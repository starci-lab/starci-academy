import type { Meta, StoryObj } from "@storybook/nextjs"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof EntityResultRow> = {
    title: "Legacy/Blocks/Learn/EntityResultRow",
    component: EntityResultRow,
}
export default meta
type Story = StoryObj<typeof EntityResultRow>

const BASE_ITEM: SearchCourseContentItem = {
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

const CONTENT_ITEM: SearchCourseContentItem = BASE_ITEM

const CHALLENGE_ITEM: SearchCourseContentItem = {
    ...BASE_ITEM,
    kind: "challenge",
    title: "Viết migration thêm unique index cho email",
    breadcrumb: "Module 4 · Thiết kế cơ sở dữ liệu",
    score: 0.77,
    contentId: "challenge-unique-email",
}

const FLASHCARD_ITEM: SearchCourseContentItem = {
    ...BASE_ITEM,
    kind: "flashcard",
    title: "Khác nhau giữa 2NF và 3NF là gì?",
    breadcrumb: null,
    score: 0.71,
    moduleId: null,
    contentId: null,
    deckId: "deck-normalization",
}

const MILESTONE_ITEM: SearchCourseContentItem = {
    ...BASE_ITEM,
    kind: "milestone",
    title: "Thiết kế schema đặt bàn nhà hàng",
    breadcrumb: "Milestone 2 · Đồ án hệ thống đặt bàn",
    score: 0.68,
    moduleId: null,
    contentId: null,
    taskId: "task-restaurant-schema",
}

const NO_BREADCRUMB_ITEM: SearchCourseContentItem = {
    ...BASE_ITEM,
    breadcrumb: null,
    snippet: "",
}

const LOCKED_ITEM: SearchCourseContentItem = {
    ...BASE_ITEM,
    title: "Đồ án capstone: hệ thống đặt bàn nhà hàng",
    breadcrumb: "Milestone 2 · Đồ án hệ thống đặt bàn",
    snippet: "",
    isLocked: true,
}

/**
 * Toàn bộ trạng thái của EntityResultRow: kind chip theo 4 loại kết quả, breadcrumb
 * thay chip khi ở danh sách liên quan, không có chip lẫn breadcrumb, có snippet,
 * nhiều dòng xếp liền nhau (đường kẻ phân cách), và dòng bị khoá vì chưa ghi danh.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tổng quan mọi biến thể trước khi ghép EntityResultRow vào widget kết quả tool trong chat, danh sách nội dung liên quan, hay kết quả tìm kiếm AI toàn khoá — chọn đúng cặp showKindChip/showSnippet theo bối cảnh hiển thị.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Kind chip theo loại kết quả — showKindChip"
                hint="Dùng trong widget kết quả tool ở chat, nơi cần phân biệt content/challenge/flashcard/milestone; mỗi loại một màu chip riêng."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showKindChip />
                    <EntityResultRow item={MILESTONE_ITEM} onSelect={() => {}} showKindChip />
                </div>
            </Variant>

            <Variant
                label="Breadcrumb thay chip — danh sách liên quan"
                hint="Dùng cho danh sách nội dung liên quan thụ động: không cần chip loại, chỉ cần breadcrumb module/milestone phía trên tiêu đề."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} />
                </div>
            </Variant>

            <Variant
                label="Không chip, không breadcrumb"
                hint="Khi kết quả không có breadcrumb (ví dụ flashcard đứng lẻ) và showKindChip tắt — chỉ còn tiêu đề, không có dòng phụ phía trên."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={NO_BREADCRUMB_ITEM} onSelect={() => {}} />
                </div>
            </Variant>

            <Variant
                label="Có snippet — showSnippet"
                hint="Dùng cho trang tìm kiếm AI toàn khoá, nơi đoạn trích khớp nhất giúp học viên biết trước nội dung trước khi bấm vào."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
                </div>
            </Variant>

            <Variant
                label="Nhiều dòng liền nhau (N) — đường kẻ phân cách"
                hint="Ba dòng xếp trong cùng một danh sách: mỗi dòng có đường kẻ mảnh phía dưới, dòng cuối không có đường kẻ (last:after:hidden)."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={CONTENT_ITEM} onSelect={() => {}} showSnippet />
                    <EntityResultRow item={CHALLENGE_ITEM} onSelect={() => {}} showSnippet />
                    <EntityResultRow item={FLASHCARD_ITEM} onSelect={() => {}} showSnippet />
                </div>
            </Variant>

            <Variant
                label="Khoá vì chưa ghi danh — isLocked"
                hint="Dòng vẫn điều hướng được khi bấm — đích đến tự hiện cổng ghi danh; ở đây chỉ báo trước bằng icon khoá, backend cũng đã lược bỏ snippet nên không có gì để đọc."
            >
                <div className="flex w-full max-w-xl flex-col rounded-2xl border border-default">
                    <EntityResultRow item={LOCKED_ITEM} onSelect={() => {}} />
                </div>
            </Variant>
        </Gallery>
    ),
}
