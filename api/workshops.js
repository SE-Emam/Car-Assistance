/* GET /api/workshops?lat=&lng=&limit= — Service Locator (Phase 5.1 preview).
   Live source: Supabase `nearest_workshops()` RPC (haversine in DB).
   Fallback: haversine computed over bundled seed — same formula. */
const seed = require('./_lib/seed');
const { getSupabase, isLive } = require('./_lib/db');
const { guard, cors, json, mode } = require('./_lib/http');

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);

  const lat = parseFloat(req.query.lat) || seed.ME.lat;
  const lng = parseFloat(req.query.lng) || seed.ME.lng;
  const limit = Math.min(parseInt(req.query.limit || '6', 10) || 6, 20);

  if (isLive()) {
    const { data, error } = await getSupabase().rpc('nearest_workshops', { p_lat: lat, p_lng: lng, p_limit: limit });
    if (error) return json(res, 502, { error: 'db_error', message: error.message });
    return json(res, 200, { items: data || [], count: (data || []).length, mode: 'supabase' });
  }

  const items = seed.WORKSHOPS
    .map(w => ({ name: w.name, area: w.area, phone: w.phone, whatsapp: w.wa,
                 rating: w.rating, specialty: w.specialty, distance_km: +haversine(lat, lng, w.lat, w.lng).toFixed(1) }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  json(res, 200, { items, count: items.length, mode: 'seed' });
};
