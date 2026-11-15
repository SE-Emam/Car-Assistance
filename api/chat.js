/* POST /api/chat — Diagnosis Service with LLM Gateway (Phase 3.1/3.2 preview).
   Contract: { message } → { reply, code?, severity?, cite, mode }
   When LLM_API_URL + LLM_API_KEY are set, the gateway calls the external free
   LLM API with retrieved context (source-cited). Otherwise the documented
   scripted W245 flow answers — same shape, so the frontend never changes. */
const seed = require('./_lib/seed');
const { retrieve } = require('./_lib/retrieve');
const { guard, cors, json, readBody, mode } = require('./_lib/http');

function ctxFromChunks(query, chunks) {
  /* map retrieved chunks back to the richest structured context */
  for (const chunk of chunks) {
    const code = chunk.metadata?.code;
    const c = code && seed.FAULT_CODES.find(x => x.code === code);
    if (c) return c;
  }
  return null;
}

async function callLLM(message, ctx, ar) {
  const sys = 'You are Car Assistance, a car fault-diagnosis assistant for a Mercedes-Benz B-Class (W245). ' +
    'Answer ONLY from the provided repair context. If it is insufficient, say so instead of guessing. ' +
    'Always include the fault code and severity when known.' +
    (ar ? ' Always reply in Arabic (فصحى مبسطة), keeping fault codes (P0300…) and part names as-is.' : '');
  const user = `Repair context:\n${JSON.stringify({ code: ctx.code, name: ctx.name, severity: ctx.severity, causes: ctx.causes, guide: ctx.guide })}\n\nUser message: ${message}`;
  const r = await fetch(process.env.LLM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.LLM_API_KEY}` },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || 'default',
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0.2, max_tokens: 400
    })
  });
  if (!r.ok) throw new Error(`llm_status_${r.status}`);
  const data = await r.json();
  const text = data?.choices?.[0]?.message?.content || data?.content?.[0]?.text;
  if (!text) throw new Error('llm_empty');
  return text;
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (!guard(req, res)) return;
  mode(res);
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const { message, lang: rawLang } = await readBody(req);
  if (!message || typeof message !== 'string') return json(res, 400, { error: 'missing_message' });
  const ar = (rawLang || '').toLowerCase() === 'ar';
  /* Arabic scripted flow (Phase 6) — falls back to English script when absent */
  const script = (ar && seed.CHAT_SCRIPT_AR) ? seed.CHAT_SCRIPT_AR : seed.CHAT_SCRIPT;

  const retrieval = await retrieve(message);
  const ctx = ctxFromChunks(message, retrieval.chunks);

  /* LLM Gateway: external free LLM API when configured */
  if (process.env.LLM_API_URL && process.env.LLM_API_KEY && ctx) {
    try {
      const reply = await callLLM(message, ctx, ar);
      return json(res, 200, {
        reply, code: ctx.code || null, severity: ctx.severity || null, dangerous: !!ctx.dangerous,
        cite: ctx.guide ? ctx.guide.source : 'W245 seed corpus', mode: 'llm'
      });
    } catch (e) {
      console.error('[chat] LLM gateway failed, falling back to scripted flow:', e.message);
    }
  }

  /* scripted fallback (documented W245 patterns) */
  const rule = script.rules.find(r => r.match.test(message));
  if (rule) {
    const c = seed.FAULT_CODES.find(x => x.code === rule.code);
    return json(res, 200, {
      reply: rule.reply, code: rule.code || null, severity: c ? c.severity : null,
      dangerous: c ? c.dangerous : false, cite: rule.cite, mode: 'scripted'
    });
  }
  json(res, 200, { reply: script.fallback, code: null, severity: null, dangerous: false, cite: null, mode: 'scripted' });
};
