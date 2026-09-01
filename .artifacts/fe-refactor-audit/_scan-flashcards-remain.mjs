#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const WANT = "src/components/pages/FlashcardsPage"

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, e.name)
        if (e.isDirectory()) walk(f, out)
        else if (f.endsWith(".tsx")) out.push(f)
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
        yield { name: m[1], tag: src.slice(m.index, i + 1), line: src.slice(0, m.index).split("\n").length }
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

function classifyFrame(tag) {
    const hasGap = /\bgap\s*=/.test(tag)
    const hasPad = /\bpadding\s*=/.test(tag) || /\bp\s*=/.test(tag)
    if (hasGap && hasPad) return "padding-plus-gap"
    return "real-seam-no-owner"
}

function classifyRaw(line) {
    const hasGap = /\bgap-/.test(line)
    const hasPad = /\b(?:p|px|py)-[1-9]/.test(line)
    if (hasGap && hasPad) return "padding-plus-gap"
    return "raw-vendor-foreign"
}

const SUGGEST = {
    1: "name-handle",
    2: "icon-text|title-subtitle|separator-dot",
    3: "flex-action|sibling-stack|chip-row|identity|value-row",
    4: "content-row|label-field|card-caption",
    5: "group-boundary",
    6: "block-boundary",
    7: "layout-split",
    8: "marketing-beat",
}

const holes = []
for (const file of walk(path.join(ROOT, WANT))) {
    const src = fs.readFileSync(file, "utf8")
    const rel = path.relative(ROOT, file).replace(/\\/g, "/")
    for (const { name, tag, line } of frameTags(src)) {
        const tokens = principleTokens(tag)
        if (tokens && tokens.length !== 1) {
            holes.push({ rel, line, name, gap: "-", pad: "-", cls: "multi-token", suggest: "-", head: tag.slice(0, 140).replace(/\s+/g, " ") })
            continue
        }
        if (tokens) continue
        if (!DECISION.test(tag)) continue
        const g = tag.match(/\bgap\s*=\s*(?:\{\s*)?(\d+)/)
        const pads = [...tag.matchAll(/\bpadding\s*=\s*(?:\{\s*)?([^}\s>]+)/g)].map((m) => m[1])
        holes.push({
            rel, line, name,
            gap: g?.[1] ?? "-",
            pad: pads.join(",") || "-",
            cls: classifyFrame(tag),
            suggest: SUGGEST[g?.[1]] ?? "-",
            head: tag.slice(0, 140).replace(/\s+/g, " "),
        })
    }
    src.split("\n").forEach((l, i) => {
        if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
        const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
        if (!cm || !SPACING.test(cm[1])) return
        if (/\b(?:data-)?principle\b/.test(l)) return
        const g = cm[1].match(/\bgap-(\d+)/)
        const pads = [...cm[1].matchAll(/\b(p|px|py)-([1-9]\d*)/g)].map((m) => m[0])
        const m = cm[1].match(/\b(ml-auto|mt-auto|mx-auto)\b/)
        holes.push({
            rel, line: i + 1, name: "raw",
            gap: g?.[1] ?? "-",
            pad: [...pads, m?.[1]].filter(Boolean).join(",") || "-",
            cls: classifyRaw(cm[1]),
            suggest: SUGGEST[g?.[1]] ?? "-",
            head: l.trim().slice(0, 140),
        })
    })
}

const byClass = {}
for (const h of holes) byClass[h.cls] = (byClass[h.cls] ?? 0) + 1
console.log("total", holes.length)
console.log("byClass", byClass)
console.log("")
console.log("| file | line | frame | gap/padding | class | intended action |")
console.log("|---|---:|---|---|---|---|")
for (const h of holes) {
    const short = h.rel.replace("src/components/pages/FlashcardsPage/", "")
    const gp = `gap=${h.gap} pad=${h.pad}`
    const action = h.cls === "padding-plus-gap"
        ? "split nested one-responsibility frames"
        : h.cls === "raw-vendor-foreign"
            ? `convert raw to frame+principle (${gp})`
            : `add principle for gap=${h.gap} (${h.suggest})`
    console.log(`| ${short} | ${h.line} | ${h.name} | ${gp} | ${h.cls} | ${action} |`)
}
fs.writeFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/flashcards-remain-holes.json"), JSON.stringify(holes, null, 2))
