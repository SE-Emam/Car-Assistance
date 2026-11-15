/* Retrieval service (Phase 3.3) — shared by /api/rag and /api/chat.
   Path 1 (live): free embedding API → pgvector match_chunks() RPC.
   Path 2 (fallback): keyword scoring over the bundled W245 corpus. */
const seed = require('./seed');
const { getSupabase } = require('./db');

/* provider-agnostic free embedding API (EMBEDDING_API_URL + EMBEDDING_API_KEY) */
async function embed(text) {
  const url = process.env.EMBEDDING_API_URL, key = process.env.EMBEDDING_API_KEY;
  if (!url || !key) return null;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ input: [text], model: process.env.EMBEDDING_MODEL || 'default' })
  });
  if (!r.ok) throw new Error('embed_status_' + r.status);
  const d = await r.json();
  const v = d?.data?.[0]?.embedding;
  if (!Array.isArray(v) || v.length !== 768) throw new Error('embed_dim_' + (v ? v.length : 'none') + '_expected_768');
  return v;
}

async function retrieve(query, { modelScope = 'W245', k = 5 } = {}) {
  const sb = getSupabase();
  if (sb) {
    try {
      const vector = await embed(query);
      if (vector) {
        const { data, error } = await sb.rpc('match_chunks',
          { query_embedding: vector, match_count: k, p_model_scope: modelScope });
        if (!error && data?.length)
          return { mode: 'pgvector', chunks: data };
      }
    } catch (e) {
      console.error('[retrieve] pgvector path failed → keyword fallback:', e.message);
    }
  }

  /* keyword fallback — never returns empty silently.
     Corpus: seeded fault codes + RAG&Fulte knowledge items (fuse/repair/CVT digests). */
  const t = query.toLowerCase();
  const words = t.split(/\W+/).filter(w => w.length > 2);
  const score = (hay, variants) => {
    let s = words.filter(w => hay.includes(w)).length;
    if (variants) for (const v of variants) if (t.includes(v.toLowerCase())) s += 3; // q_variants exact hit
    return s;
  };

  const codeChunks = seed.FAULT_CODES
    .map(c => {
      const hay = (c.code + ' ' + c.name + ' ' + c.system + ' ' +
        c.symptoms.join(' ') + ' ' + c.causes.join(' ') + ' ' +
        (c.guide ? c.guide.steps.join(' ') : '')).toLowerCase();
      return { c, s: score(hay) };
    })
    .filter(x => x.s > 0)
    .map(({ c, s }) => ({ s, chunk: {
      guide_id: null,
      chunk_text: `${c.code} — ${c.name} (${c.system}). Symptoms: ${c.symptoms.join('; ')}. ` +
        `Causes: ${c.causes.join('; ')}. Fix: ${(c.guide ? c.guide.steps.join(' ') : '')}`,
      metadata: { code: c.code, severity: c.severity, make: 'mercedes-benz', model_scope: 'W245', type: 'fault_code' },
      similarity: null
    }}));

  const knowledge = require('./knowledge');
  const knowChunks = knowledge
    .map(item => {
      const hay = ([item.q, item.a, ...(item.q_variants || [])].join(' ') +
        ' ' + (item.category || '')).toLowerCase();
      return { item, s: score(hay, item.q_variants) };
    })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map(({ item, s }) => ({ s, chunk: {
      guide_id: null,
      chunk_text: `${item.q} — ${item.a}`,
      metadata: { category: item.category, make: 'mercedes-benz', model_scope: 'W245',
                  type: 'knowledge', code: (item.fault_codes || [])[0] || null },
      similarity: null
    }}));

  const chunks = [...codeChunks, ...knowChunks]
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map(x => x.chunk);

  return { mode: 'keyword', chunks };
}

module.exports = { retrieve, embed };
