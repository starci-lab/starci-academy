import fs from "node:fs"

const d = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-only.json", "utf8"),
)
const tokens = {}
let unresolved = 0
for (const e of d.unlockedExplain) {
    const lines = fs.readFileSync(e.file, "utf8").split(/\n/)
    const start = Math.max(0, e.line - 4)
    const end = Math.min(lines.length, e.line + 12)
    const chunk = lines.slice(start, end).join("\n")
    const m = chunk.match(/principle=["']([a-z0-9-]+)["']/)
    const t = m ? m[1] : "?"
    if (t === "?") unresolved++
    tokens[t] = (tokens[t] || 0) + 1
}
console.log(
    Object.entries(tokens)
        .sort((a, b) => b[1] - a[1])
        .map(([t, c]) => c + " " + t)
        .join("\n"),
)
console.log("unresolved", unresolved)
