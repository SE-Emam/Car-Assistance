/* ============================================================
   Car Assistance — demo logic
   Backend-aware: set localStorage['api_base'] (e.g. http://localhost:3000)
   to use the live serverless API; falls back to bundled seed silently.
   ============================================================ */

const API_BASE = ((window.API_BASE || localStorage.getItem('api_base') || '') + '').replace(/\/+$/, '');

async function apiSearch(q, severity) {
  if (!API_BASE) return null;
  try {
    const u = new URL(API_BASE + '/api/codes');
    if (q) u.searchParams.set('q', q);
    if (severity && severity !== 'ALL') u.searchParams.set('severity', severity);
    const r = await fetch(u);
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data.items) ? data.items : null;
  } catch { return null; }   /* offline → bundled seed */
}

/* ---------- shared helpers ---------- */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}

function byCode(code) {
  return FAULT_CODES.find(c => c.code.toUpperCase() === code.toUpperCase()) || null;
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* i18n (Phase 6): dynamic strings route through t()/sevLabel() — provided by
   i18n.js (loads before app.js); identity fallback keeps EN behaviour intact. */
const t = (typeof window.t === 'function') ? window.t : (s => s);
const sevLabel = (typeof window.sevLabel === 'function') ? window.sevLabel : (s => s);

/* Arabic content overlay (data-ar.js): symptoms/causes/guide steps/name */
function locName(c) {
  if (window.LANG !== 'ar' || !window.FAULT_CODES_AR) return c.name;
  const o = FAULT_CODES_AR.byCode[c.code];
  if (o && o.name) return o.name;
  return FAULT_CODES_AR.names[c.name] || c.name;
}
function locCode(c) {
  if (window.LANG !== 'ar' || !window.FAULT_CODES_AR) return c;
  const o = FAULT_CODES_AR.byCode[c.code];
  const fix = s => s.replace(/Recommended action:/g, 'الإجراء الموصى به:').replace(/Recommended action /g, 'الإجراء الموصى به: ');
  if (o) return { ...c, name: o.name, symptoms: o.symptoms || c.symptoms,
    causes: o.causes || c.causes, guide: { ...c.guide, steps: (o.steps || c.guide.steps).map(fix) } };
  return { ...c, name: locName(c), guide: { ...c.guide, steps: c.guide.steps.map(fix) } };
}

/* ---------- shared row template ---------- */
function codeRow(c) {
  c = locCode(c);
  return `
    <a class="row" href="code.html?code=${c.code}">
      <div class="r-body">
        <div class="r-title" style="font-variant-numeric:tabular-nums">${c.code}</div>
        <div class="r-sub">${esc(c.name)}</div>
      </div>
      <span class="sev sev-${c.severity === 'HIGH' ? 'high' : c.severity === 'MEDIUM' ? 'med' : 'low'}"><span class="dot"></span>${sevLabel(c.severity)}</span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M9 6l6 6-6 6"/></svg>
    </a>`;
}

/* ---------- index.html: quick search under the hero ---------- */
function initHomeSearch() {
  const q = document.getElementById('home-search');
  if (!q) return;
  const res = document.getElementById('home-results');
  const hint = document.getElementById('home-hint');

  function render() {
    const term = q.value.trim().toLowerCase();
    if (!term) {
      res.classList.add('hidden');
      res.innerHTML = '';
      if (hint) hint.classList.remove('hidden');
      return;
    }
    if (hint) hint.classList.add('hidden');
    const items = FAULT_CODES.filter(c =>
      (c.code + ' ' + c.name + ' ' + c.system + ' ' + locName(c)).toLowerCase().includes(term)).slice(0, 6);
    res.classList.remove('hidden');
    res.innerHTML = items.map(codeRow).join('') ||
      `<div class="row" style="pointer-events:none"><div class="r-body"><div class="r-sub">${esc(t('No documented W245 code matches'))} “${esc(term)}” — ${esc(t('Try the chat instead.'))}</div></div></div>`;

    /* live API overrides the local mirror when configured */
    apiSearch(term).then(apiItems => {
      if (apiItems && q.value.trim().toLowerCase() === term) {
        res.innerHTML = apiItems.map(codeRow).join('') ||
          `<div class="row" style="pointer-events:none"><div class="r-body"><div class="r-sub">${esc(t('No documented W245 code matches'))} “${esc(term)}” — ${esc(t('Try the chat instead.'))}</div></div></div>`;
      }
    });
  }

  q.addEventListener('input', render);

  /* the first entry row scrolls to the search and focuses it */
  const entry = document.getElementById('entry-search');
  if (entry) entry.addEventListener('click', () => {
    setTimeout(() => q.focus(), 60);
  });
}

/* ---------- codes.html: list + search + filter ---------- */
function initCodes() {
  const list = document.getElementById('code-list');
  if (!list) return;
  const q = document.getElementById('code-search');
  const filters = document.querySelectorAll('.chip-btn[data-sev]');
  const filtersSec = document.getElementById('code-filters');
  const listSec = document.getElementById('code-list-section');
  const hint = document.getElementById('code-hint');
  const note = document.getElementById('ws-note');
  let sev = 'ALL';

  /* idle state: browse by system + common codes — search stays primary */
  function idleHome() {
    const counts = {};
    FAULT_CODES.forEach(c => { counts[c.system] = (counts[c.system] || 0) + 1; });
    const systems = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const common = ['P0300', 'P0301', 'P0172', 'P0670', 'P0420', 'P0016']
      .map(id => FAULT_CODES.find(c => c.code === id)).filter(Boolean);
    return `
      <span class="micro" style="display:block;margin-bottom:10px">${t('Browse by system')}</span>
      <div class="chips">${systems.map(([s, n]) =>
        `<button class="chip-btn" data-sys="${esc(s)}">${esc(s)} · ${n}</button>`).join('')}</div>
      <span class="micro" style="display:block;margin:18px 0 8px">${t('Common codes')}</span>
      <div class="rows">${common.map(codeRow).join('')}</div>`;
  }

  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-sys]');
    if (btn) { q.value = btn.getAttribute('data-sys'); render(); q.focus(); }
  });

  function render() {
    const term = (q.value || '').trim().toLowerCase();

    /* idle state: browse — nothing else visible */
    if (!term) {
      filtersSec.classList.add('hidden');
      if (hint) hint.classList.remove('hidden');
      listSec.classList.remove('hidden');
      if (note) note.textContent = t('Codebook · Mercedes-Benz B-Class (W245)') + ' · ' + FAULT_CODES.length + ' ' + t('codes');
      list.innerHTML = idleHome();
      return;
    }

    listSec.classList.remove('hidden');
    filtersSec.classList.remove('hidden');
    if (hint) hint.classList.add('hidden');
    if (note) note.textContent = t('Search results · Mercedes-Benz B-Class (W245)');

    const items = FAULT_CODES.filter(c => {
      if (sev !== 'ALL' && c.severity !== sev) return false;
      return (c.code + ' ' + c.name + ' ' + c.system + ' ' + locName(c)).toLowerCase().includes(term);
    });
    list.innerHTML = items.map(codeRow).join('') ||
      `<div class="block mut small">${esc(t('No documented W245 code matches'))} “${esc(term)}”.</div>`;

    /* live API overrides the local mirror when configured */
    apiSearch(term, sev).then(apiItems => {
      if (apiItems && q.value.trim().toLowerCase() === term) {
        list.innerHTML = apiItems.map(codeRow).join('') ||
          `<div class="block mut small">${esc(t('No documented W245 code matches'))} “${esc(term)}”.</div>`;
      }
    });
  }

  if (q) q.addEventListener('input', render);
  filters.forEach(btn => btn.addEventListener('click', () => {
    sev = btn.dataset.sev;
    filters.forEach(b => b.style.background = b === btn ? 'var(--mist)' : 'var(--paper)');
    render();
  }));
  render();
}

