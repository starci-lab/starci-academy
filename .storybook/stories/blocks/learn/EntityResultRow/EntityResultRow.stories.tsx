import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { EntityResultRow, type SearchCourseContentItem } from "./EntityResultRow"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof EntityResultRow> = {
    title: "Design/Learn/EntityResultRow",
    component: EntityResultRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EntityResultRow>

const ANATOMY = {
    primitives: [
        { name: "EnumChip", role: "nhãn loại kết quả (kind → màu soft): Bài học/Thử thách/Flashcard/Dự án" },
    ],
    reason:
        "Một kết quả tìm kiếm RAG cần một nhãn LOẠI theo enum (EnumChip: kind → màu) đứng trên tiêu đề-link. Gói nhãn-loại + breadcrumb + tiêu đề (hover-underline, foreground) + snippet + trạng thái khoá vào MỘT dòng pickable dùng chung cho 3 nơi (widget kết quả tool trong chat, danh sách liên quan, view tìm kiếm AI) — mỗi nơi chỉ bật/tắt showKindChip·showSnippet, không dựng lại dòng.",
}

/** A bordered frame so the row's own inset separators (last:after:hidden) read in isolation. */
const RowFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">{children}</div>
)

const CONTENT_ITEM: SearchCourseContentItem = {
    kind: "content",
    title: "Chuẩn hoá dữ liệu quan hệ tới 3NF",
    breadcrumb: "Module 4 · Thiết kế cơ sở dữ liệu",
    snippet: "3NF loại bỏ transitive dependency — cột không-khoá không được phụ thuộc vào cột không-khoá khác.",
    score: 0.82,
    moduleId: "module-4",
    contentId: "content-3nf",
    deckId: null,
    taskId: null,
    isLocked: false,
}

const CHALLENGE_ITEM: SearchCourseContentItem = {
    ...CONTENT_ITEM,
    kind: "challenge",
    title: "Viết migration thêm unique index cho email",
    score: 0.77,
    contentId: "challenge-unique-email",
}

const FLASHCARD_ITEM: SearchCourseContentItem = {
    ...CONTENT_ITEM,
    kind: "flashcard",
    title: "Khác nhau giữa 2NF và 3NF là gì?",
    breadcrumb: null,
    score: 0.71,
    moduleId: null,
    contentId: null,
    deckId: "deck-normalization",
}

const MILESTONE_ITEM: SearchCourseContentItem = {
    ...CONTENT_ITEM,
    kind: "milestone",
    title: "Thiết kế schema đặt bàn nhà hàng",
    breadcrumb: "Milestone 2 · Đồ án hệ thống đặt bàn",
    score: 0.68,
    moduleId: null,
    contentId: null,
    taskId: "task-restaurant-schema",
}

const NO_BREADCRUMB_ITEM: SearchCourseContentItem = {
    ...CONTENT_ITEM,
    breadcrumb: null,
    snippet: "",
}

const LOCKED_ITEM: SearchCourseContentItem = {
    ...CONTENT_ITEM,
    title: "Đồ án capstone: hệ thống đặt bàn nhà hàng",
    breadcrumb: "Milestone 2 · Đồ án hệ thống đặt bàn",
    snippet: "",
    isLocked: true,
}

export const KindChips: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showKindChip />
                <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showKindChip />
                <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showKindChip />
                <EntityResultRow item={MILESTONE_ITEM} onSelect={() => {}} showKindChip />
            </RowFrame>,
            ANATOMY,
        ),
}

export const Breadcrumb: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} />
            </RowFrame>,
            ANATOMY,
        ),
}

export const NoChipNoBreadcrumb: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={NO_BREADCRUMB_ITEM} onSelect={() => {}} />
            </RowFrame>,
            ANATOMY,
        ),
}

export const WithSnippet: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
            </RowFrame>,
            ANATOMY,
        ),
}

export const MultipleRows: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
                <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showSnippet />
                <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showSnippet />
            </RowFrame>,
            ANATOMY,
        ),
}

export const Locked: Story = {
    render: () =>
        blockShell(
            <RowFrame>
                <EntityResultRow item={LOCKED_ITEM} onSelect={() => {}} />
            </RowFrame>,
            ANATOMY,
        ),
}
