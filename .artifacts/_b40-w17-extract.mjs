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
  const j = n.toLowerCase().indexOf("/.storybook/")
  const k = Math.max(i, j)
  return k >= 0 ? n.slice(k + 1) : n
}

const safe = []
const byFile = {}
for (const f of eslint) {
  const r = rel(f.filePath)
  if (!owns.has(r)) {
    console.error("MISS", r)
    continue
  }
  for (const m of f.messages || []) {
    if (!SAFE.has(m.ruleId)) continue
    const item = {
      file: r,
      rule: m.ruleId,
      line: m.line,
      col: m.column,
      msg: m.message.slice(0, 220),
    }
    safe.push(item)
    ;(byFile[r] ||= []).push(item)
  }
}

const byRule = {}
for (const s of safe) byRule[s.rule] = (byRule[s.rule] || 0) + 1

const out = { safe: safe.length, byRule, files: Object.keys(byFile).length, byFile }
fs.writeFileSync(
  ".artifacts/_b40-w17-safe-findings.json",
  JSON.stringify(out, null, 2),
)
console.log(JSON.stringify({ safe: out.safe, byRule: out.byRule, files: out.files }, null, 2))
