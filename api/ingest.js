/* POST /api/ingest — kb_chunks embedding pipeline (Phase 3.3, admin only).
   Header: x-admin-key === ADMIN_KEY env.
   Sources: (a) seeded repair guides (title + numbered steps), (b) RAG&Fulte
   knowledge items (q_variants + answers). Embeds each via the free embedding
   API and replaces matching rows in Supabase kb_chunks for pgvector. */
const seed = require('./_lib/seed');
const knowledge = require('./_lib/knowledge');
const { getSupabase, isLive } = require('./_lib/db');
const { embed } = require('./_lib/retrieve');
const { guard, cors, json, readBody } = require('./_lib/http');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  /* ingest mutates the knowledge base — admin-only, always.
     No ADMIN_KEY configured = endpoint closed (fail closed, never open). */
  if (!process.env.ADMIN_KEY)
    return json(res, 503, { error: 'admin_required', message: 'Ingest is disabled until ADMIN_KEY is configured.' });
  if ((req.headers['x-admin-key'] || '') !== process.env.ADMIN_KEY)
    return json(res, 403, { error: 'forbidden' });

  const sb = getSupabase();
  const { dry_run = false } = await readBody(req);

  /* collect chunk texts + their code */
  const jobs = [];
  for (const c of seed.FAULT_CODES) {
    if (!c.guide) continue;
    jobs.push({ code: c.code, text: `${c.guide.title}. Source: ${c.guide.source}.` });
    c.guide.steps.forEach((s, i) => jobs.push({ code: c.code, text: `Step ${i + 1}: ${s} (${c.guide.title}, ${c.code}).` }));
  }
  const guideJobs = jobs.length;

  /* knowledge items (RAG&Fulte corpus) — standalone chunks, no guide_id */
  for (const item of knowledge) {
    const text = `${item.q} — ${item.a}` +
      (item.q_variants?.length ? ` [phrasings: ${item.q_variants.join(' | ')}]` : '');
    jobs.push({ code: null, text, meta: { category: item.category || null, type: 'knowledge',
      code: (item.fault_codes || [])[0] || null } });
  }

  if (dry_run) return json(res, 200, { dry_run: true, chunk_count: jobs.length,
    guide_chunks: guideJobs, knowledge_chunks: jobs.length - guideJobs });

  if (!isLive()) return json(res, 503, { error: 'supabase_required', message: 'Ingest writes to Supabase kb_chunks.' });

  /* map codes → repair_guides ids */
  const { data: codes } = await sb.from('fault_codes').select('id,code');
  const codeId = Object.fromEntries((codes || []).map(r => [r.code, r.id]));
  const { data: guides } = await sb.from('repair_guides').select('id,fault_code_id');
  const guideByCode = {};
  for (const g of guides || []) {
    const fc = codes.find(x => x.id === g.fault_code_id);
    if (fc) guideByCode[fc.code] = g.id;
  }

  let embedded = 0, failed = 0;
  const guideRows = [], knowledgeRows = [];
  for (const j of jobs) {
    try {
      const vector = await embed(j.text);
      if (!vector) return json(res, 503, { error: 'embedding_required', message: 'Set EMBEDDING_API_URL + EMBEDDING_API_KEY (768 dims).' });
      if (j.code) {
        const guideId = guideByCode[j.code];
        if (!guideId) { failed++; continue; }   // no seeded guide for this code yet
        guideRows.push({ guide_id: guideId, chunk_text: j.text, embedding: vector,
          metadata: { code: j.code, make: 'mercedes-benz', model_scope: 'W245' } });
      } else {
        knowledgeRows.push({ chunk_text: j.text, embedding: vector,
          metadata: { make: 'mercedes-benz', model_scope: 'W245', ...j.meta } });
      }
      embedded++;
    } catch (e) {
      failed++;
      console.error('[ingest]', j.code || 'knowledge', e.message);
    }
  }

  /* idempotent replace: refresh chunks for touched guides + all standalone knowledge chunks */
  const guideIds = [...new Set(guideRows.map(r => r.guide_id))];
  if (guideIds.length) await sb.from('kb_chunks').delete().in('guide_id', guideIds);
  await sb.from('kb_chunks').delete().filter('metadata->>type', 'eq', 'knowledge');

  const rows = [...guideRows, ...knowledgeRows];
  const { error: insErr } = await sb.from('kb_chunks').insert(rows);
  if (insErr) return json(res, 502, { error: 'db_error', message: insErr.message });

  json(res, 200, { embedded, failed, guides_touched: guideIds.length,
    knowledge_chunks: knowledgeRows.length, mode: 'supabase' });
};
