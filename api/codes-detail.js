/* GET /api/codes/{code} — single fault code with its repair guide (Phase 2.2).
   Live source: Supabase fault_codes + repair_guides. Fallback: bundled seed. */
const seed = require('./_lib/seed');
const { getSupabase, isLive } = require('./_lib/db');
const { guard, cors, json, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);

  const code = (req.query.code || '').toUpperCase();
  const lang = (req.query.lang || '').toLowerCase() === 'ar' ? 'ar' : 'en';
  if (!code) return json(res, 400, { error: 'missing_code' });

  if (isLive()) {
    const sb = getSupabase();
    const { data: fc, error: e1 } = await sb.from('fault_codes')
      .select('code,name,name_ar,system,system_ar,severity,symptoms,symptoms_ar,causes,causes_ar,dangerous,model_scope')
      .eq('code', code).maybeSingle();
    if (e1) return json(res, 502, { error: 'db_error', message: e1.message });
    if (!fc) return json(res, 404, { error: 'not_found', code });

    const { data: guide } = await sb.from('repair_guides')
      .select('title,steps,steps_ar,source_ref,verified')
      .eq('fault_code_id', (await sb.from('fault_codes').select('id').eq('code', code).single()).data.id)
      .maybeSingle();

    let item = { ...fc, guide: guide ? { title: guide.title, steps: guide.steps, source: guide.source_ref } : null };
    if (lang === 'ar' && fc.name_ar) {
      item = {
        code: fc.code, name: fc.name_ar, system: fc.system_ar || fc.system,
        severity: fc.severity, dangerous: fc.dangerous, model_scope: fc.model_scope,
        symptoms: fc.symptoms_ar || [], causes: fc.causes_ar || [],
        guide: guide ? { title: guide.title, steps: (guide.steps_ar && guide.steps_ar.length) ? guide.steps_ar : guide.steps, source: guide.source_ref } : null
      };
    } else {
      delete item.name_ar; delete item.system_ar; delete item.symptoms_ar; delete item.causes_ar;
      if (guide) delete item.guide.steps_ar;
    }
    return json(res, 200, { item, mode: 'supabase' });
  }

  const c = seed.FAULT_CODES.find(x => x.code.toUpperCase() === code);
  if (!c) return json(res, 404, { error: 'not_found', code });
  json(res, 200, { item: c, mode: 'seed' });
};
