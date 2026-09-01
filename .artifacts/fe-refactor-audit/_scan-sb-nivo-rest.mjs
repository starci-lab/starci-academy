#!/usr/bin/env node
/**
 * Partition-local hole scan for sb-nivo-rest.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const PART = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/pattern-seam-partitions.json", "utf8"),
)
const dirs = PART.partitions.find((x) => x.id === "sb-nivo-rest").directories.map((d) => d.dir)

const FRAMES = [
    "StackH",
    "StackV",
    "Cluster",
    "Grid",
    "Split",
    "ResponsiveRow",
    "ResponsiveCluster",
    "RailShell",
    "SplitWorkspace",
    "Reel",
]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
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
        let i = m.index + m[0].length - 1,
            depth = 0
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
    const hasBoth = hasGap && hasPad
    const window = src.slice(index, Math.min(src.length, index + 800))
    const itemArrows = [...window.matchAll(/items\s*=\s*\{\s*\[/g)]
    let singleItem = false
    if (itemArrows.length) {
        const start = window.indexOf("[", itemArrows[0].index)
        let depth = 0,
            end = start
        for (; end < window.length; end++) {
            if (window[end] === "[") depth++
            else if (window[end] === "]" && --depth === 0) break
        }
        const body = window.slice(start + 1, end)
        const slots = [...body.matchAll(/(?:\(\)\s*=>|\{\s*key\s*:)/g)]
        singleItem = slots.length === 1
    }
    if (hasBoth) return { classId: 3, class: CLASSES[3] }
    if (singleItem && hasGap) return { classId: 1, class: CLASSES[1] }
    return { classId: 2, class: CLASSES[2] }
}

function gapOf(tag) {
    return (tag.match(/\bgap\s*=\s*\{?\s*(\d+)/) || [])[1] || ""
}
function padOf(tag) {
    return (tag.match(/\bpadding\s*=\s*\{?\s*["']?(\d+)/) || [])[1] || ""
}

const GAP_TOKENS = {
    1: "name-handle",
    2: "icon-text|title-subtitle|separator-dot",
    3: "flex-action|identity|value-row|chip-row|sibling-stack",
    4: "label-field|content-row|card-caption",
    5: "group-boundary",
    6: "block-boundary",
    7: "layout-split",
    8: "marketing-beat",
}
const PAD_TOKENS = {
    3: "control-pad?",
    4: "cell-pad",
    5: "card-padding",
    6: "page-pad",
}

const holes = []
for (const d of dirs) {
    for (const file of walk(path.join(ROOT, d))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        for (const { name, tag, line, index } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) {
                holes.push({
                    rel,
                    line,
                    name,
                    gap: gapOf(tag),
                    pad: padOf(tag),
                    class: "multi-token",
                    tag: tag.slice(0, 140).replace(/\s+/g, " "),
                })
                continue
            }
            if (tokens) continue
            if (!DECISION.test(tag)) continue
            const gap = gapOf(tag)
            const pad = padOf(tag)
            holes.push({
                rel,
                line,
                name,
                gap,
                pad,
                ...classifyFrame(tag, name, src, index),
                suggest: gap
                    ? GAP_TOKENS[gap] || "?"
                    : pad
                        ? PAD_TOKENS[pad] || "pad?"
                        : "layout-only",
                tag: tag.slice(0, 140).replace(/\s+/g, " "),
            })
        }
    }
}

console.log(`HOLES ${holes.length}`)
console.log("| file | line | frame | gap | pad | class | suggest |")
console.log("|---|---|---|---|---|---|---|")
for (const h of holes) {
    console.log(
        `| ${h.rel} | ${h.line} | ${h.name} | ${h.gap || "-"} | ${h.pad || "-"} | ${h.class} | ${h.suggest || "-"} |`,
    )
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_scan-sb-nivo-rest.json",
    JSON.stringify(holes, null, 2),
)
console.log("\nwrote _scan-sb-nivo-rest.json")
