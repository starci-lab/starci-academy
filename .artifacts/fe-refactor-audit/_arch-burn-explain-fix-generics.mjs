/**
 * Restore >> that belong to TS generics (broken by naive >> → > fix).
 * Also spot-fix remaining syntax damage.
 */
import fs from "node:fs"

const report = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", "utf8"),
)

function balanceGenericLine(line) {
    // Only consider lines that look like type/signature lines, not JSX open tags
    if (/^\s*<[A-Z]/.test(line)) return line // JSX component
    if (/principle=|explain=|className=|classNames=|items=|body=/.test(line)) return line
    if (!line.includes("<")) return line

    // Count angle brackets outside strings
    let depth = 0
    let inStr = null
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (inStr) {
            if (ch === "\\" ) { i++; continue }
            if (ch === inStr) inStr = null
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") { inStr = ch; continue }
        if (ch === "<") depth++
        else if (ch === ">") depth--
    }
    if (depth > 0) return line.replace(/\s*$/, "") + ">".repeat(depth)
    return line
}

let filesFixed = 0
let linesFixed = 0

for (const file of report.files) {
    if (!fs.existsSync(file)) continue
    const before = fs.readFileSync(file, "utf8")
    const lines = before.split(/\n/)
    let changed = false
    for (let i = 0; i < lines.length; i++) {
        const next = balanceGenericLine(lines[i])
        if (next !== lines[i]) {
            lines[i] = next
            changed = true
            linesFixed++
        }
    }
    if (changed) {
        fs.writeFileSync(file, lines.join("\n"))
        filesFixed++
    }
}

console.log(JSON.stringify({ filesFixed, linesFixed }, null, 2))
