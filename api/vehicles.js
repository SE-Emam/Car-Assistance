/* /api/vehicles — "My garage": list + add the user's car (Phase 2.3).
   Auth: Authorization: Bearer <supabase access_token>. Ownership enforced by RLS. */
const { getSupabase } = require('./_lib/db');
const { verify } = require('./_lib/auth');
const { guard, cors, json, readBody, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);

  const v = await verify(req);
  if (v.error) return json(res, v.error.status, v.error.body);
  const userId = v.user.id;

  const sb = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await sb.from('vehicles')
      .select('id,make,model,year,engine,vin,created_at')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    return json(res, 200, { items: data || [], count: (data || []).length });
  }

  if (req.method === 'POST') {
    const { make = 'Mercedes-Benz', model, year, engine, vin } = await readBody(req);
    if (!model) return json(res, 400, { error: 'missing_model', message: 'Vehicle model is required (demo scope: B-Class W245).' });
    if (year && (year < 2005 || year > 2011))
      return json(res, 400, { error: 'invalid_year', message: 'Demo scope is W245 (2005–2011).' });

    const { data, error } = await sb.from('vehicles')
      .insert({ owner_id: userId, make, model, year: year || null, engine: engine || null, vin: vin || null })
      .select('id,make,model,year,engine,created_at')
      .single();
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    return json(res, 201, { item: data });
  }

  json(res, 405, { error: 'method_not_allowed' });
};
