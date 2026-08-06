#!/usr/bin/env node
/**
 * Pattern-seam debt inventory — groups check-pattern-coverage holes by directory
 * and assigns a provisional class (1–5) from local evidence. Write-only report;
 * does not edit sources.
 *
 *   node scripts/_pattern-seam-inventory.mjs
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ROOTS = [".storybook/components", "src/components"]
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const DS_ROOTS = [
    ".storybook/components/composites", ".storybook/components/starci",
    "src/components/composites", "src/components/starci", "src/components/page",
    "src/components/blockv2", "src/components/modalsv2", "src/components/drawersv2", "src/components/layoutsv2",
]
const inDesignSystem = (rel) => DS_ROOTS.some((r) => rel.replace(/\\/g, "/").startsWith(r))

const CLASSES = {
    1: "redundant-wrapper",
    2: "real-seam-no-owner",
    3: "padding-plus-gap",
    4: "raw-vendor-foreign",
    5: "intentional-no-seam",
}

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, out)
        else if (full.endsWith(".tsx")) out.push(full)
    }
    return out
}

function* frameTags(src) {
    const re = new RegExp(`<(${FRAMES.join("|")})(\\s)`, "g")
    let m
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length - 1, depth = 0
        for (; i < src.length; i++) {
            const c = src[i]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) break
        }
        const tag = src.slice(m.index, i + 1)
        const line = src.slice(0, m.index).split("\n").length
        yield { name: m[1], tag, line, index: m.index }
    }
}

function principleTokens(tag) {
    const array = tag.match(/\bprinciple\s*=\s*\{\s*\[([^\]]*)\]/)
    if (array) return [...array[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
    const lit = tag.match(/\bprinciple\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\1/)
    if (lit) return lit[2].trim().split(/\s+/).filter(Boolean)
    const data = tag.match(/\bdata-principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\1/)
    if (data) return data[2].trim().split(/\s+/).filter(Boolean)
    if (/\bprinciple\s*=/.test(tag) || /\bdata-principle\s*=/.test(tag)) return ["<expr>"]
    return null
}

function classifyFrame(tag, name, src, index) {
    const hasGap = /\bgap\s*=/.test(tag)
    const hasPad = /\bpadding\s*=/.test(tag) || /\bp\s*=/.test(tag)
    const hasBothSpacing = hasGap && hasPad
    const gapOne = /\bgap\s*=\s*\{?\s*1\s*\}?/.test(tag) || /\bgap\s*=\s*\{?\s*0\s*\}?/.test(tag)
    const onlyJustifyOrAlign =
        DECISION.test(tag) &&
        !hasGap &&
        !/\bcolumns\s*=/.test(tag) &&
        !/\bpadding\s*=/.test(tag)

    // Peek at nearby closing for single-child wrappers: items={[ () => ... ]} with one arrow
    const window = src.slice(index, Math.min(src.length, index + 800))
    const itemArrows = [...window.matchAll(/items\s*=\s*\{\s*\[/g)]
    let singleItem = false
    if (itemArrows.length) {
        const start = window.indexOf("[", itemArrows[0].index)
        let depth = 0
        let end = start
        for (; end < window.length; end++) {
            if (window[end] === "[") depth++
            else if (window[end] === "]" && --depth === 0) break
        }
        const body = window.slice(start + 1, end)
        // Count () => or plain refs at shallow level — crude
        const slots = [...body.matchAll(/(?:\(\)\s*=>|\{\s*key\s*:)/g)]
        singleItem = slots.length === 1
    }

    if (hasBothSpacing) return { classId: 3, class: CLASSES[3], note: "gap + padding on one frame" }
    if (gapOne && !/\bjustify|align|wrap|divider|columns|separator|at=/.test(tag.replace(/\bgap\s*=\s*\{?\s*1\s*\}?/, ""))) {
        // gap={1} with other decisions still a seam naming case → usually intentional zero/no-seam
        if (!DECISION.test(tag.replace(/\bgap\s*=[^>\s]+/, " "))) {
            return { classId: 5, class: CLASSES[5], note: "gap={1}/0 — likely intentional no-seam; confirm before dropping frame" }
        }
    }
    if (singleItem && hasGap) {
        return { classId: 1, class: CLASSES[1], note: "frame appears to wrap a single slot — candidate redundant wrapper" }
    }
    if (onlyJustifyOrAlign) {
        return { classId: 2, class: CLASSES[2], note: "layout decision without gap — still needs one principle (or drop decision)" }
    }
    return { classId: 2, class: CLASSES[2], note: "layout frame with decision, no principle" }
}

function classifyRaw(lineText, rawToken) {
    const hasGap = /\bgap-/.test(lineText)
    const hasPad = /\b(?:p|px|py)-[1-9]/.test(lineText)
    if (hasGap && hasPad) {
        return { classId: 3, class: CLASSES[3], note: `raw classes mix pad+gap (${rawToken}) — split into nested one-token frames` }
    }
    if (/\b(ml-auto|mt-auto|mx-auto)\b/.test(rawToken) || /\b(ml-auto|mt-auto|mx-auto)\b/.test(lineText)) {
        return { classId: 4, class: CLASSES[4], note: `raw position escape (${rawToken}) — Box hatch or frame prop` }
    }
    return { classId: 4, class: CLASSES[4], note: `raw spacing class (${rawToken}) — own via frame+principle or Box hatch` }
}

/** Directory key: up to pages/<Name>, overlays/<kind>, blocks/<domain>, composites/<family>, or 3 segments. */
function dirKey(rel) {
    const n = rel.replace(/\\/g, "/")
    const parts = n.split("/")
    // .storybook/components/{tier}/{family}/...
    // src/components/{tier}/...
    if (parts[0] === ".storybook" && parts[1] === "components") {
        if (parts[2] === "starci" || parts[2] === "nivo" || parts[2] === "nivoexpert") {
            // starci/blocks/learn/Foo → starci/blocks/learn
            return parts.slice(0, Math.min(5, parts.length - 1)).join("/")
        }
        // composites/layout/ModalShell → composites/layout
        return parts.slice(0, Math.min(4, parts.length - 1)).join("/")
    }
    if (parts[0] === "src" && parts[1] === "components") {
        const tier = parts[2]
        if (tier === "pages") {
            // src/components/pages/FooPage/... → pages/FooPage
            return parts.slice(0, 4).join("/")
        }
        if (tier === "overlays") {
            // overlays/modals/X → overlays/modals
            return parts.slice(0, Math.min(4, parts.length - 1)).join("/")
        }
        if (tier === "blocks") {
            // blocks/learn/X → blocks/learn
            return parts.slice(0, Math.min(4, parts.length - 1)).join("/")
        }
        if (tier === "starci") {
            return parts.slice(0, Math.min(5, parts.length - 1)).join("/")
        }
        // composites/layout/...
        return parts.slice(0, Math.min(4, parts.length - 1)).join("/")
    }
    return parts.slice(0, Math.min(4, parts.length - 1)).join("/")
}

