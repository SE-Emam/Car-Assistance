/* POST /api/auth-login {email, password} → Supabase Auth signInWithPassword */
const { getSupabaseAnon } = require('./_lib/db');
const { guard, cors, json, readBody } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const sb = getSupabaseAnon();
  if (!sb) return json(res, 503, { error: 'supabase_required', message: 'Set SUPABASE_URL + SUPABASE_ANON_KEY.' });

  const { email, password } = await readBody(req);
  if (!email || !password) return json(res, 400, { error: 'invalid_input' });

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return json(res, 401, { error: 'login_failed', message: error.message });

  json(res, 200, {
    user_id: data.user.id, email: data.user.email,
    access_token: data.session.access_token, refresh_token: data.session.refresh_token
  });
};
