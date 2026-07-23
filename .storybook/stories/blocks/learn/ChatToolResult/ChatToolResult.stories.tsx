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

// The result-list parts (single-kind and mixed-kind leaves share this composition).
const RESULT_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "header eyebrow: icon + nhãn loại + số lượng kết quả" },
    {
        name: "EntityResultRow",
        tier: "design",
        role: "mỗi hàng kết quả pickable (lặp ×N)",
        children: [
            { name: "EnumChip", tier: "design", role: "chip loại (khi showKindChip) / breadcrumb" },
            { name: "LockSimpleIcon", tier: "primitive", role: "cờ khoá 'Ghi danh để mở'", state: "locked" },
        ],
    },
]

// view-all leaf: same result list + a footer link opening the full search view.
const VIEWALL_PARTS: Array<AnatomyNode> = [
    ...RESULT_PARTS,
    { name: "Xem tất cả", tier: "primitive", role: "footer link mở toàn bộ kết quả tìm kiếm" },
]

// loading leaf: header stays, body becomes skeleton row frames mirroring the list shape.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "header eyebrow (không đếm khi đang tải)" },
    {
        name: "SurfaceListCardItem",
        tier: "design",
        role: "khung hàng skeleton ×2 (giữ đúng footprint hàng thật)",
        state: "skeleton",
        children: [{ name: "Skeleton", tier: "primitive", role: "thanh chip + tiêu đề + snippet giả (không spinner)" }],
    },
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
                parts={RESULT_PARTS}
                note="Danh sách trộn loại → mỗi EntityResultRow hiện EnumChip loại; hàng bị khoá thêm cờ 'Ghi danh để mở'. Không có footer xem-tất-cả."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={MIXED_KIND_ITEMS}
                        label="Kết quả liên quan"
                        icon={<MagnifyingGlassIcon aria-hidden focusable="false" className="size-4" />}
                        showKindChip
                        onSelect={() => {}}
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
                parts={RESULT_PARTS}
                note="Chỉ một hàng khớp → CÙNG composition với leaf nhiều loại, chỉ khác số lượng EntityResultRow."
            >
                <ChatWidth>
                    <ChatToolResult
                        items={SINGLE_ITEM}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        onSelect={() => {}}
                    />
                </ChatWidth>
            </BlockAnatomy>,
        ),
}
