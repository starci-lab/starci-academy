import fs from "node:fs"

const raw = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f-eslint-raw.json", "utf8"),
)

const root = "D:/Repositories/starci-academy/".toLowerCase()
const findings = []

for (const file of raw) {
    for (const message of file.messages ?? []) {
        if (message.ruleId !== "starci-fe/no-frame-fragment-item") continue
        const abs = String(file.filePath).replaceAll("\\", "/")
        const lower = abs.toLowerCase()
        const fileRel = lower.startsWith(root) ? abs.slice(root.length) : abs
        findings.push({
            file: fileRel.replaceAll("\\", "/"),
            line: message.line,
            column: message.column,
        })
    }
}

const bucketOf = (path) => {
    if (path.startsWith(".storybook/components/composites/")) return "sb-composites-cards-layout-data"
    if (path.startsWith(".storybook/components/starci/blocks/learn/")) return "sb-blocks-learn"
    if (path.startsWith(".storybook/components/starci/blocks/")) return "sb-blocks-nonlearn"
    if (
        path.startsWith(".storybook/components/starci/pages/") ||
        path.startsWith(".storybook/components/starci/layouts/")
    ) {
        return "sb-pages-layouts"
    }
    if (path.startsWith(".storybook/")) return "sb-other"
    if (path.startsWith("src/components/composites/")) return "src-composites"
    if (path.startsWith("src/components/blocks/learn/")) return "src-blocks-learn"
    if (
        path.startsWith("src/components/blocks/commerce/") ||
        path.startsWith("src/components/blocks/dashboard/") ||
        path.startsWith("src/components/blocks/navigation/")
    ) {
        return "src-blocks-cdn"
    }
    if (path.startsWith("src/components/blocks/")) return "src-blocks-profile-remaining"
    if (path.startsWith("src/components/pages/")) {
        const learning = [
            "Learn", "Content", "Course", "Playground", "Flashcard", "Practice",
            "Architecture", "Mock", "Lesson", "Module", "Milestone", "Challenge",
            "Submission", "Foundation", "PersonalProject", "Cv", "Interview",
            "Quiz", "MindMap", "Leaderboard",
        ]
        if (learning.some((key) => path.includes(key))) return "src-pages-learning"
        return "src-pages-remaining"
    }
    return "other"
}

const byBucket = {}
const filesByBucket = {}
for (const finding of findings) {
    const bucket = bucketOf(finding.file)
    byBucket[bucket] = (byBucket[bucket] ?? 0) + 1
    ;(filesByBucket[bucket] ??= new Set()).add(finding.file)
}

const splitHalf = (filesSet) => {
    const arr = [...filesSet].sort()
    const mid = Math.ceil(arr.length / 2)
    return { A: arr.slice(0, mid), B: arr.slice(mid) }
}

const sbLearn = splitHalf(filesByBucket["sb-blocks-learn"] ?? new Set())
const srcLearn = splitHalf(filesByBucket["src-blocks-learn"] ?? new Set())

// Prompt worker 4 is SB blocks non-learn; SB pages/layouts fold into that worker
// so every finding has an owner (pages aren't a separate SB worker in the prompt).
const manifests = {
    "sb-composites-cards-layout-data": [...(filesByBucket["sb-composites-cards-layout-data"] ?? [])].sort(),
    "sb-blocks-learn-a": sbLearn.A,
    "sb-blocks-learn-b": sbLearn.B,
    "sb-blocks-nonlearn": [
        ...(filesByBucket["sb-blocks-nonlearn"] ?? []),
        ...(filesByBucket["sb-pages-layouts"] ?? []),
        ...(filesByBucket["sb-other"] ?? []),
    ].sort(),
    "src-composites": [...(filesByBucket["src-composites"] ?? [])].sort(),
    "src-blocks-learn-a": srcLearn.A,
    "src-blocks-learn-b": srcLearn.B,
    "src-blocks-commerce-dashboard-navigation": [...(filesByBucket["src-blocks-cdn"] ?? [])].sort(),
    "src-blocks-profile-remaining": [...(filesByBucket["src-blocks-profile-remaining"] ?? [])].sort(),
    "src-pages-learning": [...(filesByBucket["src-pages-learning"] ?? [])].sort(),
    "src-pages-remaining": [...(filesByBucket["src-pages-remaining"] ?? [])].sort(),
}

const owned = new Set(Object.values(manifests).flat())
const uncovered = [...new Set(findings.map((f) => f.file).filter((f) => !owned.has(f)))].sort()

const findingCountByManifest = {}
for (const [name, files] of Object.entries(manifests)) {
    const set = new Set(files)
    findingCountByManifest[name] = findings.filter((f) => set.has(f.file)).length
}

const inventory = {
    batch: "31f",
    date: "2026-08-09",
    rule: "starci-fe/no-frame-fragment-item",
    totalFindings: findings.length,
    totalFiles: [...new Set(findings.map((f) => f.file))].length,
    byBucket,
    manifests,
    findingCountByManifest,
    uncovered,
    findings,
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/2026-08-09-b31f-inventory.json",
    `${JSON.stringify(inventory, null, 2)}\n`,
)

console.log(JSON.stringify({
    totalFindings: inventory.totalFindings,
    totalFiles: inventory.totalFiles,
    byBucket,
    findingCountByManifest,
    manifestFileCounts: Object.fromEntries(
        Object.entries(manifests).map(([k, v]) => [k, v.length]),
    ),
    uncovered,
}, null, 2))
