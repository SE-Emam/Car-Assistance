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
  const lang = (req.query.lang || '').toLowerCase() === 'ar' ? 'ar' : 'en';
  const limit = Math.min(parseInt(req.query.limit || '25', 10) || 25, 50);
  const modelScope = req.query.model || 'W245';

  let items;
  if (isLive()) {
    /* fetch the whole model scope (104 rows — small) and filter in JS:
       limiting BEFORE the filter dropped matches whenever heap order changed */
    let query = getSupabase()
      .from('fault_codes')
      .select('code,name,name_ar,system,system_ar,severity,dangerous,make,model_scope,symptoms_ar,causes_ar')
      .eq('model_scope', modelScope);
    if (severity && ['LOW', 'MEDIUM', 'HIGH'].includes(severity)) query = query.eq('severity', severity);
    const { data, error } = await query;
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    items = data || [];
    if (q) {
      /* haystack covers both languages (name_ar / system_ar included) */
      items = items.filter(c =>
        (c.code + ' ' + c.name + ' ' + c.system + ' ' +
         (c.name_ar || '') + ' ' + (c.system_ar || '')).toLowerCase().includes(q));
    }
    items = items.slice(0, limit);
    /* lang=ar swaps in the Arabic fields when populated */
    if (lang === 'ar') {
      items = items.map(c => {
        const { name_ar, system_ar, symptoms_ar, causes_ar, ...rest } = c;
        if (!name_ar) return { code: c.code, name: c.name, system: c.system, severity: c.severity, dangerous: c.dangerous };
        return { ...rest, name: name_ar, system: system_ar || c.system,
          symptoms: symptoms_ar || [], causes: causes_ar || [] };
      });
    } else {
      items = items.map(({ name_ar, system_ar, symptoms_ar, causes_ar, ...rest }) => rest);
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
