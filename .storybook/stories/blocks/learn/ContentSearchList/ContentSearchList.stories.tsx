import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ContentSearchList } from "./ContentSearchList"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the chatbox's "Tìm nội dung khóa" (search-in-course) view: a
 * self-bounded scroll region running the standard error → loading → empty →
 * content switch, with an Idle hint before anything is typed.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContentSearchList> = {
    title: "Block/Learn/ContentSearchList",
    component: ContentSearchList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContentSearchList>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-xl p-8">{node}</div>

const ITEM_ORM_LESSON: SearchCourseContentItem = {
    kind: "content",
    title: "N+1 query trong ORM là gì và cách phát hiện",
    breadcrumb: "Module 5 · Tối ưu truy vấn cơ sở dữ liệu",
    snippet: "Mỗi lần lặp gọi thêm một truy vấn riêng thay vì JOIN/preload một lần — dấu hiệu điển hình của N+1.",
    score: 0.89,
    moduleId: "module-5",
    contentId: "content-n-plus-1",
    deckId: null,
    taskId: null,
    isLocked: false,
}

const ITEM_EAGER_LOADING_CHALLENGE: SearchCourseContentItem = {
    kind: "challenge",
    title: "Bài tập: sửa N+1 bằng eager loading",
    breadcrumb: "Module 5 · Tối ưu truy vấn cơ sở dữ liệu",
    snippet: "Thay vòng lặp gọi lẻ từng bản ghi con bằng một truy vấn preload duy nhất.",
    score: 0.83,
    moduleId: "module-5",
    contentId: "challenge-eager-loading",
    deckId: null,
    taskId: null,
    isLocked: false,
}

const ITEM_QUERY_PLAN_FLASHCARD: SearchCourseContentItem = {
    kind: "flashcard",
    title: "EXPLAIN ANALYZE đọc như thế nào?",
    breadcrumb: null,
    snippet: "",
    score: 0.7,
    moduleId: null,
    contentId: null,
    deckId: "deck-query-plan",
    taskId: null,
    isLocked: false,
}

const ITEM_LOCKED_CHALLENGE: SearchCourseContentItem = {
    kind: "challenge",
    title: "Bài tập nâng cao: index composite cho truy vấn đa điều kiện",
    breadcrumb: "Module 5 · Tối ưu truy vấn cơ sở dữ liệu",
    snippet: "",
    score: 0.64,
    moduleId: "module-5",
    contentId: "challenge-composite-index",
    deckId: null,
    taskId: null,
    isLocked: true,
}

// filtered OUT by the block itself (kind === "milestone") — passed in the DATA leaf
// below to demonstrate the port keeps this exclusion (source :1207).
const ITEM_CAPSTONE_MILESTONE: SearchCourseContentItem = {
    kind: "milestone",
    title: "Đồ án: dashboard phân tích hiệu năng truy vấn",
    breadcrumb: "Milestone 4 · Đồ án tối ưu hoá",
    snippet: "",
    score: 0.6,
    moduleId: null,
    contentId: null,
    deckId: null,
    taskId: "task-perf-dashboard",
    isLocked: false,
}

const QUERY = "N+1 query"

// IDLE leaf — query rỗng: ScrollShadow > AsyncContent (nhánh content) > chỉ một dòng hint.
const IDLE_PARTS: Array<AnatomyNode> = [
    {
        name: "ScrollShadow",
        tier: "primitive",
        role: "vùng cuộn tự giới hạn (max-h-[55vh])",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "switch error → loading → empty → content",
                state: "content",
                children: [
                    { name: "Typography", tier: "primitive", role: "dòng gợi ý gõ từ khoá — chỉ khi query rỗng" },
                ],
            },
        ],
    },
]

// LOADING leaf — cùng ScrollShadow > AsyncContent nhưng nhánh loading: SurfaceListCard
// bordered giữ khung, mỗi hàng là SurfaceListCardItem bọc 2 Skeleton.Typography + 1 Skeleton icon.
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "ScrollShadow",
        tier: "primitive",
        role: "vùng cuộn tự giới hạn (max-h-[55vh])",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "nhánh loading → skeleton",
                state: "loading",
                children: [
                    {
                        name: "SurfaceListCard",
                        tier: "primitive",
                        role: "khung bordered (rounded-3xl bg-surface) — CÙNG khung với leaf có kết quả (port fix)",
                        children: [
                            {
                                name: "SurfaceListCardItem",
                                tier: "primitive",
                                role: "khung mỗi hàng skeleton ×3",
                                children: [
                                    { name: "Skeleton.Typography", tier: "primitive", role: "thanh tiêu đề giả (2/3)", state: "skeleton" },
                                    { name: "Skeleton.Typography", tier: "primitive", role: "thanh phụ đề giả (1/2)", state: "skeleton" },
                                    { name: "Skeleton", tier: "primitive", role: "ô icon-loại giả (size-4)", state: "skeleton" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

// EMPTY leaf — query không rỗng nhưng isEmpty=true: AsyncContent nhánh empty → EmptyContent (qua EmptyState).
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "ScrollShadow",
        tier: "primitive",
        role: "vùng cuộn tự giới hạn (max-h-[55vh])",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "nhánh empty",
                state: "empty",
                children: [
                    { name: "EmptyContent", tier: "primitive", role: "dòng 'không tìm thấy' — CÙNG câu với leaf lỗi" },
                ],
            },
        ],
    },
]

// ERROR leaf — hasError=true: AsyncContent nhánh error (ưu tiên cao nhất) → ErrorContent, CÙNG câu với empty.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "ScrollShadow",
        tier: "primitive",
        role: "vùng cuộn tự giới hạn (max-h-[55vh])",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "nhánh error (ưu tiên trước loading/empty)",
                state: "error",
                children: [
                    { name: "ErrorContent", tier: "primitive", role: "dòng 'không tìm thấy' — nguồn dùng CHUNG một câu cho empty và error" },
                ],
            },
        ],
    },
]

