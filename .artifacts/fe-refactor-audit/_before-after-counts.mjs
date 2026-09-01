import fs from "node:fs"
import { spawnSync } from "node:child_process"

const RULES = [
    "starci-fe/no-inline-parameter-type",
    "starci-fe/handler-on-prefix",
    "starci-fe/prefer-arrow-export",
    "starci-fe/no-vietnamese-in-source-authoring",
    "starci-fe/no-emoji-in-source",
]

const baseline = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json", "utf8"),
)

const toRel = (f) => {
    const n = f.split("\\").join("/")
    const i = n.indexOf("starci-academy/")
    return i >= 0 ? n.slice(i + "starci-academy/".length) : n
}

const before = Object.fromEntries(RULES.map((r) => [r, 0]))
for (const f of baseline) {
    for (const m of f.messages || []) {
        if (RULES.includes(m.ruleId)) before[m.ruleId]++
    }
}

// Re-scan product trees for AFTER counts (same scope as baseline product scan intent)
const r = spawnSync(
    "npx",
    ["eslint", "src", ".storybook", "--format", "json", "--max-warnings", "999999"],
    { encoding: "utf8", shell: true, maxBuffer: 80 * 1024 * 1024 },
)
let afterData = []
try {
    afterData = JSON.parse(r.stdout || "[]")
} catch (e) {
    console.error("failed to parse eslint json", e.message, r.stderr?.slice(0, 500))
    process.exit(1)
}

const after = Object.fromEntries(RULES.map((r) => [r, 0]))
const afterByFile = Object.fromEntries(RULES.map((r) => [r, {}]))
for (const f of afterData) {
    const rel = toRel(f.filePath)
    for (const m of f.messages || []) {
        if (!RULES.includes(m.ruleId)) continue
        after[m.ruleId]++
        afterByFile[m.ruleId][rel] = (afterByFile[m.ruleId][rel] || 0) + 1
    }
}

console.log("BEFORE (baseline product json) → AFTER (live src+.storybook)")
for (const rule of RULES) {
    console.log(`${rule}: ${before[rule]} → ${after[rule]} (Δ ${after[rule] - before[rule]})`)
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-authoring-before-after.json",
    JSON.stringify({ before, after, afterByFile }, null, 2),
)
