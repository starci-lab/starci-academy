import { execSync } from "node:child_process"
import fs from "node:fs"

const result = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-identity-result.json", "utf8"),
)
const srcFiles = result.changed.filter((f) => f.startsWith("src/") && f.endsWith(".tsx"))
// also the two manual fixes
for (const f of [
    "src/components/blocks/learn/KeepGoingPath/index.tsx",
    "src/components/pages/FlashcardsPage/FlashcardReviewModeModal/index.tsx",
]) {
    if (!srcFiles.includes(f)) srcFiles.push(f)
}

let still = 0
const stillFiles = []
const chunk = 40
for (let i = 0; i < srcFiles.length; i += chunk) {
    const slice = srcFiles.slice(i, i + chunk)
    const out = execSync(`npx eslint -f json ${slice.map((f) => JSON.stringify(f)).join(" ")}`, {
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["pipe", "pipe", "pipe"],
    })
    const data = JSON.parse(out)
    for (const f of data) {
        for (const m of f.messages || []) {
            if (m.ruleId === "starci-fe/require-identity-root") {
                still++
                stillFiles.push(f.filePath.replace(/\\/g, "/").replace(/^.*starci-academy\//, ""))
            }
        }
    }
}

console.log(JSON.stringify({
    before: 703,
    srcFilesBurned: srcFiles.length,
    stillIdentityRootOnBurned: still,
    stillFiles,
    estimateCleared: srcFiles.length - still,
}, null, 2))
