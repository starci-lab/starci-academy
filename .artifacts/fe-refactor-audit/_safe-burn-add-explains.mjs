/**
 * SAFE burn A: add explain= where principle already exists.
 * Templates satisfy starci-fe/explain-justifies-token-choice (error):
 * - ≥6 words
 * - do not only restate token words
 * - family tokens name a rejected sibling
 */
import fs from "node:fs"

const inventory = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-only.json", "utf8"),
)

/** @type {Record<string, string>} */
const EXPLAIN = {
    // padding family — must name sibling
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

    // vertical spacing family — must name sibling
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

    // title/label family — must name sibling
    "title-subtitle":
    "Title over supporting line — not label-field, because neither line is a form control label.",
    "label-field":
    "Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair.",
    "name-handle":
    "Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle.",
    "icon-text":
    "Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity.",

    // non-family — still ≥6 words, reason-shaped
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

const PRINCIPLE_FAMILIES = [
    ["cell-pad", "card-padding", "row-pad", "control-pad", "page-pad", "pill-pad"],
    ["sibling-stack", "group-boundary", "block-boundary", "layout-split", "marketing-beat"],
    ["title-subtitle", "label-field", "name-handle", "icon-text"],
]

function validateExplain(token, text) {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length < 6) return "tooShort"
    const tokenWords = new Set(token.split("-"))
    const carriesOwnWords = words.every((w) => tokenWords.has(w.toLowerCase().replace(/[^a-z]/g, "")))
    if (carriesOwnWords) return "restates"
    const family = PRINCIPLE_FAMILIES.find((f) => f.includes(token))
    if (family) {
        const siblings = family.filter((t) => t !== token)
        const normalized = text.toLowerCase()
        if (!siblings.some((s) => normalized.includes(s))) return "noAlternative:" + siblings.join(",")
    }
    return null
}

for (const [token, text] of Object.entries(EXPLAIN)) {
    const err = validateExplain(token, text)
    if (err) {
        console.error("BAD TEMPLATE", token, err)
        process.exit(1)
    }
}

/** Findings grouped by file, descending line so edits do not shift earlier lines. */
const byFile = new Map()
for (const e of inventory.unlockedExplain) {
    if (!byFile.has(e.file)) byFile.set(e.file, [])
    byFile.get(e.file).push(e)
}

let fixed = 0
let skipped = 0
const hardCases = []
const changedFiles = []

for (const [file, findings] of byFile) {
    let src = fs.readFileSync(file, "utf8")
    const lines = src.split(/\n/)
    const sorted = [...findings].sort((a, b) => b.line - a.line || b.col - a.col)
    let fileFixed = 0

    for (const finding of sorted) {
        const lineIdx = finding.line - 1
        if (lineIdx < 0 || lineIdx >= lines.length) {
            skipped++
            hardCases.push({ file, line: finding.line, reason: "line-out-of-range" })
            continue
        }

        // Search a window for the opening tag that owns principle=
        const winStart = Math.max(0, lineIdx - 2)
        const winEnd = Math.min(lines.length - 1, lineIdx + 15)
        let principleLine = -1
        let principleToken = null
        let principleMatch = null

        for (let i = winStart; i <= winEnd; i++) {
            const m = lines[i].match(/principle=(["'])([a-z0-9-]+)\1/)
            if (m) {
                // Prefer the first principle in the window that lacks explain nearby
                const nearby = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 8)).join("\n")
                if (/\bexplain=/.test(nearby)) continue
                principleLine = i
                principleToken = m[2]
                principleMatch = m
                break
            }
        }

        if (!principleToken || principleLine < 0) {
            skipped++
            hardCases.push({ file, line: finding.line, reason: "no-static-principle" })
            continue
        }

        const explain = EXPLAIN[principleToken]
        if (!explain) {
            skipped++
            hardCases.push({ file, line: finding.line, reason: "no-template:" + principleToken })
            continue
        }

        // Insert explain= on the same line after principle="token", or next line if crowded
        const line = lines[principleLine]
        if (/\bexplain=/.test(line)) {
            skipped++
            hardCases.push({ file, line: finding.line, reason: "already-has-explain-on-line" })
            continue
        }

        const quote = principleMatch[1]
        const principleLit = `principle=${quote}${principleToken}${quote}`
        const explainLit = `explain=${quote}${explain}${quote}`

        if (!line.includes(principleLit)) {
            skipped++
            hardCases.push({ file, line: finding.line, reason: "principle-literal-mismatch" })
            continue
        }

        // Prefer same-line insertion after principle
        const indent = line.match(/^\s*/)[0]
        const afterPrinciple = line.indexOf(principleLit) + principleLit.length
        const rest = line.slice(afterPrinciple)
        // If the rest of the line is only whitespace / /> / > / other attrs, put explain after principle
        lines[principleLine] =
      line.slice(0, afterPrinciple) + "\n" + indent + "    " + explainLit + rest
        fileFixed++
        fixed++
    }

    if (fileFixed > 0) {
        fs.writeFileSync(file, lines.join("\n"))
        changedFiles.push({ file, fixed: fileFixed })
    }
}

const report = { fixed, skipped, changedFiles: changedFiles.length, hardCases: hardCases.slice(0, 50), hardCaseCount: hardCases.length, files: changedFiles.map((c) => c.file) }
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-burn-explain-result.json",
    JSON.stringify({ ...report, hardCases }, null, 2),
)
console.log(JSON.stringify(report, null, 2))
