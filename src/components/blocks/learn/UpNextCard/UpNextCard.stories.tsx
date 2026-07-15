import type { Meta, StoryObj } from "@storybook/nextjs"
import { UpNextCard } from "./index"

const meta: Meta<typeof UpNextCard> = {
    title: "Blocks/Learn/UpNextCard",
    component: UpNextCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof UpNextCard>

/** Dùng ở thời điểm hoàn thành một bài học để trao tay ngay rung tiếp theo, giữ đà học tập. */
export const Default: Story = {
    parameters: { usage: "Dùng ở thời điểm hoàn thành một bài học để trao tay ngay rung tiếp theo, giữ đà học tập." },
    render: () => (
        <div className="w-[420px]">
            <UpNextCard
                eyebrow="Tiếp theo"
                title="Làm 2 thử thách của bài này"
                description="Củng cố kiến thức vừa học và tăng điểm sẵn sàng đi làm."
                ctaLabel="Bắt đầu thử thách"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Bật cờ hoàn thành khi learner vừa xong một bước, để dấu tích xanh xác nhận trước khi dẫn sang bước kế. */
export const WithCompletionCheck: Story = {
    parameters: { usage: "Bật cờ hoàn thành khi learner vừa xong một bước, để dấu tích xanh xác nhận trước khi dẫn sang bước kế." },
    render: () => (
        <div className="w-[420px]">
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Ôn lại bộ flashcard chương này"
                description="Ghi nhớ sâu hơn trước khi bước sang chương mới."
                ctaLabel="Ôn flashcard"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Thêm hành động phụ khi có một lựa chọn thay thế đáng làm ngay, ví dụ capstone của chương, mà không cạnh tranh với CTA chính. */
export const WithSecondaryAction: Story = {
    parameters: { usage: "Thêm hành động phụ khi có một lựa chọn thay thế đáng làm ngay, ví dụ capstone của chương, mà không cạnh tranh với CTA chính." },
    render: () => (
        <div className="w-[420px]">
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Làm bài kiểm tra cuối chương"
                description="Xác nhận bạn đã sẵn sàng chuyển sang chương tiếp theo."
                ctaLabel="Làm bài kiểm tra"
                onPress={() => {}}
                secondaryLabel="Làm capstone chương"
                secondaryOnPress={() => {}}
            />
        </div>
    ),
}

/** Bỏ qua eyebrow và mô tả khi bản thân tiêu đề đã đủ rõ, giữ thẻ tối giản cho các luồng ngắn. */
export const MinimalNoDescription: Story = {
    parameters: { usage: "Bỏ qua eyebrow và mô tả khi bản thân tiêu đề đã đủ rõ, giữ thẻ tối giản cho các luồng ngắn." },
    render: () => (
        <div className="w-[420px]">
            <UpNextCard
                title="Chuyển sang bài học tiếp theo"
                ctaLabel="Học tiếp"
                onPress={() => {}}
            />
        </div>
    ),
}