const holes = []
for (const root of ROOTS) {
    for (const file of walk(path.join(ROOT, root))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        const lines = src.split("\n")
        for (const { name, tag, line, index } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) {
                holes.push({
                    rel, line, name, why: `multi-token (${tokens.length})`,
                    tag: tag.slice(0, 120).replace(/\s+/g, " "),
                    ...classifyFrame(tag, name, src, index),
                    kind: "multi-token",
                })
                continue
            }
            if (tokens) continue
            if (!DECISION.test(tag)) continue
            holes.push({
                rel, line, name,
                tag: tag.slice(0, 120).replace(/\s+/g, " "),
                ...classifyFrame(tag, name, src, index),
                kind: "unnamed-frame",
            })
        }
        if (!inDesignSystem(rel)) continue
        lines.forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) {
                const tokens = principleTokens(l)
                if (tokens && tokens.length !== 1) {
                    holes.push({
                        rel, line: i + 1, name: "raw", why: `multi-token on raw (${tokens.length})`,
                        raw: cm[1].match(SPACING)?.[0],
                        snippet: l.trim().slice(0, 140),
                        classId: 3, class: CLASSES[3], note: "raw node with multi-token principle",
                        kind: "raw-multi",
                    })
                }
                return
            }
            const raw = cm[1].match(SPACING)[0]
            holes.push({
                rel, line: i + 1, name: "raw", raw,
                snippet: l.trim().slice(0, 140),
                ...classifyRaw(cm[1], raw),
                kind: "raw",
            })
        })
    }
}

const byDir = {}
for (const h of holes) {
    const key = dirKey(h.rel)
    ;(byDir[key] ??= { dir: key, total: 0, byClass: {}, files: {}, findings: [] }).total++
    byDir[key].byClass[h.class] = (byDir[key].byClass[h.class] ?? 0) + 1
    ;(byDir[key].files[h.rel] ??= 0)
    byDir[key].files[h.rel]++
    byDir[key].findings.push(h)
}

const dirs = Object.values(byDir).sort((a, b) => b.total - a.total)

// Pick first migration target: prefer pages with mostly class-2, small-to-medium size, has SB twin if any
function scoreDir(d) {
    const c2 = d.byClass[CLASSES[2]] ?? 0
    const c4 = d.byClass[CLASSES[4]] ?? 0
    const c1 = d.byClass[CLASSES[1]] ?? 0
    const pure = c2 / d.total
    // Prefer src/pages with 4–20 holes, high share of real-seam
    let score = pure * 10 + Math.min(d.total, 20) * 0.3
    if (d.dir.includes("/pages/")) score += 5
    if (d.total >= 4 && d.total <= 16) score += 8
    if (d.total < 4) score -= 3
    if (c4 / d.total > 0.7) score -= 4 // mostly raw — harder first pass
    if (c1 / d.total > 0.5) score += 2 // wrappers are quick wins
    if (d.dir.startsWith(".storybook")) score -= 1 // migrate SB-first inside chosen domain; prefer src page grouping for selection
    return score
}

