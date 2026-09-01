/**
 * Explain-only burn for require-frame-self-declare.
 * Scans src + .storybook for static principle= without depth-0 explain.
 * Skips locked paths + open teacher-hold paths.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

const EXPLAIN = {
    "cell-pad": "Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.",
    "card-padding": "Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.",
    "page-pad": "Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.",
    "control-pad": "Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.",
    "row-pad": "Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.",
    "pill-pad": "Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.",
    "sibling-stack": "Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups.",
    "group-boundary": "Section group spacing — not sibling-stack, because these blocks are distinct groups rather than section groups.",
    "block-boundary": "Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.",
    "layout-split": "Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks.",
    "marketing-beat": "Marketing section beat — not layout-split, because this is a promotional rhythm rather than a structural page split.",
    "title-subtitle": "Title over supporting line — not label-field, because neither line is a form control label.",
    "label-field": "Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair.",
    "name-handle": "Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle.",
    "icon-text": "Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity.",
    "content-row": "Keeps primary content and trailing meta on one baseline so the meta does not drop under the title.",
    "flex-action": "Groups action controls on one horizontal peer row so they share a single hit baseline.",
    "flex-action-center": "Centers action controls on one peer row so the CTA cluster stays visually balanced.",
    "flex-action-end": "Pins action controls to the trailing edge so primary CTAs stay at the row end.",
    "flex-action-start": "Pins action controls to the leading edge so secondary actions stay at the row start.",
    "flex-action-between": "Spreads action peers across the row so leading and trailing controls stay at opposite edges.",
    "chip-row": "Lets chips share one wrapping row so related tags stay together without stacking as a column.",
    "card-caption": "Holds caption text under card media so the caption stays attached to the image above it.",
    "center-measure": "Caps reading width so long copy does not stretch edge-to-edge across the viewport.",
    "identity": "Keeps avatar and identity text as one peer unit so the person label stays beside the face.",
    "identity-end": "Pins identity peers to the trailing edge so the person chip stays at the row end.",
    "value-row": "Holds a label and its numeric value on one baseline so the count stays readable against the label.",
    "push-end": "Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.",
    "pin-bottom": "Pins this block to the bottom of its parent so the footer action stays visible under scrolling content.",
    "separator-dot": "Places a middle-dot separator between short meta peers so the items read as one inline list.",
    "reel": "Horizontal scroll reel for overflowing peers so the row can scroll instead of wrapping the layout.",
    "sticky-top": "Keeps this bar stuck to the viewport top so navigation remains reachable while the page scrolls.",
    "fixed-bar": "Fixes this bar in the viewport so primary actions remain available over scrolling content.",
    "stack-below": "Stacks this layer below a pinned peer so the flowing content clears the sticky/fixed region.",
}

// Fix group-boundary template to name sibling-stack (already does)
EXPLAIN["group-boundary"] = "Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."

const SPACING_CN = /\b(gap-[1-9]\d*|p-[1-9]\d*|px-[1-9]\d*|py-[1-9]\d*|pt-[1-9]\d*|pb-[1-9]\d*|pl-[1-9]\d*|pr-[1-9]\d*|m-[1-9]\d*|mx-auto|ml-auto|mt-auto|mb-auto)\b/
const PRINCIPLE_RE = /(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g

const LOCKED = [
    /MockInterviewPage\/MockInterviewSession\//,
    /FlashcardsPage\/QuizSession\//,
    /LandingPage\/LearnLoopScroll\//,
    /blocks\/learn\/ContentAiChat\//,
    /blocks\/marketing\/ArchitectureScene\//,
    /\.storybook\/utils\/BlockAnatomy\//,
    /\/nivoexpert\//,
    /\/nivo\//,
    /src\/resources\//,
]

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))
const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        holdPaths.set(String(p).replace(/\\/g, "/").replace(/:\d+$/, ""), d.id)
    }
}

function holdId(file) {
    const f = file.replace(/\\/g, "/")
    for (const [hp, id] of holdPaths) {
        if (f === hp || f.startsWith(hp + "/") || f.includes(hp)) return id
    }
    return null
}
function isLocked(file) {
    return LOCKED.some((re) => re.test(file.replace(/\\/g, "/")))
}

function walk(dir, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name)
        if (ent.isDirectory()) {
            if (ent.name === "node_modules" || ent.name === ".git") continue
            walk(p, out)
        } else if (/\.tsx?$/.test(ent.name)) out.push(p.replace(/\\/g, "/"))
    }
    return out
}

function scanOpening(src, from) {
    let depth = 0, inStr = null, end = -1, attrText = ""
    for (let j = from; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") { j++; continue }
            if (ch === inStr) inStr = null
            if (depth === 0) attrText += ch
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") { inStr = ch; if (depth === 0) attrText += ch; continue }
        if (ch === "{") { depth++; continue }
        if (ch === "}") { depth = Math.max(0, depth - 1); continue }
        if (depth === 0 && ch === ">") { end = j; break }
        if (depth === 0) attrText += ch
    }
    if (end < 0) return null
    return { end, attrText, hasExplain: /(?<![\w-])explain\s*=/.test(attrText) }
}

function insertExplain(src, index, token, quote) {
    const principleLit = `principle=${quote}${token}${quote}`
    if (src.slice(index, index + principleLit.length) !== principleLit) return null
    const text = EXPLAIN[token]
    if (!text) return null
    const scanned = scanOpening(src, index)
    if (!scanned || scanned.hasExplain) return null

    const insertAt = index + principleLit.length
    const lineStart = src.lastIndexOf("\n", index) + 1
    const indent = src.slice(lineStart).match(/^\s*/)[0]
    const explainLit = `explain=${quote}${text}${quote}`

    // Keep spacing className with principle on SAME line
    const after = src.slice(insertAt)
    const cnMatch = after.match(/^\s+(className=(?:"[^"]*"|`[^`]*`|'[^']*'))/)
    if (cnMatch && SPACING_CN.test(cnMatch[1])) {
        const cnEnd = insertAt + cnMatch[0].length
        const lineEnd = src.indexOf("\n", cnEnd)
        const endIdx = lineEnd === -1 ? src.length : lineEnd
        const rest = src.slice(cnEnd, endIdx)
        const closerOnly = rest.match(/^(\s*\/?\s*>)\s*$/)
        if (closerOnly) {
            return src.slice(0, cnEnd) + `\n${indent}${explainLit}` + closerOnly[1] + src.slice(endIdx)
        }
        const closer = rest.match(/(\s*\/?\s*>)\s*$/)
        let main = rest, cl = ""
        if (closer) { cl = closer[1]; main = rest.slice(0, -cl.length) }
        return src.slice(0, cnEnd) + `\n${indent}${explainLit}` + (main.trim() ? `\n${indent}${main.trimStart()}` : "") + cl + src.slice(endIdx)
    }

    const lineEnd = src.indexOf("\n", insertAt)
    const endIdx = lineEnd === -1 ? src.length : lineEnd
    const rest = src.slice(insertAt, endIdx)
    const closer = rest.match(/(\s*\/?\s*>)\s*$/)
    let main = rest, cl = ""
    if (closer) { cl = closer[1]; main = rest.slice(0, -cl.length) }
    if (main.trim()) {
        return src.slice(0, insertAt) + `\n${indent}${explainLit}` + `\n${indent}${main.trimStart()}` + cl + src.slice(endIdx)
    }
    return src.slice(0, insertAt) + `\n${indent}${explainLit}` + cl + src.slice(endIdx)
}

const files = [...walk("src"), ...walk(".storybook")].sort((a, b) => {
    const ak = a.startsWith(".storybook/") ? "0:" + a : "1:" + a
    const bk = b.startsWith(".storybook/") ? "0:" + b : "1:" + b
    return ak.localeCompare(bk)
})

let beforeUnlocked = 0, beforeLocked = 0, beforeHold = 0, beforeMissingTemplate = 0
let fixed = 0
const changed = []
const tokenCounts = new Map()
const skippedHard = []

for (const file of files) {
    if (isLocked(file)) {
    // still count
        const src = fs.readFileSync(file, "utf8")
        let m; const re = new RegExp(PRINCIPLE_RE.source, "g")
        while ((m = re.exec(src))) {
            const sc = scanOpening(src, m.index)
            if (sc && !sc.hasExplain) beforeLocked++
        }
        continue
    }
    const hid = holdId(file)
    if (hid) {
        const src = fs.readFileSync(file, "utf8")
        let m; const re = new RegExp(PRINCIPLE_RE.source, "g")
        while ((m = re.exec(src))) {
            const sc = scanOpening(src, m.index)
            if (sc && !sc.hasExplain) beforeHold++
        }
        continue
    }

    let src = fs.readFileSync(file, "utf8")
    const sites = []
    let m
    const re = new RegExp(PRINCIPLE_RE.source, "g")
    while ((m = re.exec(src))) {
        const sc = scanOpening(src, m.index)
        if (!sc || sc.hasExplain) continue
        const token = m[2]
        beforeUnlocked++
        if (!EXPLAIN[token]) {
            beforeMissingTemplate++
            skippedHard.push({ file, token, reason: "no-template" })
            continue
        }
        sites.push({ index: m.index, token, quote: m[1] })
    }

    let fileFixed = 0
    for (const s of sites.sort((a, b) => b.index - a.index)) {
        const next = insertExplain(src, s.index, s.token, s.quote)
        if (!next) {
            skippedHard.push({ file, token: s.token, reason: "insert-failed" })
            continue
        }
        src = next
        fileFixed++
        fixed++
        tokenCounts.set(s.token, (tokenCounts.get(s.token) || 0) + 1)
    }

    if (fileFixed > 0) {
        fs.writeFileSync(file, src)
        changed.push({ file, fixed: fileFixed })
    }
}

const report = {
    before: { unlocked: beforeUnlocked, locked: beforeLocked, hold: beforeHold, missingTemplate: beforeMissingTemplate },
    fixed,
    changedFiles: changed.length,
    files: changed.map((c) => c.file),
    tokenCounts: Object.fromEntries([...tokenCounts.entries()].sort((a, b) => b[1] - a[1])),
    skippedHard: skippedHard.slice(0, 40),
    skippedHardCount: skippedHard.length,
}

fs.mkdirSync(".artifacts/fe-refactor-audit", { recursive: true })
fs.writeFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
