import fs from "node:fs"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json", "utf8"),
)
const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))

const rules = [
    "starci-fe/no-inline-parameter-type",
    "starci-fe/handler-on-prefix",
    "starci-fe/prefer-arrow-export",
    "starci-fe/no-vietnamese-in-source-authoring",
    "starci-fe/no-emoji-in-source",
]

const toRel = (f) => {
    const n = f.split("\\").join("/")
    const i = n.indexOf("starci-academy/")
    return i >= 0 ? n.slice(i + "starci-academy/".length) : n
}

const lockedPrefixes = [
    ".storybook/utils/BlockAnatomy/",
    "src/components/pages/MockInterviewPage/MockInterviewSession/",
    "src/components/pages/FlashcardsPage/QuizSession/",
    "src/components/pages/LandingPage/LearnLoopScroll/",
    "src/components/blocks/learn/ContentAiChat/",
    ".storybook/components/nivoexpert/",
    ".storybook/components/nivo/",
    "src/resources/",
]

const heldFiles = new Set()
for (const d of ledger.decisions.filter((x) => x.status === "open")) {
    const paths = d.paths || (d.path ? [d.path] : [])
    for (const raw of paths) {
        for (const part of String(raw).split(/[;|]/)) {
            let p = part.trim().replace(/:\d+$/, "").split("\\").join("/")
            // directory hold (e.g. SepayCheckoutPage)
            if (p && (p.startsWith("src/") || p.startsWith(".storybook/"))) heldFiles.add(p)
        }
    }
}

const isHeld = (rel) => {
    for (const h of heldFiles) {
        if (rel === h || rel.startsWith(h.endsWith("/") ? h : h + "/") || (h.endsWith(rel) === false && rel.startsWith(h))) {
            if (rel === h || rel.startsWith(h + "/") || (h.endsWith("/") && rel.startsWith(h)) || (!h.includes(".") && rel.startsWith(h)))
                return true
        }
    }
    // SepayCheckoutPage is a directory prefix without trailing slash
    if (rel.startsWith("src/components/pages/SepayCheckoutPage")) return true
    return [...heldFiles].some((h) => {
        if (h.includes(".")) return rel === h
        return rel === h || rel.startsWith(h + "/")
    })
}

const isLocked = (rel, rule) => {
    if (lockedPrefixes.some((p) => rel.includes(p))) return true
    if (isHeld(rel)) return true
    if (rel.includes("src/components/blocks/marketing/ArchitectureScene/")) {
        return rule !== "starci-fe/no-inline-parameter-type"
    }
    return false
}

const byRule = {}
const lockedByRule = {}
const heldByRule = {}

for (const f of data) {
    const rel = toRel(f.filePath)
    for (const m of f.messages || []) {
        if (!rules.includes(m.ruleId)) continue
        const lockedHard = lockedPrefixes.some((p) => rel.includes(p)) ||
      (rel.includes("src/components/blocks/marketing/ArchitectureScene/") &&
        m.ruleId !== "starci-fe/no-inline-parameter-type")
        const held = isHeld(rel)
        if (lockedHard || held) {
            lockedByRule[m.ruleId] = (lockedByRule[m.ruleId] || 0) + 1
            if (held && !lockedHard) heldByRule[m.ruleId] = (heldByRule[m.ruleId] || 0) + 1
            continue
        }
        if (!byRule[m.ruleId]) byRule[m.ruleId] = []
        byRule[m.ruleId].push({
            file: rel,
            line: m.line,
            column: m.column,
            endLine: m.endLine,
            endColumn: m.endColumn,
            message: m.message,
        })
    }
}

const summary = {}
for (const r of rules) {
    const hits = byRule[r] || []
    const files = {}
    for (const h of hits) files[h.file] = (files[h.file] || 0) + 1
    summary[r] = {
        eligible: hits.length,
        lockedOrHeld: lockedByRule[r] || 0,
        heldOnly: heldByRule[r] || 0,
        fileCount: Object.keys(files).length,
        files,
    }
    console.log(
        r,
        "eligible",
        hits.length,
        "locked/held",
        lockedByRule[r] || 0,
        "(held-only",
        heldByRule[r] || 0 + ")",
        "files",
        Object.keys(files).length,
    )
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-authoring-eligible.json",
    JSON.stringify({ summary, byRule, heldFiles: [...heldFiles].sort() }, null, 2),
)
