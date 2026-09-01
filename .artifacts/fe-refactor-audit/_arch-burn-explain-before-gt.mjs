import fs from "node:fs"

const EXPLAIN = JSON.parse(fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-templates.json","utf8")).EXPLAIN
// templates may be missing if file gone - inline minimal set if needed
const E = EXPLAIN || {
    "content-row": "Keeps primary content and trailing meta on one baseline so the meta does not drop under the title.",
    "sibling-stack": "Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups.",
    "group-boundary": "Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers.",
    "block-boundary": "Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.",
    "layout-split": "Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks.",
    "title-subtitle": "Title over supporting line — not label-field, because neither line is a form control label.",
    "label-field": "Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair.",
    "name-handle": "Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle.",
    "icon-text": "Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity.",
    "flex-action": "Groups action controls on one horizontal peer row so they share a single hit baseline.",
    "flex-action-end": "Pins action controls to the trailing edge so primary CTAs stay at the row end.",
    "flex-action-start": "Pins action controls to the leading edge so secondary actions stay at the row start.",
    "flex-action-between": "Spreads action peers across the row so leading and trailing controls stay at opposite edges.",
    "chip-row": "Lets chips share one wrapping row so related tags stay together without stacking as a column.",
    "card-caption": "Holds caption text under card media so the caption stays attached to the image above it.",
    "center-measure": "Caps reading width so long copy does not stretch edge-to-edge across the viewport.",
    "identity": "Keeps avatar and identity text as one peer unit so the person label stays beside the face.",
    "value-row": "Holds a label and its numeric value on one baseline so the count stays readable against the label.",
    "push-end": "Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.",
    "cell-pad": "Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.",
    "card-padding": "Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.",
    "page-pad": "Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.",
    "control-pad": "Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.",
    "row-pad": "Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.",
    "pill-pad": "Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.",
    "separator-dot": "Places a middle-dot separator between short meta peers so the items read as one inline list.",
}

const PRINCIPLE_RE = /(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g
const SPACING_CN = /\b(gap-[1-9]\d*|p-[1-9]\d*|px-[1-9]\d*|py-[1-9]\d*|pt-[1-9]\d*|pb-[1-9]\d*|pl-[1-9]\d*|pr-[1-9]\d*|m-[1-9]\d*|mx-auto|ml-auto|mt-auto|mb-auto)\b/

function findOpeningEnd(src, from) {
    let depth = 0, inStr = null
    for (let j = from; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") { j++; continue }
            if (ch === inStr) inStr = null
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") { inStr = ch; continue }
        if (ch === "{") { depth++; continue }
        if (ch === "}") { depth = Math.max(0, depth - 1); continue }
        if (depth === 0 && ch === ">") return j
    }
    return -1
}

function hasExplainInOpening(src, from, end) {
    // depth-0 attr text only
    let depth = 0, inStr = null, attr = ""
    for (let j = from; j < end; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") { j++; continue }
            if (ch === inStr) inStr = null
            if (depth === 0) attr += ch
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") { inStr = ch; if (depth === 0) attr += ch; continue }
        if (ch === "{") { depth++; continue }
        if (ch === "}") { depth = Math.max(0, depth - 1); continue }
        if (depth === 0) attr += ch
    }
    return /(?<![\w-])explain\s*=/.test(attr)
}

function insertBeforeCloser(src, principleIndex, token, quote) {
    const lit = `principle=${quote}${token}${quote}`
    if (src.slice(principleIndex, principleIndex + lit.length) !== lit) return null
    const text = E[token]
    if (!text) return null
    const end = findOpeningEnd(src, principleIndex)
    if (end < 0) return null
    if (hasExplainInOpening(src, principleIndex, end)) return null

    const lineStart = src.lastIndexOf("\n", principleIndex) + 1
    const indent = src.slice(lineStart).match(/^\s*/)[0]
    const explainLit = `explain=${quote}${text}${quote}`

    // Prefer: keep principle + spacing className on same line; put explain on its own line before >
    // Check if principle and spacing className share a physical line ending before `end`
    const principleLineEnd = src.indexOf("\n", principleIndex)
    const sameLineAsPrinciple = principleLineEnd === -1 || principleLineEnd > end || principleLineEnd === -1

    // Insert immediately before opening `>`
    // Format: \n${indent}${explainLit} just before >
    // If the character before > is whitespace/newline already, still fine
    const before = src.slice(0, end)
    const after = src.slice(end) // starts with >
    // If principle line also has spacing className before end on same line, good.
    return before + `\n${indent}${explainLit}` + after
}

const files = fs.readFileSync(".artifacts/fe-refactor-audit/_tsc-parse-broken.txt","utf8")
    .split(/\n/).map(s=>s.replace(/^\uFEFF/,"").trim()).filter(Boolean)

let fixed=0
const changed=[]
for (const file of files) {
    if (!fs.existsSync(file)) continue
    let src = fs.readFileSync(file,"utf8")
    const sites=[]
    let m; const re=new RegExp(PRINCIPLE_RE.source,"g")
    while ((m=re.exec(src))) {
        if (!E[m[2]]) continue
        const end = findOpeningEnd(src, m.index)
        if (end < 0) continue
        if (hasExplainInOpening(src, m.index, end)) continue
        sites.push({index:m.index, token:m[2], quote:m[1]})
    }
    let n=0
    for (const s of sites.sort((a,b)=>b.index-a.index)) {
        const next = insertBeforeCloser(src, s.index, s.token, s.quote)
        if (!next) continue
        src = next; n++; fixed++
    }
    if (n) { fs.writeFileSync(file, src); changed.push({file,n}) }
}
console.log(JSON.stringify({files:files.length, fixed, changedFiles:changed.length, changed},null,2))
