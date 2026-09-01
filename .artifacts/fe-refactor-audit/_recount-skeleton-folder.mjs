/**
 * Recount target-rule hits after the burn (fresh eslint on product trees).
 * Also compares to baseline unlocked counts.
 */
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const RULES = [
    "starci-fe/no-inline-skeleton-branch",
    "starci-fe/no-skeleton-twin-component",
    "starci-fe/no-parallel-skeleton",
    "starci-fe/export-matches-folder",
    "starci-fe/no-helper-folder-in-components",
    "starci-fe/page-folder-two-files-only",
]

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

const ledger = JSON.parse(readFileSync(resolve(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))
const holdPaths = []
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        holdPaths.push(String(p).replace(/\\/g, "/"))
    }
}

const norm = (p) => p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

function classify(rel) {
    if (LOCKED.some((re) => re.test(rel))) return "locked"
    if (holdPaths.some((hp) => rel.endsWith(hp) || rel.includes(hp))) return "hold"
    return "unlocked"
}

console.log("running eslint…")
const r = spawnSync(
    "npx",
    ["eslint", "src", ".storybook", "--format", "json", "-o", ".artifacts/fe-refactor-audit/_eslint-after-skeleton-folder.json"],
    { cwd: ROOT, shell: true, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
)
console.log("eslint exit", r.status)

const after = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_eslint-after-skeleton-folder.json"), "utf8"),
)
const before = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"), "utf8"),
)

const counts = {}
for (const rule of RULES) {
    counts[rule] = { beforeAll: before[rule].all.length, beforeUnlocked: before[rule].unlocked.length, afterAll: 0, afterUnlocked: 0, afterLocked: 0, afterHold: 0 }
}

for (const file of after) {
    const rel = norm(file.filePath)
    const bucket = classify(rel)
    for (const m of file.messages || []) {
        if (!RULES.includes(m.ruleId)) continue
        counts[m.ruleId].afterAll++
        if (bucket === "unlocked") counts[m.ruleId].afterUnlocked++
        else if (bucket === "locked") counts[m.ruleId].afterLocked++
        else counts[m.ruleId].afterHold++
    }
}

writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-before-after.json"),
    JSON.stringify(counts, null, 2),
)
console.log(JSON.stringify(counts, null, 2))
