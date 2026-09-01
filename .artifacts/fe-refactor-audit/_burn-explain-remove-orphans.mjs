/**
 * Remove orphan explain= lines that sit AFTER a closed JSX tag (sibling junk).
 * Also fix PressableCard-style: self-closing line already has explain + orphan below.
 */
import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]

let removed = 0
const changed = []

for (const file of files) {
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    const out = []
    let fileRemoved = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const prev = out[out.length - 1] || ""
        if (/^\s*explain=/.test(line) && />\s*$/.test(prev)) {
            // orphan after closed tag
            fileRemoved++
            removed++
            continue
        }
        out.push(line)
    }
    if (fileRemoved) {
        fs.writeFileSync(file, out.join(nl))
        changed.push({ file, fileRemoved })
    }
}

console.log(JSON.stringify({ removed, changedFiles: changed.length, changed }, null, 2))
