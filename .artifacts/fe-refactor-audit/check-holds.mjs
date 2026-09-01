import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"

const ROOT = process.cwd()
const dump = spawnSync("node", [".artifacts/fe-refactor-audit/dump-holes.mjs"], {
    encoding: "utf8",
    cwd: ROOT,
})
const text = dump.stdout
const holePaths = [...text.matchAll(/((?:\.storybook|src)[\\/][^\n]+\.tsx)/g)].map((m) =>
    m[1].replace(/\\/g, "/"),
)

const ledgerRaw = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))
const entries = ledgerRaw.decisions
const covered = new Map()
for (const e of entries) {
    if (e.status !== "open") continue
    const paths = e.paths || (e.path ? [e.path] : [])
    for (const p of paths) covered.set(String(p).replace(/\\/g, "/"), e.id)
}

console.log("holes", holePaths.length)
const missing = []
for (const p of holePaths) {
    if (!covered.has(p)) missing.push(p)
    else console.log("OK", p, "→", covered.get(p))
}
console.log("\nmissing", missing.length)
for (const p of missing) console.log(" ", p)
