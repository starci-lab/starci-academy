import type { Meta, StoryObj } from "@storybook/nextjs"
import { UpNextCard } from "@/components/blocks/learn/UpNextCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof UpNextCard> = {
    title: "Legacy/Blocks/Learn/UpNextCard",
    component: UpNextCard,
}
export default meta
type Story = StoryObj<typeof UpNextCard>

/**
 * Toàn bộ trạng thái của UpNextCard trong một gallery: từ bản tối thiểu (chỉ
 * tiêu đề + CTA chính) đến bản đầy đủ (check hoàn thành, eyebrow, mô tả và một
 * hành động phụ), cùng trường hợp nội dung dài để xem cách card bọc dòng.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tất cả trạng thái của UpNextCard cạnh nhau để chọn đúng tổ hợp props cho từng điểm hoàn thành trong luồng học (cuối bài học, cuối phiên flashcard, cuối bài chấm điểm).",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Tối thiểu"
                hint="Chỉ có tiêu đề bước tiếp theo và CTA chính — dùng khi màn hoàn thành chưa cần thêm ngữ cảnh."
            >
                <UpNextCard
                    title="Làm 2 thử thách của bài này"
                    ctaLabel="Bắt đầu"
                    onPress={() => {}}
                />
            </Variant>

            <Variant
                label="Có dấu tích hoàn thành + eyebrow"
                hint="showCheck + eyebrow tạo phản hồi vi-mô 'vừa xong · tiếp theo là gì' ngay sau khi học viên hoàn tất một bước."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Ôn lại cụm từ vừa học bằng flashcard"
                    ctaLabel="Ôn ngay"
                    onPress={() => {}}
                />
            </Variant>

            <Variant
                label="Có mô tả outcome"
                hint="Dùng khi cần giải thích vì sao bước tiếp theo quan trọng, gắn với kết quả cụ thể thay vì mô tả chung."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Làm bài kiểm tra cuối chương 3"
                    description="Hoàn thành bài này để mở khoá dải năng lực Junior Backend trong lộ trình của bạn."
                    ctaLabel="Vào bài kiểm tra"
                    onPress={() => {}}
                />
            </Variant>

            <Variant
                label="Có hành động phụ"
                hint="secondaryLabel + secondaryOnPress cho một lựa chọn khác nhẹ nhàng hơn, đứng cạnh CTA chính chứ không cạnh tranh với nó."
            >
                <UpNextCard
                    title="Làm 2 thử thách của bài này"
                    ctaLabel="Bắt đầu"
                    onPress={() => {}}
                    secondaryLabel="Làm capstone chương"
                    secondaryOnPress={() => {}}
                />
            </Variant>

            <Variant
                label="Đầy đủ"
                hint="Tổ hợp toàn bộ props tuỳ chọn — trạng thái phổ biến nhất ở màn hoàn thành cuối một milestone."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Làm dự án cá nhân: API giỏ hàng có phân trang"
                    description="Ghép kiến thức REST và phân trang vừa học thành một dự án chấm điểm, đưa bạn gần hơn tới dải năng lực Middle Backend."
                    ctaLabel="Xem đề bài"
                    onPress={() => {}}
                    secondaryLabel="Xem lại bài học"
                    secondaryOnPress={() => {}}
                />
            </Variant>

            <Variant
                label="Nội dung dài"
                hint="Tiêu đề và mô tả dài để kiểm tra cách card bọc dòng khi tên bài học hoặc lời giải thích outcome dài hơn bình thường."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Xây dựng hệ thống thông báo realtime dùng WebSocket kết hợp hàng đợi tin nhắn để xử lý lượng lớn kết nối đồng thời"
                    description="Bài này nối tiếp phần kiến trúc event-driven đã học, đưa bạn tới gần hơn dải năng lực System Design cho vị trí Senior Backend trong lộ trình hiện tại."
                    ctaLabel="Vào bài học tiếp theo"
                    onPress={() => {}}
                    secondaryLabel="Xem lại toàn bộ chương này trước khi tiếp tục"
                    secondaryOnPress={() => {}}
                />
            </Variant>
        </Gallery>
    ),
}
