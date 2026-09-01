const fs = require("fs");
const { execSync } = require("child_process");
const manifests = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json", "utf8"));
const files = manifests.manifests["overlays-modals-drawers"].files.filter((f) => /\.(tsx|ts|jsx|js)$/.test(f));
const chunk = files.join(" ");
const out = ".artifacts/_b35-a2-eslint-slice.json";
try {
  execSync(`npx eslint --no-error-on-unmatched-pattern ${files.map((f) => JSON.stringify(f)).join(" ")} -f json -o ${out}`, {
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 20 * 1024 * 1024,
  });
} catch (e) {
  // eslint non-zero when warnings
}
const results = JSON.parse(fs.readFileSync(out, "utf8"));
const byFile = {};
let total = 0;
for (const r of results) {
  const rel = r.filePath.split("\\").join("/").split("/starci-academy/")[1];
  const msgs = (r.messages || []).filter((m) => m.ruleId && m.ruleId.startsWith("starci-fe/"));
  if (!msgs.length) continue;
  byFile[rel] = msgs.map((m) => ({ rule: m.ruleId, line: m.line, msg: String(m.message).slice(0, 140) }));
  total += msgs.length;
}
console.log(JSON.stringify({ total, filesWithDebt: Object.keys(byFile).length, byFile }, null, 2));
fs.writeFileSync(".artifacts/_b35-a2-eslint-slice-summary.json", JSON.stringify({ total, filesWithDebt: Object.keys(byFile).length, byFile }, null, 2));
