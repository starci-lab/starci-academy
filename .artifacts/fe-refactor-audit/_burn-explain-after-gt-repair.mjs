/**
 * Repair explain that landed AFTER tag closer (`>` / `/>`) — move it inside as an attribute.
 */
import fs from "node:fs"

const bad = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-after-gt.json", "utf8"),
)

const byFile = new Map()
for (const b of bad) {
    if (!byFile.has(b.file)) byFile.set(b.file, [])
    byFile.get(b.file).push(b.line)
}

let repaired = 0
const hard = []
const changed = []

for (const [file, explainLines] of byFile) {
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    const sorted = [...new Set(explainLines)].sort((a, b) => b - a)
    let fileRepaired = 0

    for (const explainLineNo of sorted) {
        const i = explainLineNo - 1
        if (i <= 0) continue
        const cur = lines[i]
        const prev = lines[i - 1]
        if (!/^\s*explain=/.test(cur)) continue
        if (!/>\s*$/.test(prev) || !/principle=/.test(prev)) continue

        const explainLit = cur.trim()
        const indent = (prev.match(/^\s*/) || [""])[0]

        // One-liner that already contains a child before close: <Box principle="x"><Child /></Box>
        // Put explain immediately after principle="token"
        const nestedChild = /principle=(["'])([a-z0-9-]+)\1([^>]*?)>(.+)/.exec(prev)
        if (nestedChild && /<\w/.test(nestedChild[4])) {
            const quote = nestedChild[1]
            const token = nestedChild[2]
            const lit = `principle=${quote}${token}${quote}`
            const at = prev.indexOf(lit)
            if (at < 0) {
                hard.push({ file, line: explainLineNo, reason: "nested-principle-miss" })
                continue
            }
            const next = prev.slice(0, at + lit.length) + " " + explainLit + prev.slice(at + lit.length)
            lines.splice(i - 1, 2, next)
            fileRepaired++
            repaired++
            continue
        }

        // Strip trailing > or />
        const closerMatch = prev.match(/^(.*?)(\s*\/\s*>|\s*>)\s*$/)
        if (!closerMatch) {
            hard.push({ file, line: explainLineNo, reason: "no-closer" })
            continue
        }
        const before = closerMatch[1].replace(/\s+$/, "")
        const closer = closerMatch[2].trim()

        // Self-closing or open tag: put explain before closer on its own line
        lines.splice(i - 1, 2, before, indent + explainLit, indent + closer)
        fileRepaired++
        repaired++
    }

    if (fileRepaired) {
        fs.writeFileSync(file, lines.join(nl))
        changed.push({ file, fileRepaired })
    }
}

const report = { repaired, hard, changedFiles: changed.length, changed }
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-after-gt-repair.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
