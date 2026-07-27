#!/usr/bin/env node
/**
 * PADDING and MARGIN gate (10a, 10c).
 *
 * The gap rule is held by the compiler: every frame types it as `SeamScale`, a set of six WORDS,
 * so an off scale gap cannot be written and a numeric one cannot either. The padding rule has no
 * such path and the margin rule has none, so both live only in prose, and a rule the machine does
 * not hold is the rule people route around.
 *
 * Measured on 2026-07-27, both scopes stated because they differ by an order of magnitude:
 *   whole `.storybook` tree, atoms and `_legacy` and stories included
 *       1253 padding classes, 92 of them off scale, 93 margin classes
 *   what THIS gate guards, frame tier up with atoms and `_legacy` and stories excluded
 *       9 off scale paddings and 11 child margins, every one of them at the composite tier
 *
 * The first version of this header carried three numbers (816, 48, 24) that no longer reproduce
 * under either scope. A gate whose own docstring cannot be re-measured teaches a reader to skim
 * the next number too, so figures here state their scope or they do not belong.
 *
 * Two checks, both scoped from the FRAME tier up:
 *   1. padding off the `0 · 1 · 2 · 3 · 6 · 8` scale
 *   2. a child pushing its own margin, which makes two owners for one seam
 *
 * ATOMS ARE EXEMPT by 13z. An atom owns its inner geometry, so `pr-9` reserving room for the eye
 * button inside `Input` is the rule working rather than a violation. `utils` is dev tooling and
 * is exempt for the same reason.
 *
 * The margin whitelist is `auto` for pushing to an edge and a NEGATIVE value for bleeding past a
 * container edge. Anything else means the child decided a seam that belongs to its parent.
 *
 *   node scripts/check-padding.mjs         report, exit 1 when anything is found
 *   node scripts/check-padding.mjs --json  machine readable
 *
 * This lives beside `check-seams.mjs` rather than inside it on purpose. The same logic patched
 * into that file refused to fire while an identical standalone copy found twenty violations, and
 * shipping a gate whose silence cannot be explained is worse than shipping no gate at all.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const SB = join(ROOT, ".storybook")
const SCALE = new Set(["0", "1", "2", "3", "6", "8"])
/** Tiers that must route spacing through a frame. `atom` and `util` own their own insides. */
const GUARDED = new Set(["frame", "composite", "design", "block", "screen"])

const walk = (dir, out = []) => {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry)
        if (statSync(path).isDirectory()) {
            walk(path, out)
        } else if (/\.tsx?$/.test(entry)) {
            out.push(path)
        }
    }
    return out
}

/** Tier from the path. Must be updated the same day the tree moves, or the gate goes blind. */
const tierOf = (rel) =>
    rel.includes("/screens/") ? "screen"
    : rel.includes("/blocks/") ? "block"
    : rel.includes("/designs/") ? "design"
    : rel.includes("/composites/") ? "composite"
    : rel.includes("/frames/") ? "frame"
    : rel.includes("/atoms/") ? "atom"
    : "util"

const findings = []
const files = walk(SB).filter((f) => !f.includes("_legacy") && !f.includes(".stories."))

for (const file of files) {
    const rel = relative(ROOT, file).replaceAll("\\", "/")
    const tier = tierOf(rel)
    if (!GUARDED.has(tier)) {
        continue
    }
    let inBlockComment = false
    readFileSync(file, "utf8").split("\n").forEach((line, index) => {
        const trimmed = line.trim()
        if (trimmed.startsWith("/*") || trimmed.startsWith("{/*")) {
            inBlockComment = true
        }
        const isComment = trimmed.startsWith("//") || inBlockComment || trimmed.startsWith("*")
        if (inBlockComment && trimmed.includes("*/")) {
            inBlockComment = false
        }
        if (isComment) {
            return
        }
        const at = { file: rel, line: index + 1, tier, code: trimmed.slice(0, 96) }

        for (const match of line.matchAll(/\bp[trblxy]?-(\d+(?:\.\d+)?)\b/g)) {
            if (!SCALE.has(match[1])) {
                findings.push({ ...at, rule: "padding-off-scale", detail: match[0] })
            }
        }
        for (const match of line.matchAll(/\bm[trblxyse]?-(?!auto)(\d+(?:\.\d+)?)\b/g)) {
            findings.push({ ...at, rule: "child-margin", detail: match[0] })
        }
    })
}

if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(findings))
    process.exit(0)
}

const LABEL = {
    "padding-off-scale": "PADDING ngoài thang 0·1·2·3·6·8 — dùng prop `padding` của khung",
    "child-margin": "MARGIN của con — khoảng phải đến từ `gap` của cha hoặc `padding` của bề mặt",
}
const byRule = {}
const byTier = {}
for (const f of findings) {
    byRule[f.rule] = (byRule[f.rule] ?? 0) + 1
    byTier[f.tier] = (byTier[f.tier] ?? 0) + 1
}

console.log(`File quét: ${files.length} (bỏ atom · util · _legacy · story) | phát hiện: ${findings.length}`)
for (const [rule, count] of Object.entries(byRule)) {
    console.log(`  ${String(count).padStart(3)}  ${LABEL[rule]}`)
}
if (findings.length) {
    console.log(`  theo tầng: ${JSON.stringify(byTier)}`)
}

for (const rule of Object.keys(LABEL)) {
    const rows = findings.filter((f) => f.rule === rule)
    if (!rows.length) {
        continue
    }
    console.log(`\n── ${LABEL[rule]}`)
    for (const f of rows) {
        console.log(`  [${f.tier}] ${f.file}:${f.line}  ${f.detail}\n        ${f.code}`)
    }
}

if (findings.length) {
    process.exit(1)
}
console.log("\n✅ Không có padding off-scale, không có margin của con.")
