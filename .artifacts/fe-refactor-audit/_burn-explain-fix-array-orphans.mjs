/**
 * Fix explain= that landed as array elements between () => items.
 * Move explain into the preceding JSX tag (before /> or >).
 */
import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]

let fixed = 0
const changed = []
const hard = []

for (const file of files) {
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    let fileFixed = 0

    for (let i = lines.length - 1; i >= 1; i--) {
        if (!/^\s*explain=/.test(lines[i])) continue
        const prev = lines[i - 1]
        const next = lines[i + 1] || ""

        // Array-element orphan: prev is a JSX expression ending with />, next is another array item
        const inArray =
            (/\)\s*,\s*$/.test(prev) || /\/>\s*,?\s*$/.test(prev) || /\)\s*$/.test(prev)) &&
            (/^\s*(\(\)\s*=>|\.\.\.|\]|\/?>)/.test(next) || /^\s*explain=/.test(next) === false)

        // More precise: prev contains principle= and ends with />, and explain is bare
        if (!/principle=/.test(prev)) {
            // maybe principle on line further up with self-closing on prev - skip hard
            if (/^\s*\(\)\s*=>/.test(next) || /^\s*\.\.\./.test(next) || /^\s*\]/.test(next)) {
                // orphan in array without principle on prev — just delete if prev ends with />,
                if (/\/>\s*,?\s*$/.test(prev) || /\)\s*,\s*$/.test(prev)) {
                    // Try to find principle-bearing tag in prev (one-liner)
                    if (/principle=/.test(prev) && /\/>/.test(prev)) {
                        const explainLit = lines[i].trim()
                        const closerMatch = prev.match(/^(.*)(\s*\/\s*>)(\s*,?\s*)$/)
                        if (closerMatch) {
                            lines[i - 1] =
                                closerMatch[1].replace(/\s+$/, "") +
                                " " +
                                explainLit +
                                closerMatch[2] +
                                closerMatch[3]
                            lines.splice(i, 1)
                            fileFixed++
                            fixed++
                            continue
                        }
                    }
                    hard.push({ file, line: i + 1, prev: prev.trim().slice(0, 100), next: next.trim().slice(0, 60) })
                }
            }
            continue
        }

        if (!/\/>/.test(prev) && !/>\s*,?\s*$/.test(prev)) continue

        // prev has principle and closes; explain should be attribute inside it
        const explainLit = lines[i].trim()
        // Prefer inserting before />
        if (/\/>/.test(prev)) {
            const closerMatch = prev.match(/^(.*)(\s*\/\s*>)(\s*,?\s*)$/)
            if (!closerMatch) {
                hard.push({ file, line: i + 1, reason: "no-self-close" })
                continue
            }
            // Avoid duplicating if already has explain
            if (/\bexplain\s*=/.test(closerMatch[1])) {
                lines.splice(i, 1)
                fileFixed++
                fixed++
                continue
            }
            lines[i - 1] =
                closerMatch[1].replace(/\s+$/, "") + " " + explainLit + closerMatch[2] + closerMatch[3]
            lines.splice(i, 1)
            fileFixed++
            fixed++
            continue
        }
    }

    if (fileFixed) {
        fs.writeFileSync(file, lines.join(nl))
        changed.push({ file, fileFixed })
    }
}

console.log(JSON.stringify({ fixed, hardCount: hard.length, hard, changed }, null, 2))
