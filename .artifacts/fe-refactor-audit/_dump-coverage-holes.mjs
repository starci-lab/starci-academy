/**
 * Dump pattern-coverage failing holes with line text for files we touched.
 */
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const ROOT = process.cwd()
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
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
const inDesignSystem = (rel) => DS_ROOTS.some((r) => rel.replace(/\\/g, "/").startsWith(r))

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

const changed = new Set(
    execSync("git diff --name-only HEAD", { encoding: "utf8" })
        .split(/\r?\n/)
        .filter(Boolean)
        .map((f) => f.replace(/\\/g, "/")),
)

const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))
const heldPaths = new Set()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) heldPaths.add(String(p).replace(/\\/g, "/"))
}
const isHeld = (rel) => {
    const n = rel.replace(/\\/g, "/")
    for (const h of heldPaths) if (n === h || n.startsWith(h + "/") || n.startsWith(h)) return true
    return false
}

const holes = []
function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, out)
        else if (full.endsWith(".tsx")) out.push(full)
    }
    return out
}
for (const root of [".storybook/components", "src/components"]) {
    for (const file of walk(path.join(ROOT, root))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        for (const { name, tag, line } of frameTags(src)) {
            const tokens = principleTokens(tag)
            if (tokens && tokens.length !== 1) holes.push({ rel, line, name, kind: "multi", changed: changed.has(rel) })
            else if (!tokens && DECISION.test(tag)) holes.push({ rel, line, name, kind: "frame-decision", changed: changed.has(rel), snip: tag.slice(0, 120).replace(/\s+/g, " ") })
        }
        if (!inDesignSystem(rel)) continue
        src.split("\n").forEach((l, i) => {
            if (/^\s*(\*|\/\/|\/\*)/.test(l)) return
            const cm = l.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
            if (!cm || !SPACING.test(cm[1])) return
            if (/\b(?:data-)?principle\b/.test(l)) return
            holes.push({ rel, line: i + 1, name: "raw", kind: "raw-class", changed: changed.has(rel), snip: l.trim().slice(0, 140) })
        })
    }
}

const failing = holes.filter((h) => !isHeld(h.rel))
const inChanged = failing.filter((h) => h.changed)
const preexist = failing.filter((h) => !h.changed)

console.log({
    totalFailing: failing.length,
    inChangedFiles: inChanged.length,
    inUnchangedFiles: preexist.length,
    byKindChanged: inChanged.reduce((a, h) => ((a[h.kind] = (a[h.kind] || 0) + 1), a), {}),
    byKindPre: preexist.reduce((a, h) => ((a[h.kind] = (a[h.kind] || 0) + 1), a), {}),
})
console.log("\n--- sample changed-file holes ---")
for (const h of inChanged.slice(0, 40)) {
    console.log(`${h.rel}:${h.line} [${h.kind}/${h.name}] ${h.snip || ""}`)
}
