import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { CardsIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { ChatToolResult } from "./ChatToolResult"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "EntityResultRow", role: "mỗi hàng kết quả pickable (kind chip + tiêu đề + snippet + khoá)" },
        { name: "SurfaceListCard", role: "khung hàng (SurfaceListCardItem) cho skeleton lúc đang tải" },
        { name: "Skeleton", role: "bars mirror hình dạng hàng khi tool RAG đang chạy" },
    ],
    reason:
        "Kết quả một tool call RAG hiển thị ngay trong bong bóng chat cần khung border-only (surface-in-surface) với header gọn (icon + loại + số lượng) rồi một loạt EntityResultRow dùng chung. Gói header + loading skeleton (mirror hàng, không spinner) + danh sách hàng + nút xem-tất-cả vào một block, để phần chat chỉ truyền items — không dựng lại khung, header, và trạng thái tải ở mỗi tool.",
}

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

export const Loading: Story = {
    render: () =>
        blockShell(
            <ChatWidth>
                <ChatToolResult
                    items={[]}
                    label="Flashcard liên quan"
                    icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                    isLoading
                    showKindChip
                    onSelect={() => {}}
                />
            </ChatWidth>,
            ANATOMY,
        ),
}

export const SingleKindWithViewAll: Story = {
    render: () =>
        blockShell(
            <ChatWidth>
                <ChatToolResult
                    items={FLASHCARD_ITEMS}
                    label="Flashcard liên quan"
                    icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                    onSelect={() => {}}
                    onViewAll={() => {}}
                    viewAllLabel="Xem tất cả kết quả"
                />
            </ChatWidth>,
            ANATOMY,
        ),
}

export const MixedKindLocked: Story = {
    render: () =>
        blockShell(
            <ChatWidth>
                <ChatToolResult
                    items={MIXED_KIND_ITEMS}
                    label="Kết quả liên quan"
                    icon={<MagnifyingGlassIcon aria-hidden focusable="false" className="size-4" />}
                    showKindChip
                    onSelect={() => {}}
                />
            </ChatWidth>,
            ANATOMY,
        ),
}

export const SingleResult: Story = {
    render: () =>
        blockShell(
            <ChatWidth>
                <ChatToolResult
                    items={SINGLE_ITEM}
                    label="Flashcard liên quan"
                    icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                    onSelect={() => {}}
                />
            </ChatWidth>,
            ANATOMY,
        ),
}
