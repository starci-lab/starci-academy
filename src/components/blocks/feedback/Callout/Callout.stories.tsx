import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { Callout, type CalloutStatus } from "./index"

/**
 * A tinted, flat note for use **inside a card / surface** — wraps HeroUI `Alert` +
 * `CloseButton` with a status-driven soft tint so it doesn't read as a card-in-card.
 */
const meta = {
    title: "Blocks/Callout",
    component: Callout,
    args: {
        title: "Bài học đã được lưu",
        description: "Tiến độ của bạn được đồng bộ tự động sau mỗi lần hoàn thành.",
    },
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

/** Dùng cho thông báo trung tính trong card (đã lưu nháp, ghi chú hệ thống) — không mang sắc thái cảnh báo/thành công. */
export const Default: Story = {
    args: {
        status: "default",
    },
}

const TONE_CONTENT: Record<CalloutStatus, { title: string; description: string }> = {
    default: {
        title: "Đã lưu bản nháp",
        description: "Tiến độ của bạn được đồng bộ tự động sau mỗi lần hoàn thành.",
    },
    accent: {
        title: "Có bản cập nhật mới cho khoá học",
        description: "3 bài học mới vừa được thêm vào lộ trình Fullstack Mastery.",
    },
    success: {
        title: "Nộp bài thành công",
        description: "Bài nộp của bạn đã được ghi nhận và đang chờ chấm điểm.",
    },
    warning: {
        title: "Sắp hết hạn nộp bài",
        description: "Milestone \"API Gateway\" sẽ đóng sau 2 ngày nữa.",
    },
    danger: {
        title: "Nộp bài thất bại",
        description: "Không thể kết nối tới GitHub repo. Vui lòng thử lại.",
    },
}

/** Dùng báo trạng thái mềm TRONG card (nộp bài OK / sắp hết hạn / lỗi kết nối / có bản cập nhật…) — không tạo card-trong-card. */
export const Tones: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {(Object.keys(TONE_CONTENT) as CalloutStatus[]).map((status) => (
                <Callout key={status} status={status} {...TONE_CONTENT[status]} />
            ))}
        </div>
    ),
}

/** Dùng khi thông báo gắn với một hành động cụ thể (hoàn thành module) — icon riêng giúp người dùng nhận diện nhanh hơn icon trạng thái mặc định. */
export const WithCustomIcon: Story = {
    args: {
        status: "success",
        title: "Hoàn thành module",
        description: "Bạn đã hoàn thành toàn bộ 8 bài học trong module này.",
        icon: <CheckCircleIcon />,
    },
}

/** Dùng khi muốn người dùng THỬ NGAY một tính năng mới (nút hành động đi kèm) thay vì chỉ đọc rồi bỏ qua. */
export const WithAction: Story = {
    args: {
        status: "accent",
        title: "Thử tính năng mới",
        description: "Luyện phỏng vấn AI vừa ra mắt, thử ngay hôm nay.",
        icon: <RocketLaunchIcon />,
        action: (
            <Button size="sm" variant="secondary">
                Thử ngay
            </Button>
        ),
    },
}

/** Dùng cho cảnh báo người dùng có thể tự tắt sau khi đã đọc (kết nối chập chờn) — không nên dùng cho lỗi cần được xử lý bắt buộc. */
export const Closable: Story = {
    args: {
        status: "warning",
        title: "Kết nối không ổn định",
        description: "Một số tính năng có thể hoạt động chậm hơn bình thường.",
        onClose: () => {},
        closeAriaLabel: "Đóng thông báo",
    },
}

/** Dùng khi thông điệp đã đủ rõ trong một dòng ngắn (đã lưu nháp) — tránh thêm mô tả thừa gây rối mắt. */
export const TitleOnly: Story = {
    args: {
        status: "default",
        title: "Đã lưu bản nháp",
        description: undefined,
    },
}
