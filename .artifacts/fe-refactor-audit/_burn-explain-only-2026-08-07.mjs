/**
 * Burn explain-only require-frame-self-declare debt.
 * Targets unlocked sites from _explain-only-unlocked.json.
 * Keeps principle + spacing className on the same line; explain on next line (or after className).
 */
import fs from "node:fs"

const EXPLAIN = {
    "cell-pad":
        "Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.",
    "card-padding":
        "Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.",
    "page-pad":
        "Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.",
    "control-pad":
        "Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.",
    "row-pad":
        "Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.",
    "pill-pad":
        "Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.",
    "sibling-stack":
        "Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups.",
    "group-boundary":
        "Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers.",
    "block-boundary":
        "Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.",
    "layout-split":
        "Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks.",
    "marketing-beat":
        "Marketing section beat — not layout-split, because this is a promotional rhythm rather than a structural page split.",
    "title-subtitle":
        "Title over supporting line — not label-field, because neither line is a form control label.",
    "label-field":
        "Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair.",
    "name-handle":
        "Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle.",
    "icon-text":
        "Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity.",
    "content-row":
        "Keeps primary content and trailing meta on one baseline so the meta does not drop under the title.",
    "flex-action":
        "Groups action controls on one horizontal peer row so they share a single hit baseline.",
    "flex-action-center":
        "Centers action controls on one peer row so the CTA cluster stays visually balanced.",
    "flex-action-end":
        "Pins action controls to the trailing edge so primary CTAs stay at the row end.",
    "flex-action-start":
        "Pins action controls to the leading edge so secondary actions stay at the row start.",
    "flex-action-between":
        "Spreads action peers across the row so leading and trailing controls stay at opposite edges.",
    "chip-row":
        "Lets chips share one wrapping row so related tags stay together without stacking as a column.",
    "card-caption":
        "Holds caption text under card media so the caption stays attached to the image above it.",
    "center-measure":
        "Caps reading width so long copy does not stretch edge-to-edge across the viewport.",
    "identity":
        "Keeps avatar and identity text as one peer unit so the person label stays beside the face.",
    "identity-end":
        "Pins identity peers to the trailing edge so the person chip stays at the row end.",
    "value-row":
        "Holds a label and its numeric value on one baseline so the count stays readable against the label.",
    "push-end":
        "Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.",
    "pin-bottom":
        "Pins this block to the bottom of its parent so the footer action stays visible under scrolling content.",
    "separator-dot":
        "Places a middle-dot separator between short meta peers so the items read as one inline list.",
    "reel":
        "Horizontal scroll reel for overflowing peers so the row can scroll instead of wrapping the layout.",
    "sticky-top":
        "Keeps this bar stuck to the viewport top so navigation remains reachable while the page scrolls.",
    "fixed-bar":
        "Fixes this bar in the viewport so primary actions remain available over scrolling content.",
    "stack-below":
        "Stacks this layer below a pinned peer so the flowing content clears the sticky/fixed region.",
}

const PRINCIPLE_RE = /(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g
const SPACING_CN =
    /\b(gap-[1-9]\d*|p-[1-9]\d*|px-[1-9]\d*|py-[1-9]\d*|pt-[1-9]\d*|pb-[1-9]\d*|pl-[1-9]\d*|pr-[1-9]\d*|m-[1-9]\d*|mx-auto|ml-auto|mt-auto|mb-auto)\b/

function scanOpening(src, from) {
    let depth = 0,
        inStr = null,
        end = -1,
        attrText = ""
    for (let j = from; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") {
                j++
                continue
            }
            if (ch === inStr) inStr = null
            if (depth === 0) attrText += ch
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") {
            inStr = ch
            if (depth === 0) attrText += ch
            continue
        }
        if (ch === "{") {
            depth++
            continue
        }
        if (ch === "}") {
            depth = Math.max(0, depth - 1)
            continue
        }
        if (depth === 0 && ch === ">") {
            end = j
            break
        }
        if (depth === 0) attrText += ch
    }
    if (end < 0) return null
    return { hasExplain: /(?<![\w-])explain\s*=/.test(attrText), end }
}

