/**
 * Recount require-identity-root on baseline finding files + report burn stats.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const baseline = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"), "utf8"),
)
const classify = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/_identity-burn-classify.json"), "utf8"),
)
const apply = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/_identity-burn-result.json"), "utf8"),
)

const beforeFiles = new Set()
for (const f of baseline) {
    for (const m of f.messages || []) {
        if (m.ruleId === "starci-fe/require-identity-root") {
            beforeFiles.add(f.filePath.replace(/\\/g, "/").replace(/^.*?starci-academy\//, ""))
        }
    }
}

const files = [...beforeFiles].filter((f) => fs.existsSync(f)).sort()
let still = 0
const stillFiles = []
const chunk = 35
for (let i = 0; i < files.length; i += chunk) {
    const slice = files.slice(i, i + chunk)
    const cmd = `npx eslint -f json ${slice.map((f) => JSON.stringify(f)).join(" ")}`
    let out
    try {
        out = execSync(cmd, {
            encoding: "utf8",
            maxBuffer: 40 * 1024 * 1024,
            stdio: ["pipe", "pipe", "pipe"],
        })
    } catch (e) {
        out = e.stdout || "[]"
    }
    const data = JSON.parse(out || "[]")
    for (const f of data) {
        for (const m of f.messages || []) {
            if (m.ruleId === "starci-fe/require-identity-root") {
                still++
                stillFiles.push(f.filePath.replace(/\\/g, "/").replace(/^.*?starci-academy\//, ""))
            }
        }
    }
}

// Final changed list: apply.changed + manual KeepGoingPath/FlashcardReviewModeModal, minus stripped SB SurfaceCard twins
const strippedSb = [
    ".storybook/components/starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard.tsx",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardHero/index.tsx",
    ".storybook/components/starci/blocks/learn/ContinueCard/ContinueCardItem/index.tsx",
    ".storybook/components/starci/blocks/learn/KeepGoingPath/KeepGoingPath.tsx",
    ".storybook/components/starci/blocks/learn/ModuleChallengeList/ModuleChallengeList.tsx",
    ".storybook/components/starci/blocks/learn/ModuleLessonList/ModuleLessonList.tsx",
    ".storybook/components/starci/blocks/learn/PlaygroundEnterBanner/PlaygroundEnterBanner.tsx",
]
const changed = new Set([
    ...apply.changed,
    "src/components/blocks/learn/KeepGoingPath/index.tsx",
    "src/components/pages/FlashcardsPage/FlashcardReviewModeModal/index.tsx",
])
for (const s of strippedSb) changed.delete(s)
// MindMapRail twin kept
changed.add(".storybook/components/starci/blocks/learn/MindMapRail/MindMapRail.tsx")

const srcChanged = [...changed].filter((f) => f.startsWith("src/")).sort()
const sbChanged = [...changed].filter((f) => f.startsWith(".storybook/")).sort()

const report = {
    before: beforeFiles.size,
    after: still,
    cleared: beforeFiles.size - still,
    safeClassified: classify.safe.length,
    srcFilesChanged: srcChanged.length,
    storybookTwinsChanged: sbChanged.length,
    filesChangedTotal: changed.size,
    hardSkipped: {
        byReason: classify.hardByReason,
        locked: classify.skippedLocked.length,
        teacherHold: classify.skippedHold.length,
        AsyncContent: classify.hardByReason["AsyncContent-root"] || 0,
        hostElement: classify.hardByReason["host-element-root"] || 0,
        mixedHost: classify.hardByReason["mixed-host-and-component-roots"] || 0,
        fragment: classify.hardByReason["fragment-root"] || 0,
        multiCapable: classify.hardByReason["multi-capable-roots"] || 0,
        incapableOrMixed: classify.hardByReason["incapable-or-mixed-root"] || 0,
        noReturn: classify.hardByReason["no-return-jsx-found"] || 0,
        note: "SB SurfaceCard/SurfaceCardList twins skipped (prop not on SB composite yet); RagSourceGraph left alone",
    },
    srcChanged,
    sbChanged,
    stillSample: stillFiles.slice(0, 20),
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_identity-burn-verify.json"),
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify({
    before: report.before,
    after: report.after,
    cleared: report.cleared,
    srcFilesChanged: report.srcFilesChanged,
    storybookTwinsChanged: report.storybookTwinsChanged,
    filesChangedTotal: report.filesChangedTotal,
    hardSkipped: report.hardSkipped,
}, null, 2))
