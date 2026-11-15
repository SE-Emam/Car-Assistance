/* POST /api/image-jobs — Image Analysis intake (Phase 4.1 preview).
   Body: { storage_path, user_id?, vehicle_id? }
   Live: inserts into Supabase `image_jobs` (worker claims via claim_next_image_job()).
   Fallback: returns a mock queued job so the demo pipeline stays testable. */
const { getSupabase, isLive } = require('./_lib/db');
const { guard, cors, json, readBody, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const { storage_path, user_id = null, vehicle_id = null } = await readBody(req);
  if (!storage_path) return json(res, 400, { error: 'missing_storage_path' });

  if (isLive()) {
    const { data, error } = await getSupabase()
      .from('image_jobs')
      .insert({ storage_path, user_id, vehicle_id, status: 'queued' })
      .select('id,status,created_at')
      .single();
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    return json(res, 202, { ...data, mode: 'supabase' });
  }

  json(res, 202, {
    id: 'demo-' + Date.now().toString(36), status: 'queued',
    created_at: new Date().toISOString(), mode: 'seed'
  });
};
