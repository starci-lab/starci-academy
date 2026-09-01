import fs from "node:fs"

const SAFE = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/handler-on-prefix",
  "starci-fe/prefer-arrow-export",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-emoji-in-source",
])

const owns = new Set(
  JSON.parse(
    fs.readFileSync(
      ".artifacts/fe-refactor-audit/b40-manifests/w17-src-blocks-skeleton.json",
      "utf8",
    ),
  ).owns,
)
const eslint = JSON.parse(
  fs.readFileSync(".artifacts/_b40-w17-eslint-before.json", "utf8"),
)
const rel = (p) => {
  const n = p.replaceAll("\\", "/")
  const i = n.toLowerCase().indexOf("/src/")
  return i >= 0 ? n.slice(i + 1) : n
}

const rows = []
for (const f of eslint) {
  const r = rel(f.filePath)
  if (!owns.has(r)) continue
  const msgs = f.messages || []
  const rules = {}
  let safe = 0
  let unsafe = 0
  for (const m of msgs) {
    rules[m.ruleId] = (rules[m.ruleId] || 0) + 1
    if (SAFE.has(m.ruleId)) safe++
    else unsafe++
  }
  rows.push({ file: r, total: msgs.length, safe, unsafe, rules })
}
rows.sort((a, b) => a.unsafe - b.unsafe || a.total - b.total)
fs.writeFileSync(
  ".artifacts/_b40-w17-file-debt.json",
  JSON.stringify(rows, null, 2),
)
console.log(
  JSON.stringify(
    {
      zeroUnsafe: rows.filter((r) => r.unsafe === 0).map((r) => r.file),
      oneUnsafe: rows.filter((r) => r.unsafe === 1),
      lowUnsafe: rows.filter((r) => r.unsafe > 0 && r.unsafe <= 3),
      summary: rows.map((r) => ({
        file: r.file.split("/").slice(-3).join("/"),
        total: r.total,
        safe: r.safe,
        unsafe: r.unsafe,
      })),
    },
    null,
    2,
  ),
)
