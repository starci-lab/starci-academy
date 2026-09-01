import fs from "node:fs"

const d = JSON.parse(
    fs.readFileSync(
        new URL("./eslint-arch-burn-baseline.json", import.meta.url),
        "utf8",
    ),
)

let missingBoth = 0
let explainOnly = 0
for (const f of d) {
    for (const m of f.messages || []) {
        if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
        if (m.message.includes("neither")) missingBoth++
        else if (m.message.includes("but no `explain`")) explainOnly++
    }
}
console.log(JSON.stringify({ missingBoth, explainOnly }, null, 2))
