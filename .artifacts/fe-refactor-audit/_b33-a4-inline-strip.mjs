/**
 * Strip inline dead escapes on Stack open lines that also declare principle.
 */
import fs from "node:fs"

const files = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json", "utf8"),
).manifests["agent-4-stack-flex-cluster"].files

let n = 0
for (const f of files) {
    if (!fs.existsSync(f)) continue
    const src = fs.readFileSync(f, "utf8")
    const lines = src.split(/\n/)
    let changed = false
    const out = lines.map((line) => {
        if (!/<(StackH|StackV)\b/.test(line) || !/\bprinciple\s*=/.test(line)) return line
        const next = line
            .replace(/\s(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))/g, "")
        if (next !== line) changed = true
        return next
    })
    if (changed) {
        fs.writeFileSync(f, out.join("\n"))
        console.log("inline-stripped", f)
        n++
    }
}
console.log("updated", n)
