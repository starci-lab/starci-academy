import type { Meta, StoryObj } from "@storybook/nextjs"
import { RelatedContentList } from "./index"

const meta: Meta<typeof RelatedContentList> = {
    title: "Blocks/Learn/RelatedContentList",
    component: RelatedContentList,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof RelatedContentList>

/** Gắn cuối một bài học để gợi ý nội dung liên quan trong cùng khoá học, dựa trên tiêu đề bài học làm truy vấn RAG. */
export const Default: Story = {
    parameters: { usage: "Gắn cuối một bài học để gợi ý nội dung liên quan trong cùng khoá học, dựa trên tiêu đề bài học làm truy vấn RAG." },
    render: () => (
        <div className="w-96">
            <RelatedContentList
                courseId="course-fullstack-mastery"
                courseDisplayId="0-fullstack-mastery"
                query="React Server Components hoạt động như thế nào"
                label="Nội dung liên quan"
            />
        </div>
    ),
}

/** Khi truy vấn ngữ cảnh còn rỗng (chưa xác định được nội dung nguồn), khối tự ẩn hoàn toàn — không hiện skeleton hay khung rỗng gây rối mắt. */
export const EmptyQuery: Story = {
    parameters: { usage: "Khi truy vấn ngữ cảnh còn rỗng (chưa xác định được nội dung nguồn), khối tự ẩn hoàn toàn — không hiện skeleton hay khung rỗng gây rối mắt." },
    render: () => (
        <div className="w-96">
            <RelatedContentList
                courseId="course-fullstack-mastery"
                courseDisplayId="0-fullstack-mastery"
                query=""
                label="Nội dung liên quan"
            />
        </div>
    ),
}
