/**
 * Find explain= lines that land inside items/body arrays (corruption from pass2).
 */
import fs from "node:fs"

const r1 = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"))
const r2 = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"))

const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]
const bad = []

for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        if (!/^\s*explain=/.test(lines[i])) continue
        const prev = lines[i - 1] || ""
        // Corruption: previous line opens items/body/content with [{ or ({ and does not close
        if (/items=\{\s*\[\s*$/.test(prev) || /body=\{\s*\(\s*$/.test(prev) || /items=\{\s*$/.test(prev)) {
            bad.push({ file, line: i + 1, prev: prev.trim().slice(0, 120), cur: lines[i].trim().slice(0, 100) })
        }
    }
}

console.log(JSON.stringify({ badCount: bad.length, bad }, null, 2))
fs.writeFileSync(".artifacts/fe-refactor-audit/_burn-explain-corruption.json", JSON.stringify(bad, null, 2))
