/**
 * Final tally: explains added vs baseline unlocked inventory.
 */
import fs from "node:fs"
import { execSync } from "node:child_process"

const inv = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_explain-only-unlocked.json", "utf8"),
)
const lockedBaseline = 426 - inv.total

// files changed in src from this work
const status = execSync("git status --porcelain src", { encoding: "utf8" })
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
const changedFiles = status
    .map((s) => s.replace(/^[AM?DR]+\s+/, "").replace(/^.* -> /, ""))
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))

let stillMissingExplain = 0
let dynamicSkipped = 0
const missingList = []

for (const h of inv.hits) {
    if (!fs.existsSync(h.file)) continue
    const lines = fs.readFileSync(h.file, "utf8").split(/\r?\n/)
    // find principle near original line ±20 (lines shifted)
    let found = false
    let isDyn = false
    let hasExplain = false
    for (let i = 0; i < lines.length; i++) {
        if (/principle=\{/.test(lines[i]) && !/principle=["']/.test(lines[i])) {
            // only count if near original
            if (Math.abs(i + 1 - h.line) <= 30) {
                // weak — better count file-level later
            }
        }
    }
}

// Better: scan all changed files for static principle without nearby explain
for (const rel of changedFiles) {
    const file = rel.startsWith("src") ? rel : "src/" + rel
    if (!fs.existsSync(file)) continue
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        if (/principle=\{/.test(lines[i]) && !/principle=["']/.test(lines[i])) {
            if (inv.hits.some((h) => h.file.replace(/\\/g, "/").endsWith(file.replace(/\\/g, "/")) && Math.abs(h.line - (i + 1)) <= 20)) {
                dynamicSkipped++
            }
            continue
        }
        const m = lines[i].match(/principle=(["'])([a-z0-9-]+)\1/)
        if (!m) continue
        const has = lines.slice(i, Math.min(lines.length, i + 3)).some((l) => /\bexplain\s*=/.test(l))
        if (!has) {
            stillMissingExplain++
            missingList.push({ file, line: i + 1, text: lines[i].trim().slice(0, 100) })
        }
    }
}

const report = {
    baselineExplainOnly: 426,
    lockedSkipped: lockedBaseline,
    unlockedTarget: inv.total,
    gitChangedSrcFiles: changedFiles.length,
    changedFiles,
    stillMissingExplain,
    dynamicSkippedApprox: dynamicSkipped,
    missingList: missingList.slice(0, 20),
}
console.log(JSON.stringify(report, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-final-tally.json",
    JSON.stringify(report, null, 2),
)
