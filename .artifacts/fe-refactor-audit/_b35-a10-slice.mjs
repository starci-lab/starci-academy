import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const before = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-10-b35-eslint-before.json"), "utf8"),
)
const manifests = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-10-b35-manifests.json"), "utf8"),
)
const files = manifests.manifests["shared-consumer-chains-coordinator"].files
const fileSet = new Set(files.map((f) => f.replaceAll("\\", "/").toLowerCase()))

function relOf(abs) {
  const n = abs.replaceAll("\\", "/")
  const marker = "starci-academy/"
  const i = n.toLowerCase().indexOf(marker)
  return i >= 0 ? n.slice(i + marker.length) : n
}

const mine = []
const byRule = {}
let total = 0
for (const r of before) {
  const rel = relOf(r.filePath).replaceAll("\\", "/")
  if (!fileSet.has(rel.toLowerCase())) continue
  const msgs = (r.messages || []).filter(
    (m) => m.ruleId && !String(m.ruleId).startsWith("jsx-a11y"),
  )
  if (!msgs.length) continue
  const rules = {}
  for (const m of msgs) {
    rules[m.ruleId] = (rules[m.ruleId] || 0) + 1
    byRule[m.ruleId] = (byRule[m.ruleId] || 0) + 1
    total++
  }
  mine.push({
    file: rel,
    count: msgs.length,
    rules,
    samples: msgs.slice(0, 4).map((m) => ({
      rule: m.ruleId,
      line: m.line,
      message: String(m.message).slice(0, 140),
    })),
  })
}
mine.sort((a, b) => b.count - a.count)

const out = {
  filesWithFindings: mine.length,
  totalMessages: total,
  byRule: Object.fromEntries(
    Object.entries(byRule).sort((a, b) => b[1] - a[1]),
  ),
  top: mine.slice(0, 60),
  classnameDoors: mine.filter(
    (x) =>
      x.rules["starci-fe/no-public-classname-prop"] ||
      x.rules["starci-fe/no-per-part-classname-prop"] ||
      x.rules["starci-fe/no-css-door-type-laundering"],
  ),
}
fs.writeFileSync(
  path.join(ART, "_b35-a10-slice-findings.json"),
  JSON.stringify(out, null, 2),
)
console.log(
  JSON.stringify(
    {
      filesWithFindings: out.filesWithFindings,
      totalMessages: out.totalMessages,
      byRule: out.byRule,
      top20: out.top.slice(0, 20).map((x) => [x.count, x.file]),
      doorFiles: out.classnameDoors.length,
    },
    null,
    2,
  ),
)
