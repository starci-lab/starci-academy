import { readFileSync } from "node:fs"

const after = JSON.parse(
    readFileSync(".artifacts/fe-refactor-audit/_eslint-after-skeleton-folder.json", "utf8"),
)
const norm = (p) => p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

for (const f of after) {
    for (const m of f.messages || []) {
        if (m.ruleId === "starci-fe/export-matches-folder") {
            console.log(norm(f.filePath), "|", m.message.slice(0, 140))
        }
    }
}