/* ---------- code.html: detail page ---------- */
function initCodeDetail() {
  const root = document.getElementById('code-detail');
  if (!root) return;
  const c = locCode(byCode(getParam('code')));
  if (!c) {
    root.innerHTML = `<div class="block"><div class="micro">${t('Not found')}</div>
      <p class="mt8">${t('No documented W245 code with this ID.')} <a href="codes.html">${t('Browse the list')}</a>.</p></div>`;
    return;
  }

  document.getElementById('code-title').textContent = c.code;
  const crit = c.severity === 'HIGH';

  const sevBadge = `<span class="sev ${c.severity === 'HIGH' ? 'sev-high' : c.severity === 'MEDIUM' ? 'sev-med' : 'sev-low'}"><span class="dot"></span>${sevLabel(c.severity)}</span>`;

  root.innerHTML = `
    <div class="band code-hero">
      <div class="micro ice">${t('Fault Code')} · ${esc(t(c.system))}</div>
      <div class="numeral">${c.code}</div>
      <div class="name">${esc(c.name)}</div>
    </div>
    <div class="sev-banner ${crit ? 'crit' : ''}">
      <span class="dot" style="background:${crit ? 'var(--danger)' : c.severity === 'MEDIUM' ? 'var(--ink)' : 'var(--mut)'}"></span>
      <p>${crit
        ? t('Safety-critical. Address this before further driving — the MAYDAY buttons below connect you to help.')
        : c.severity === 'MEDIUM'
          ? t('Driveable short-term; schedule a check soon.')
          : t('Low urgency — safe to book a normal service visit.')}</p>
    </div>
    <div class="block"><div class="micro">${t('Symptoms')}</div>
      ${c.symptoms.map(s => `<p class="small">· ${esc(s)}</p>`).join('')}
    </div>
    <div class="block"><div class="micro">${t('Possible causes')}</div>
      ${c.causes.map(x => `<p class="small">· ${esc(x)}</p>`).join('')}
    </div>
    <div class="block"><div class="micro">${sevBadge} · ${t('Recommended steps')}</div>
      <ol class="steps">${c.guide.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <div class="source">${esc(c.guide.source)} — ${t('every answer is cited to a retrieved document.')}</div>
    </div>
    ${crit ? `
    <div class="sheet-danger">
      <div class="sd-head"><svg viewBox="0 0 24 24"><path d="M12 3L2 21h20L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.5" fill="#fff"/></svg>${t('Safety warning')}</div>
      <div class="sd-body">
        <p><b>${esc(c.name)}</b> ${t('is flagged safety-critical for your')} ${esc(VEHICLE.model)}${t('. Stop driving and get help now.')}</p>
        <div class="btn-stack">
          <a class="btn btn-danger" href="tel:${MAYDAY.callNumber}"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-3 2a13 13 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></svg>${t('Call MAYDAY')}</a>
          <a class="btn btn-ghost" href="https://wa.me/${MAYDAY.waNumber.replace('+','')}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M4 4h16v13H8l-4 4V4z"/></svg>${t('WhatsApp MAYDAY')}</a>
        </div>
      </div>
    </div>` : ''}
    <div class="section btn-stack px16">
      <a class="btn btn-ghost" href="locator.html?code=${c.code}">${t('Find nearest workshop')}</a>
      <a class="btn btn-primary" href="codes.html">${t('Back to fault codes')}</a>
    </div>`;
}

