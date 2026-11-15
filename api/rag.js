/* POST /api/rag {query} — RAG Service (Phase 3.3).
   pgvector retrieval when embeddings+Supabase are configured; documented
   keyword fallback otherwise. Response always carries its retrieval mode. */
const { retrieve } = require('./_lib/retrieve');
const { guard, cors, json, readBody, mode } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const { query, model_scope } = await readBody(req);
  if (!query || typeof query !== 'string') return json(res, 400, { error: 'missing_query' });

  const started = Date.now();
  const { mode: retrievalMode, chunks } = await retrieve(query, { modelScope: model_scope || 'W245' });

  json(res, 200, {
    mode: retrievalMode,
    chunks: chunks.map(c => ({
      code: c.metadata?.code || null,
      severity: c.metadata?.severity || null,
      text: c.chunk_text,
      similarity: c.similarity
    })),
    count: chunks.length,
    took_ms: Date.now() - started
  });
};
