/* Smoke tests for the API (seed mode, no Supabase needed): npm run test:api */
const BASE = process.env.API_BASE || 'http://localhost:3000';
const fails = [];
async function req(path, opts) {
  const r = await fetch(BASE + path, opts);
  return { status: r.status, headers: r.headers, body: await r.json().catch(() => ({})) };
}
(async () => {
  const t = (name, ok, extra) => { console.log((ok ? 'OK   ' : 'FAIL ') + name + (extra ? ` — ${extra}` : '')); if (!ok) fails.push(name); };

  const h = await req('/api/health');
  t('health 200 + mode', h.status === 200 && ['supabase', 'seed'].includes(h.body.mode), h.body.mode);

  const c = await req('/api/codes?q=glow%20plug');
  t('codes search "glow plug" = 5', c.status === 200 && c.body.count === 5, `got ${c.body.count}`);

  const cs = await req('/api/codes?severity=HIGH');
  t('codes severity filter HIGH', cs.status === 200 && cs.body.items.every(i => i.severity === 'HIGH'));

  const d = await req('/api/codes/P0300');
  t('detail P0300 + guide + dangerous', d.status === 200 && d.body.item.code === 'P0300' && !!d.body.item.guide && d.body.item.dangerous === true);

  const d2 = await req('/api/codes/XXXX');
  t('unknown code → 404', d2.status === 404);

  const w = await req('/api/workshops?lat=30.0444&lng=31.2357');
  const km = (w.body.items || []).map(i => i.distance_km);
  t('workshops sorted by haversine', w.status === 200 && km.length === 6 && km.every((x, i) => i === 0 || km[i - 1] <= x), km.join(','));

  const chat = await req('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Engine shakes at idle' }) });
  t('chat scripted → P0300 + cite', chat.status === 200 && chat.body.code === 'P0300' && !!chat.body.cite, chat.body.mode);

  const chat2 = await req('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'xyzzy nonsense' }) });
  t('chat fallback without guessing', chat2.status === 200 && chat2.body.code === null);

  const job = await req('/api/image-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storage_path: 'dashboards/test.png' }) });
  t('image-jobs 202 queued', job.status === 202 && job.body.status === 'queued');

  const r = await req('/api/health');
  t('rate limit headers/mode set', r.headers.get('x-data-mode') !== null);

  /* Phase 2.3 — auth: expectations depend on data mode (seed = 503, supabase = real flow) */
  const live = h.body.mode === 'supabase';
  const rnd = Date.now();
  const EMAIL = `smoke${rnd}@gmail.com`, PASS = 'smoke-pass-1';

  const ar = await req('/api/auth-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASS, display_name: 'Smoke Test' }) });
  t(live ? 'auth-register → 201 user created (supabase live)' : 'auth-register → 503 without Supabase',
    live ? (ar.status === 201 && !!ar.body.user_id) : (ar.status === 503 && ar.body.error === 'supabase_required'),
    live ? `user_id ${String(ar.body.user_id || '').slice(0, 8)}…` : ar.body.error);

  const al = await req('/api/auth-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASS }) });
  t(live ? 'auth-login → 200 with token (supabase live)' : 'auth-login → 503 without Supabase',
    live ? (al.status === 200 && !!al.body.access_token) : (al.status === 503 && al.body.error === 'supabase_required'),
    live ? 'access_token [redacted]' : al.body.error);

  const veh = await req('/api/vehicles');
  t('vehicles without token → 503 (no supabase)', [401, 503].includes(veh.status), String(veh.status));

  const rag = await req('/api/rag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: 'engine misfire at idle' }) });
  t('rag keyword fallback → P0300 chunk', rag.status === 200 && rag.body.mode === 'keyword' && JSON.stringify(rag.body.chunks).includes('P0300'), `${rag.body.count} chunks · ${rag.body.took_ms}ms`);

  const ing = await req('/api/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dry_run: true }) });
  t('ingest dry-run counts chunks', ing.status === 200 && ing.body.dry_run === true && ing.body.chunk_count > 300,
    `${ing.body.chunk_count} chunks (${ing.body.guide_chunks} guides + ${ing.body.knowledge_chunks} knowledge)`);

  /* community corpus expansion — 104-code codebook */
  const p0301 = await req('/api/codes/P0301');
  t('new code P0301 (expanded from range) found', p0301.status === 200 && p0301.body.item.code === 'P0301');
  const cvt = await req('/api/codes?q=' + encodeURIComponent('CVT'));
  t('CVT codes searchable', cvt.status === 200 && cvt.body.count > 0, `${cvt.body.count} hits`);
  const knowRag = await req('/api/rag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: 'فيوز مفتاح لمبة الفرامل' }) });
  t('rag Arabic fuse query → knowledge chunk', knowRag.status === 200 && JSON.stringify(knowRag.body.chunks).includes('فيوز'), `${knowRag.body.count} chunks`);

  const chatRag = await req('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Engine shakes at idle' }) });
  t('chat via RAG service → P0300 + cite', chatRag.status === 200 && chatRag.body.code === 'P0300' && !!chatRag.body.cite);

  /* specs card — W245 B150 reference data */
  const sp = await req('/api/specs');
  t('specs → B150 sheet (7 sections)', sp.status === 200 && sp.body.item.variant === 'B150' && sp.body.item.sections.length === 7, sp.body.item.sections.length + ' sections');

  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL API SMOKE TESTS PASSED');
  process.exit(fails.length ? 1 : 0);
})();
