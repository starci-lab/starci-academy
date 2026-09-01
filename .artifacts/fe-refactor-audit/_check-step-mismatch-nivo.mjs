#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const TOKEN = {
    "name-handle": 1,
    "icon-text": 2,
    "separator-dot": 2,
    "title-subtitle": 2,
    "flex-action": 3,
    "identity": 3,
    "value-row": 3,
    "chip-row": 3,
    "sibling-stack": 3,
    "label-field": 4,
    "content-row": 4,
    "card-caption": 4,
    "group-boundary": 5,
    "block-boundary": 6,
    "layout-split": 7,
    "marketing-beat": 8,
}
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

function strip(tag) {
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

function walk(d, o = []) {
    if (!fs.existsSync(d)) return o
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory()) walk(f, o)
        else if (f.endsWith(".tsx")) o.push(f)
    }
    return o
}

const bad = []
for (const d of [".storybook/components/nivo", ".storybook/components/nivoexpert"]) {
    for (const file of walk(d)) {
        const src = fs.readFileSync(file, "utf8")
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
            const own = strip(tag)
            const p = (own.match(/principle\s*=\s*["']([^"']+)/) || [])[1]
            const gap = (own.match(/gap\s*=\s*\{?(\d+)/) || [])[1]
            if (p && gap && TOKEN[p] != null && String(TOKEN[p]) !== gap) {
                bad.push(
                    `${file.replace(/\\/g, "/")}:L${src.slice(0, m.index).split("\n").length} gap=${gap} ${p}(step${TOKEN[p]})`,
                )
            }
        }
    }
}
console.log("mismatches", bad.length)
for (const x of bad) console.log(x)
