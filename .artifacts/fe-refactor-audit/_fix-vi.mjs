/**
 * Translate Vietnamese in COMMENTS/JSDoc to English.
 * Does not rewrite product/runtime string literals (listed as skips).
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { VN_LETTER } from "../../plugins/eslint/authoring.mjs"

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

/** Phrase-level translations for mixed EN/VI comments. Order: longer first. */
const PHRASES = [
    ["Đã kết bạn", "Already friends"],
    ["Kết bạn", "Add friend"],
    ["Hạng Vàng", "Gold rank"],
    ["Hỏi nhanh", "Quick quiz"],
    ["Học thẻ", "Flashcard study"],
    ["Ôn thẻ đến hạn", "Due-card review"],
    ["ôn thẻ đến hạn", "due-card review"],
    ["Ôn tập", "Review"],
    ["Học thử", "Trial learn"],
    ["Giao diện", "Appearance"],
    ["Tải PDF", "Download PDF"],
    ["Đang tải", "Loading"],
    ["Đã nộp", "Submitted"],
    ["Quay lại bài học", "Back to lesson"],
    ["Quay lại", "Back"],
    ["cần điểm CV", "requires CV score"],
    ["chỉ state", "state only"],
    ["Cấu thành (block + primitive)", "Composition (block + primitive)"],
    ["Vì sao dùng composite này", "Why this composite"],
    ["đính chính", "clarification"],
    ["thầy chốt", "teacher ruling"],
    ["thầy:", "teacher:"],
    ["(thầy", "(teacher"],
    ["thầy ", "teacher "],
    ["bỏ deck đi, only session thôi", "drop the deck route; session only"],
    ["bỏ padding-6 ở đây này", "drop padding-6 here"],
    ["giao diện y chang", "same UI"],
    ["Đề bài / Nộp bài", "Problem / Submit"],
    ["Câu N", "Question N"],
    ["50 câu", "50 questions"],
    ["[tháng]", "[month]"],
    ["tháng", "month"],
    ["LẪN", "AND"],
    ["CÙNG", "SAME"],
    ["KHÔNG", "does NOT"],
    ["hiện ở", "renders on"],
    ["là bản ungated của", "is the ungated version of the"],
    ["user đã login xem ở đây", "signed-in users see it here"],
    ["Mọi trang khác", "Every other page"],
    ["có footer", "have a footer"],
    ["skin-shape đậm", "heavy skin-shape"],
    ["pill nổi", "raised pill"],
    ["nên thành", "should become"],
    ["frame không làm được", "a frame cannot do this"],
    ["tạm bọc", "temporarily wrap with"],
]

const translateComment = (text) => {
    let out = text
    for (const [vi, en] of PHRASES) {
        if (out.includes(vi)) out = out.split(vi).join(en)
    }
    return out
}

/** Full-file comment rewrites for heavily Vietnamese modules. */
const FULL_REWRITES = {
    ".storybook/utils/AnatomyOverlay/AnatomyOverlay.tsx": {
        from: `/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐỒ NGHỀ — AnatomyOverlay: đánh dấu MỘT part để cây anatomy nhận ra nó.
 *
 * Rút gọn 2026-07-26 (thầy chốt): anatomy chỉ còn là CÔNG CỤ XEM CÂY DOM, nên
 * overlay KHÔNG vẽ gì lên hình nữa — không viền nét đứt, không nhãn góc, không
 * badge số, không bấm. Nó chỉ còn phát một marker VÔ HÌNH mang \`data-anat-part\`.
 *
 * Vì sao bỏ: nhãn phủ đè lên chính component nó chú thích (neo: trùm kín một cái
 * chip 60px, chữ không đọc nổi) — rối hơn là giúp.
 *
 * Vì sao GIỮ component thay vì xoá: ~20 call-site đang gọi nó, và cây vẫn cần
 * marker để nhận diện part. Muốn đảo lại thì chỉ sửa MỘT chỗ.
 * ─────────────────────────────────────────────────────────────────────────────
 */`,
        to: `/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TOOLING — AnatomyOverlay: mark ONE part so the anatomy tree can recognize it.
 *
 * Slimmed 2026-07-26 (teacher ruling): anatomy is now only a DOM-TREE VIEWER, so
 * the overlay draws NOTHING on the canvas — no dashed outline, no corner label,
 * no number badge, no click. It only emits an INVISIBLE marker with \`data-anat-part\`.
 *
 * Why remove the drawings: labels covered the component they annotated (e.g. a
 * 60px chip fully obscured, unreadable text) — more noise than help.
 *
 * Why KEEP the component instead of deleting it: ~20 call sites still use it, and
 * the tree still needs the marker to identify parts. Reversing the decision is one edit.
 * ─────────────────────────────────────────────────────────────────────────────
 */`,
    },
}

