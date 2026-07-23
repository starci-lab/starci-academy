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
 * is no separate consolidated "Anatomy" story. DiffViewer emits no anchors (it
 * hand-draws every row), so no `showAnatomy` — Sơ đồ is a clean render + legend.
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

// UNIFIED leaf: filename header + hunk-header separator + one-column gutter/rows.
const UNIFIED_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "tên file trên header bar (HeroUI base)" },
    { name: "Thanh header hunk", tier: "design", role: "hàng phân cách muted @@ … @@ (tự vẽ)" },
    { name: "Gutter số dòng", tier: "design", role: "cột số dòng cũ + mới, tabular-nums (tự vẽ)" },
    { name: "Hàng diff", tier: "design", role: "marker +/-/· + nội dung, nền token thêm=success / xoá=danger / context=neutral (tự vẽ)" },
]

// SPLIT leaf: same parts but the body is a 2-column old/new layout, own gutter each side.
const SPLIT_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "tên file trên header bar (HeroUI base)" },
    { name: "Thanh header hunk", tier: "design", role: "hàng phân cách muted @@ … @@ (tự vẽ)" },
    { name: "Gutter số dòng", tier: "design", role: "hai cột: file cũ trái + file mới phải, mỗi bên một số dòng (tự vẽ)" },
    { name: "Hàng diff", tier: "design", role: "grid 2 cột chia đôi — thêm chỉ hiện bên mới / xoá chỉ bên cũ (tự vẽ)" },
]

// NO-FILENAME leaf: `filename` omitted → header bar (Typography) skipped entirely.
const NO_FILENAME_PARTS: Array<AnatomyNode> = [
    { name: "Thanh header hunk", tier: "design", role: "hàng phân cách muted @@ … @@ (tự vẽ)" },
    { name: "Gutter số dòng", tier: "design", role: "cột số dòng cũ + mới, tabular-nums (tự vẽ)" },
    { name: "Hàng diff", tier: "design", role: "marker +/-/· + nội dung, nền token thêm=success / xoá=danger / context=neutral (tự vẽ)" },
]

// NO-HUNK-HEADER leaf: hunk has no `header` → the muted separator row is not drawn.
const NO_HUNK_HEADER_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "tên file trên header bar (HeroUI base)" },
    { name: "Gutter số dòng", tier: "design", role: "cột số dòng cũ + mới, tabular-nums (tự vẽ)" },
    { name: "Hàng diff", tier: "design", role: "marker +/-/· + nội dung, nền token thêm=success / xoá=danger / context=neutral (tự vẽ)" },
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
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} />
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
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" />
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
                <DiffViewer hunks={sampleHunks} />
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
                <DiffViewer filename="src/utils/clamp.ts" hunks={hunkWithoutHeader} />
            </BlockAnatomy>,
        ),
}
