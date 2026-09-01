/**
 * Find explain props that landed AFTER a closing `>` (became children, not attrs).
 */
import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]

const bad = []
for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 1; i < lines.length; i++) {
        if (!/^\s*explain=/.test(lines[i])) continue
        const prev = lines[i - 1]
        // Previous line closes a JSX opening tag
        if (/>\s*$/.test(prev) && /principle=/.test(prev)) {
            bad.push({
                file,
                line: i + 1,
                prev: prev.trim().slice(0, 140),
                cur: lines[i].trim().slice(0, 100),
            })
        }
    }
}

console.log(JSON.stringify({ badCount: bad.length, sample: bad.slice(0, 30) }, null, 2))
fs.writeFileSync(".artifacts/fe-refactor-audit/_burn-explain-after-gt.json", JSON.stringify(bad, null, 2))
