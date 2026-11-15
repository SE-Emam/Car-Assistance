/* Supabase client factory — lazy; falls back to bundled seed when env is absent.
   Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (server-side only, never exposed). */
let _client = null;

function getSupabase() {
  if (_client !== null) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { _client = false; return _client; }
  try {
    const { createClient } = require('@supabase/supabase-js');
    _client = createClient(url, key, { auth: { persistSession: false } });
  } catch (e) {
    console.error('[db] supabase-js not installed — running in seed mode:', e.message);
    _client = false;
  }
  return _client;
}

/* anon client — used for sign-up / sign-in so RLS + confirmations behave normally */
function getSupabaseAnon() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, { auth: { persistSession: false } });
  } catch { return false; }
}

const isLive = () => getSupabase() !== false;

module.exports = { getSupabase, getSupabaseAnon, isLive };
