import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"

const roots = ["src/components", ".storybook/components"]
const exts = new Set([".ts", ".tsx"])
const files = []

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (exts.has(path.extname(ent.name))) files.push(p.replace(/\\/g, "/"))
  }
}
for (const r of roots) walk(r)
console.log("files", files.length)

const rule = "starci-fe/no-public-classname-prop"
const rows = []
const CHUNK = 80
for (let i = 0; i < files.length; i += CHUNK) {
  const chunk = files.slice(i, i + CHUNK)
  const r = spawnSync(
    "npx",
    ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", ...chunk],
    {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
      shell: true,
    },
  )
  const out = (r.stdout || "").trim()
  if (!out) {
    process.stderr.write(`chunk ${i}/${files.length} empty stdout code=${r.status}\n`)
    continue
  }
  let data
  try {
    data = JSON.parse(out)
  } catch {
    process.stderr.write(`chunk ${i} parse fail: ${out.slice(0, 120)}\n`)
    continue
  }
  for (const f of data) {
    for (const m of f.messages || []) {
      if (m.ruleId === rule) {
        rows.push({
          file: f.filePath.replace(/\\/g, "/").replace(/^.*?starci-academy\//, ""),
          line: m.line,
          column: m.column,
          message: m.message,
          messageId: m.messageId,
        })
      }
    }
  }
  process.stderr.write(`chunk ${i}/${files.length} hits=${rows.length}\n`)
}

fs.mkdirSync(".artifacts/fe-refactor-audit", { recursive: true })
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_b20-classname-raw.json",
  JSON.stringify(rows, null, 2),
)
console.log("TOTAL", rows.length)

const byFile = {}
for (const r of rows) byFile[r.file] = (byFile[r.file] || 0) + 1
const top = Object.entries(byFile).sort((a, b) => b[1] - a[1])
console.log("files with hits", top.length)
console.log(top.slice(0, 50).map(([f, c]) => `${c}\t${f}`).join("\n"))
