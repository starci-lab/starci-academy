import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"

const files = JSON.parse(
    readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-6-domain-a"]

const outPath = process.argv[2] ?? ".artifacts/fe-refactor-audit/_b32-a6-eslint-before.json"
const r = spawnSync("npx", ["eslint", "--format", "json", "-o", outPath, ...files], {
    encoding: "utf8",
    shell: true,
})
console.log("status", r.status)
if (r.stderr) console.error(r.stderr.slice(-800))

const data = JSON.parse(readFileSync(outPath, "utf8"))
let n = 0
const by = {}
for (const f of data) {
    for (const m of f.messages) {
        if (!m.ruleId) continue
        n++
        by[m.ruleId] = (by[m.ruleId] || 0) + 1
        const parts = f.filePath.split("starci-academy")
        const rel = (parts[parts.length - 1] || f.filePath).replace(/^[\\/]+/, "")
        const msg = String(m.message || "").replace(/\n/g, " ").slice(0, 160)
        console.log(rel + ":" + m.line + ":" + m.column + " " + m.ruleId + " " + msg)
    }
}
console.log("TOTAL", n)
console.log(JSON.stringify(by, null, 2))
writeFileSync(
    outPath.replace(".json", "-summary.json"),
    JSON.stringify({ total: n, byRule: by, files: files.length }, null, 2),
)
