/**
 * Burn no-emoji-in-source in COMMENTS + non-product authoring strings.
 * Skips known product-UI emoji (reaction bars, etc.).
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { hasEmoji } from "../../plugins/eslint/authoring.mjs"

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

const PRODUCT_EMOJI_FILES = new Set([
    "src/components/blocks/community/Discussion/constants.ts",
    "src/components/blocks/feed/ReactionBar/index.tsx",
    "src/components/blocks/learn/ReactionButton/types.ts",
    ".storybook/components/starci/blocks/learn/ReactionButton/ReactionButton.tsx",
])

const isHeld = (rel) =>
    [...heldFiles].some((h) => {
        if (h.includes(".")) return rel === h
        return rel === h || rel.startsWith(h + "/")
    }) || rel.startsWith("src/components/pages/SepayCheckoutPage")

const isLocked = (rel) =>
    lockedPrefixes.some((p) => rel.includes(p)) ||
  isHeld(rel) ||
  rel.includes("src/components/blocks/marketing/ArchitectureScene/")

/** Replace Extended_Pictographic / flag pairs with ASCII stand-ins. */
const scrubEmoji = (text) => {
    let out = text
    const map = [
        [/↔/g, "<->"],
        [/↕/g, "<->"],
        [/→/g, "->"],
        [/←/g, "<-"],
        [/⇒/g, "=>"],
        [/⭐/g, "*"],
        [/✨/g, "*"],
        [/⏳/g, "(pending)"],
        [/▶/g, ">"],
        [/©/g, "(c)"],
        [/⚠/g, "WARNING"],
        [/✅/g, "[ok]"],
        [/❌/g, "[x]"],
        [/🔥/g, ""],
        [/💡/g, ""],
        [/🎉/g, ""],
        [/🚀/g, ""],
        [/📌/g, ""],
        [/👉/g, "->"],
        [/✓/g, "[ok]"],
        [/✔/g, "[ok]"],
    ]
    for (const [re, rep] of map) out = out.replace(re, rep)
    // Strip remaining Extended_Pictographic and flag pairs
    out = out.replace(/\p{Extended_Pictographic}/gu, "")
    out = out.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    // Clean doubled spaces left by removals (preserve newlines)
    out = out.replace(/[^\S\n]{2,}/g, " ")
    return out
}

const files = [
    ...new Set((byRule["starci-fe/no-emoji-in-source"] || []).map((h) => h.file)),
].filter((f) => !isLocked(f) && !PRODUCT_EMOJI_FILES.has(f))

const changed = []
const skippedProduct = [...PRODUCT_EMOJI_FILES]
const skippedStrings = []

for (const rel of files) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    let src = fs.readFileSync(abs, "utf8")
    const original = src
    const kind = rel.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : rel.endsWith(".ts")
            ? ts.ScriptKind.TS
            : ts.ScriptKind.TSX
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)

    /** @type {Array<{start:number,end:number,text:string}>} */
    const edits = []

    const addCommentRanges = (ranges) => {
        for (const r of ranges || []) {
            const text = src.slice(r.pos, r.end)
            if (!hasEmoji(text)) continue
            const next = scrubEmoji(text)
            if (next !== text) edits.push({ start: r.pos, end: r.end, text: next })
        }
    }

    const visit = (node) => {
        addCommentRanges(ts.getLeadingCommentRanges(src, node.pos))
        addCommentRanges(ts.getTrailingCommentRanges(src, node.end))

        // Non-content authoring strings in stories (role/why/explain) — scrub ↔ etc.
        // Skip JSX text and likely product UI (short emoji-only, reaction maps).
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            const text = node.text
            if (hasEmoji(text)) {
                // Product footer copyright, reaction glyphs, etc.
                if (/^[\p{Extended_Pictographic}\s]+$/u.test(text) || text.includes("👍") || text.includes("❤️")) {
                    skippedStrings.push({ file: rel, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, text: text.slice(0, 80) })
                } else if (text.includes("©") && /StarCi|Mia Mia|nivo|Academy/i.test(text)) {
                    skippedStrings.push({ file: rel, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, text: text.slice(0, 80), reason: "product copyright" })
                } else {
                    // Authoring doc strings (role/why with ↔)
                    const scrubbed = scrubEmoji(text)
                    if (scrubbed !== text) {
                        const full = src.slice(node.getStart(sf), node.getEnd())
                        const quote = full[0]
                        edits.push({
                            start: node.getStart(sf),
                            end: node.getEnd(),
                            text: quote + scrubbed.replace(new RegExp("\\\\" + quote, "g"), "\\" + quote).replace(new RegExp(quote, "g"), "\\" + quote) + quote,
                        })
                        // Safer: replace only inside the literal content using original quoting
                        // Recompute properly:
                    }
                }
            }
        }

        ts.forEachChild(node, visit)
    }
    visit(sf)
    addCommentRanges(ts.getLeadingCommentRanges(src, 0))

    // Re-do string edits more carefully — only comments in this pass to avoid quote bugs
    const commentEdits = edits.filter((e) => {
        const slice = original.slice(e.start, e.end)
        return slice.startsWith("//") || slice.startsWith("/*")
    })

    // Separate string scrub for ↔ in authoring strings
    const stringEdits = []
    const visit2 = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            const raw = node.text
            if (!hasEmoji(raw)) return
            if (/^[\p{Extended_Pictographic}\uFE0F\s]+$/u.test(raw)) {
                skippedStrings.push({ file: rel, text: raw, reason: "emoji-only product/reaction" })
                return
            }
            if (raw.includes("©") && /StarCi|Mia|Academy|nivo|copyright/i.test(raw)) {
                skippedStrings.push({ file: rel, text: raw.slice(0, 80), reason: "product copyright" })
                return
            }
            // Vietnamese product story copy with © already handled; skip mixed product
            if (/Học |Đề |tiếng Anh/.test(raw)) {
                skippedStrings.push({ file: rel, text: raw.slice(0, 80), reason: "product/story copy" })
                return
            }
            const scrubbed = scrubEmoji(raw)
            if (scrubbed === raw) return
            const start = node.getStart(sf)
            const end = node.getEnd()
            const full = original.slice(start, end)
            // Preserve original quotes / template delimiters; only replace content
            if (ts.isStringLiteral(node)) {
                const q = full[0]
                stringEdits.push({ start, end, text: q + scrubbed.replace(/\\/g, "\\\\").replace(new RegExp(q, "g"), "\\" + q) + q })
            } else {
                stringEdits.push({ start, end, text: "`" + scrubbed.replace(/\\/g, "\\\\").replace(/`/g, "\\`") + "`" })
            }
        }
        // Template with expressions: scrub cooked parts via TemplateElement
        if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
            // skip — rare for role/why
        }
        ts.forEachChild(node, visit2)
    }
    visit2(sf)

    const all = [...commentEdits, ...stringEdits].sort((a, b) => b.start - a.start)
    // Dedupe overlapping
    const applied = []
    let lastStart = Infinity
    for (const e of all) {
        if (e.end > lastStart) continue
        applied.push(e)
        lastStart = e.start
    }

    let next = original
    for (const e of applied) {
        next = next.slice(0, e.start) + e.text + next.slice(e.end)
    }

    if (next !== original) {
        fs.writeFileSync(abs, next)
        changed.push(rel)
    }
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_fix-emoji-result.json",
    JSON.stringify({ changed, skippedProduct: [...skippedProduct], skippedStrings: skippedStrings.slice(0, 80) }, null, 2),
)
console.log("changed", changed.length)
console.log("skipped product files", [...skippedProduct])
console.log("skipped strings", skippedStrings.length)
