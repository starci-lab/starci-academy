import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { EntityResultRow, type SearchCourseContentItem } from "./EntityResultRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one pickable RAG result row shared by the content-AI search view, the
 * related-content list, and the in-chat tool-result widget.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy reflecting the parts THAT leaf composes (chip vs
 * breadcrumb, snippet on/off, locked). There is no separate consolidated
 * "Anatomy" story.
 */
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

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

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

// leaf WITH kind chip: EnumChip replaces the breadcrumb, above the title.
const KIND_CHIP_PARTS: Array<AnatomyNode> = [
    { name: "EnumChip", tier: "primitive", role: "nhãn loại kết quả (kind → màu soft): Bài học/Thử thách/Flashcard/Dự án — chỉ khi showKindChip" },
    { name: "Typography", tier: "primitive", role: "tiêu đề foreground hover-underline" },
]

// leaf with breadcrumb (no chip): breadcrumb muted đứng trên tiêu đề.
const BREADCRUMB_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "breadcrumb muted (khi không có chip) · tiêu đề foreground hover-underline" },
]

// leaf chỉ tiêu đề: không chip, breadcrumb null, snippet rỗng.
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "chỉ tiêu đề foreground hover-underline (không chip, không breadcrumb, không snippet)" },
]

// leaf có snippet: breadcrumb · tiêu đề · snippet muted một dòng.
const SNIPPET_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "breadcrumb muted · tiêu đề foreground hover-underline · snippet muted" },
]

// leaf khoá: thêm dòng lock "Ghi danh để mở" dưới tiêu đề.
const LOCKED_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "breadcrumb muted · tiêu đề foreground hover-underline" },
    { name: "LockSimpleIcon", tier: "primitive", role: '"Ghi danh để mở" — gợi ý khoá premium, dòng vẫn navigate', state: "isLocked" },
]

/** KIND CHIPS — mỗi kind một EnumChip màu soft đứng trên tiêu đề-link. */
export const KindChips: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Có nhãn loại"
                parts={KIND_CHIP_PARTS}
                reason="Một kết quả tìm kiếm RAG cần một nhãn LOẠI theo enum (EnumChip: kind → màu) đứng trên tiêu đề-link. Gói nhãn-loại + breadcrumb + tiêu đề (hover-underline, foreground) + snippet + trạng thái khoá vào MỘT dòng pickable dùng chung cho 3 nơi (widget kết quả tool trong chat, danh sách liên quan, view tìm kiếm AI) — mỗi nơi chỉ bật/tắt showKindChip·showSnippet, không dựng lại dòng."
            >
                <RowFrame>
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={MILESTONE_ITEM} onSelect={() => {}} showKindChip />
                </RowFrame>
            </BlockAnatomy>,
        ),
}

/** BREADCRUMB — không chip → breadcrumb muted đứng trên tiêu đề. */
export const Breadcrumb: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Có breadcrumb"
                parts={BREADCRUMB_PARTS}
                note="Tắt showKindChip → breadcrumb muted thay chip đứng trên tiêu đề."
            >
                <RowFrame>
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} />
                </RowFrame>
            </BlockAnatomy>,
        ),
}

/** NO CHIP / NO BREADCRUMB — breadcrumb null → chỉ còn tiêu đề-link. */
export const NoChipNoBreadcrumb: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Chỉ tiêu đề"
                parts={TITLE_ONLY_PARTS}
                note="Không chip, breadcrumb null, snippet rỗng → dòng thu về đúng một Typography tiêu đề."
            >
                <RowFrame>
                    <EntityResultRow item={NO_BREADCRUMB_ITEM} onSelect={() => {}} />
                </RowFrame>
            </BlockAnatomy>,
        ),
}

/** WITH SNIPPET — showSnippet → thêm dòng snippet muted dưới tiêu đề. */
export const WithSnippet: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Có snippet"
                parts={SNIPPET_PARTS}
                note="Bật showSnippet → thêm dòng snippet muted làm ngữ cảnh dưới tiêu đề."
            >
                <RowFrame>
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
                </RowFrame>
            </BlockAnatomy>,
        ),
}

/** MULTIPLE ROWS — nhiều dòng snippet trong một khung; CÙNG composition với 'Có snippet'. */
export const MultipleRows: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Nhiều dòng"
                parts={SNIPPET_PARTS}
                note="Lặp dòng snippet ×N trong một khung — CÙNG composition với leaf 'Có snippet', separator inset giữa các dòng."
            >
                <RowFrame>
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
                    <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showSnippet />
                    <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showSnippet />
                </RowFrame>
            </BlockAnatomy>,
        ),
}

/** LOCKED — isLocked → thêm dòng lock "Ghi danh để mở" dưới tiêu đề. */
export const Locked: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EntityResultRow"
                tier="design"
                leaf="Khoá"
                parts={LOCKED_PARTS}
                note="isLocked → thêm LockSimpleIcon + 'Ghi danh để mở', dòng vẫn navigate về gate ghi danh."
            >
                <RowFrame>
                    <EntityResultRow item={LOCKED_ITEM} onSelect={() => {}} />
                </RowFrame>
            </BlockAnatomy>,
        ),
}
