/**
 * Scan changed files for static principle= without nearby explain=.
 */
import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]

const missing = []
const duplicates = []

for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g)
        if (!m) continue
        // count explains on this line + next 3
        const window = lines.slice(i, Math.min(lines.length, i + 4))
        const explainCount = window.filter((l) => /(?<![\w-])explain\s*=/.test(l)).length
        if (explainCount === 0) {
            missing.push({ file, line: i + 1, text: lines[i].trim().slice(0, 120) })
        }
        if (explainCount > 1) {
            duplicates.push({ file, line: i + 1, explainCount, text: lines[i].trim().slice(0, 120) })
        }
    }
    // also bare explain lines that follow a line already containing explain=
    for (let i = 1; i < lines.length; i++) {
        if (!/^\s*explain=/.test(lines[i])) continue
        if (/\bexplain\s*=/.test(lines[i - 1])) {
            duplicates.push({ file, line: i + 1, reason: "duplicate-line", prev: lines[i - 1].trim().slice(0, 100) })
        }
    }
}

console.log(JSON.stringify({ missing: missing.length, duplicates: duplicates.length, missing, duplicates }, null, 2))
