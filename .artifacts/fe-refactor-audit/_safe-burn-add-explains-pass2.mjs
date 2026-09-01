/**
 * Second pass: for every JSX opening that has principle="…" but no explain= in the
 * same opening tag (until `>` / `/>`), insert a template explain on the next line.
 * Also normalizes awkward same-line / over-indented explains from pass 1.
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
    "Section group spacing — not sibling-stack, because these blocks are distinct groups rather than nested section groups.",
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

const FRAME = /\b(Box|Cluster|Container|Flex|Grid|PinnedTrack|RailShell|ResponsiveCluster|ResponsiveRow|ScrollArea|Split|SplitWorkspace|Stack|StackH|StackV|Stage|Surface)\b/

const locked = [
    /MockInterviewSession/,
    /QuizSession/,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /nivoexpert\//,
    /\/nivo\//,
]

const holdPaths = new Set()
const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))
for (const d of ledger.decisions.filter((x) => x.status === "open")) {
    for (const p of [d.path, ...(d.paths || [])].filter(Boolean)) {
        holdPaths.add(String(p).replace(/:\d+$/, "").replace(/\\/g, "/"))
    }
}

const result = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-result.json", "utf8"),
)
const files = new Set(result.files)
// also scan hard-case files from pass 1
for (const h of result.hardCases) files.add(h.file)

let fixed = 0
let skippedDynamic = 0
const changed = []

for (const file of [...files].sort()) {
    if (locked.some((r) => r.test(file))) continue
    if (holdPaths.has(file)) continue
    if (!fs.existsSync(file)) continue

    let src = fs.readFileSync(file, "utf8")
    // Normalize pass-1 artifacts: explain jammed on same line after principle mid-attr soup
    // and over-indented explain-only lines (principle line + 4 spaces extra).
    src = src.replace(
        /(principle=["'][a-z0-9-]+["'])\s*\n(\s+)explain=/g,
        (m, princ, indent) => {
            // prefer explain indented exactly like sibling attrs: same as principle line indent + typical 4? 
            // Keep indent of the principle line by stripping one level if over-indented relative to previous.
            return `${princ}\n${indent.replace(/^ {4}/, "")}explain=`
        },
    )

    // Fix jammed: principle="x" explain="..." items=  OR principle="x"\n explain on weird places
    // Split inline Cluster cases: principle="chip-row"\n        explain="..." items=
    // Already handled.

    const lines = src.split(/\n/)
    const out = []
    let fileFixed = 0

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        // Detect principle="token" on this line
        const m = line.match(/principle=(["'])([a-z0-9-]+)\1/)
        if (!m) {
            out.push(line)
            continue
        }

        const token = m[2]
        const quote = m[1]
        const explain = EXPLAIN[token]
        if (!explain) {
            out.push(line)
            skippedDynamic++
            continue
        }

        // Collect opening-tag lines until `>` that closes the tag (not a nested `>` in JSX expr — heuristic: line with `>` or `/>` at end-ish)
        let j = i
        let opening = line
        let hasExplain = /\bexplain=/.test(line)
        while (j + 1 < lines.length && !hasExplain) {
            // stop if next line starts a new JSX sibling/child at same or less indent after we already saw `>`
            const next = lines[j + 1]
            if (/\bexplain=/.test(next)) {
                hasExplain = true
                break
            }
            // end of opening tag
            if (/\/\s*>\s*$/.test(opening.trim()) || (/>\s*$/.test(opening.trim()) && !/<[A-Za-z]/.test(opening.trim().slice(0, -1).split(">").pop() || ""))) {
                // crude: if current accumulated opening ends with > we're done looking
                break
            }
            // if next line looks like child content (indent more and starts with < or {) and current ends with >
            if (/>\s*$/.test(lines[j].trim()) && !lines[j].trim().endsWith("=>")) {
                break
            }
            j++
            opening += "\n" + lines[j]
            if (/\bexplain=/.test(lines[j])) {
                hasExplain = true
                break
            }
            if (/>\s*$/.test(lines[j].trim()) && !/=>\s*$/.test(lines[j].trim())) {
                break
            }
            if (j > i + 20) break
        }

        if (hasExplain) {
            out.push(line)
            continue
        }

        // Skip principle={expr}
        if (/principle=\{/.test(opening)) {
            out.push(line)
            skippedDynamic++
            continue
        }

        // Insert explain on its own line after the principle line, matching principle indent
        const indent = line.match(/^\s*/)[0]
        const principleLit = `principle=${quote}${token}${quote}`
        if (!line.includes(principleLit)) {
            out.push(line)
            continue
        }

        const after = line.indexOf(principleLit) + principleLit.length
        const rest = line.slice(after)
        // If rest of line has more attrs or closer, keep them on principle line; explain on next line
        out.push(line.slice(0, after))
        out.push(`${indent}explain=${quote}${explain}${quote}${rest}`)
        // skip lines we already consumed? we only rewrote current line; if j>i we didn't consume
        fileFixed++
        fixed++
    }

    if (fileFixed > 0 || src !== lines.join("\n")) {
    // If we only normalized, still write
        const newSrc = out.length === lines.length && fileFixed === 0 ? src : out.join("\n")
        // Wait - if fileFixed>0, out was built line-by-line but when we insert we push TWO lines for one input line, and we don't skip - good.
        // When fileFixed===0 but src normalized, use src.
        const finalSrc = fileFixed > 0 ? out.join("\n") : src
        if (finalSrc !== fs.readFileSync(file, "utf8")) {
            fs.writeFileSync(file, finalSrc)
            changed.push({ file, fixed: fileFixed })
        }
    }
}

console.log(JSON.stringify({ fixed, skippedDynamic, changedFiles: changed.length, sample: changed.slice(0, 20) }, null, 2))
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-burn-explain-pass2.json",
    JSON.stringify({ fixed, skippedDynamic, changed }, null, 2),
)
