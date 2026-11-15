/* GET /api/specs — full technical specifications for the seeded vehicle (W245 B150).
   Static reference data mirrored from data.js SPECS; served through the gateway
   like every other endpoint. */
const seed = require('./_lib/seed');
const { guard, cors, json, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);
  json(res, 200, { item: seed.SPECS, mode: 'seed' });
};
