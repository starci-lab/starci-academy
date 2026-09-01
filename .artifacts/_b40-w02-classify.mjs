import fs from "node:fs"

const r = JSON.parse(fs.readFileSync("./.artifacts/_b40-w02-eslint-before.json", "utf8"))
const safe = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/handler-on-prefix",
  "starci-fe/prefer-arrow-export",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-emoji-in-source",
])

const rows = []
for (const f of r) {
  const file = f.filePath.replace(/\\/g, "/").replace(/^.*?\/src\//, "src/")
  const all = f.messages
  const safeMsgs = all.filter((m) => safe.has(m.ruleId))
  const other = all.filter((m) => !safe.has(m.ruleId))
  rows.push({
    file,
    total: all.length,
    safe: safeMsgs.length,
    other: other.length,
    safeRules: Object.fromEntries(
      [...safeMsgs.reduce((m, x) => m.set(x.ruleId.replace("starci-fe/", ""), (m.get(x.ruleId.replace("starci-fe/", "")) || 0) + 1), new Map())],
    ),
    otherRules: Object.fromEntries(
      [...other.reduce((m, x) => m.set(x.ruleId?.replace("starci-fe/", "") || "unknown", (m.get(x.ruleId?.replace("starci-fe/", "") || "unknown") || 0) + 1), new Map())],
    ),
    safeDetails: safeMsgs.map((m) => ({
      line: m.line,
      col: m.column,
      rule: m.ruleId.replace("starci-fe/", ""),
      msg: m.message.split("\n")[0].slice(0, 140),
    })),
  })
}

const cleanable = rows.filter((r) => r.safe > 0 && r.other === 0)
const blocked = rows.filter((r) => r.safe > 0 && r.other > 0)
const noSafe = rows.filter((r) => r.safe === 0)

fs.writeFileSync("./.artifacts/_b40-w02-safe-findings.json", JSON.stringify({ cleanable, blocked, noSafeCount: noSafe.length, rows }, null, 2))
console.log("cleanable (only safe findings):", cleanable.length)
for (const r of cleanable) console.log("  CLEAN", r.safe, r.file, JSON.stringify(r.safeRules))
console.log("\nblocked by other rules:", blocked.length)
for (const r of blocked) console.log("  BLOCK", r.safe, "+", r.other, r.file, "safe=", JSON.stringify(r.safeRules), "other=", JSON.stringify(r.otherRules))
console.log("\nno safe findings:", noSafe.length)
