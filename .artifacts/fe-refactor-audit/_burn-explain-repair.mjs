/**
 * Repair explain inserted AFTER items=/body= openers (invalid JSX).
 * Moves explain to its own line between principle attrs and items=/body=.
 */
import fs from "node:fs"

const bad = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-corruption.json", "utf8"),
)

/** @type {Map<string, number[]>} */
const byFile = new Map()
for (const b of bad) {
    if (!byFile.has(b.file)) byFile.set(b.file, [])
    byFile.get(b.file).push(b.line)
}

let repaired = 0
const changed = []

for (const [file, explainLines] of byFile) {
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    // Process descending so splices don't shift earlier targets
    const sorted = [...new Set(explainLines)].sort((a, b) => b - a)
    let fileRepaired = 0

    for (const explainLineNo of sorted) {
        const i = explainLineNo - 1
        if (i <= 0 || i >= lines.length) continue
        const cur = lines[i]
        const prev = lines[i - 1]
        if (!/^\s*explain=/.test(cur)) continue

        const m = prev.match(/^(.*?)(\s+)((?:items|body|content)=\{.*)$/)
        if (!m) continue

        const before = m[1].replace(/\s+$/, "")
        const opener = m[3]
        const indent = before.match(/^\s*/)[0]
        // Prefer explain indent matching sibling attrs (+4 spaces from tag indent if possible)
        const explainIndent = cur.match(/^\s*/)[0]

        // Replace prev+cur with before / explain / opener
        lines.splice(i - 1, 2, before, explainIndent + cur.trim(), indent + opener)
        fileRepaired++
        repaired++
    }

    if (fileRepaired) {
        fs.writeFileSync(file, lines.join(nl))
        changed.push({ file, fileRepaired })
    }
}

const report = { repaired, changedFiles: changed.length, changed }
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-repair-result.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
