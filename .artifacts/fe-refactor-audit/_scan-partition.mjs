#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const dirs = [
    "src/components/pages/CvEditorPage",
    "src/components/pages/ProfileChallengeManagePage",
    "src/components/pages/ProfileChallengeSubmissionPage",
    "src/components/pages/ProfileProjectRoadmapPage",
    "src/components/pages/ProfileRedirectPage",
    "src/components/pages/MockInterviewPage",
    "src/components/pages/DashboardPage",
    "src/components/pages/LeaguePage",
    "src/components/pages/LegalPage",
    "src/components/pages/PrivacySettingsPage",
    "src/components/blocks/stats/VerdictHeroCard",
    "src/components/composites/form/InputTags",
    "src/components/overlays/modals/AuthenticationModal",
    "src/components/overlays/modals/LivestreamCalendarModal",
    ".storybook/components/composites/form/InputTags",
]

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, out)
        else if (full.endsWith(".tsx") || full.endsWith(".ts")) out.push(full)
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

function classifyFrame(tag, src, index) {
    const hasGap = /\bgap\s*=/.test(tag)
    const hasPad = /\bpadding\s*=/.test(tag)
    if (hasGap && hasPad) return "padding-plus-gap"
    const window = src.slice(index, Math.min(src.length, index + 800))
    const itemArrows = [...window.matchAll(/items\s*=\s*\{\s*\[/g)]
    let singleItem = false
    if (itemArrows.length) {
        const start = window.indexOf("[", itemArrows[0].index)
        let depth = 0, end = start
        for (; end < window.length; end++) {
            if (window[end] === "[") depth++
            else if (window[end] === "]" && --depth === 0) break
        }
        const body = window.slice(start + 1, end)
        const slots = [...body.matchAll(/(?:\(\)\s*=>|\{\s*key\s*:)/g)]
        singleItem = slots.length === 1
    }
    if (singleItem && hasGap) return "redundant-wrapper"
    return "real-seam-no-owner"
}

function classifyRaw(lineText) {
    const hasGap = /\bgap-/.test(lineText)
    const hasPad = /\b(?:p|px|py)-[1-9]/.test(lineText)
    if (hasGap && hasPad) return "padding-plus-gap"
    return "raw-vendor-foreign"
}

function spacingToken(tagOrClass) {
    const g = tagOrClass.match(/\bgap(?:-|=\{?)(\d+)/)
    const p = tagOrClass.match(/\b(?:padding=\{?|p-|px-|py-)(\d+)/)
    const m = tagOrClass.match(/\b(ml-auto|mt-auto|mx-auto)\b/)
    const parts = []
    if (g) parts.push(`gap-${g[1] ?? g[0]}`)
    if (p) parts.push(p[0])
    if (m) parts.push(m[1])
    return parts.join(" ") || "?"
}

const rows = []
for (const dir of dirs) {
    for (const file of walk(path.join(ROOT, dir))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        for (const { name, tag, line, index } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) {
                rows.push({ rel, line, frame: name, gap: spacingToken(tag), cls: "multi-token", action: "split to one principle", snip: tag.replace(/\s+/g, " ").slice(0, 120) })
                continue
            }
            if (tokens) continue
            if (!DECISION.test(tag)) continue
            const cls = classifyFrame(tag, src, index)
            const action =
                cls === "redundant-wrapper" ? "remove wrapper if no layout/seam" :
                    cls === "padding-plus-gap" ? "split nested one-responsibility frames" :
                        "add one principle matching gap/pad step"
            rows.push({ rel, line, frame: name, gap: spacingToken(tag), cls, action, snip: tag.replace(/\s+/g, " ").slice(0, 120) })
        }
        src.split("\n").forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) {
                const tokens = principleTokens(l)
                if (tokens && tokens.length !== 1) {
                    rows.push({ rel, line: i + 1, frame: "raw", gap: cm[1].match(SPACING)[0], cls: "multi-token", action: "fix singular", snip: l.trim().slice(0, 120) })
                }
                return
            }
            const cls = classifyRaw(cm[1])
            const action =
                cls === "padding-plus-gap" ? "split pad+gap into nested frames" :
                    "convert to house frame+principle or Box hatch"
            rows.push({ rel, line: i + 1, frame: "raw", gap: cm[1].match(SPACING)[0], cls, action, snip: l.trim().slice(0, 140) })
        })
    }
}

console.log(`total ${rows.length}`)
const byDir = {}
for (const r of rows) {
    const d = dirs.find((x) => r.rel.startsWith(x)) ?? r.rel
    byDir[d] = (byDir[d] ?? 0) + 1
}
console.log(JSON.stringify(byDir, null, 2))
console.log("")
console.log("| file | line | frame | gap/padding | class | intended action |")
console.log("|---|---:|---|---|---|---|")
for (const r of rows) {
    console.log(`| \`${r.rel}\` | ${r.line} | ${r.frame} | ${r.gap} | ${r.cls} | ${r.action} |`)
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_partition-holes.json"),
    JSON.stringify(rows, null, 2),
)
