/**
 * Verify unlocked inventory sites now have explain nearby (except dynamic principle).
 */
import fs from "node:fs"

const inv = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_explain-only-unlocked.json", "utf8"),
)

const stillMissing = []
const dynamic = []
const ok = []

for (const h of inv.hits) {
    const lines = fs.readFileSync(h.file, "utf8").split(/\r?\n/)
    let principleIdx = -1
    let isDyn = false
    for (let i = Math.max(0, h.line - 4); i < Math.min(lines.length, h.line + 10); i++) {
        if (/principle=\{/.test(lines[i]) && !/principle=["']/.test(lines[i])) {
            isDyn = true
            principleIdx = i
            break
        }
        if (/principle=["'][a-z0-9-]+["']/.test(lines[i])) {
            principleIdx = i
            break
        }
    }
    if (isDyn) {
        dynamic.push({ file: h.file, line: h.line })
        continue
    }
    if (principleIdx < 0) {
        stillMissing.push({ file: h.file, line: h.line, reason: "no-principle-found" })
        continue
    }
    const hasExplain = lines
        .slice(principleIdx, Math.min(lines.length, principleIdx + 4))
        .some((l) => /\bexplain\s*=/.test(l))
    if (!hasExplain) {
        stillMissing.push({ file: h.file, line: h.line, reason: "no-explain", principleLine: principleIdx + 1 })
    } else {
        ok.push(1)
    }
}

// also check no explain-inside-items corruption
const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)
const files = [...new Set([...r1.changed, ...r2.changed].map((c) => c.file))]
let corrupt = 0
for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    for (let i = 1; i < lines.length; i++) {
        if (!/^\s*explain=/.test(lines[i])) continue
        const prev = lines[i - 1]
        if (/items=\{\s*\[\s*$/.test(prev) || /body=\{\s*\(\s*$/.test(prev) || /items=\{\s*$/.test(prev)) {
            corrupt++
        }
    }
}

const report = {
    ok: ok.length,
    stillMissing: stillMissing.length,
    dynamic: dynamic.length,
    corrupt,
    missingSample: stillMissing.slice(0, 20),
    dynamicSample: dynamic.slice(0, 10),
}
console.log(JSON.stringify(report, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-verify.json",
    JSON.stringify(report, null, 2),
)
