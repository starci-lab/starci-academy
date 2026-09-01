import fs from "node:fs"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json", "utf8"),
)
const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))

const lockedRes = [
    /MockInterviewSession/,
    /QuizSession/,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /nivoexpert\//,
    /\/nivo\//,
]

const holdPaths = new Set()
for (const d of ledger.decisions.filter((x) => x.status === "open")) {
    const raw = []
    if (d.path) raw.push(d.path)
    if (Array.isArray(d.paths)) raw.push(...d.paths)
    for (const p of raw) {
    // strip :line
        const file = String(p).replace(/:\d+$/, "").replace(/\\/g, "/")
        holdPaths.add(file)
    }
}

const norm = (f) => f.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")
const isLocked = (f) => {
    const p = norm(f)
    if (lockedRes.some((r) => r.test(p))) return true
    // teacher hold: any open path prefix match for pattern seams
    for (const hp of holdPaths) {
        if (p === hp || p.startsWith(hp.replace(/\/index\.tsx$/, "/")) || hp.startsWith(p)) {
            // only skip if the hold is clearly about this file
            if (p === hp || hp.startsWith(p + "/") || p.startsWith(hp.split("/").slice(0, -1).join("/") + "/")) {
                // tighter: exact file match or hold path equals file
                if (p === hp || hp.endsWith(p) || p.endsWith(hp)) return "hold:" + hp
            }
        }
    }
    if (holdPaths.has(p)) return "hold"
    return false
}

const isHoldFile = (f) => {
    const p = norm(f)
    for (const hp of holdPaths) {
        if (p === hp || p === hp.replace(/\.tsx$/, "") || hp.startsWith(p)) {
            if (p === hp) return hp
        }
        // file path without line
        const hpFile = hp.split(":").length > 2 ? hp : hp.replace(/:\d+$/, "")
        if (p === hpFile || p.endsWith("/" + hpFile.split("/").pop()) && hpFile.endsWith(p.split("/").slice(-2).join("/"))) {
            if (p === hpFile) return hpFile
        }
    }
    // exact match against hold file paths
    for (const hp of holdPaths) {
        const hpFile = hp.replace(/:\d+$/, "")
        if (p === hpFile) return hpFile
    }
    return false
}

const explainOnly = []
const missingBoth = []
const asyncRetired = []
const exportFolder = []
const handler = []
const arrow = []
const jsdoc = []

for (const f of data) {
    if (!f.messages) continue
    for (const m of f.messages) {
        const rule = m.ruleId || ""
        const msg = m.message || ""
        const entry = {
            file: norm(f.filePath),
            line: m.line,
            col: m.column,
            msg: msg.slice(0, 200),
            rule,
            locked: isLocked(f.filePath),
            hold: isHoldFile(f.filePath),
        }
        if (rule === "starci-fe/require-frame-self-declare") {
            if (msg.includes("but no `explain`") && !msg.includes("neither")) {
                explainOnly.push(entry)
            } else {
                missingBoth.push(entry)
            }
        }
        if (rule === "starci-fe/no-retired-async-content") asyncRetired.push(entry)
        if (rule === "starci-fe/export-matches-folder") exportFolder.push(entry)
        if (rule === "starci-fe/handler-on-prefix") handler.push(entry)
        if (rule === "starci-fe/prefer-arrow-export") arrow.push(entry)
        if (rule === "starci-fe/require-export-jsdoc") jsdoc.push(entry)
    }
}

const unlockedExplain = explainOnly.filter((e) => !e.locked && !e.hold)
const byFile = {}
for (const e of unlockedExplain) {
    byFile[e.file] = (byFile[e.file] || 0) + 1
}

console.log(
    JSON.stringify(
        {
            explainOnly: explainOnly.length,
            unlockedExplain: unlockedExplain.length,
            unlockedExplainFiles: Object.keys(byFile).length,
            missingBoth: missingBoth.length,
            asyncRetired: asyncRetired.length,
            holdPaths: [...holdPaths].length,
            byFile,
            unlockedExplainSample: unlockedExplain.slice(0, 30),
            asyncUnlocked: asyncRetired.filter((e) => !e.locked && !e.hold).map((e) => e.file + ":" + e.line),
            exportUnlocked: exportFolder.filter((e) => !e.locked && !e.hold).slice(0, 40),
        },
        null,
        2,
    ),
)

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-burn-explain-only.json",
    JSON.stringify({ unlockedExplain, byFile, asyncRetired, exportFolder, handler, arrow, jsdoc, holdPaths: [...holdPaths] }, null, 2),
)
