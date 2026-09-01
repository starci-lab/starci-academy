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

const out = []
for (const f of r) {
  const msgs = f.messages.filter((m) => safe.has(m.ruleId))
  if (!msgs.length) continue
  const file = f.filePath.replace(/\\/g, "/").replace(/^.*?\/src\//, "src/")
  out.push({
    file,
    count: msgs.length,
    rules: msgs.map((m) => ({
      line: m.line,
      col: m.column,
      rule: m.ruleId.replace("starci-fe/", ""),
      msg: m.message.split("\n")[0].slice(0, 160),
    })),
  })
}
fs.writeFileSync("./.artifacts/_b40-w02-safe-findings.json", JSON.stringify(out, null, 2))
console.log("files", out.length, "total", out.reduce((s, x) => s + x.count, 0))
for (const x of out) console.log(`${x.count}\t${x.file}`)