/* ---------- chat.html: scripted flow ---------- */
function initChat() {
  const scroll = document.getElementById('chat-scroll');
  if (!scroll) return;

  function bubble(cls, html, cite) {
    const d = document.createElement('div');
    d.className = 'bubble ' + cls;
    d.innerHTML = html + (cite ? `<span class="cite">${esc(cite)}</span>` : '');
    scroll.appendChild(d);
    scroll.scrollTop = scroll.scrollHeight;
  }

  /* AR mode swaps in the Arabic script (i18n.js); EN keeps CHAT_SCRIPT */
  const CS = (window.LANG === 'ar' && window.CHAT_SCRIPT_AR) ? window.CHAT_SCRIPT_AR : CHAT_SCRIPT;

  bubble('bot', esc(CS.greeting));

  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  scroll.appendChild(typing);

  let busy = false;

  function answer(text) {
    if (busy) return;
    busy = true;
    bubble('user', esc(text));
    const quick = document.getElementById('chat-quick');
    if (quick) quick.classList.add('hidden');
    scroll.appendChild(typing);
    setTimeout(() => {
      const rule = CS.rules.find(r => r.match.test(text));
      scroll.removeChild(typing);
      if (rule) {
        bubble('bot', esc(rule.reply).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'), rule.cite);
        if (rule.code) {
          const c = byCode(rule.code);
          if (c && c.severity === 'HIGH') {
            bubble('bot crit', `<b>${t('Safety warning.')}</b> ${t('This fault is flagged safety-critical. Stop driving and get help.')}`);
          }
        }
        showChips(rule.code ? ['View diagnosis', 'Find workshop', 'Emergency'] : ['Try another symptom']);
      } else {
        bubble('bot', esc(CS.fallback));
        showChips(['Try another symptom']);
      }
      busy = false;
    }, 900);
  }

  function showChips(list) {
    const bar = document.getElementById('chat-chips');
    bar.innerHTML = list.map(l => {
      if (l === 'View diagnosis') return `<button class="chip-btn" onclick="location.href='code.html?code=${CHAT_CODE}'">${t('View diagnosis')}</button>`;
      if (l === 'Find workshop') return `<button class="chip-btn" onclick="location.href='locator.html'">${t('Find workshop')}</button>`;
      if (l === 'Emergency') return `<button class="chip-btn" onclick="location.href='mayday.html'">${t('Emergency')}</button>`;
      return `<button class="chip-btn" onclick="resetChat()">${t(l)}</button>`;
    }).join('');
    bar.classList.remove('hidden');
  }

  window.CHAT_CODE = '';
  const origAnswer = answer;
  answer = function (text) { origAnswer(text); };

  window.resetChat = function () {
    document.getElementById('chat-chips').classList.add('hidden');
    bubble('bot', esc(CS.greeting));
  };

  document.getElementById('chat-ask').addEventListener('click', () => {
    const inp = document.getElementById('chat-input');
    const v = inp.value.trim();
    if (!v) return;
    inp.value = '';
    const rule = CS.rules.find(r => r.match.test(v));
    window.CHAT_CODE = rule && rule.code ? rule.code : '';
    answer(v);
  });
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('chat-ask').click();
  });

  /* quick chips keep their English data-q key (rules match both languages);
     in AR mode the bubble shows the Arabic question text */
  document.querySelectorAll('.chip-btn[data-q]').forEach(b =>
    b.addEventListener('click', () => {
      const q = b.dataset.q;
      const rule = CS.rules.find(r => r.match.test(q));
      window.CHAT_CODE = rule && rule.code ? rule.code : '';
      answer(t(q));
    }));

  /* ----- image attachment (mock VLM pipeline) ----- */
  const fileInput = document.getElementById('chat-file');
  document.getElementById('chat-attach').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);

    /* user bubble with the attachment */
    const att = document.createElement('div');
    att.className = 'bubble user';
    att.innerHTML = `<img src="${url}" alt="attached dashboard photo"><div class="att-name">${esc(f.name)} ${t('· sent for vision analysis')}</div>`;
    scroll.appendChild(att);
    const quick = document.getElementById('chat-quick');
    if (quick) quick.classList.add('hidden');
    scroll.appendChild(typing);
    scroll.scrollTop = scroll.scrollHeight;

    setTimeout(() => {
      scroll.removeChild(typing);
      bubble('bot', t('Vision analysis (demo): reading the dashboard image… detected a <b>flashing engine-shaped warning lamp</b> with amber-to-red colouring.'));
      bubble('bot',
        t('The detected lamp maps to a documented W245 fault code:\n\n<b>P0300</b> — Random/Multiple Cylinder Misfire Detected · severity <b>HIGH</b>.'),
        t('SOURCE: W245 COMMON-FAULTS DIGEST · R-01'));
      bubble('bot crit', `<b>${t('Safety warning.')}</b> ${t('This fault is flagged safety-critical. Stop driving and get help.')}`);
      window.CHAT_CODE = 'P0300';
      showChips(['View diagnosis', 'Find workshop', 'Emergency']);
      fileInput.value = '';
    }, 1400);
  });
}

