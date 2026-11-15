-- ============================================================
-- Car Assistance — Supabase schema (01-schema.sql)
-- PostgreSQL + pgvector · run as service_role / SQL editor
-- Order: extensions → enums → tables → indexes → RLS → triggers
-- ============================================================

-- ---------- extensions ----------
create extension if not exists "uuid-ossp";
create extension if not exists "vector";   -- pgvector: knowledge-base embeddings

-- ---------- enums ----------
create type user_role as enum ('driver', 'workshop', 'admin');
create type severity as enum ('LOW', 'MEDIUM', 'HIGH');
create type job_status as enum ('queued', 'processing', 'done', 'failed');

-- ============================================================
-- 1. profiles — mirrors Supabase Auth users
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          user_role not null default 'driver',
  display_name  text,
  locale        text not null default 'en',   -- 'en' | 'ar'
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 2. vehicles — user cars (demo seed: W245)
-- ============================================================
create table vehicles (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references profiles (id) on delete cascade,
  make          text not null default 'Mercedes-Benz',
  model         text not null,              -- 'B-Class (W245)'
  year          int,
  engine        text,                       -- 'M266.920 1.7L petrol'
  vin           text,
  created_at    timestamptz not null default now()
);
create index vehicles_owner_idx on vehicles (owner_id);

-- ============================================================
-- 3. fault_codes — OBD-II + manufacturer codes
-- ============================================================
create table fault_codes (
  id            uuid primary key default uuid_generate_v4(),
  code          text not null unique,       -- 'P0300'
  name          text not null,
  system        text not null,              -- 'Ignition / Engine'
  severity      severity not null,
  symptoms      jsonb not null default '[]',   -- string[]
  causes        jsonb not null default '[]',   -- string[]
  dangerous     boolean not null default false, -- true → MAYDAY sheet shown
  make          text not null default 'generic', -- 'generic' | 'mercedes-benz'
  model_scope   text not null default 'all',     -- 'all' | 'W245'
  /* Arabic localization (Phase 6) — populated by 03-seed-arabic.sql */
  name_ar       text,
  system_ar     text,
  symptoms_ar   jsonb not null default '[]',
  causes_ar     jsonb not null default '[]',
  created_at    timestamptz not null default now()
);
create index fault_codes_code_idx on fault_codes (code);
create index fault_codes_severity_idx on fault_codes (severity);

