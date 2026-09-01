import { execFileSync } from "node:child_process"
import fs from "node:fs"

const sample = [
    "src/components/blocks/ai/QuotaBar/index.tsx",
    "src/components/blocks/ai/AiQuotaHistoryPanel/index.tsx",
    "src/components/blocks/cards/MediaCard/index.tsx",
    "src/components/blocks/cards/LabeledCard/index.tsx",
    "src/components/pages/SessionsPage/index.tsx",
    "src/components/pages/BookmarksPage/index.tsx",
    "src/components/composites/form/Form/index.tsx",
]

const out = execFileSync(
    "npx",
    ["eslint", "-f", "json", ...sample],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
)
const data = JSON.parse(out)
let noExplain = 0
let missingBoth = 0
let justifies = 0
let retired = 0
for (const f of data) {
    for (const m of f.messages || []) {
        if (m.ruleId === "starci-fe/require-frame-self-declare") {
            if ((m.message || "").includes("but no `explain`") && !(m.message || "").includes("neither")) noExplain++
            else missingBoth++
        }
        if (m.ruleId === "starci-fe/explain-justifies-token-choice") justifies++
        if (m.ruleId === "starci-fe/no-retired-async-content") retired++
    }
}
console.log({ noExplain, missingBoth, justifies, retired })
