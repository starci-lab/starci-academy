import type { Meta, StoryObj } from "@storybook/nextjs"
import { UpNextCard } from "./UpNextCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof UpNextCard> = {
    title: "Design/Learn/UpNextCard",
    component: UpNextCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof UpNextCard>

const ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung viền tự đóng cho khối hoàn thành" },
    ],
    reason:
        "Điểm hoàn thành một bề mặt học cần MỘT surface tự đóng khung (SectionCard) gom lại: micro-feedback 'vừa xong ✓' + eyebrow, bước tiếp theo (title + outcome), và ĐÚNG MỘT CTA chính (accent, size lg, mũi tên) + một hành động phụ nhẹ. Gói vào một block để mỗi màn hoàn thành chỉ truyền bước kế + handler điều hướng — không dựng lại khung, thứ tự nhấn, và cặp CTA chính/phụ.",
}

export const Minimal: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                title="Làm 2 thử thách của bài này"
                ctaLabel="Bắt đầu"
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const CheckAndEyebrow: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Ôn lại cụm từ vừa học bằng flashcard"
                ctaLabel="Ôn ngay"
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const WithDescription: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Làm bài kiểm tra cuối chương 3"
                description="Hoàn thành bài này để mở khoá dải năng lực Junior Backend trong lộ trình của bạn."
                ctaLabel="Vào bài kiểm tra"
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const WithSecondaryAction: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                title="Làm 2 thử thách của bài này"
                ctaLabel="Bắt đầu"
                onPress={() => {}}
                secondaryLabel="Làm capstone chương"
                secondaryOnPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const Full: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Làm dự án cá nhân: API giỏ hàng có phân trang"
                description="Ghép kiến thức REST và phân trang vừa học thành một dự án chấm điểm, đưa bạn gần hơn tới dải năng lực Middle Backend."
                ctaLabel="Xem đề bài"
                onPress={() => {}}
                secondaryLabel="Xem lại bài học"
                secondaryOnPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const LongContent: Story = {
    render: () =>
        blockShell(
            <UpNextCard
                showCheck
                eyebrow="Đã xong · Tiếp theo"
                title="Xây dựng hệ thống thông báo realtime dùng WebSocket kết hợp hàng đợi tin nhắn để xử lý lượng lớn kết nối đồng thời"
                description="Bài này nối tiếp phần kiến trúc event-driven đã học, đưa bạn tới gần hơn dải năng lực System Design cho vị trí Senior Backend trong lộ trình hiện tại."
                ctaLabel="Vào bài học tiếp theo"
                onPress={() => {}}
                secondaryLabel="Xem lại toàn bộ chương này trước khi tiếp tục"
                secondaryOnPress={() => {}}
            />,
            ANATOMY,
        ),
}
