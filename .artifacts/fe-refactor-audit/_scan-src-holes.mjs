#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
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
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const DS_ROOTS = [
    ".storybook/components/composites",
    ".storybook/components/starci",
    "src/components/composites",
    "src/components/starci",
    "src/components/page",
    "src/components/blockv2",
    "src/components/modalsv2",
    "src/components/drawersv2",
    "src/components/layoutsv2",
]
const TARGETS = [
    "MockInterviewPage",
    "QuickActions",
    "ProfileRedirectPage",
    "CvEditorPage",
    "LeaguePage",
    "LegalPage",
    "PrivacySettingsPage",
    "InputTags",
]

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, out)
        else if (full.endsWith(".tsx")) out.push(full)
    }
    return out
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

function* frameTags(src) {
    const re = new RegExp(`<(${FRAMES.join("|")})(\\s)`, "g")
    let m
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length - 1
        let depth = 0
        for (; i < src.length; i++) {
            const c = src[i]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) break
        }
        const tag = src.slice(m.index, i + 1)
        const line = src.slice(0, m.index).split("\n").length
        yield { name: m[1], tag, line }
    }
}

const inDS = (rel) => DS_ROOTS.some((r) => rel.replace(/\\/g, "/").startsWith(r))
const holes = []

for (const root of [".storybook/components", "src/components"]) {
    for (const file of walk(path.join(ROOT, root))) {
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        if (!TARGETS.some((t) => rel.includes(t))) continue
        if (rel.includes("/nivo")) continue
        const src = fs.readFileSync(file, "utf8")
        for (const { name, tag, line } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) {
                holes.push({ rel, line, name, kind: "frame", why: `got ${tokens.length}` })
                continue
            }
            if (tokens) continue
            if (!DECISION.test(tag)) continue
            holes.push({ rel, line, name, kind: "frame", head: tag.replace(/\s+/g, " ").slice(0, 120) })
        }
        if (!inDS(rel)) continue
        src.split("\n").forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) {
                const tokens = principleTokens(l)
                if (tokens && tokens.length !== 1) {
                    holes.push({ rel, line: i + 1, name: "raw", kind: "raw", why: `got ${tokens.length}` })
                }
                return
            }
            holes.push({
                rel,
                line: i + 1,
                name: "raw",
                kind: "raw",
                raw: cm[1].match(SPACING)[0],
                head: l.trim().slice(0, 140),
            })
        })
    }
}

console.log(JSON.stringify(holes, null, 2))
console.error(`total=${holes.length}`)
