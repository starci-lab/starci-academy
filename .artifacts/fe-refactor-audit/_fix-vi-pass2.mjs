/**
 * Second-pass Vietnamese comment burn — expanded gloss map + known file patches.
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

const PHRASES = [
    ["AI viết giúp", "AI rewrite help"],
    ["AI viết", "AI rewrite"],
    ["Lịch sử dùng AI", "AI usage history"],
    ["Xem trong bài học", "View in lesson"],
    ["điểm quà", "reward points"],
    ["Tùy chỉnh phiên", "Customize session"],
    ["Tùy chỉnh", "Customize"],
    ["trả góp", "installment"],
    ["hỏi chung khóa", "course-wide Q&A"],
    ["không đạt", "not pass"],
    ["chưa đạt", "partial pass"],
    ["đạt", "pass"],
    ["làm ngắn gọn hơn", "make it more concise"],
    ["hạng-mục", "category"],
    ["hạng mục", "category"],
    ["Hỏi AI khi đọc bài", "Ask AI while reading"],
    ["Chấm bài", "Grade submission"],
    ["Phỏng vấn thử", "Mock interview"],
    ["Cấu hình luyện", "Practice setup"],
    ["Tất cả", "All"],
    ["Tự động", "Automatic"],
    ["Bài:", "Lesson:"],
    ["viết lại", "rewrite"],
    ["Dự án", "Project"],
    ["đã học N khóa", "already studied N courses"],
    ["có gợi ý", "has hint"],
    ["CHỐT CUỐI", "FINAL CALL"],
    ["xám → đồng → bạc → vàng", "gray -> bronze -> silver -> gold"],
    ["Phiên ", "Session "],
    ["ôn thẻ", "card review"],
    ["cả locale root", "both locale root"],
    ["trang landing", "landing page"],
    ["résumé", "resume"], // accented e might trip? actually e-acute is Latin-1 not VN letter set
]

const files = [
    ...new Set((byRule["starci-fe/no-vietnamese-in-source-authoring"] || []).map((h) => h.file)),
].filter((f) => !isLocked(f))

const changed = []
const remaining = []

for (const rel of files) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) continue
    let src = fs.readFileSync(abs, "utf8")
    const original = src

    // InnerLayout special
    if (rel === "src/app/InnerLayout.tsx") {
        src = src.replace(
            /\/\/ Footer renders on LANDING[^\n]*\n\/\/[^\n]*\n\/\/[^\n]*/,
            `// Footer renders on LANDING — both locale root ("/", "/vi", "/en") AND /home ("/home",
    // "/vi/home"): /home is the ungated version of the SAME landing page (signed-in users see it here).
    // Every other page (dashboard / learn / profile / auth / …) does NOT have a footer — teacher ruling 2026-06-26.`,
        )
    }

    const kind = rel.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : rel.endsWith(".ts")
            ? ts.ScriptKind.TS
            : ts.ScriptKind.TSX
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
    const edits = []

    const translate = (text) => {
        let out = text
        for (const [vi, en] of PHRASES) out = out.split(vi).join(en)
        return out
    }

    const add = (ranges) => {
        for (const r of ranges || []) {
            const text = src.slice(r.pos, r.end)
            if (!VN_LETTER.test(text)) continue
            if (/vn-ok:/.test(text)) continue
            const next = translate(text)
            if (next !== text) edits.push({ start: r.pos, end: r.end, text: next })
            if (VN_LETTER.test(next)) remaining.push({ file: rel, text: next.slice(0, 200) })
        }
    }

    const visit = (node) => {
        add(ts.getLeadingCommentRanges(src, node.pos))
        add(ts.getTrailingCommentRanges(src, node.end))
        ts.forEachChild(node, visit)
    }
    visit(sf)
    add(ts.getLeadingCommentRanges(src, 0))

    edits.sort((a, b) => b.start - a.start)
    const seen = new Set()
    let next = src
    for (const e of edits) {
        const k = `${e.start}:${e.end}`
        if (seen.has(k)) continue
        seen.add(k)
        next = next.slice(0, e.start) + e.text + next.slice(e.end)
    }

    if (next !== original) {
        fs.writeFileSync(abs, next)
        changed.push(rel)
    }
}

const remUniq = [...new Map(remaining.map((r) => [r.file + r.text, r])).values()]
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_fix-vi-pass2.json",
    JSON.stringify({ changed, remaining: remUniq }, null, 2),
)
console.log("changed", changed.length, "remaining", remUniq.length)
remUniq.slice(0, 40).forEach((r) => {
    const m = r.text.match(/[^\n]*[À-ỹĐđ][^\n]*/)
    console.log(r.file, (m ? m[0] : r.text).replace(/\s+/g, " ").slice(0, 140))
})
