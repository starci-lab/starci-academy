import fs from "node:fs"
const p = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json", "utf8"))
const rel = (f) => f.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")
let sb = 0
let src = 0
const sbFiles = new Set()
for (const f of p) {
    for (const m of f.messages || []) {
        if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
        const msg = m.message || ""
        if (/neither/.test(msg)) continue
        if (!/no `explain`|but no `explain`/.test(msg)) continue
        const path = rel(f.filePath)
        if (path.includes(".storybook")) {
            sb++
            sbFiles.add(path)
        } else src++
    }
}
console.log({ sb, src, sbFileCount: sbFiles.size, sample: [...sbFiles].slice(0, 20) })
