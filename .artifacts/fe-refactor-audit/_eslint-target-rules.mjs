import fs from "node:fs"
import { spawnSync } from "node:child_process"

const RULES = [
    "starci-fe/no-inline-parameter-type",
    "starci-fe/handler-on-prefix",
    "starci-fe/prefer-arrow-export",
    "starci-fe/no-vietnamese-in-source-authoring",
    "starci-fe/no-emoji-in-source",
]

const list = fs
    .readFileSync(".artifacts/fe-refactor-audit/_eslint-targets.txt", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)

// refresh targets with late fixes
;[
    ".storybook/components/starci/layouts/LearnShell/LearnShell.tsx",
    ".storybook/components/starci/pages/MindMapPage/MindMapPage.tsx",
    ".storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx",
    "src/components/pages/MindMapPage/component.tsx",
    ".storybook/components/composites/form/Form/Form.tsx",
    "src/components/composites/form/Form/index.tsx",
    "src/app/[locale]/not-found.tsx",
    ".storybook/utils/block-anatomy.tsx",
].forEach((f) => {
    if (!list.includes(f)) list.push(f)
})

const ruleHits = Object.fromEntries(RULES.map((r) => [r, []]))
let otherErrors = 0
const chunkSize = 40

for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize)
    const r = spawnSync(
        "npx",
        ["eslint", "--format", "json", "--max-warnings", "999999", ...chunk],
        { encoding: "utf8", shell: true, maxBuffer: 40 * 1024 * 1024 },
    )
    let data = []
    try {
        data = JSON.parse(r.stdout || "[]")
    } catch {
        console.log("parse fail chunk", i / chunkSize + 1, r.stderr?.slice(0, 500))
        continue
    }
    for (const f of data) {
        for (const m of f.messages || []) {
            if (RULES.includes(m.ruleId)) {
                ruleHits[m.ruleId].push({
                    file: f.filePath.replace(/\\/g, "/").split("starci-academy/")[1] || f.filePath,
                    line: m.line,
                    msg: m.message,
                })
            } else if (m.severity >= 2) {
                otherErrors++
            }
        }
    }
}

console.log("=== TARGET RULES REMAINING ON CHANGED FILES ===")
for (const r of RULES) {
    console.log(r, ruleHits[r].length)
    ruleHits[r].slice(0, 12).forEach((h) => console.log(" ", h.file + ":" + h.line, h.msg.slice(0, 100)))
}
console.log("other errors (severity>=2) count across messages:", otherErrors)

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_eslint-target-rules-remain.json",
    JSON.stringify(ruleHits, null, 2),
)
