import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { CardsIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { ChatToolResult } from "./ChatToolResult"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the in-chat tool-result widget: a labeled, pickable list of RAG hits
 * rendered INLINE inside an assistant chat bubble. Border-only surface-in-surface,
 * a quiet header (icon + kind label + count), then shared `EntityResultRow`s.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ChatToolResult> = {
    title: "Block/Learn/ChatToolResult",
    component: ChatToolResult,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChatToolResult>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

/** The block lives inline in a chat bubble — a narrow popover width. */
const ChatWidth = ({ children }: { children: React.ReactNode }) => <div className="w-96">{children}</div>

const FLASHCARD_ITEMS: Array<SearchCourseContentItem> = [
    {
        kind: "flashcard",
        title: "Ôn khái niệm đóng (closure) trong JavaScript",
        breadcrumb: null,
        snippet: "Bộ thẻ giúp bạn nhớ lại cách closure giữ tham chiếu biến ngoài scope lâu hơn cần thiết.",
        score: 0.87,
        moduleId: null,
        contentId: null,
        deckId: "deck-closure-101",
        taskId: null,
        isLocked: false,
    },
    {
        kind: "flashcard",
        title: "Event loop và microtask queue",
        breadcrumb: null,
        snippet: "So sánh thứ tự chạy giữa Promise.then và setTimeout trong Node.js.",
        score: 0.81,
        moduleId: null,
        contentId: null,
        deckId: "deck-event-loop-202",
        taskId: null,
        isLocked: false,
    },
]

const MIXED_KIND_ITEMS: Array<SearchCourseContentItem> = [
    {
        kind: "content",
        title: "Memory leak trong Node.js là gì",
        breadcrumb: "Module 4 · Debug hiệu năng Node.js",
        snippet: "Memory leak thường xuất phát từ closure giữ tham chiếu lâu hơn cần thiết hoặc listener quên gỡ.",
        score: 0.91,
        moduleId: "module-debug-nodejs",
        contentId: "lesson-memory-leak",
        deckId: null,
        taskId: null,
        isLocked: false,
    },
    {
        kind: "challenge",
        title: "Bài tập: tìm memory leak trong service Node",
        breadcrumb: "Module 4 · Debug hiệu năng Node.js",
        snippet: "",
        score: 0.86,
        moduleId: "module-debug-nodejs",
        contentId: "challenge-memory-leak",
        deckId: null,
        taskId: null,
        isLocked: true,
    },
    {
        kind: "milestone",
        title: "Task: Tối ưu hiệu năng API tra cứu",
        breadcrumb: "Milestone 2 · Xây dựng service tìm kiếm",
        snippet: "Đo lại thời gian phản hồi trước và sau khi thêm index cho các cột lọc thường xuyên.",
        score: 0.78,
        moduleId: null,
        contentId: null,
        deckId: null,
        taskId: "task-perf-search",
        isLocked: false,
    },
]

const SINGLE_ITEM: Array<SearchCourseContentItem> = [FLASHCARD_ITEMS[0]]

// The frame + header is now ONE NestedCard (primitive = leaf: its header icon/label/count
// are NestedCard's own internals, drill into NestedCard's story — NOT badged here). What
// ChatToolResult composes INTO NestedCard's slots (rows + footer link) are the nodes.
const nestedCard = (children: Array<AnatomyNode>): AnatomyNode => ({
    name: "NestedCard",
    tier: "primitive",
    role: "khung compact bordered (surface-in-surface) + header eyebrow (icon loại + nhãn + số lượng) + slot footer",
    children,
})

// The "Xem tất cả" footer = SeeMoreLink (it OWNS the arrow + hover-slide, §5b) — no longer a
// hand-rolled button+ArrowRightIcon.
const SEE_MORE: AnatomyNode = {
    name: "SeeMoreLink",
    tier: "primitive",
    role: "footer 'xem tất cả' — text accent + mũi tên trượt khi hover (§5b), sở hữu bởi primitive",
}

// A pickable row with NO kind chip / breadcrumb / lock: title + snippet are Typography
// rendering EntityResultRow's OWN `item.title`/`item.snippet` props → not separate nodes
// (mirrors EntityResultRow's own granularity fix); the row itself has no child nodes here.
// (Flashcard hits carry breadcrumb=null and these leaves pass showKindChip off → neither shows.)
const SIMPLE_ROW: AnatomyNode = {
    name: "EntityResultRow",
    tier: "design",
    role: "hàng kết quả pickable (lặp ×N) — cả hàng là nav link",
}

// A pickable row in a MIXED-kind list: kind chip on top; a locked hit adds the enrol flag.
// Title/snippet are EntityResultRow's own prop-render Typography → not nodes; EnumChip
// (real component) and the lock <span> cluster (fixed icon+label, not prop-driven) stay.
const CHIP_LOCKED_ROW: AnatomyNode = {
    name: "EntityResultRow",
    tier: "design",
    role: "hàng kết quả pickable (lặp ×N)",
    children: [
        { name: "EnumChip", tier: "primitive", role: "chip loại (kind → màu soft) khi showKindChip" },
        {
            name: "span",
            tier: "primitive",
            role: "khung bọc cờ khoá 'Ghi danh để mở' — icon + nhãn",
            state: "locked",
            children: [
                { name: "LockSimpleIcon", tier: "primitive", role: "cờ 'Ghi danh để mở' — hàng vẫn navigate" },
                { name: "Typography", tier: "primitive", role: "nhãn 'Ghi danh để mở'" },
            ],
        },
    ],
}

// Single-kind data leaf (no chip): NestedCard wrapping simple rows.
const SIMPLE_PARTS: Array<AnatomyNode> = [nestedCard([SIMPLE_ROW])]

// view-all leaf: NestedCard wrapping rows + a SeeMoreLink footer (composed into NestedCard's footer slot).
const VIEWALL_PARTS: Array<AnatomyNode> = [nestedCard([SIMPLE_ROW, SEE_MORE])]

// Mixed-kind + locked leaf: NestedCard wrapping chip/locked rows (no footer link).
const MIXED_PARTS: Array<AnatomyNode> = [nestedCard([CHIP_LOCKED_ROW])]

// loading leaf: NestedCard (header label still shows, only the count is suppressed) wrapping
// SurfaceListCardItem skeleton frames mirroring the row shape.
const LOADING_PARTS: Array<AnatomyNode> = [
    nestedCard([
        {
            name: "SurfaceListCardItem",
            tier: "primitive",
            role: "khung hàng skeleton ×2 (giữ đúng footprint hàng thật)",
            state: "skeleton",
            children: [
                { name: "Skeleton.Chip", tier: "primitive", role: "chip loại giả (khi showKindChip)", state: "skeleton" },
                { name: "Skeleton.Typography", tier: "primitive", role: "thanh tiêu đề giả (3/4)", state: "skeleton" },
                { name: "Skeleton.Typography", tier: "primitive", role: "thanh snippet giả (full)", state: "skeleton" },
            ],
        },
    ]),
]

export const Loading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatToolResult"
                tier="block"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Tool đang chạy → body đổi sang SurfaceListCardItem + Skeleton mirror hàng (không spinner), composition khác leaf có dữ liệu (không hàng thật)."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={[]}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        isLoading
                        showKindChip
                        onSelect={() => {}}
                        showAnatomy
                    />
                </ChatWidth>
            </BlockAnatomy>,
        ),
}