// DATA leaf — kết quả thật: AsyncContent nhánh content > SurfaceListCard bordered (CÙNG khung
// với skeleton — port fix) > EntityResultRow ×N (showKindChip + showSnippet).
const DATA_PARTS: Array<AnatomyNode> = [
    {
        name: "ScrollShadow",
        tier: "primitive",
        role: "vùng cuộn tự giới hạn (max-h-[55vh])",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "nhánh content, query không rỗng",
                state: "content",
                children: [
                    {
                        name: "SurfaceListCard",
                        tier: "primitive",
                        role: "khung bordered (rounded-3xl bg-surface) ôm các hàng edge-to-edge — CÙNG khung skeleton (port fix, nguồn hand-roll rounded-2xl khác shape)",
                        children: [
                            { name: "EntityResultRow", tier: "design", role: "mỗi hàng kết quả (chip loại + tiêu đề + snippet), lặp ×N" },
                        ],
                    },
                ],
            },
        ],
    },
]

// LOCKED-ROW leaf — CÙNG composition với leaf có kết quả, chỉ khác: một EntityResultRow ở
// trạng thái isLocked → tự thêm cụm lock (icon + "Ghi danh để mở") bên trong chính nó.
const LOCKED_PARTS: Array<AnatomyNode> = DATA_PARTS

export const Idle: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="Idle"
                parts={IDLE_PARTS}
                note="query rỗng → nhánh content của AsyncContent chỉ render MỘT dòng Typography gợi ý, không khung/không hàng nào cả."
            >
                <ContentSearchList items={[]} query="" onSelect={() => {}} showAnatomy />
            </BlockAnatomy>,
        ),
}

export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="Skeleton"
                parts={LOADING_PARTS}
                note="isLoading → AsyncContent đổi sang khung SurfaceListCard bordered với 3 hàng SurfaceListCardItem mirror Skeleton — CÙNG khung với leaf có kết quả (khác leaf idle: khung đã dựng sẵn dù chưa có dữ liệu)."
            >
                <ContentSearchList items={[]} query={QUERY} isLoading onSelect={() => {}} showAnatomy />
            </BlockAnatomy>,
        ),
}

export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="query không rỗng nhưng isEmpty=true → AsyncContent nhánh empty; câu hiện ra GIỐNG HỆT leaf lỗi (nguồn dùng chung một i18n key cho cả hai)."
            >
                <ContentSearchList items={[]} query={QUERY} isEmpty onSelect={() => {}} showAnatomy />
            </BlockAnatomy>,
        ),
}

export const ErrorState: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="Error"
                parts={ERROR_PARTS}
                note="hasError=true → AsyncContent ưu tiên nhánh error trước cả loading/empty; câu hiện ra GIỐNG HỆT leaf rỗng (nguồn dùng chung một i18n key)."
            >
                <ContentSearchList items={[]} query={QUERY} hasError onSelect={() => {}} showAnatomy />
            </BlockAnatomy>,
        ),
}

export const WithResults: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="WithResults"
                parts={DATA_PARTS}
                reason="View 'Tìm nội dung khóa' trong chatbox cần MỘT vùng cuộn tự giới hạn chạy đúng chuỗi trạng thái error→loading→empty→content chuẩn (AsyncContent), cộng một gợi ý khi chưa gõ gì. Gói vùng cuộn + AsyncContent + khung kết quả + logic lọc bỏ milestone vào một block để bề mặt chat chỉ truyền items/query/isLoading/isEmpty/hasError — không dựng lại 4 nhánh trạng thái ở mỗi nơi cần tìm nội dung."
            >
                <ContentSearchList
                    items={[ITEM_ORM_LESSON, ITEM_EAGER_LOADING_CHALLENGE, ITEM_QUERY_PLAN_FLASHCARD, ITEM_CAPSTONE_MILESTONE]}
                    query={QUERY}
                    onSelect={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

export const WithLockedRow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentSearchList"
                tier="block"
                leaf="WithLockedRow"
                parts={LOCKED_PARTS}
                note="Một EntityResultRow ở trạng thái isLocked (chưa ghi danh) — CÙNG composition với leaf 'Có kết quả', chỉ khác tone của một hàng (tự thêm cụm khoá bên trong EntityResultRow, không phải node riêng ở tầng này)."
            >
                <ContentSearchList
                    items={[ITEM_EAGER_LOADING_CHALLENGE, ITEM_LOCKED_CHALLENGE]}
                    query={QUERY}
                    onSelect={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
