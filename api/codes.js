/* GET /api/codes?q=&severity=&limit= — fault-code search (Phase 2.2)
   Live source: Supabase `fault_codes` table. Fallback: bundled W245 seed. */
const seed = require('./_lib/seed');
const { getSupabase, isLive } = require('./_lib/db');
const { guard, cors, json, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);

  const q = (req.query.q || '').trim().toLowerCase();
  const severity = (req.query.severity || '').toUpperCase();
  const limit = Math.min(parseInt(req.query.limit || '25', 10) || 25, 50);
  const modelScope = req.query.model || 'W245';

  let items;
  if (isLive()) {
    let query = getSupabase()
      .from('fault_codes')
      .select('code,name,system,severity,dangerous,make,model_scope')
      .eq('model_scope', modelScope)
      .limit(limit);
    if (severity && ['LOW', 'MEDIUM', 'HIGH'].includes(severity)) query = query.eq('severity', severity);
    const { data, error } = await query;
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    items = data || [];
    if (q) {
      items = items.filter(c =>
        (c.code + ' ' + c.name + ' ' + c.system).toLowerCase().includes(q));
    }
  } else {
    items = seed.FAULT_CODES.filter(c => {
      if (severity && c.severity !== severity) return false;
      if (q && !(c.code + ' ' + c.name + ' ' + c.system).toLowerCase().includes(q)) return false;
      return true;
    }).slice(0, limit).map(({ code, name, system, severity: sev, dangerous }) =>
      ({ code, name, system, severity: sev, dangerous }));
  }

  json(res, 200, { items, count: items.length, mode: isLive() ? 'supabase' : 'seed' });
};
