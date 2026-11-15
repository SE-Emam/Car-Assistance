/* Auth helpers — bearer-JWT verification against Supabase Auth (Phase 2.3). */
const { getSupabase } = require('./db');

function bearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7).trim() : null;
}

/* returns { user } or { error } — verifies the JWT via Supabase Auth */
async function verify(req) {
  const sb = getSupabase();
  if (!sb) return { error: { status: 503, body: { error: 'supabase_required', message: 'Auth requires SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.' } } };
  const token = bearer(req);
  if (!token) return { error: { status: 401, body: { error: 'unauthorized', message: 'Missing bearer token.' } } };
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return { error: { status: 401, body: { error: 'unauthorized', message: 'Invalid or expired token.' } } };
  return { user: data.user };
}

module.exports = { bearer, verify };
