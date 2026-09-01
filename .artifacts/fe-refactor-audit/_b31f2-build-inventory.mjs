import fs from "node:fs"

const raw = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f2-eslint-raw.json", "utf8"),
)

const root = "D:/Repositories/starci-academy/".toLowerCase()
const toRel = (abs) => {
    const n = String(abs).replaceAll("\\", "/")
    const lower = n.toLowerCase()
    return lower.startsWith(root) ? n.slice(root.length) : n
}

const CSS_DOOR = new Set([
    "starci-fe/no-public-classname-prop",
    "starci-fe/no-classname-at-sentence-tier",
    "starci-fe/no-cn-above-vocabulary",
])
const FRAME_ID = new Set([
    "starci-fe/require-frame-self-declare",
    "starci-fe/require-identity-root",
    "starci-fe/no-raw-shape-at-sentence-tier",
    "starci-fe/no-frame-css-props",
    "starci-fe/no-frame-fragment-item",
])
const HEROUI = new Set([
    "starci-fe/no-heroui-outside-vocabulary",
])
const STRUCTURAL = new Set([
    "starci-fe/page-folder-two-files-only",
])
const AUTHORING = new Set([
    "starci-fe/handler-on-prefix",
    "starci-fe/no-inline-parameter-type",
    "starci-fe/no-emoji-in-source",
    "starci-fe/no-vietnamese-in-source-authoring",
])

const LOCKED_PATHS = [
    "/nivo/",
    "/nivoexpert/",
    "QuizSession",
    "EnrollGate",
]

const byFile = new Map()
let fragTotal = 0
const ruleHist = {}

for (const file of raw) {
    const rel = toRel(file.filePath)
    const messages = file.messages ?? []
    if (messages.length === 0) continue
    const frag = messages.filter((m) => m.ruleId === "starci-fe/no-frame-fragment-item")
    if (frag.length === 0 && !messages.some((m) => String(m.ruleId || "").startsWith("starci-fe/"))) {
        // only care about files that still have fragment findings for this batch
    }
    if (frag.length === 0) continue

    fragTotal += frag.length
    const other = messages.filter((m) => m.ruleId !== "starci-fe/no-frame-fragment-item")
    const rules = {}
    for (const m of messages) {
        const id = m.ruleId || "unknown"
        rules[id] = (rules[id] ?? 0) + 1
        ruleHist[id] = (ruleHist[id] ?? 0) + 1
    }

    let css = 0, frame = 0, heroui = 0, structural = 0, authoring = 0, otherCount = 0
    for (const [id, n] of Object.entries(rules)) {
        if (id === "starci-fe/no-frame-fragment-item") continue
        if (CSS_DOOR.has(id)) css += n
        else if (FRAME_ID.has(id)) frame += n
        else if (HEROUI.has(id)) heroui += n
        else if (STRUCTURAL.has(id)) structural += n
        else if (AUTHORING.has(id)) authoring += n
        else otherCount += n
    }

    const locked = LOCKED_PATHS.some((p) => rel.includes(p))
    let cluster = "B"
    if (locked || structural > 0) cluster = "D"
    else if (heroui > 0 && heroui >= css && heroui >= frame) cluster = "C"
    else if (css > 0 && css >= frame) cluster = "A"
    else if (authoring > 0 && css === 0 && frame === 0 && heroui === 0) cluster = "authoring"
    else cluster = "B"

    byFile.set(rel, {
        file: rel,
        frag: frag.length,
        total: messages.length,
        other: other.length,
        rules,
        css,
        frame,
        heroui,
        structural,
        authoring,
        otherCount,
        cluster,
        locked,
    })
}

const files = [...byFile.values()].sort((a, b) => a.file.localeCompare(b.file))

const assignWorker = (row) => {
    const p = row.file
    if (row.locked || p.includes("QuizSession") || p.includes("/nivo/")) return "structural-locked-report"
    if (row.cluster === "C" && row.heroui > 0 && row.css === 0 && row.frame <= 2) return "hero-ui-gap-report"
    if (row.cluster === "authoring") return "authoring-handler-only"

    if (p.startsWith(".storybook/")) {
        if (
            p.includes("/navigation/") ||
            p.includes("/profile/") ||
            p.includes("Footer") ||
            p.includes("Navbar") ||
            p.includes("CollapsibleSidebar") ||
            p.includes("ProfileLoading") ||
            p.includes("ProfileLocked") ||
            p.includes("WorkSessionHeader") ||
            p.includes("SettingsSidebarNav")
        ) {
            return "sb-navigation-profile-families"
        }
        return "sb-css-door-families"
    }

    if (p.startsWith("src/components/composites/")) return "src-composites-twins"
    if (p.startsWith("src/components/blocks/learn/")) {
        const learn = files
            .filter((f) => f.file.startsWith("src/components/blocks/learn/"))
            .map((f) => f.file)
            .sort()
        const mid = Math.ceil(learn.length / 2)
        return learn.indexOf(p) < mid ? "src-blocks-learn-a" : "src-blocks-learn-b"
    }
    if (
        p.startsWith("src/components/blocks/navigation/") ||
        p.startsWith("src/components/blocks/dashboard/") ||
        p.startsWith("src/components/blocks/commerce/")
    ) {
        return "src-blocks-navigation-dashboard"
    }
    if (p.startsWith("src/components/blocks/")) return "src-blocks-profile-remaining"
    if (p.startsWith("src/components/pages/")) {
        if (row.other <= 5 && !row.locked) return "src-clean-pages"
        return "structural-locked-report"
    }
    return "structural-locked-report"
}

const manifests = {}
for (const row of files) {
    const w = assignWorker(row)
    row.worker = w
    ;(manifests[w] ??= []).push(row.file)
}

for (const w of Object.keys(manifests)) {
    manifests[w] = [...new Set(manifests[w])].sort()
}

const inventory = {
    batch: "31f2",
    date: "2026-08-09",
    checkpoint: "0d0091c0",
    rule: "starci-fe/no-frame-fragment-item",
    totalFragFindings: fragTotal,
    totalFiles: files.length,
    ruleHistogram: ruleHist,
    clusterCounts: files.reduce((acc, f) => {
        acc[f.cluster] = (acc[f.cluster] ?? 0) + 1
        return acc
    }, {}),
    manifests,
    findingCountByManifest: Object.fromEntries(
        Object.entries(manifests).map(([w, list]) => [
            w,
            list.reduce((s, f) => s + (byFile.get(f)?.frag ?? 0), 0),
        ]),
    ),
    files,
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/2026-08-09-b31f2-inventory.json",
    `${JSON.stringify(inventory, null, 2)}\n`,
)

console.log(JSON.stringify({
    totalFragFindings: fragTotal,
    totalFiles: files.length,
    clusterCounts: inventory.clusterCounts,
    findingCountByManifest: inventory.findingCountByManifest,
    manifestFileCounts: Object.fromEntries(
        Object.entries(manifests).map(([k, v]) => [k, v.length]),
    ),
}, null, 2))
