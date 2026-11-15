/* Local development server — routes /api/* to the same serverless handlers.
   Usage: npm start  (PORT env optional, default 3000). Zero-config: runs in
   seed mode until SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided. */
const http = require('http');
const { parse: parseUrl } = require('url');

const routes = {
  '/api/health': () => require('./api/health'),
  '/api/codes': (code) => code ? require('./api/codes-detail') : require('./api/codes'),
  '/api/workshops': () => require('./api/workshops'),
  '/api/chat': () => require('./api/chat'),
  '/api/image-jobs': () => require('./api/image-jobs'),
  '/api/auth-register': () => require('./api/auth-register'),
  '/api/auth-login': () => require('./api/auth-login'),
  '/api/vehicles': () => require('./api/vehicles'),
  '/api/rag': () => require('./api/rag'),
  '/api/ingest': () => require('./api/ingest'),
  '/api/specs': () => require('./api/specs')
};

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parseUrl(req.url, true);
  req.query = query;

  const m = pathname.match(/^\/api\/codes\/([A-Za-z0-9]+)\/?$/);
  if (m) { req.query.code = m[1].toUpperCase(); pathname.replace(m[0], '/api/codes'); }

  const key = m ? '/api/codes' : pathname.replace(/\/$/, '');
  const handler = routes[key];
  if (!handler) { res.statusCode = 404; res.setHeader('Content-Type','application/json'); return res.end(JSON.stringify({ error: 'not_found', path: pathname })); }
  try {
    await handler(m)(req, res);
  } catch (e) {
    console.error('[api]', e);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal_error', message: e.message }));
  }
});

const PORT = parseInt(process.env.PORT || '3000', 10);
server.listen(PORT, () => console.log(`Car Assistance API → http://localhost:${PORT}/api/health`));
