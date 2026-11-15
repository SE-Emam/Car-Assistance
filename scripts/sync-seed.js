/* Regenerates api/_lib/seed.js from demo/assets/js/data.js (single source). */
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(__dirname + '/../demo/assets/js/data.js', 'utf8');
const out = vm.runInContext(src + ';({VEHICLE,FAULT_CODES,WORKSHOPS,ME,MAYDAY,CHAT_SCRIPT,SPECS})', vm.createContext({}));
const header = '/* AUTO-GENERATED from demo/assets/js/data.js — run: npm run sync-seed. Do not edit by hand. */\n';
/* serialize with real RegExp literals (JSON.stringify would destroy them) */
function ser(v) {
  if (Object.prototype.toString.call(v) === '[object RegExp]')  /* cross-realm safe */
    return '/' + v.source + '/' + (v.flags || '');
  if (Array.isArray(v)) return '[' + v.map(ser).join(',') + ']';
  if (v === null) return 'null';
  if (typeof v === 'object')
    return '{' + Object.entries(v).map(([k, val]) =>
      (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ':' + ser(val)).join(',') + '}';
  return JSON.stringify(v);
}
fs.writeFileSync(__dirname + '/../api/_lib/seed.js', header + 'module.exports = ' + ser(out) + ';\n');

/* knowledge from the local cleaned corpus if present (optional — the generated
   api/_lib/knowledge.js ships with the repo and works without the source folder) */
const RAG = __dirname + '/../RAG&Fulte';
if (fs.existsSync(RAG + '/knowledge.json')) {
  const knowledge = JSON.parse(fs.readFileSync(RAG + '/knowledge.json', 'utf8'));
  fs.writeFileSync(__dirname + '/../api/_lib/knowledge.js',
    '/* AUTO-GENERATED from local knowledge corpus — run: npm run sync-seed. Do not edit by hand. */\nmodule.exports = ' + JSON.stringify(knowledge, null, 2) + ';\n');
  console.log('  knowledge.js regenerated from local corpus — items:', knowledge.length);
} else {
  console.log('  knowledge.js kept as committed (no local corpus folder)');
}

console.log('seed.js regenerated — codes:', out.FAULT_CODES.length, 'workshops:', out.WORKSHOPS.length);
