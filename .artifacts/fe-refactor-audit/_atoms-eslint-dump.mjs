import fs from "node:fs"
import { execSync } from "node:child_process"

const m = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-manifest-atoms.json", "utf8"),
)
const paths = m.files.map((f) => f.path)
const chunkSize = 20
let all = []
for (let i = 0; i < paths.length; i += chunkSize) {
  const chunk = paths.slice(i, i + chunkSize)
  const cmd =
    "npx eslint --no-error-on-unmatched-pattern -f json " +
    chunk.map((p) => JSON.stringify(p)).join(" ")
  const out = execSync(cmd, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 })
  all = all.concat(JSON.parse(out))
}
const summary = {}
for (const f of all) {
  const rel = f.filePath.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")
  const msgs = f.messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith("starci-fe/"))
  if (!msgs.length) continue
  summary[rel] = msgs.map((msg) => ({
    rule: msg.ruleId,
    line: msg.line,
    msg: msg.message.slice(0, 140),
  }))
}
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_atoms-live-eslint.json",
  JSON.stringify(summary, null, 2),
)
const byRule = {}
let total = 0
for (const msgs of Object.values(summary)) {
  for (const msg of msgs) {
    byRule[msg.rule] = (byRule[msg.rule] || 0) + 1
    total++
  }
}
console.log("files with msgs", Object.keys(summary).length)
console.log(byRule)
console.log("total", total)
