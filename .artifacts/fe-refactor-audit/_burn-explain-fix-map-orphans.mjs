/**
 * Move explain out of map/arrow callback bodies onto the principle-bearing opener.
 * Pattern:
 *   <Tag principle="tok" ... items={....map(... => () => (
 *   explain="..."
 *       <Child
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

for (const file of files) {
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    let fileFixed = 0

    for (let i = lines.length - 1; i >= 1; i--) {
        if (!/^\s*explain=/.test(lines[i])) continue
        const prev = lines[i - 1]
        if (!/principle=/.test(prev)) continue
        // opener ends by opening an arrow callback that returns JSX
        if (!/(\(\)\s*=>\s*\(|\(\)\s*=>\s*\{|\(\)\s*=>\s*$)\s*$/.test(prev) && !/items=\{\[?\(\)\s*=>\s*\(\s*$/.test(prev)) {
            // also: items={[() => (
            if (!/items=\{\[\(\)\s*=>\s*\(\s*$/.test(prev) && !/=>\s*\(\s*$/.test(prev) && !/=>\s*\{\s*$/.test(prev)) {
                continue
            }
        }
        if (/\bexplain\s*=/.test(prev)) {
            // duplicate — drop orphan
            lines.splice(i, 1)
            fileFixed++
            fixed++
            continue
        }
        const explainLit = lines[i].trim()
        const m = prev.match(/principle=(["'])([a-z0-9-]+)\1/)
        if (!m) continue
        const lit = `principle=${m[1]}${m[2]}${m[1]}`
        const at = prev.indexOf(lit)
        if (at < 0) continue
        lines[i - 1] = prev.slice(0, at + lit.length) + " " + explainLit + prev.slice(at + lit.length)
        lines.splice(i, 1)
        fileFixed++
        fixed++
    }

    if (fileFixed) {
        fs.writeFileSync(file, lines.join(nl))
        changed.push({ file, fileFixed })
    }
}

console.log(JSON.stringify({ fixed, changed }, null, 2))
