import type { Meta, StoryObj } from "@storybook/nextjs"
import { EntityResultRow } from "./index"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

const meta: Meta<typeof EntityResultRow> = {
    title: "Blocks/Learn/EntityResultRow",
    component: EntityResultRow,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof EntityResultRow>

const contentItem: SearchCourseContentItem = {
    kind: "content",
    title: "Thiết kế schema cơ sở dữ liệu quan hệ",
    breadcrumb: "Module 3: Thiết kế dữ liệu",
    snippet: "Chuẩn hóa dữ liệu giúp tránh trùng lặp và giữ tính toàn vẹn khi cập nhật bản ghi liên quan.",
    score: 0.87,
    moduleId: "module-3",
    contentId: "content-12",
    deckId: null,
    taskId: null,
}

const challengeItem: SearchCourseContentItem = {
    kind: "challenge",
    title: "Thử thách: Tối ưu truy vấn N+1",
    breadcrumb: "Module 5: Hiệu năng backend",
    snippet: "Phát hiện và sửa lỗi N+1 query trong một API danh sách đơn hàng có quan hệ lồng nhau.",
    score: 0.81,
    moduleId: "module-5",
    contentId: "content-40",
    deckId: null,
    taskId: null,
}

const flashcardItem: SearchCourseContentItem = {
    kind: "flashcard",
    title: "Bộ thẻ: Chỉ mục và tối ưu truy vấn",
    breadcrumb: null,
    snippet: "Index B-Tree tăng tốc tra cứu nhưng làm chậm thao tác ghi vì phải cập nhật thêm cấu trúc chỉ mục.",
    score: 0.76,
    moduleId: null,
    contentId: null,
    deckId: "deck-7",
    taskId: null,
}

const longTitleItem: SearchCourseContentItem = {
    kind: "milestone",
    title: "Dự án: Xây dựng hệ thống đặt vé sự kiện có xử lý đồng thời và chống bán vé trùng khi nhiều người cùng đặt một chỗ ngồi",
    breadcrumb: "Milestone 2: Hệ thống đặt chỗ thời gian thực",
    snippet: "Vận dụng khóa lạc quan hoặc pessimistic lock để đảm bảo không có hai người dùng cùng giữ một chỗ ngồi.",
    score: 0.69,
    moduleId: null,
    contentId: null,
    deckId: null,
    taskId: "task-2",
}

/** Dùng cho danh sách nội dung liên quan thụ động — chỉ tiêu đề + breadcrumb, không cần nhấn mạnh loại kết quả. */
export const Default: Story = {
    parameters: { usage: "Dùng cho danh sách nội dung liên quan thụ động — chỉ tiêu đề + breadcrumb, không cần nhấn mạnh loại kết quả." },
    render: () => <EntityResultRow item={contentItem} onSelect={() => {}} />,
}

/** Dùng trong widget kết quả công cụ tìm kiếm trong chat — hiện chip loại kết quả để người dùng phân biệt nhanh giữa bài học, thử thách, flashcard, dự án. */
export const WithKindChip: Story = {
    parameters: { usage: "Dùng trong widget kết quả công cụ tìm kiếm trong chat — hiện chip loại kết quả để người dùng phân biệt nhanh giữa bài học, thử thách, flashcard, dự án." },
    render: () => (
        <div className="flex w-96 flex-col">
            <EntityResultRow item={contentItem} onSelect={() => {}} showKindChip />
            <EntityResultRow item={challengeItem} onSelect={() => {}} showKindChip />
            <EntityResultRow item={flashcardItem} onSelect={() => {}} showKindChip />
        </div>
    ),
}

/** Dùng khi màn hình tìm kiếm cần thêm một dòng ngữ cảnh trích từ đoạn khớp nhất, giúp người dùng đánh giá mức độ liên quan trước khi bấm vào. */
export const WithSnippet: Story = {
    parameters: { usage: "Dùng khi màn hình tìm kiếm cần thêm một dòng ngữ cảnh trích từ đoạn khớp nhất, giúp người dùng đánh giá mức độ liên quan trước khi bấm vào." },
    render: () => <EntityResultRow item={contentItem} onSelect={() => {}} showSnippet />,
}

/** Dùng để kiểm tra tiêu đề dài không làm vỡ bố cục — dòng bị cắt gọn với dấu ba chấm thay vì xuống dòng tràn khối. */
export const LongTitleTruncates: Story = {
    parameters: { usage: "Dùng để kiểm tra tiêu đề dài không làm vỡ bố cục — dòng bị cắt gọn với dấu ba chấm thay vì xuống dòng tràn khối." },
    render: () => (
        <div className="w-96">
            <EntityResultRow item={longTitleItem} onSelect={() => {}} showKindChip showSnippet />
        </div>
    ),
}
