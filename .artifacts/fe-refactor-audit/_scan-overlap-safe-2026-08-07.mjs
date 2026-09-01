/**
 * Scan SAFE overlap-cluster candidates from arch-burn baseline.
 * Targets: heroui, cn, classname, raw-shape, per-part-classname, inline-skeleton.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const data = JSON.parse(
    fs.readFileSync(
        path.join(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"),
        "utf8",
    ),
)

const RULES = [
    "starci-fe/no-heroui-outside-vocabulary",
    "starci-fe/no-cn-above-vocabulary",
    "starci-fe/no-classname-at-sentence-tier",
    "starci-fe/no-raw-shape-at-sentence-tier",
    "starci-fe/no-per-part-classname-prop",
    "starci-fe/no-inline-skeleton-branch",
]
const RULE_SET = new Set(RULES)

const LOCKED = [
    /MockInterviewSession/,
    /QuizSession/,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /nivoexpert\//i,
    /\/nivo\//i,
    /components\/nivo\//i,
    /\/resources\//,
    /MiaMia|mia-mia|Mia-Mia/i,
]

const ATOM_MAP = {
    Button: "@/components/atoms/buttons/Button",
    Spinner: "@/components/atoms/display/Spinner",
    Chip: "@/components/atoms/chips/Chip",
    Typography: "@/components/atoms/text/Typography",
    Link: "@/components/atoms/navigation/Link",
    Card: "@/components/atoms/display/Card",
    Progress: "@/components/atoms/display/Progress",
    Alert: "@/components/atoms/feedback/Alert",
    Modal: "@/components/atoms/overlay/Modal",
    Drawer: "@/components/atoms/overlay/Drawer",
    Popover: "@/components/atoms/overlay/Popover",
    Pagination: "@/components/atoms/navigation/Pagination",
    Tabs: "@/components/atoms/navigation/Tabs",
    Accordion: "@/components/atoms/navigation/Accordion",
    Select: "@/components/atoms/forms/Select",
    Input: "@/components/atoms/forms/InputText",
    TextArea: "@/components/atoms/forms/InputTextarea",
    Radio: "@/components/atoms/forms/Radio",
    Switch: "@/components/atoms/forms/Switch",
    Checkbox: "@/components/atoms/forms/Checkbox",
    Divider: "@/components/atoms/display/Divider",
    Separator: "@/components/atoms/display/Divider",
    Avatar: "@/components/atoms/display/Avatar",
    Badge: "@/components/atoms/display/Badge",
    Skeleton: "@/components/atoms/feedback/Skeleton",
    ButtonGroup: "@/components/atoms/buttons/ButtonGroup",
    ProgressBar: "@/components/atoms/display/Progress",
}

function relPath(filePath) {
    const p = filePath.replace(/\\/g, "/")
    const i = p.indexOf("starci-academy/")
    return i >= 0 ? p.slice(i + "starci-academy/".length) : p
}

const isLocked = (rel) => LOCKED.some((re) => re.test(rel))

const byRule = Object.fromEntries(RULES.map((r) => [r, []]))
const unlockedByRule = Object.fromEntries(RULES.map((r) => [r, []]))
const lockedByRule = Object.fromEntries(RULES.map((r) => [r, 0]))

for (const file of data) {
    const rel = relPath(file.filePath)
    for (const m of file.messages || []) {
        if (!RULE_SET.has(m.ruleId)) continue
        const hit = { file: rel, line: m.line, col: m.column, msg: m.message }
        byRule[m.ruleId].push(hit)
        if (isLocked(rel)) lockedByRule[m.ruleId]++
        else unlockedByRule[m.ruleId].push(hit)
    }
}

console.log("=== baseline counts ===")
for (const r of RULES) {
    console.log(
        `${r}: total=${byRule[r].length} unlocked=${unlockedByRule[r].length} locked=${lockedByRule[r]}`,
    )
}

// HeroUI atom candidates among unlocked heroui files
const herouiFiles = [...new Set(unlockedByRule["starci-fe/no-heroui-outside-vocabulary"].map((h) => h.file))]
const cnOnly = []
const candidate = []
const hard = []
const symbolFreq = new Map()

for (const file of herouiFiles.sort()) {
    if (!fs.existsSync(file)) {
        hard.push({ file, reason: "missing" })
        continue
    }
    const src = fs.readFileSync(file, "utf8")
    const blocks = src.match(/import\s*\{[^}]+\}\s*from\s*["']@heroui\/react["']/gs) || []
    if (blocks.length === 0) {
        if (/from\s*["']@heroui\/react["']/.test(src)) hard.push({ file, reason: "non-named" })
        else hard.push({ file, reason: "no-import" })
        continue
    }
    const names = new Set()
    for (const block of blocks) {
        const inner = block.replace(/^import\s*\{/, "").replace(/\}\s*from[\s\S]*/, "")
        for (const part of inner.split(",")) {
            let t = part.trim()
            if (!t || t.startsWith("type ")) continue
            t = t.replace(/^type\s+/, "")
            const base = t.split(/\s+as\s+/)[0].trim()
            if (base) names.add(base)
        }
    }
    const clean = [...names]
    for (const n of clean) symbolFreq.set(n, (symbolFreq.get(n) || 0) + 1)
    if (clean.length === 1 && clean[0] === "cn") {
        cnOnly.push(file)
        continue
    }
    const withoutCn = clean.filter((n) => n !== "cn")
    const unmapped = withoutCn.filter((n) => !(n in ATOM_MAP) || ATOM_MAP[n] === null)
    const mapped = withoutCn.filter((n) => ATOM_MAP[n])
    if (unmapped.length === 0 && mapped.length > 0) {
        candidate.push({ file, symbols: withoutCn, hasCn: clean.includes("cn") })
    } else {
        hard.push({ file, reason: "unmapped", symbols: withoutCn, unmapped })
    }
}

