import fs from "node:fs"

function summarize(path) {
  const raw = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "")
  const d = JSON.parse(raw)
  const msgs = d.flatMap((f) =>
    f.messages.map((m) => ({
      file: f.filePath.replace(/\\/g, "/").replace(/^.*starci-academy\//, ""),
      rule: m.ruleId,
      line: m.line,
    })),
  )
  const by = {}
  for (const m of msgs) by[m.rule] = (by[m.rule] || 0) + 1
  const byFile = {}
  for (const m of msgs) (byFile[m.file] ??= []).push(`${m.line}:${m.rule}`)
  return { total: msgs.length, by, byFile, filesWithMsgs: Object.keys(byFile).length }
}

const before = summarize(".artifacts/fe-refactor-audit/_b33-agent5-eslint-before.json")
const after = summarize(".artifacts/fe-refactor-audit/_b33-agent5-eslint-after.json")
console.log(JSON.stringify({ before: { total: before.total, by: before.by }, after: { total: after.total, by: after.by }, remainingFiles: after.byFile }, null, 2))
