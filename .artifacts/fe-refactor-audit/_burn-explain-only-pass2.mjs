/**
 * Pass 2: line-based explain insert for sites where tag-scan fails
 * (large items={...} / body={...} trees that never close at depth 0).
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

const SPACING_CN =
    /\b(gap-[1-9]\d*|p-[1-9]\d*|px-[1-9]\d*|py-[1-9]\d*|pt-[1-9]\d*|pb-[1-9]\d*|pl-[1-9]\d*|pr-[1-9]\d*|m-[1-9]\d*|mx-auto|ml-auto|mt-auto|mb-auto)\b/

const inventory = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_explain-only-unlocked.json", "utf8"),
)

const byFile = new Map()
for (const h of inventory.hits) {
    if (!byFile.has(h.file)) byFile.set(h.file, [])
    byFile.get(h.file).push(h.line)
}

let fixed = 0
const hardCases = []
const changed = []

for (const [file, eslintLines] of byFile) {
    if (!fs.existsSync(file)) continue
    const raw = fs.readFileSync(file, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    let fileFixed = 0

    // Collect principle lines that lack a nearby explain, near inventory eslint lines
    const targets = []
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/(?<![\w-])principle=(["'])([a-z0-9-]+)\1/)
        if (!m) continue
        // dynamic principle={...} already excluded by regex requiring quotes
        const nearbyExplain = lines.slice(i, Math.min(lines.length, i + 3)).some((l) => /(?<![\w-])explain\s*=/.test(l))
        if (nearbyExplain) continue
        const lineNo = i + 1
        const nearInv = eslintLines.some((L) => Math.abs(L - lineNo) <= 5)
        if (!nearInv) continue
        if (!EXPLAIN[m[2]]) {
            hardCases.push({ file, line: lineNo, reason: "no-template:" + m[2] })
            continue
        }
        targets.push({ idx: i, token: m[2], quote: m[1] })
    }

    // Insert descending so later indices stay valid
    for (const t of targets.sort((a, b) => b.idx - a.idx)) {
        const line = lines[t.idx]
        const lit = `principle=${t.quote}${t.token}${t.quote}`
        const explainLit = `explain=${t.quote}${EXPLAIN[t.token]}${t.quote}`
        const indent = line.match(/^\s*/)[0]
        const at = line.indexOf(lit)
        if (at < 0) {
            hardCases.push({ file, line: t.idx + 1, reason: "literal-miss" })
            continue
        }
        const after = line.slice(at + lit.length)

        // Keep principle + spacing className(s) on SAME line; put explain on next line.
        const cnMatch = after.match(/^\s+(className(?:s)?=(?:"[^"]*"|`[^`]*`|'[^']*'))/)
        if (cnMatch && SPACING_CN.test(cnMatch[1])) {
            const cnEnd = at + lit.length + cnMatch[0].length
            const before = line.slice(0, cnEnd)
            const rest = line.slice(cnEnd)
            lines.splice(t.idx, 1, before, indent + explainLit + rest)
        } else {
            // Insert explain on the next line; keep rest of principle line intact
            // (items=/body=/other attrs stay with principle)
            lines.splice(t.idx + 1, 0, indent + explainLit)
        }
        fileFixed++
        fixed++
    }

    if (fileFixed) {
        fs.writeFileSync(file, lines.join(nl))
        changed.push({ file, fileFixed })
    }
}

const report = { fixed, changedFiles: changed.length, changed, hardCases }
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
