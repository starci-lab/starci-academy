import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const DECISION = /\b(justify|align|at|wrap|divider|padding|columns|separator)[=\s]/
const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const DS_ROOTS = [
    ".storybook/components/composites", ".storybook/components/starci",
    "src/components/composites", "src/components/starci", "src/components/page",
    "src/components/blockv2", "src/components/modalsv2", "src/components/drawersv2", "src/components/layoutsv2",
]
const ROOTS = [".storybook/components", "src/components"]

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
        yield { name: m[1], tag, line }
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

const inDesignSystem = (rel) => DS_ROOTS.some((r) => rel.replace(/\\/g, "/").startsWith(r))
const holes = []
for (const root of ROOTS) {
    for (const file of walk(path.join(ROOT, root))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file)
        for (const { name, tag, line } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) {
                holes.push({ rel, line, name, why: `multi ${tokens.length}` })
                continue
            }
            if (tokens) continue
            if (!DECISION.test(tag)) continue
            holes.push({ rel, line, name, why: "unnamed-frame" })
        }
        if (!inDesignSystem(rel)) continue
        src.split("\n").forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) {
                const tokens = principleTokens(l)
                if (tokens && tokens.length !== 1) {
                    holes.push({ rel, line: i + 1, name: "raw", why: `multi ${tokens.length}` })
                }
                return
            }
            holes.push({ rel, line: i + 1, name: "raw", why: cm[1].match(SPACING)[0] })
        })
    }
}

const byFile = {}
for (const h of holes) (byFile[h.rel] ??= []).push(h)
console.log(`total ${holes.length} in ${Object.keys(byFile).length} files`)
for (const [rel, hs] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${rel}`)
    for (const h of hs) console.log(`  L${h.line} ${h.name} ${h.why || ""}`)
}