export const SingleKindWithViewAll: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatToolResult"
                tier="block"
                leaf="Một loại + xem tất cả"
                parts={VIEWALL_PARTS}
                reason="Kết quả một tool call RAG hiển thị ngay trong bong bóng chat cần khung border-only (surface-in-surface) với header gọn (icon + loại + số lượng) rồi một loạt EntityResultRow dùng chung. Gói header + loading skeleton (mirror hàng, không spinner) + danh sách hàng + nút xem-tất-cả vào một block, để phần chat chỉ truyền items — không dựng lại khung, header, và trạng thái tải ở mỗi tool."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={FLASHCARD_ITEMS}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        onSelect={() => {}}
                        onViewAll={() => {}}
                        viewAllLabel="Xem tất cả kết quả"
                        showAnatomy
                    />
                </ChatWidth>
            </BlockAnatomy>,
        ),
}

export const MixedKindLocked: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatToolResult"
                tier="block"
                leaf="Nhiều loại + khoá"
                parts={MIXED_PARTS}
                note="Danh sách trộn loại → mỗi EntityResultRow hiện EnumChip loại; hàng bị khoá thêm cờ 'Ghi danh để mở'. Không có footer xem-tất-cả."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={MIXED_KIND_ITEMS}
                        label="Kết quả liên quan"
                        icon={<MagnifyingGlassIcon aria-hidden focusable="false" className="size-4" />}
                        showKindChip
                        onSelect={() => {}}
                        showAnatomy
                    />
                </ChatWidth>
            </BlockAnatomy>,
        ),
}

export const SingleResult: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatToolResult"
                tier="block"
                leaf="Một kết quả"
                parts={SIMPLE_PARTS}
                note="Chỉ một hàng khớp, không chip loại/không breadcrumb/không khoá → hàng chỉ có tiêu đề + snippet (CÙNG composition với leaf xem-tất-cả, chỉ khác số lượng hàng và không có footer link)."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={SINGLE_ITEM}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        onSelect={() => {}}
                        showAnatomy
                    />
                </ChatWidth>
            </BlockAnatomy>,
        ),
}
