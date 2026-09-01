#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]
const TOKEN_STEP = {
    "name-handle": 1, "icon-text": 2, "separator-dot": 2, "title-subtitle": 2,
    "flex-action": 3, "identity": 3, "value-row": 3, "chip-row": 3, "sibling-stack": 3,
    "label-field": 4, "content-row": 4, "card-caption": 4,
    "group-boundary": 5, "block-boundary": 6, "layout-split": 7, "marketing-beat": 8,
}
const dirs = [
    ".storybook/components/nivo/blocks/expert-site",
    ".storybook/components/nivo/blocks/agent-os",
    ".storybook/components/nivo/blocks/catalog",
    ".storybook/components/nivo/pages/CatalogView",
    ".storybook/components/nivo/pages/ExpertSiteView",
    ".storybook/components/nivo/blocks/wallet",
    ".storybook/components/nivo/blocks/account",
    ".storybook/components/nivo/blocks/dashboard",
    ".storybook/components/nivo/blocks/support",
    ".storybook/components/nivo/blocks/billing",
    ".storybook/components/nivo/pages/Dashboard",
    ".storybook/components/nivo/pages/AgentOsConsole",
    ".storybook/components/nivo/pages/ControlPlaneOverview",
    ".storybook/components/nivo/pages/ExpertSiteOverview",
    ".storybook/components/nivo/blocks/domains",
]

function strip(tag) {
    let out = tag
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g")
        let m
        while ((m = re.exec(out))) {
            let i = m.index + m[0].length - 1, d = 0
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

function* frames(src) {
    const re = new RegExp(`<(${FRAMES.join("|")})(\\s)`, "g")
    let m
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length - 1, d = 0
        for (; i < src.length; i++) {
            const c = src[i]
            if (c === "{") d++
            else if (c === "}") d--
            else if (c === ">" && d === 0) break
        }
        yield { name: m[1], tag: src.slice(m.index, i + 1), line: src.slice(0, m.index).split("\n").length }
    }
}

function walk(d, o = []) {
    if (!fs.existsSync(d)) return o
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory()) walk(f, o)
        else if (f.endsWith(".tsx")) o.push(f)
    }
    return o
}

const mismatches = []
for (const d of dirs) {
    for (const file of walk(d)) {
        const src = fs.readFileSync(file, "utf8")
        const rel = path.relative(".", file).replace(/\\/g, "/")
        for (const { name, tag, line } of frames(src)) {
            const own = strip(tag)
            const p = (own.match(/principle\s*=\s*["']([^"']+)/) || [])[1]
            if (!p) continue
            const gap = (own.match(/gap\s*=\s*\{?(\d+)/) || [])[1]
            if (!gap) continue
            const step = TOKEN_STEP[p]
            if (step && String(step) !== gap) {
                mismatches.push({ rel, line, name, gap, p, step })
            }
        }
    }
}
console.log("step mismatches", mismatches.length)
for (const m of mismatches) {
    console.log(`${m.rel}:L${m.line} gap=${m.gap} ${m.p}(step${m.step})`)
}
