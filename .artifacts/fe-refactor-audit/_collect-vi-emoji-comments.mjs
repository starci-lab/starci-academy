/**
 * Collect Vietnamese/emoji authoring hits that are COMMENTS only (safe to rewrite).
 * String/JSX product copy is listed as skip.
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { VN_LETTER, hasEmoji } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()
const { byRule, heldFiles } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const lockedPrefixes = [
    ".storybook/utils/BlockAnatomy/",
    "src/components/pages/MockInterviewPage/MockInterviewSession/",
    "src/components/pages/FlashcardsPage/QuizSession/",
    "src/components/pages/LandingPage/LearnLoopScroll/",
    "src/components/blocks/learn/ContentAiChat/",
    ".storybook/components/nivoexpert/",
    ".storybook/components/nivo/",
    "src/resources/",
]

const isHeld = (rel) =>
    [...heldFiles].some((h) => {
        if (h.includes(".")) return rel === h
        return rel === h || rel.startsWith(h + "/")
    }) || rel.startsWith("src/components/pages/SepayCheckoutPage")

const isLocked = (rel) =>
    lockedPrefixes.some((p) => rel.includes(p)) || isHeld(rel)

const files = new Set([
    ...(byRule["starci-fe/no-vietnamese-in-source-authoring"] || []).map((h) => h.file),
    ...(byRule["starci-fe/no-emoji-in-source"] || []).map((h) => h.file),
])

const viComments = []
const emojiComments = []
const skipStrings = []

for (const rel of [...files].sort()) {
    if (isLocked(rel)) continue
    // ArchitectureScene: only inline-param allowed — skip vi/emoji there
    if (rel.includes("src/components/blocks/marketing/ArchitectureScene/")) continue

    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    const src = fs.readFileSync(abs, "utf8")
    const kind = rel.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : rel.endsWith(".ts")
            ? ts.ScriptKind.TS
            : rel.endsWith(".mjs")
                ? ts.ScriptKind.JS
                : ts.ScriptKind.TSX
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)

    for (const c of sf.getAllComments?.() || []) {
    /* ts SourceFile doesn't always expose getAllComments — use scanner via forEachChild comments */
    }

    // Use typescript's getLeading/Trailing via full scan
    const comments = []
    const scan = (node) => {
        const lead = ts.getLeadingCommentRanges(src, node.pos) || []
        const trail = ts.getTrailingCommentRanges(src, node.end) || []
        for (const r of [...lead, ...trail]) {
            comments.push({ pos: r.pos, end: r.end, text: src.slice(r.pos, r.end) })
        }
        ts.forEachChild(node, scan)
    }
    scan(sf)
    // Also synthetic file-level
    const synth = ts.getLeadingCommentRanges(src, 0) || []
    for (const r of synth) comments.push({ pos: r.pos, end: r.end, text: src.slice(r.pos, r.end) })

    // Dedupe by pos
    const seen = new Set()
    for (const c of comments) {
        if (seen.has(c.pos)) continue
        seen.add(c.pos)
        if (VN_LETTER.test(c.text) && !/vn-ok:/.test(c.text) && !/Tiếng Việt/.test(c.text)) {
            viComments.push({ file: rel, pos: c.pos, end: c.end, text: c.text.slice(0, 300) })
        }
        if (hasEmoji(c.text)) {
            emojiComments.push({ file: rel, pos: c.pos, end: c.end, text: c.text.slice(0, 300) })
        }
    }
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_vi-emoji-comments.json",
    JSON.stringify(
        {
            viCommentCount: viComments.length,
            emojiCommentCount: emojiComments.length,
            viComments,
            emojiComments,
        },
        null,
        2,
    ),
)
console.log("vi comments", viComments.length, "emoji comments", emojiComments.length)
console.log("unique vi files", new Set(viComments.map((c) => c.file)).size)
console.log("unique emoji files", new Set(emojiComments.map((c) => c.file)).size)
