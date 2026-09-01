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
    lockedPrefixes.some((p) => rel.includes(p)) ||
  isHeld(rel) ||
  rel.includes("src/components/blocks/marketing/ArchitectureScene/")

const PRODUCT_EMOJI = new Set([
    "src/components/blocks/community/Discussion/constants.ts",
    "src/components/blocks/feed/ReactionBar/index.tsx",
    "src/components/blocks/learn/ReactionButton/types.ts",
    ".storybook/components/starci/blocks/learn/ReactionButton/ReactionButton.tsx",
])

const files = [
    ...new Set([
        ...(byRule["starci-fe/no-vietnamese-in-source-authoring"] || []).map((h) => h.file),
        ...(byRule["starci-fe/no-emoji-in-source"] || []).map((h) => h.file),
    ]),
].filter((f) => !isLocked(f))

const viComments = []
const emojiComments = []
const viStrings = []
const emojiStrings = []

for (const rel of files) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    const src = fs.readFileSync(abs, "utf8")
    const kind = rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)

    const addC = (ranges) => {
        for (const r of ranges || []) {
            const text = src.slice(r.pos, r.end)
            if (VN_LETTER.test(text) && !/vn-ok:/.test(text)) viComments.push({ file: rel, text: text.slice(0, 120) })
            if (hasEmoji(text)) emojiComments.push({ file: rel, text: text.slice(0, 120) })
        }
    }
    const visit = (node) => {
        addC(ts.getLeadingCommentRanges(src, node.pos))
        addC(ts.getTrailingCommentRanges(src, node.end))
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            if (VN_LETTER.test(node.text) && !/vn-ok:/.test(node.text))
                viStrings.push({ file: rel, text: node.text.slice(0, 100) })
            if (hasEmoji(node.text) && !PRODUCT_EMOJI.has(rel))
                emojiStrings.push({ file: rel, text: node.text.slice(0, 100) })
        }
        ts.forEachChild(node, visit)
    }
    visit(sf)
    addC(ts.getLeadingCommentRanges(src, 0))
}

console.log("vi comments left", viComments.length)
viComments.slice(0, 20).forEach((c) => console.log(" ", c.file, c.text.replace(/\s+/g, " ").slice(0, 100)))
console.log("emoji comments left", emojiComments.length)
emojiComments.slice(0, 15).forEach((c) => console.log(" ", c.file, c.text.replace(/\s+/g, " ").slice(0, 100)))
console.log("vi strings (skipped product/tooling)", viStrings.length)
viStrings.slice(0, 15).forEach((c) => console.log(" ", c.file, JSON.stringify(c.text)))
console.log("emoji strings left (non-product files)", emojiStrings.length)
emojiStrings.slice(0, 15).forEach((c) => console.log(" ", c.file, JSON.stringify(c.text)))
