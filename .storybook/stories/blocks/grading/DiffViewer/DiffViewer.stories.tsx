import type { Meta, StoryObj } from "@storybook/nextjs"
import { DiffViewer } from "./DiffViewer"
import type { DiffHunk } from "./DiffViewer"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a leaf renderer for grading diffs (student code vs a suggested fix).
 * It takes PRE-PARSED hunks (no diff algorithm) and self-draws every row: a
 * filename header bar, a line-number gutter, and token-colored line backgrounds.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. DiffViewer hand-draws every row,
 * but with `showAnatomy` on it tags each part with `data-anat-part` so the Sơ đồ
 * view can draw numbered on-render badges over the live render.
 */
const meta: Meta<typeof DiffViewer> = {
    title: "Design/Grading/DiffViewer",
    component: DiffViewer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DiffViewer>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

/** A small pre-parsed hunk: a few context lines, one removed line and two added lines. */
const sampleHunks: DiffHunk[] = [
    {
        header: "@@ -1,5 +1,6 @@ function login(token) {",
        lines: [
            { type: "ctx", content: "function login(token) {", oldNumber: 1, newNumber: 1 },
            { type: "ctx", content: "  const user = findUser()", oldNumber: 2, newNumber: 2 },
            { type: "del", content: "  return true", oldNumber: 3 },
            { type: "add", content: "  if (!verify(token)) return false", newNumber: 3 },
            { type: "add", content: "  return Boolean(user)", newNumber: 4 },
            { type: "ctx", content: "}", oldNumber: 4, newNumber: 5 },
        ],
    },
]

// ── Shared part nodes (the SAME real component reused across leaves) ──
// The DiffViewer frame (rounded-xl border bg-surface) is the anatomy ROOT
// (BlockAnatomy supplies it as the tree root), so `parts` below are its DIRECT
// children, nested to mirror the real DOM the component hand-draws.

/** Filename header bar — a bordered div that CONTAINS the mono Typography. */
const FILE_HEADER: AnatomyNode = {
    name: "Thanh tên file",
    tier: "design",
    role: "header bar border-b bg-default px-4 py-2 — chỉ render khi có prop filename",
    children: [
        { name: "Typography", tier: "primitive", role: "tên file, font-mono body-sm medium (HeroUI base)" },
    ],
}

/** Muted @@ separator row — only drawn when the hunk carries a `header`. */
const HUNK_HEADER: AnatomyNode = {
    name: "Thanh header hunk",
    tier: "design",
    role: "hàng phân cách muted @@ … @@ (tự vẽ, chỉ khi hunk có header)",
}

/** One UNIFIED row: a flex div that CONTAINS the two gutter cells, marker và nội dung. */
const UNIFIED_ROW: AnatomyNode = {
    name: "UnifiedRow",
    tier: "design",
    role: "một hàng diff xếp dọc, nền token thêm=success / xoá=danger / context=neutral (tự vẽ)",
    children: [
        { name: "NumberCell", tier: "primitive", role: "ô số dòng cũ + mới (hai ô), right-align tabular-nums, muted (tự vẽ)" },
        { name: "Marker", tier: "primitive", role: "glyph +/-/khoảng-trắng, cột w-4 canh giữa (tự vẽ)" },
        { name: "Nội dung dòng", tier: "primitive", role: "text nội dung, whitespace-pre (tự vẽ)" },
    ],
}

/** One SPLIT row: a 2-col grid that CONTAINS an old-side and a new-side SplitCell. */
const SPLIT_ROW: AnatomyNode = {
    name: "Hàng chia đôi",
    tier: "design",
    role: "grid grid-cols-2 divide-x — mỗi dòng chia file cũ trái / file mới phải (tự vẽ)",
    children: [
        {
            name: "SplitCell",
            tier: "design",
            role: "bên cũ: số dòng + nội dung; dòng thêm thành ô trống filler (tự vẽ)",
            children: [
                { name: "NumberCell", tier: "primitive", role: "số dòng cũ, right-align tabular-nums, muted (tự vẽ)" },
                { name: "Nội dung dòng", tier: "primitive", role: "text nội dung, whitespace-pre (tự vẽ)" },
            ],
        },
        {
            name: "SplitCell",
            tier: "design",
            role: "bên mới: số dòng + nội dung; dòng xoá thành ô trống filler (tự vẽ)",
            children: [
                { name: "NumberCell", tier: "primitive", role: "số dòng mới, right-align tabular-nums, muted (tự vẽ)" },
                { name: "Nội dung dòng", tier: "primitive", role: "text nội dung, whitespace-pre (tự vẽ)" },
            ],
        },
    ],
}

/** overflow-x-auto scroll region wrapping the mono code body — CONTAINS hunk rows. */
const scrollRegion = (children: Array<AnatomyNode>): AnatomyNode => ({
    name: "Vùng cuộn code",
    tier: "design",
    role: "overflow-x-auto bọc thân min-w-fit font-mono text-xs — dòng dài cuộn ngang, không vỡ trang",
    children,
})

// UNIFIED leaf: header bar (Typography) + scroll region [hunk header + one-column rows].
const UNIFIED_PARTS: Array<AnatomyNode> = [
    FILE_HEADER,
    scrollRegion([HUNK_HEADER, UNIFIED_ROW]),
]

// SPLIT leaf: same frame, but each row is a 2-column old/new grid with a gutter per side.
const SPLIT_PARTS: Array<AnatomyNode> = [
    FILE_HEADER,
    scrollRegion([HUNK_HEADER, SPLIT_ROW]),
]

// NO-FILENAME leaf: `filename` omitted → header bar (+ its Typography) skipped entirely.
const NO_FILENAME_PARTS: Array<AnatomyNode> = [
    scrollRegion([HUNK_HEADER, UNIFIED_ROW]),
]

// NO-HUNK-HEADER leaf: hunk has no `header` → the muted separator row is not drawn.
const NO_HUNK_HEADER_PARTS: Array<AnatomyNode> = [
    FILE_HEADER,
    scrollRegion([UNIFIED_ROW]),
]

/** UNIFIED (default) — every line stacked in one column with +/-/space markers. */
export const Unified: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DiffViewer"
                tier="design"
                leaf="Hợp nhất"
                parts={UNIFIED_PARTS}
                reason="Leaf renderer cho diff chấm bài: nhận hunks đã parse sẵn (không tự chạy thuật toán diff) rồi vẽ header tên file + gutter số dòng + nền màu theo token (thêm=success, xoá=danger, context=neutral). Không cấu thành từ Primitives/* — tự vẽ mọi hàng, nên đúng ra là một Primitive hơn là Block (xem FLAGS)."
            >
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** SPLIT — SAME parts, but the body switches to a 2-column old/new layout. */
export const Split: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DiffViewer"
                tier="design"
                leaf="Chia đôi"
                parts={SPLIT_PARTS}
                note="Cùng thành phần nhưng bố cục chia đôi: file cũ bên trái, file mới bên phải; context hiện cả hai bên."
            >
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** `filename` is optional — the header bar is skipped entirely when omitted. */
export const NoFilename: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DiffViewer"
                tier="design"
                leaf="Không tên file"
                parts={NO_FILENAME_PARTS}
                note="filename bỏ trống → header bar bị bỏ HẲN (không Typography), phần code giữ nguyên."
            >
                <DiffViewer hunks={sampleHunks} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** A hunk's `header` is optional — no muted separator row is drawn when it's omitted. */
const hunkWithoutHeader: DiffHunk[] = [
    {
        lines: [
            { type: "ctx", content: "export const clamp = (n) => {", oldNumber: 1, newNumber: 1 },
            { type: "del", content: "  return Math.min(n, 100)", oldNumber: 2 },
            { type: "add", content: "  return Math.min(Math.max(n, 0), 100)", newNumber: 2 },
            { type: "ctx", content: "}", oldNumber: 3, newNumber: 3 },
        ],
    },
]

export const WithoutHunkHeader: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DiffViewer"
                tier="design"
                leaf="Không header hunk"
                parts={NO_HUNK_HEADER_PARTS}
                note="hunk không có header → không vẽ hàng phân cách muted; các hàng diff nối liền nhau."
            >
                <DiffViewer filename="src/utils/clamp.ts" hunks={hunkWithoutHeader} showAnatomy />
            </BlockAnatomy>,
        ),
}