/* ---------- photo.html: mock VLM ---------- */
function initPhoto() {
  const drop = document.getElementById('drop');
  if (!drop) return;
  const step2 = document.getElementById('photo-step2');
  const analysis = document.getElementById('photo-analysis');
  const results = document.getElementById('photo-results');

  function detect() {
    drop.classList.add('has-photo');
    drop.innerHTML = `<div class="mock"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke="#C53030"/></svg></div>`;
    analysis.classList.remove('hidden');
    setTimeout(() => {
      analysis.classList.add('hidden');
      step2.classList.remove('hidden');
      results.classList.remove('hidden');
    }, 1400);
  }

  drop.addEventListener('click', () => detect());
  document.getElementById('retake').addEventListener('click', () => detect());
}

/* ---------- locator.html: haversine sorting ---------- */
function initLocator() {
  const list = document.getElementById('ws-list');
  if (!list) return;
  document.getElementById('me-label').textContent = t(ME.label);
  const code = getParam('code');

  const sorted = WORKSHOPS
    .map(w => ({ ...w, km: haversine(ME.lat, ME.lng, w.lat, w.lng) }))
    .sort((a, b) => a.km - b.km);

  list.innerHTML = sorted.map(w => `
    <a class="row" href="https://wa.me/${w.wa.replace('+','')}" target="_blank" rel="noopener">
      <div class="chip"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4.2 4.2 0 01-5.8 5.4L4.6 16a1.9 1.9 0 002.7 2.7l4.3-4.3a4.2 4.2 0 015.4-5.8l-2.3 2.3 1.6 1.6 2.3-2.3a4.2 4.2 0 01-3.9-3.9z"/></svg></div>
      <div class="r-body">
        <div class="r-title">${esc(w.name)}</div>
        <div class="r-sub">${esc(w.area)} · ★ ${w.rating} · ${esc(w.specialty)}</div>
      </div>
      <span class="dist">${w.km.toFixed(1)} ${t('km')}</span>
    </a>`).join('');

  if (code) document.getElementById('ws-note').textContent = t('Showing nearest workshops for') + ' ' + code + t(' — call ahead and mention the code.');
}

/* ---------- index.html: dynamic bits ---------- */
function initHome() {
  const grid = document.getElementById('engine-facts');
  if (!grid) return;
  const facts = [
    [t('Model'), t('B-Class (W245)')],
    [t('Production'), VEHICLE.years],
    [t('Engines'), t(VEHICLE.engines.length + ' variants')],
    [t('Platform'), t('Sandwich floor, FWD')]
  ];
  grid.innerHTML = facts.map(([k, v]) => `<div><div class="micro ice">${k}</div><b>${esc(v)}</b></div>`).join('');
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHome(); initHomeSearch(); initCodes(); initCodeDetail(); initChat(); initPhoto(); initLocator();
});
