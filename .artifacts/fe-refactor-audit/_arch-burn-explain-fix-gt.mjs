/**
 * Fix >> damage and bad closer peeling artifacts from explain burn.
 * Also restore em-dashes in explain templates that got mojibake.
 */
import fs from "node:fs"

const report = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", "utf8"),
)

const REPLACEMENTS = [
    // mojibake em-dash variants from PowerShell encoding
    [/ �\? /g, " — "],
    [/ �?" /g, " — "],
    [/ �\?\?/g, " —"],
    [/�\?/g, "—"],
    [/�"/g, "—"],
]

let filesFixed = 0
let ops = 0
const stillBad = []

for (const file of report.files) {
    if (!fs.existsSync(file)) continue
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // Collapse accidental >>
    const gtCount = (src.match(/>>/g) || []).length
    if (gtCount) {
        src = src.replace(/>>+/g, ">")
        ops += gtCount
    }

    for (const [re, to] of REPLACEMENTS) {
        const n = (src.match(re) || []).length
        if (n) {
            src = src.replace(re, to)
            ops += n
        }
    }

    // Fix pattern: explain="..."\n        >\n  where lone > line should stay as tag closer — ok
    // Fix: className="..." >  with space-gt already fine

    if (src !== before) {
        fs.writeFileSync(file, src)
        filesFixed++
    }

    // re-check
    const now = fs.readFileSync(file, "utf8")
    const kinds = []
    if (/>>/.test(now)) kinds.push("still-double-gt")
    if (/�/.test(now)) kinds.push("still-mojibake")
    if (kinds.length) stillBad.push({ file, kinds })
}

console.log(JSON.stringify({ filesFixed, ops, stillBadCount: stillBad.length, stillBad: stillBad.slice(0, 30) }, null, 2))
