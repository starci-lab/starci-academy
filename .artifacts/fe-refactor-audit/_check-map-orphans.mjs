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
        if (/=>\s*\(\s*$/.test(prev) || /=>\s*\{\s*$/.test(prev)) {
            bad.push({
                file: file.replace(/\\/g, "/").split("src/")[1],
                line: i + 1,
                prev: prev.trim().slice(0, 120),
            })
        }
    }
}
console.log(JSON.stringify({ remaining: bad.length, bad }, null, 2))
