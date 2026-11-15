/* POST /api/auth-register {email, password, display_name} → Supabase Auth signUp */
const { getSupabaseAnon } = require('./_lib/db');
const { guard, cors, json, readBody } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const sb = getSupabaseAnon();
  if (!sb) return json(res, 503, { error: 'supabase_required', message: 'Set SUPABASE_URL + SUPABASE_ANON_KEY.' });

  const { email, password, display_name } = await readBody(req);
  if (!email || !password || password.length < 8)
    return json(res, 400, { error: 'invalid_input', message: 'Email and a password of at least 8 characters are required.' });

  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { display_name: display_name || email.split('@')[0] } }
  });
  if (error) return json(res, 400, { error: 'signup_failed', message: error.message });

  const session = data?.session;
  json(res, session ? 201 : 202, session
    ? { user_id: data.user.id, email: data.user.email, access_token: session.access_token, refresh_token: session.refresh_token }
    : { needs_confirmation: true, message: 'Check your email to confirm the account.' });
};