const files = [
    ...new Set((byRule["starci-fe/no-vietnamese-in-source-authoring"] || []).map((h) => h.file)),
].filter((f) => !isLocked(f))

const changed = []
const remainingViComments = []
const skippedStrings = []

for (const rel of files) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    let src = fs.readFileSync(abs, "utf8")
    const original = src

    // Apply known full rewrites first
    if (FULL_REWRITES[rel]) {
        const { from, to } = FULL_REWRITES[rel]
        if (src.includes(from)) src = src.split(from).join(to)
    }

    // AnatomyOverlay short JSDocs
    if (rel === ".storybook/utils/AnatomyOverlay/AnatomyOverlay.tsx") {
        src = src
            .replace("/** Tên part — hiện trong cây anatomy. */", "/** Part name — shown in the anatomy tree. */")
            .replace(
                "/** Giữ cho tương thích call-site cũ; cây lấy tier từ `annotate`. */",
                "/** Kept for old call-site compatibility; the tree reads tier from `annotate`. */",
            )
            .replace(
                "/** Giữ cho tương thích call-site cũ; overlay không còn vẽ link. */",
                "/** Kept for old call-site compatibility; the overlay no longer draws a link. */",
            )
            .replace(
                "/** Marker vô hình đánh dấu part cho cây anatomy. */",
                "/** Invisible marker that tags a part for the anatomy tree. */",
            )
    }

    const kind = rel.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : rel.endsWith(".ts")
            ? ts.ScriptKind.TS
            : ts.ScriptKind.TSX
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)

    const edits = []
    const addRanges = (ranges) => {
        for (const r of ranges || []) {
            const text = src.slice(r.pos, r.end)
            if (!VN_LETTER.test(text)) continue
            if (/vn-ok:/.test(text) || /Tiếng Việt/.test(text)) continue
            const next = translateComment(text)
            if (next !== text && !VN_LETTER.test(next)) {
                edits.push({ start: r.pos, end: r.end, text: next })
            } else if (VN_LETTER.test(next)) {
                remainingViComments.push({ file: rel, text: next.slice(0, 240) })
                // still apply partial translation
                if (next !== text) edits.push({ start: r.pos, end: r.end, text: next })
            }
        }
    }

    const visit = (node) => {
        addRanges(ts.getLeadingCommentRanges(src, node.pos))
        addRanges(ts.getTrailingCommentRanges(src, node.end))
        // Flag string literals with VI for skip notes (do not rewrite)
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) {
            const t = ts.isJsxText(node) ? node.getText(sf) : node.text
            if (VN_LETTER.test(t) && !/vn-ok:/.test(t)) {
                skippedStrings.push({ file: rel, text: t.slice(0, 100) })
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(sf)
    addRanges(ts.getLeadingCommentRanges(src, 0))

    edits.sort((a, b) => b.start - a.start)
    let next = src
    const seen = new Set()
    for (const e of edits) {
        const key = `${e.start}:${e.end}`
        if (seen.has(key)) continue
        seen.add(key)
        next = next.slice(0, e.start) + e.text + next.slice(e.end)
    }

    if (next !== original) {
        fs.writeFileSync(abs, next)
        changed.push(rel)
    }
}

// Dedupe remaining
const remUniq = []
const remSeen = new Set()
for (const r of remainingViComments) {
    const k = r.file + "::" + r.text
    if (remSeen.has(k)) continue
    remSeen.add(k)
    remUniq.push(r)
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_fix-vi-result.json",
    JSON.stringify(
        {
            changed,
            remainingViComments: remUniq,
            skippedStrings: [...new Map(skippedStrings.map((s) => [s.file + s.text, s])).values()].slice(0, 60),
        },
        null,
        2,
    ),
)
console.log("changed", changed.length)
console.log("remaining VI comments", remUniq.length)
console.log("skipped strings", skippedStrings.length)
remUniq.slice(0, 25).forEach((r) => console.log("-", r.file, r.text.replace(/\s+/g, " ").slice(0, 120)))