console.log("\n=== heroui unlocked files ===", herouiFiles.length)
console.log("cn-only", cnOnly.length)
console.log("atom-candidate", candidate.length)
console.log("hard", hard.length)

console.log("\n=== symbol freq (unlocked heroui files) ===")
;[...symbolFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(v, k))

console.log("\n=== atom candidates (first 80) ===")
for (const c of candidate.slice(0, 80)) {
    console.log(c.symbols.join(","), c.hasCn ? "+cn" : "", c.file)
}

// Inline skeleton unlocked
console.log("\n=== inline-skeleton unlocked (first 40) ===")
for (const h of unlockedByRule["starci-fe/no-inline-skeleton-branch"].slice(0, 40)) {
    console.log(`${h.file}:${h.line}`)
}

// Per-part classname unlocked
console.log("\n=== per-part-classname unlocked ===")
for (const h of unlockedByRule["starci-fe/no-per-part-classname-prop"]) {
    console.log(`${h.file}:${h.line} | ${h.msg.slice(0, 120)}`)
}

const out = {
    byRule: Object.fromEntries(
        RULES.map((r) => [
            r,
            {
                total: byRule[r].length,
                unlocked: unlockedByRule[r].length,
                locked: lockedByRule[r],
            },
        ]),
    ),
    heroui: {
        files: herouiFiles.length,
        cnOnly,
        candidate,
        hard: hard.map((h) => ({
            file: h.file,
            reason: h.reason,
            symbols: h.symbols,
            unmapped: h.unmapped,
        })),
    },
    inlineSkeleton: unlockedByRule["starci-fe/no-inline-skeleton-branch"],
    perPart: unlockedByRule["starci-fe/no-per-part-classname-prop"],
}
fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_overlap-safe-scan.json"),
    JSON.stringify(out, null, 2),
)
console.log("\nWrote _overlap-safe-scan.json")
