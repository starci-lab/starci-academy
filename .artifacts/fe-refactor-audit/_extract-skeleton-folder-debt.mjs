import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const baseline = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"), "utf8"),
)
const ledger = JSON.parse(readFileSync(resolve(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))

const LOCKED = [
    /MockInterviewSession/,
    /FlashcardsPage\/QuizSession|\/QuizSession\//,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /\/nivo\//i,
    /\/nivoexpert\//i,
    /src\/resources\//,
]

const holdPaths = []
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        holdPaths.push(String(p).replace(/\\/g, "/"))
    }
}

const RULES = [
    "starci-fe/no-inline-skeleton-branch",
    "starci-fe/no-skeleton-twin-component",
    "starci-fe/no-parallel-skeleton",
    "starci-fe/export-matches-folder",
    "starci-fe/no-helper-folder-in-components",
    "starci-fe/page-folder-two-files-only",
]

const out = Object.fromEntries(RULES.map((r) => [r, { all: [], unlocked: [], locked: [], hold: [] }]))

const norm = (p) =>
    p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

for (const file of baseline) {
    const rel = norm(file.filePath)
    const locked = LOCKED.some((re) => re.test(rel))
    const hold = holdPaths.some((hp) => rel.endsWith(hp) || rel.includes(hp))
    for (const m of file.messages || []) {
        if (!RULES.includes(m.ruleId)) continue
        const item = { file: rel, line: m.line, col: m.column, msg: m.message }
        out[m.ruleId].all.push(item)
        if (locked) out[m.ruleId].locked.push(item)
        else if (hold) out[m.ruleId].hold.push(item)
        else out[m.ruleId].unlocked.push(item)
    }
}

for (const r of RULES) {
    const b = out[r]
    console.log(
        r,
        "all",
        b.all.length,
        "unlocked",
        b.unlocked.length,
        "locked",
        b.locked.length,
        "hold",
        b.hold.length,
    )
    const files = [...new Set(b.unlocked.map((x) => x.file))]
    console.log("  unlocked files", files.length)
    for (const f of files.slice(0, 60)) console.log("   ", f)
    if (files.length > 60) console.log("   ... +" + (files.length - 60))
}

writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"),
    JSON.stringify(out, null, 2),
)
console.log("wrote _skeleton-folder-debt.json")
