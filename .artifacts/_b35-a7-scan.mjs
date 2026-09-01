import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const man = JSON.parse(
  fs.readFileSync(
    path.join(root, ".artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json"),
    "utf8",
  ),
)
const files = new Set(man.manifests["profile-cv-careers-consultant"].files)
const eslint = JSON.parse(
  fs.readFileSync(
    path.join(root, ".artifacts/fe-refactor-audit/2026-08-10-b35-eslint-before.json"),
    "utf8",
  ),
)
const results = eslint.results || eslint

const catMap = {
  "starci-fe/no-host-element-at-sentence-tier": "host",
  "starci-fe/no-raw-shape-at-sentence-tier": "raw-shape",
  "starci-fe/no-classname-at-sentence-tier": "classname-family",
  "starci-fe/no-cn-above-vocabulary": "classname-family",
  "starci-fe/no-public-classname-prop": "classname-family",
  "starci-fe/require-identity-root": "identity-root",
  "starci-fe/require-frame-self-declare": "frame-self-declare",
  "starci-fe/no-heroui-outside-vocabulary": "heroui",
  "starci-fe/no-frame-fragment-item": "frame-fragment",
  "starci-fe/page-folder-two-files-only": "page-two-files",
}

const byFile = {}
const byRule = {}
const byCat = {}
let total = 0

for (const r of results) {
  const abs = (r.filePath || "").replace(/\\/g, "/")
  const key = [...files].find((f) => abs.endsWith("/" + f) || abs.endsWith(f))
  if (!key) continue
  const msgs = (r.messages || []).filter(
    (m) => m.ruleId && String(m.ruleId).startsWith("starci-fe/"),
  )
  if (!msgs.length) continue
  byFile[key] ||= { rules: {}, samples: [] }
  for (const m of msgs) {
    total++
    byRule[m.ruleId] = (byRule[m.ruleId] || 0) + 1
    byFile[key].rules[m.ruleId] = (byFile[key].rules[m.ruleId] || 0) + 1
    const c = catMap[m.ruleId]
    if (c) byCat[c] = (byCat[c] || 0) + 1
    if (byFile[key].samples.length < 8) {
      byFile[key].samples.push({
        rule: m.ruleId,
        line: m.line,
        message: String(m.message || "").slice(0, 160),
      })
    }
  }
}

const ranked = Object.entries(byFile)
  .map(([f, data]) => {
    const cats = new Set()
    for (const r of Object.keys(data.rules)) {
      const c = catMap[r]
      if (c) cats.add(c)
    }
    return {
      f,
      count: Object.values(data.rules).reduce((a, b) => a + b, 0),
      cats: [...cats].sort(),
      rules: data.rules,
      samples: data.samples,
    }
  })
  .sort((a, b) => b.cats.length - a.cats.length || b.count - a.count)

const missing = [...files].filter((f) => !byFile[f])

const out = {
  total,
  byRule,
  byCat,
  filesWithFindings: ranked.length,
  missingFindings: missing,
  ranked,
}
fs.writeFileSync(
  path.join(root, ".artifacts/_b35-a7-scan.json"),
  JSON.stringify(out, null, 2),
)
console.log(
  JSON.stringify(
    {
      total,
      byRule,
      byCat,
      filesWithFindings: ranked.length,
      missingCount: missing.length,
      top: ranked.slice(0, 25).map((x) => ({
        score: x.cats.length,
        count: x.count,
        f: x.f,
        cats: x.cats,
        rules: x.rules,
      })),
    },
    null,
    2,
  ),
)
