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

const dirs = [
    ".storybook/components/nivo",
    ".storybook/components/nivoexpert",
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

function stripNestedProps(tag) {
    let out = tag
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g")
        let m
        while ((m = re.exec(out))) {
            let i = m.index + m[0].length - 1
            let d = 0
            for (; i < out.length; i++) {
                if (out[i] === "{") d++
                else if (out[i] === "}" && --d === 0) {
                    out = out.slice(0, m.index) + out.slice(i + 1)
                    re.lastIndex = m.index
                    break
                }
            }
        }
    }
    return out
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

function principleCount(own) {
    const array = own.match(/\bprinciple\s*=\s*\{\s*\[([^\]]*)\]/)
    if (array) return [...array[1].matchAll(/["'`]([^"'`]+)["'`]/g)].length
    const lit = own.match(/\bprinciple\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\1/)
    if (lit) return lit[2].trim().split(/\s+/).filter(Boolean).length
    const data = own.match(/\bdata-principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\1/)
    if (data) return data[2].trim().split(/\s+/).filter(Boolean).length
    if (/\bprinciple\s*=/.test(own) || /\bdata-principle\s*=/.test(own)) return 1
    return 0
}

const holes = []
for (const d of dirs) {
    for (const file of walk(path.join(ROOT, d))) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(ROOT, file).replace(/\\/g, "/")
        for (const { name, tag, line } of frameTags(src)) {
            const own = stripNestedProps(tag)
            const n = principleCount(own)
            if (n === 1) continue
            if (n > 1) {
                holes.push({
                    rel,
                    line,
                    name,
                    kind: "multi",
                    gap: "",
                    own: own.replace(/\s+/g, " ").slice(0, 200),
                })
                continue
            }
            if (!DECISION.test(own)) continue
            const gap = (own.match(/\bgap\s*=\s*\{?\s*(\d+)/) || [])[1] || ""
            const cols = (own.match(/\bcolumns\s*=/) || [])[0] ? "yes" : ""
            const just = (own.match(/\bjustify\s*=/) || [])[0] ? "yes" : ""
            const align = (own.match(/\balign\s*=/) || [])[0] ? "yes" : ""
            holes.push({
                rel,
                line,
                name,
                kind: "decision",
                gap,
                cols,
                just,
                align,
                own: own.replace(/\s+/g, " ").slice(0, 220),
            })
        }
        // raw spacing classNames under design-system path
        if (rel.includes("composites/form/InputTags")) {
            const re = /className\s*=\s*(?:\{`|"|'|\{")[^"'`]*\b(?:gap|p|px|py|pt|pb|pl|pr)-\d/g
            let m
            while ((m = re.exec(src))) {
                holes.push({
                    rel,
                    line: src.slice(0, m.index).split("\n").length,
                    name: "raw",
                    kind: "raw",
                    gap: "",
                    own: src.slice(m.index, m.index + 100).replace(/\s+/g, " "),
                })
            }
        }
    }
}

console.log(JSON.stringify(holes, null, 2))
console.log("TOTAL", holes.length)
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_remaining-nivo-holes.json",
    JSON.stringify(holes, null, 2),
)
