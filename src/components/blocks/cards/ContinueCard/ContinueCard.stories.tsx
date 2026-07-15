import type { Meta, StoryObj } from "@storybook/nextjs"
import { FireIcon, ClockIcon } from "@phosphor-icons/react"
import { ContinueCard } from "./index"

const meta: Meta<typeof ContinueCard> = {
    title: "Blocks/Card/ContinueCard",
    component: ContinueCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ContinueCard>

/** Dùng cho thẻ "học tiếp" mặc định: cả thẻ là một liên kết duy nhất, kèm thanh tiến độ và nhãn CTA dạng chữ. */
export const Default: Story = {
    parameters: { usage: "Dùng cho thẻ \"học tiếp\" mặc định: cả thẻ là một liên kết duy nhất, kèm thanh tiến độ và nhãn CTA dạng chữ." },
    render: () => (
        <div className="w-96">
            <ContinueCard
                cover={
                    <img
                        src="https://placehold.co/56x56/png"
                        alt=""
                        className="size-14 rounded-lg object-cover"
                    />
                }
                title="Xây dựng API RESTful với NestJS"
                subtitle="Module 3 · Bài 5"
                value={62}
                max={100}
                ctaLabel="Tiếp tục"
                href="/courses/nestjs-api/lessons/5"
            />
        </div>
    ),
}

/** Dùng khi muốn CTA nổi bật thành nút bấm thật (variant="chip") thay vì chỉ là chữ có màu, ví dụ khi thẻ nằm trong danh sách cần điểm nhấn hành động rõ ràng. */
export const ChipCta: Story = {
    parameters: { usage: "Dùng khi muốn CTA nổi bật thành nút bấm thật (variant=\"chip\") thay vì chỉ là chữ có màu, ví dụ khi thẻ nằm trong danh sách cần điểm nhấn hành động rõ ràng." },
    render: () => (
        <div className="w-96">
            <ContinueCard
                title="Thiết kế hệ thống: Rate Limiter phân tán"
                subtitle="Module 7 · Bài 2"
                value={30}
                max={100}
                ctaLabel="Học tiếp"
                ctaVariant="chip"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng khi phụ đề mang một mốc thời gian có thật do hệ thống áp đặt (ví dụ hạn nộp bài), cần tô màu cảnh báo thay vì màu muted mặc định — không dùng cho đếm ngược giả. */
export const UrgentDeadline: Story = {
    parameters: { usage: "Dùng khi phụ đề mang một mốc thời gian có thật do hệ thống áp đặt (ví dụ hạn nộp bài), cần tô màu cảnh báo thay vì màu muted mặc định — không dùng cho đếm ngược giả." },
    render: () => (
        <div className="w-96">
            <ContinueCard
                badgeIcon={<ClockIcon aria-hidden focusable="false" />}
                title="Bài kiểm tra: Thiết kế cơ sở dữ liệu"
                subtitle="Còn 12 phút để nộp bài"
                value={80}
                max={100}
                ctaLabel="Tiếp tục làm bài"
                urgent
                href="/courses/db-design/exams/final"
            />
        </div>
    ),
}

/** Dùng cho thẻ luyện tập theo chuỗi ngày (streak) không cần thanh tiến độ vì bản chất không có phần trăm hoàn thành — CTA được đưa xuống hàng riêng để nhường chỗ cho biểu tượng nền. */
export const StreakNoProgress: Story = {
    parameters: { usage: "Dùng cho thẻ luyện tập theo chuỗi ngày (streak) không cần thanh tiến độ vì bản chất không có phần trăm hoàn thành — CTA được đưa xuống hàng riêng để nhường chỗ cho biểu tượng nền." },
    render: () => (
        <div className="w-96">
            <ContinueCard
                badgeIcon={<FireIcon aria-hidden focusable="false" />}
                watermarkIcon={<FireIcon aria-hidden focusable="false" />}
                title="Chuỗi ôn flashcard hằng ngày"
                subtitle="7 ngày liên tiếp"
                value={0}
                hideProgress
                ctaLabel="Ôn ngay"
                ctaBelow
                ctaVariant="chip"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng khi cần đánh dấu đây là mục "của tôi" nổi bật hơn các thẻ khác trong danh sách — viền accent thay vì tô nền tràn màu. */
export const Accented: Story = {
    parameters: { usage: "Dùng khi cần đánh dấu đây là mục \"của tôi\" nổi bật hơn các thẻ khác trong danh sách — viền accent thay vì tô nền tràn màu." },
    render: () => (
        <div className="w-96">
            <ContinueCard
                title="Dự án cá nhân: Xây dựng blog full-stack"
                subtitle="Milestone 2 · Đang thực hiện"
                value={45}
                max={100}
                ctaLabel="Tiếp tục"
                accented
                href="/milestones/personal-blog"
            />
        </div>
    ),
}
