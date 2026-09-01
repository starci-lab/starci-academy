/**
 * Find bare explain= lines that are NOT attributes of a principle-bearing tag.
 * Valid: previous line contains principle= (multi-line attrs) OR previous is attr continuation.
 * Invalid: previous has no principle and isn't an open-tag attr line.
 */
import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]

const orphans = []
for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        if (!/^\s*explain=/.test(lines[i])) continue
        // look upward for principle= before we hit a closer or unrelated statement
        let ok = false
        for (let j = i - 1; j >= Math.max(0, i - 6); j--) {
            const L = lines[j]
            if (/principle=/.test(L)) {
                ok = true
                break
            }
            // stopped by a finished tag or code that isn't attrs
            if (/^\s*[})];?\s*$/.test(L) || /^(?!\s*<)(?!\s*\/?>)(?!\s*[a-zA-Z_][\w-]*\s*=)/.test(L) && L.trim() && !/^\s*\/\//.test(L) && !/^\s*{?\/\*/.test(L)) {
                // if line looks like code (ternary arm, const, return) stop
                if (/^\s*(const|let|var|return|if|else|:|\?)/.test(L) || /:\s*rows\s*$/.test(L) || /<\/\w+>/.test(L)) {
                    break
                }
            }
            if (/>\s*$/.test(L) && !/principle=/.test(L)) break
        }
        if (!ok) {
            orphans.push({ file, line: i + 1, prev: (lines[i - 1] || "").trim().slice(0, 120), cur: lines[i].trim().slice(0, 100) })
        }
    }
}

console.log(JSON.stringify({ count: orphans.length, orphans }, null, 2))
fs.writeFileSync(".artifacts/fe-refactor-audit/_burn-explain-true-orphans.json", JSON.stringify(orphans, null, 2))
