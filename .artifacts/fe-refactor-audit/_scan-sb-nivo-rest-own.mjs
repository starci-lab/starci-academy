#!/usr/bin/env node
/**
 * Richer hole dump: own attrs vs nested attrs for sb-nivo-rest.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const holes = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_scan-sb-nivo-rest.json", "utf8"))
const FRAMES = ["StackH", "StackV", "Cluster", "Grid", "Split", "ResponsiveRow", "ResponsiveCluster", "RailShell", "SplitWorkspace", "Reel"]

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

function ownAttrs(tag) {
    // Strip items={...} / body={...} / children={...} payloads so nested padding/justify don't pollute.
    let out = tag
    for (const prop of ["items", "body", "children", "content", "skeleton", "footer", "header"]) {
        const re = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "g")
        let m
        while ((m = re.exec(out))) {
            let i = m.index + m[0].length - 1,
                depth = 0
            for (; i < out.length; i++) {
                if (out[i] === "{") depth++
                else if (out[i] === "}" && --depth === 0) {
                    out = out.slice(0, m.index) + out.slice(i + 1)
                    re.lastIndex = m.index
                    break
                }
            }
        }
    }
    return out
}

const rows = []
for (const h of holes) {
    const src = fs.readFileSync(path.join(ROOT, h.rel), "utf8")
    const match = [...frameTags(src)].find((t) => t.line === h.line && t.name === h.name)
    if (!match) {
        rows.push({ ...h, error: "not found" })
        continue
    }
    const own = ownAttrs(match.tag)
    const ownGap = (own.match(/\bgap\s*=\s*\{?\s*(\d+)/) || [])[1] || ""
    const ownPad = (own.match(/\bpadding\s*=\s*\{?\s*["']?(\d+)/) || [])[1] || ""
    const ownJustify = /\bjustify\s*=/.test(own)
    const ownAlign = /\balign\s*=/.test(own)
    const ownWrap = /\bwrap\s*=/.test(own)
    const ownCols = /\bcolumns\s*=/.test(own)
    const ownAt = /\bat\s*=/.test(own)
    const ownDecision = ownJustify || ownAlign || ownWrap || ownCols || ownAt || Boolean(ownPad)
    const principle = (own.match(/\bprinciple\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\1/) || [])[2] || null
    rows.push({
        rel: h.rel,
        line: h.line,
        name: h.name,
        ownGap,
        ownPad,
        ownJustify,
        ownAlign,
        ownWrap,
        ownCols,
        ownAt,
        ownDecision,
        gateWouldFlag: true,
        principle,
        ownSnippet: own.replace(/\s+/g, " ").slice(0, 160),
        invClass: h.class,
    })
}

fs.writeFileSync(".artifacts/fe-refactor-audit/_scan-sb-nivo-rest-own.json", JSON.stringify(rows, null, 2))

console.log("| file | line | frame | ownGap | ownPad | decisions | invClass |")
console.log("|---|---|---|---|---|---|---|")
for (const r of rows) {
    const dec = [
        r.ownJustify && "justify",
        r.ownAlign && "align",
        r.ownWrap && "wrap",
        r.ownCols && "columns",
        r.ownAt && "at",
        r.ownPad && `pad=${r.ownPad}`,
    ]
        .filter(Boolean)
        .join(",") || (r.ownGap ? "gap-only-false-nested" : "none")
    console.log(`| ${r.rel.split("/").slice(-2).join("/")} | ${r.line} | ${r.name} | ${r.ownGap || "-"} | ${r.ownPad || "-"} | ${dec} | ${r.invClass} |`)
}
console.log("\ntrue padding+gap:", rows.filter((r) => r.ownGap && r.ownPad).length)
console.log("gap-only false nested:", rows.filter((r) => r.ownGap && !r.ownDecision).length)
console.log("real decision:", rows.filter((r) => r.ownDecision).length)
