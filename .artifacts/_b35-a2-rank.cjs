const fs = require("fs");
const eslint = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35-eslint-before.json", "utf8"));
const manifests = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json", "utf8"));
const files = manifests.manifests["overlays-modals-drawers"].files;
const fileSet = new Set(files);
const catOf = (r) => {
  if (r === "starci-fe/no-host-element-at-sentence-tier") return "host";
  if (r === "starci-fe/no-raw-shape-at-sentence-tier") return "raw-shape";
  if (r === "starci-fe/no-classname-at-sentence-tier" || r === "starci-fe/no-cn-above-vocabulary" || r === "starci-fe/no-public-classname-prop") return "classname-family";
  if (r === "starci-fe/require-identity-root") return "identity-root";
  if (r === "starci-fe/require-frame-self-declare") return "frame-self-declare";
  if (r === "starci-fe/no-heroui-outside-vocabulary") return "heroui";
  if (r === "starci-fe/no-frame-fragment-item") return "frame-fragment";
  if (r === "starci-fe/page-folder-two-files-only") return "page-two-files";
  return null;
};
const toRel = (p) => {
  const n = p.split("\\").join("/");
  const marker = "/starci-academy/";
  const i = n.toLowerCase().indexOf(marker);
  return i >= 0 ? n.slice(i + marker.length) : n;
};
console.log("sample rel", toRel(eslint.find(r => (r.filePath||"").includes("PremiumGate")).filePath));
console.log("in set?", fileSet.has(toRel(eslint.find(r => (r.filePath||"").includes("PremiumGate")).filePath)));
const byFile = {};
for (const r of eslint) {
  const rel = toRel(r.filePath || "");
  if (!fileSet.has(rel)) continue;
  const msgs = r.messages || [];
  byFile[rel] = { total: msgs.length, byRule: {}, byCat: {}, samples: [] };
  for (const m of msgs) {
    if (!m.ruleId) continue;
    byFile[rel].byRule[m.ruleId] = (byFile[rel].byRule[m.ruleId] || 0) + 1;
    const c = catOf(m.ruleId);
    if (c) byFile[rel].byCat[c] = (byFile[rel].byCat[c] || 0) + 1;
    if (byFile[rel].samples.length < 8) byFile[rel].samples.push({ rule: m.ruleId, line: m.line, col: m.column, msg: String(m.message).slice(0, 180) });
  }
}
const families = {};
for (const [f, v] of Object.entries(byFile)) {
  const parts = f.split("/");
  const idx = parts.findIndex((p) => /Modal$|Drawer$|GithubTeamGate|Turnstile|CookieConsentBanner/.test(p));
  const fam = idx >= 0 ? parts[idx] : parts[parts.length - 2];
  if (!families[fam]) families[fam] = { files: [], byCat: {}, raw: 0, samples: [], byRule: {} };
  families[fam].files.push(f);
  families[fam].raw += v.total;
  for (const [c, n] of Object.entries(v.byCat)) families[fam].byCat[c] = (families[fam].byCat[c] || 0) + n;
  for (const [c, n] of Object.entries(v.byRule)) families[fam].byRule[c] = (families[fam].byRule[c] || 0) + n;
  for (const s of v.samples) if (families[fam].samples.length < 12) families[fam].samples.push({ file: f, ...s });
}
const ranked = Object.entries(families)
  .map(([name, v]) => ({ name, score: Object.keys(v.byCat).length, raw: v.raw, cats: Object.keys(v.byCat).sort(), byCat: v.byCat, byRule: v.byRule, files: v.files, samples: v.samples }))
  .sort((a, b) => b.score - a.score || b.raw - a.raw);
const clean = files.filter((f) => !byFile[f] || byFile[f].total === 0);
fs.writeFileSync(".artifacts/_b35-a2-overlay-rank.json", JSON.stringify({ matched: Object.keys(byFile).length, clean, ranked, byFile }, null, 2));
console.log(JSON.stringify({ matched: Object.keys(byFile).length, cleanCount: clean.length, ranked: ranked.map(r => ({ name: r.name, score: r.score, raw: r.raw, cats: r.cats, files: r.files.length })) }, null, 2));
