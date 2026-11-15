/* GET /api/health — liveness + mode probe. */
const { isLive } = require('./_lib/db');
const { cors, json, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  mode(res);
  json(res, 200, { ok: true, service: 'car-assistance-api', version: '0.2.0', mode: isLive() ? 'supabase' : 'seed', time: new Date().toISOString() });
};
