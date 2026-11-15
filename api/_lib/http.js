/* HTTP helpers shared by all functions: CORS, JSON responses, rate limiting. */

const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_MIN || '30', 10);
const hits = new Map(); // ip -> { count, resetAt }

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
         req.socket?.remoteAddress || 'unknown';
}

/* returns true if allowed; otherwise sends 429 */
function guard(req, res) {
  const ip = clientIp(req);
  const now = Date.now();
  let h = hits.get(ip);
  if (!h || h.resetAt < now) { h = { count: 0, resetAt: now + 60_000 }; hits.set(ip, h); }
  h.count++;
  if (hits.size > 5000) hits.clear(); // naive GC for serverless warm instances
  if (h.count > RATE_LIMIT_PER_MIN) {
    json(res, 429, {
      error: 'rate_limited',
      message: `Too many requests — limit is ${RATE_LIMIT_PER_MIN}/min.`
    });
    res.setHeader('Retry-After', Math.ceil((h.resetAt - now) / 1000));
    return false;
  }
  return true;
}

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return true; }
  return false;
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
  });
}

/* service mode header tells callers whether data came from Supabase or bundled seed */
function mode(res) {
  res.setHeader('X-Data-Mode', isLiveSafe() ? 'supabase' : 'seed');
}
function isLiveSafe() {
  try { return require('./db').isLive(); } catch { return false; }
}

module.exports = { guard, cors, json, readBody, mode };
