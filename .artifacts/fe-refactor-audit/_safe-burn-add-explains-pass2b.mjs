/**
 * Pass 2b: format cleanup + fill static principle= missing explain in same opening tag.
 */
import fs from "node:fs"

const EXPLAIN = JSON.parse(
    fs.readFileSync(
        new URL("./_safe-burn-explain-templates.json", import.meta.url),
        "utf8",
    ),
).EXPLAIN

const result = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-result.json", "utf8"),
)
const files = new Set([...result.files, ...result.hardCases.map((h) => h.file)])

let fixed = 0
let formatted = 0
const changed = []

for (const file of [...files].sort()) {
    if (!fs.existsSync(file)) continue
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // Fix over-indented explain lines that sit alone under principle
    src = src.replace(
        /(^(\s*)principle=["'][a-z0-9-]+["'])\n\s+explain=/gm,
        "$1\n$2explain=",
    )

    // Fix jammed same-line: principle="x" explain="long..." rest
    // leave as-is if already fine

    // For each principle="token", if the opening tag (from this match to the next `>` that closes it)
    // has no explain=, insert one after principle.
    const parts = []
    let last = 0
    const re = /principle=(["'])([a-z0-9-]+)\1/g
    let m
    while ((m = re.exec(src))) {
        const token = m[2]
        const quote = m[1]
        const explain = EXPLAIN[token]
        if (!explain) continue

        // Find end of this opening tag: scan forward for `>` not inside strings/braces
        let i = m.index
        let depth = 0
        let inStr = null
        let end = -1
        for (; i < src.length; i++) {
            const ch = src[i]
            if (inStr) {
                if (ch === "\\" ) { i++; continue }
                if (ch === inStr) inStr = null
                continue
            }
            if (ch === "\"" || ch === "'" || ch === "`") {
                inStr = ch
                continue
            }
            if (ch === "{") { depth++; continue }
            if (ch === "}") { depth = Math.max(0, depth - 1); continue }
            if (depth === 0 && ch === ">") {
                end = i
                break
            }
        }
        if (end < 0) continue

        const opening = src.slice(m.index, end + 1)
        if (/\bexplain=/.test(opening)) continue
        if (/principle=\{/.test(opening)) continue

        // Insert explain after the principle literal
        const principleLit = m[0]
        const insertAt = m.index + principleLit.length
        const lineStart = src.lastIndexOf("\n", m.index) + 1
        const indent = src.slice(lineStart, m.index).match(/^\s*/)?.[0] ?? ""
        // Determine if principle is mid-line with more attrs after
        const afterPrinciple = src.slice(insertAt, end + 1)
        const insertion = `\n${indent}explain=${quote}${explain}${quote}`

        parts.push({ insertAt, insertion })
    }

    // Apply insertions from the end so offsets stay valid
    for (const p of parts.sort((a, b) => b.insertAt - a.insertAt)) {
        src = src.slice(0, p.insertAt) + p.insertion + src.slice(p.insertAt)
        fixed++
    }

    // Re-run over-indent cleanup after insertions
    src = src.replace(
        /(^(\s*)principle=["'][a-z0-9-]+["'])\n\s+explain=/gm,
        "$1\n$2explain=",
    )

    if (src !== before) {
        fs.writeFileSync(file, src)
        changed.push(file)
        if (parts.length === 0) formatted++
    }
}

console.log(JSON.stringify({ fixed, formatted, changedFiles: changed.length }, null, 2))