-- ============================================================
-- 4. repair_guides — verified repair documents (RAG corpus root)
-- ============================================================
create table repair_guides (
  id            uuid primary key default uuid_generate_v4(),
  fault_code_id uuid references fault_codes (id) on delete set null,
  title         text not null,
  steps         jsonb not null default '[]',   -- ordered string[]
  source_ref    text not null,                 -- 'R-01 · W245 common-faults digest'
  verified      boolean not null default false,
  version       int not null default 1,
  /* Arabic localization (Phase 6) — populated by 03-seed-arabic.sql */
  steps_ar      jsonb not null default '[]',
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 5. kb_chunks — RAG vector store (pgvector)
-- ============================================================
create table kb_chunks (
  id            uuid primary key default uuid_generate_v4(),
  guide_id      uuid references repair_guides (id) on delete cascade,  -- null = standalone knowledge chunk (community corpus)
  chunk_text    text not null,
  embedding     vector(768) not null,          -- dimension must match the free embedding API
  metadata      jsonb not null default '{}'::jsonb,  -- {code, system, severity, make, model}
  created_at    timestamptz not null default now()
);
-- cosine HNSW index (swap to ivfflat if the plan requires it)
create index kb_chunks_embedding_idx on kb_chunks
  using hnsw (embedding vector_cosine_ops);
create index kb_chunks_guide_idx on kb_chunks (guide_id);

-- match_chunks() — retrieval function used by the RAG service (LangChain.js)
create or replace function match_chunks (
  query_embedding vector(768),
  match_count int default 5,
  p_model_scope text default 'W245'
)
returns table (
  id uuid,
  guide_id uuid,
  chunk_text text,
  metadata jsonb,
  similarity float
)
language sql stable as $$
  select c.id, c.guide_id, c.chunk_text, c.metadata,
         1 - (c.embedding <=> query_embedding) as similarity
  from kb_chunks c
  where c.metadata->>'model_scope' in ('all', p_model_scope)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- 6. workshops — service locator dataset
-- ============================================================
create table workshops (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  area          text not null,
  lat           double precision not null,
  lng           double precision not null,
  phone         text not null,
  whatsapp      text,
  rating        numeric(2,1),
  specialty     text,
  active        boolean not null default true
);
create index workshops_geo_idx on workshops (lat, lng);

-- nearest_workshops() — same haversine order the demo computes client-side
create or replace function nearest_workshops (
  p_lat double precision,
  p_lng double precision,
  p_limit int default 6
)
returns table (id uuid, name text, area text, phone text, whatsapp text, distance_km float)
language sql stable as $$
  select w.id, w.name, w.area, w.phone, w.whatsapp,
    6371 * 2 * asin(sqrt(
      power(sin(radians(w.lat - p_lat) / 2), 2) +
      cos(radians(p_lat)) * cos(radians(w.lat)) *
      power(sin(radians(w.lng - p_lng) / 2), 2)
    )) as distance_km
  from workshops w
  where w.active
  order by distance_km asc
  limit p_limit;
$$;

-- ============================================================
-- 7. image_jobs — async VLM queue (FOR UPDATE SKIP LOCKED)
-- ============================================================
create table image_jobs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles (id) on delete set null,
  vehicle_id    uuid references vehicles (id) on delete set null,
  storage_path  text not null,                 -- Supabase Storage object path
  status        job_status not null default 'queued',
  attempts      int not null default 0,
  vlm_result    jsonb,                         -- detected lamps/text from the VLM
  error         text,
  locked_at     timestamptz,
  created_at    timestamptz not null default now()
);
create index image_jobs_status_idx on image_jobs (status) where status in ('queued', 'processing');

-- claim_next_image_job() — worker polls this; SKIP LOCKED keeps concurrent workers safe
create or replace function claim_next_image_job ()
returns setof image_jobs
language plpgsql as $$
declare job image_jobs;
begin
  select * into job from image_jobs
  where status = 'queued'
  order by created_at
  for update skip locked
  limit 1;
  if found then
    update image_jobs
    set status = 'processing', attempts = attempts + 1, locked_at = now()
    where id = job.id;
    return next job;
  end if;
end;
$$;

-- ============================================================
-- 8. emergency_contacts — MAYDAY buttons bind to these
-- ============================================================
create table emergency_contacts (
  id            uuid primary key default uuid_generate_v4(),
  label         text not null,                 -- 'Roadside Assistance (MAYDAY)'
  phone         text not null,
  whatsapp      text,
  active        boolean not null default true
);

-- ============================================================
-- 9. Row-Level Security
-- ============================================================
alter table profiles           enable row level security;
alter table vehicles           enable row level security;
alter table fault_codes        enable row level security;
alter table repair_guides      enable row level security;
alter table kb_chunks          enable row level security;
alter table workshops          enable row level security;
alter table image_jobs         enable row level security;
alter table emergency_contacts enable row level security;

-- profiles: self only
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- vehicles: owner only
create policy "own vehicles" on vehicles
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- knowledge: readable by authenticated users; writes by service role only
create policy "read fault codes" on fault_codes
  for select to authenticated using (true);
create policy "read guides" on repair_guides
  for select to authenticated using (true);
create policy "read kb chunks" on kb_chunks
  for select to authenticated using (true);

-- locator: public read
create policy "read workshops" on workshops
  for select using (active);

-- image jobs: user sees own; inserts by owner; processing via service role
create policy "own image jobs" on image_jobs
  for select to authenticated using (auth.uid() = user_id);
create policy "insert own image jobs" on image_jobs
  for insert to authenticated with check (auth.uid() = user_id);

-- mayday: public read of active contacts
create policy "read emergency contacts" on emergency_contacts
  for select using (active);

-- ============================================================
-- 10. auto-create profile on signup
-- ============================================================
create or replace function handle_new_user ()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