const ranked = [...dirs].sort((a, b) => scoreDir(b) - scoreDir(a))
const selected = ranked[0]

const outDir = path.join(ROOT, ".artifacts", "fe-refactor-audit")
fs.mkdirSync(outDir, { recursive: true })
const report = {
    generatedAt: new Date().toISOString(),
    totalHoles: holes.length,
    directoryCount: dirs.length,
    classLegend: {
        1: "redundant wrapper — remove it",
        2: "real seam with no owner — add one principle to the owning frame",
        3: "padding plus gap on one node — split into nested one-token frames",
        4: "raw vendor/foreign mount — preserve only as documented Box escape hatch",
        5: "intentional no-seam layout — record and remove the unnecessary principle/frame",
    },
    byClassTotals: Object.fromEntries(
        Object.values(CLASSES).map((c) => [c, holes.filter((h) => h.class === c).length]),
    ),
    directories: dirs.map((d) => ({
        dir: d.dir,
        total: d.total,
        byClass: d.byClass,
        fileCount: Object.keys(d.files).length,
        topFiles: Object.entries(d.files).sort((a, b) => b[1] - a[1]).slice(0, 8),
        score: Number(scoreDir(d).toFixed(2)),
    })),
    selectedFirstDirectory: {
        dir: selected.dir,
        reason: "Highest migration score among medium-sized directories with a high share of real-seam (class 2) findings; pages preferred over raw-heavy design-system dumps.",
        total: selected.total,
        byClass: selected.byClass,
        files: selected.files,
        findings: selected.findings,
    },
}

const jsonPath = path.join(outDir, "pattern-seam-inventory.json")
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2))

// Markdown summary
const md = []
md.push("# Pattern seam debt inventory")
md.push("")
md.push(`Generated: ${report.generatedAt}`)
md.push(`Total holes: **${report.totalHoles}** across **${report.directoryCount}** directories`)
md.push("")
md.push("## Class totals")
md.push("")
md.push("| # | Class | Count |")
md.push("|---|---|---|")
for (const [id, label] of Object.entries(report.classLegend)) {
    const key = CLASSES[id]
    md.push(`| ${id} | ${label} | ${report.byClassTotals[key] ?? 0} |`)
}
md.push("")
md.push("## Directories (by hole count)")
md.push("")
md.push("| Directory | Total | #1 wrap | #2 seam | #3 pad+gap | #4 raw | #5 no-seam | Files | Score |")
md.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|")
for (const d of report.directories) {
    const c = d.byClass
    md.push(
        `| \`${d.dir}\` | ${d.total} | ${c[CLASSES[1]] ?? 0} | ${c[CLASSES[2]] ?? 0} | ${c[CLASSES[3]] ?? 0} | ${c[CLASSES[4]] ?? 0} | ${c[CLASSES[5]] ?? 0} | ${d.fileCount} | ${d.score} |`,
    )
}
md.push("")
md.push("## Selected first directory")
md.push("")
md.push(`**\`${selected.dir}\`** — ${selected.total} hole(s)`)
md.push("")
md.push(report.selectedFirstDirectory.reason)
md.push("")
md.push("### Files")
md.push("")
for (const [f, n] of Object.entries(selected.files).sort((a, b) => b[1] - a[1])) {
    md.push(`- \`${f}\` (${n})`)
}
md.push("")
md.push("### Findings (provisional class)")
md.push("")
for (const h of selected.findings) {
    md.push(`- L${h.line} \`${h.name}\` → **${h.classId}. ${h.class}** — ${h.note}${h.raw ? ` [\`${h.raw}\`]` : ""}`)
}
md.push("")
md.push(`Full JSON: \`${path.relative(ROOT, jsonPath).replace(/\\/g, "/")}\``)
md.push("")
md.push("Classification is provisional (heuristic). Before editing a file, confirm each finding against the five rules; do not invent principle tokens.")

const mdPath = path.join(outDir, "pattern-seam-inventory.md")
fs.writeFileSync(mdPath, md.join("\n"))

console.log(`holes=${holes.length} dirs=${dirs.length}`)
console.log(`selected=${selected.dir} (${selected.total})`)
console.log(`wrote ${path.relative(ROOT, mdPath)}`)
console.log(`wrote ${path.relative(ROOT, jsonPath)}`)
console.log("\nTop 15 directories:")
for (const d of report.directories.slice(0, 15)) {
    console.log(`  ${String(d.total).padStart(4)}  ${d.dir}  ${JSON.stringify(d.byClass)}`)
}
console.log("\nTop scored for first migrate:")
for (const d of ranked.slice(0, 10)) {
    console.log(`  score=${scoreDir(d).toFixed(1).padStart(5)}  n=${String(d.total).padStart(3)}  ${d.dir}`)
}
