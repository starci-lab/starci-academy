#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const DS_ROOTS = [
    ".storybook/components/composites", ".storybook/components/starci",
    "src/components/composites", "src/components/starci", "src/components/page",
    "src/components/blockv2", "src/components/modalsv2", "src/components/drawersv2", "src/components/layoutsv2",
]
const inDS = (r) => DS_ROOTS.some((x) => r.replace(/\\/g, "/").startsWith(x))

const WANT = [
    "src/components/pages/PracticeHubPage",
    "src/components/pages/PracticeProblemPage",
    "src/components/pages/AdminAiBalancerPage",
    "src/components/pages/AdminUploadVideoPage",
    "src/components/pages/AdminLoginPage",
    "src/components/pages/AdminMpegDashTestPage",
    "src/components/pages/ArchitecturePage",
    "src/components/pages/LandingPage",
    ".storybook/components/nivo/pages/LandingPage",
    ".storybook/components/composites/form",
    ".storybook/components/composites/buttons",
    ".storybook/components/composites/viewers",
]

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

function intended(cls, gap, pad, raw) {
    if (cls === "padding-plus-gap") return "split nested one-responsibility frames"
    if (cls === "raw-vendor-foreign") {
        if (raw === "ml-auto") return "Box hatch push-end or frame justify"
        if (raw === "mt-auto") return "Box hatch pin-bottom"
        if (raw === "mx-auto") return "Box hatch center-measure"
        return "convert to frame+principle (or document foreign mount)"
    }
    if (cls === "real-seam-no-owner") {
        const g = Number(gap)
        const map = { 1: "name-handle", 2: "icon-text|title-subtitle|separator-dot", 3: "sibling-stack|flex-action|identity|value-row|chip-row", 4: "label-field|content-row|card-caption", 5: "group-boundary", 6: "block-boundary", 7: "layout-split", 8: "marketing-beat" }
        if (pad && !gap) return "padding token (cell-pad|card-padding|page-pad|control-pad|row-pad|pill-pad)"
        return map[g] ?? "pick principle matching seam"
    }
    return cls
}

const out = {}
for (const d of WANT) {
    const findings = []
    for (const file of walk(path.join(ROOT, d))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        const lines = src.split("\n")
        for (const { name, tag, line } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length === 1) continue
            if (tokens && tokens.length !== 1) {
                findings.push({
                    rel, line, name, class: "multi-token",
                    gap: tag.match(/gap\s*=\s*\{?\s*(\d+)/)?.[1],
                    pad: tag.match(/padding\s*=\s*\{?\s*(\d+)/)?.[1],
                    tag: tag.replace(/\s+/g, " ").slice(0, 180),
                })
                continue
            }
            if (!DECISION.test(tag)) continue
            const gap = tag.match(/gap\s*=\s*\{?\s*(\d+)/)?.[1]
            const pad = tag.match(/padding\s*=\s*\{?\s*(\d+)/)?.[1]
            const cls = classifyFrame(tag)
            findings.push({ rel, line, name, class: cls, gap, pad, tag: tag.replace(/\s+/g, " ").slice(0, 180) })
        }
        if (!inDS(rel)) continue
        lines.forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) return
            const raw = cm[1].match(SPACING)[0]
            findings.push({
                rel, line: i + 1, name: "raw", class: classifyRaw(cm[1]), raw,
                snippet: l.trim().slice(0, 180),
            })
        })
    }
    out[d] = findings
    console.log(`\n## ${d} (${findings.length})`)
    console.log("| file | line | frame | gap/padding | class | intended action |")
    console.log("|---|---|---|---|---|---|")
    for (const h of findings) {
        const gp = h.gap ? `gap=${h.gap}` : h.pad ? `pad=${h.pad}` : (h.raw || "")
        console.log(`| ${h.rel} | ${h.line} | ${h.name} | ${gp} | ${h.class} | ${intended(h.class, h.gap, h.pad, h.raw)} |`)
    }
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/master-partition-holes.json"),
    JSON.stringify(out, null, 2),
)
console.log("\nWrote master-partition-holes.json")
for (const [d, f] of Object.entries(out)) console.log(`${d}\t${f.length}`)
