/**
 * Count target-rule deltas on edited files vs baseline.
 */
import fs from "node:fs"
import { execSync } from "node:child_process"

const RULES = [
    "starci-fe/no-heroui-outside-vocabulary",
    "starci-fe/no-cn-above-vocabulary",
    "starci-fe/no-classname-at-sentence-tier",
    "starci-fe/no-raw-shape-at-sentence-tier",
    "starci-fe/no-per-part-classname-prop",
    "starci-fe/no-inline-skeleton-branch",
]

const edited = [
    "src/components/blocks/commerce/PhaseScarcityNote/component.tsx",
    "src/components/blocks/cv/CvBlocksWorkspace/CvWorkspaceSkeleton/index.tsx",
    "src/components/blocks/dashboard/JobReadinessWidget/index.tsx",
    "src/components/blocks/dashboard/WeeklyGoals/index.tsx",
    "src/components/blocks/learn/ChallengeScoreCard/index.tsx",
    "src/components/blocks/learn/CourseQaQuestionList/SkeletonQuestionRow/index.tsx",
    "src/components/blocks/learn/KeepGoingPath/index.tsx",
    "src/components/blocks/learn/MockInterviewScorecard/index.tsx",
    "src/components/blocks/learn/ModuleChallengeList/index.tsx",
    "src/components/blocks/learn/ModuleLessonList/index.tsx",
    "src/components/blocks/learn/PlaygroundConnectSheet/index.tsx",
    "src/components/blocks/learn/PlaygroundStepGuide/index.tsx",
    "src/components/blocks/learn/QuizRecapList/index.tsx",
    "src/components/blocks/learn/lesson/CodeBodySkeleton/index.tsx",
    "src/components/blocks/learn/lesson/ContentBodySkeleton/index.tsx",
    "src/components/blocks/learn/lesson/LessonBody/LessonCardSkeleton/index.tsx",
    "src/components/blocks/learn/personal-project/PersonalProjectDashboard/PersonalProjectDashboardSkeleton/index.tsx",
    "src/components/blocks/learn/personal-project/TaskResultsSkeleton/index.tsx",
    "src/components/blocks/learn/personal-project/TaskSkeleton/index.tsx",
    "src/components/blocks/profile/ProfileLoadingState/index.tsx",
    "src/components/pages/PracticeProblemPage/PracticeProblemSkeleton/index.tsx",
    "src/components/pages/SystemStatusPage/SystemStatusSkeleton/index.tsx",
    "src/components/blocks/blog/PostRow/index.tsx",
    "src/components/blocks/course/CourseTrialChip/index.tsx",
    "src/components/pages/BlogListPage/FeaturedPost/index.tsx",
    "src/components/layouts/LearnShellLayout/index.tsx",
    "src/components/pages/AdminUploadVideoPage/map.tsx",
    "src/components/pages/AdminUploadVideoPage/LoadingScreen/index.tsx",
    "src/components/pages/SepayCheckoutPage/index.tsx",
    ".storybook/components/starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard.tsx",
    ".storybook/components/starci/blocks/dashboard/JobReadinessWidget/JobReadinessWidget.tsx",
    ".storybook/components/starci/blocks/dashboard/WeeklyGoals/WeeklyGoals.tsx",
]

function rel(p) {
    return p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")
}

const baseline = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json", "utf8"),
)
const baseByFile = {}
for (const f of baseline) {
    const r = rel(f.filePath)
    if (!edited.includes(r)) continue
    const counts = Object.fromEntries(RULES.map((x) => [x, 0]))
    for (const m of f.messages || []) {
        if (RULES.includes(m.ruleId)) counts[m.ruleId]++
    }
    baseByFile[r] = counts
}

const cmd = `npx eslint ${edited.map((f) => `"${f}"`).join(" ")} --format json`
let after
try {
    const out = execSync(cmd, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, stdio: ["pipe", "pipe", "pipe"] })
    after = JSON.parse(out)
} catch (e) {
    const out = e.stdout?.toString?.() || e.stdout || ""
    after = JSON.parse(out)
}

const afterByFile = {}
const afterTotals = Object.fromEntries(RULES.map((x) => [x, 0]))
for (const f of after) {
    const r = rel(f.filePath)
    const counts = Object.fromEntries(RULES.map((x) => [x, 0]))
    for (const m of f.messages || []) {
        if (RULES.includes(m.ruleId)) {
            counts[m.ruleId]++
            afterTotals[m.ruleId]++
        }
    }
    afterByFile[r] = counts
}

const baseTotals = Object.fromEntries(RULES.map((x) => [x, 0]))
for (const r of edited) {
    const c = baseByFile[r] || Object.fromEntries(RULES.map((x) => [x, 0]))
    for (const rule of RULES) baseTotals[rule] += c[rule]
}

console.log("=== edited-file rule counts (baseline → after) ===")
for (const rule of RULES) {
    const b = baseTotals[rule]
    const a = afterTotals[rule]
    console.log(`${rule}: ${b} → ${a} (Δ ${a - b})`)
}

const residual = []
for (const r of edited) {
    const a = afterByFile[r]
    if (!a) continue
    const hits = RULES.filter((rule) => a[rule] > 0).map((rule) => `${rule.split("/").pop()}:${a[rule]}`)
    if (hits.length) residual.push({ file: r, hits })
}
console.log("\n=== residual on edited files ===")
residual.forEach((x) => console.log(x.hits.join(", "), x.file))

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_overlap-burn-delta.json",
    JSON.stringify({ baseTotals, afterTotals, residual, edited }, null, 2),
)