/** SAFE insert: never peel > unless rest is ONLY optional slash+> */
function insertExplain(src, index, token, quote) {
    const lit = `principle=${quote}${token}${quote}`
    if (src.slice(index, index + lit.length) !== lit) return null
    const text = EXPLAIN[token]
    if (!text) return null
    if (scanOpening(src, index)?.hasExplain) return null
    const insertAt = index + lit.length
    const lineStart = src.lastIndexOf("\n", index) + 1
    const indent = src.slice(lineStart).match(/^\s*/)[0]
    const explainLit = `explain=${quote}${text}${quote}`
    const after = src.slice(insertAt)
    const cnMatch = after.match(/^\s+(className(?:s)?=(?:"[^"]*"|`[^`]*`|'[^']*'))/)
    if (cnMatch && SPACING_CN.test(cnMatch[1])) {
        const cnEnd = insertAt + cnMatch[0].length
        const lineEnd = src.indexOf("\n", cnEnd)
        const endIdx = lineEnd === -1 ? src.length : lineEnd
        const rest = src.slice(cnEnd, endIdx)
        if (/^\s*\/?\s*>\s*$/.test(rest)) {
            return (
                src.slice(0, cnEnd) +
                `\n${indent}${explainLit}` +
                rest.replace(/\s*$/, "") +
                src.slice(endIdx)
            )
        }
        return src.slice(0, cnEnd) + `\n${indent}${explainLit}` + src.slice(cnEnd)
    }
    const lineEnd = src.indexOf("\n", insertAt)
    const endIdx = lineEnd === -1 ? src.length : lineEnd
    const rest = src.slice(insertAt, endIdx)
    if (/^\s*\/?\s*>\s*$/.test(rest)) {
        return (
            src.slice(0, insertAt) +
            `\n${indent}${explainLit}` +
            rest.replace(/\s*$/, "") +
            src.slice(endIdx)
        )
    }
    if (rest.trim()) {
        return src.slice(0, endIdx) + `\n${indent}${explainLit}` + src.slice(endIdx)
    }
    return src.slice(0, insertAt) + `\n${indent}${explainLit}` + src.slice(insertAt)
}

const inventory = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_explain-only-unlocked.json", "utf8"),
)

const files = [...new Set(inventory.hits.map((h) => h.file))].filter((f) => fs.existsSync(f))

let fixed = 0
let skippedAlready = 0
const hardCases = []
const changed = []

for (const file of files) {
    let src = fs.readFileSync(file, "utf8")
    const sites = []
    let m
    const re = new RegExp(PRINCIPLE_RE.source, "g")
    while ((m = re.exec(src))) {
        const sc = scanOpening(src, m.index)
        if (!sc || sc.hasExplain) continue
        if (!EXPLAIN[m[2]]) {
            hardCases.push({ file, token: m[2], reason: "no-template" })
            continue
        }
        sites.push({ index: m.index, token: m[2], quote: m[1] })
    }

    // Only fix sites that appear near inventory lines (within ±3) to avoid over-touching
    const inventoryLines = new Set(
        inventory.hits.filter((h) => h.file === file).map((h) => h.line),
    )
    const lineAt = (index) => src.slice(0, index).split(/\n/).length

    let fileFixed = 0
    for (const s of sites.sort((a, b) => b.index - a.index)) {
        const line = lineAt(s.index)
        const nearInventory = [...inventoryLines].some((L) => Math.abs(L - line) <= 3)
        if (!nearInventory) {
            // Still missing explain but not in our inventory — leave alone (may be post-baseline)
            continue
        }
        const next = insertExplain(src, s.index, s.token, s.quote)
        if (!next) {
            skippedAlready++
            continue
        }
        src = next
        fileFixed++
        fixed++
    }
    if (fileFixed) {
        fs.writeFileSync(file, src)
        changed.push({ file, fileFixed })
    }
}

const report = {
    unlockedTarget: inventory.total,
    filesScanned: files.length,
    fixed,
    skippedAlready,
    hardCases: hardCases.slice(0, 40),
    hardCaseCount: hardCases.length,
    changedFiles: changed.length,
    changed,
}
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
