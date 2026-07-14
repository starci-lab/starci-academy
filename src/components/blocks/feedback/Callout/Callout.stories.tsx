import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { Callout } from "./index"

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

export const Default: Story = {
    args: {
        status: "default",
    },
}

export const Accent: Story = {
    args: {
        status: "accent",
        title: "Có bản cập nhật mới cho khoá học",
        description: "3 bài học mới vừa được thêm vào lộ trình Fullstack Mastery.",
    },
}

export const Success: Story = {
    args: {
        status: "success",
        title: "Nộp bài thành công",
        description: "Bài nộp của bạn đã được ghi nhận và đang chờ chấm điểm.",
    },
}

export const Warning: Story = {
    args: {
        status: "warning",
        title: "Sắp hết hạn nộp bài",
        description: "Milestone \"API Gateway\" sẽ đóng sau 2 ngày nữa.",
    },
}

export const Danger: Story = {
    args: {
        status: "danger",
        title: "Nộp bài thất bại",
        description: "Không thể kết nối tới GitHub repo. Vui lòng thử lại.",
    },
}

/** Custom indicator icon replaces the default status icon; it inherits the status colour. */
export const WithCustomIcon: Story = {
    args: {
        status: "success",
        title: "Hoàn thành module",
        description: "Bạn đã hoàn thành toàn bộ 8 bài học trong module này.",
        icon: <CheckCircleIcon />,
    },
}

/** A trailing action (e.g. a `<Button>`) renders before the close button. */
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

/** `onClose` wires a HeroUI `CloseButton` (×) whose colour matches the status tint. */
export const Closable: Story = {
    args: {
        status: "warning",
        title: "Kết nối không ổn định",
        description: "Một số tính năng có thể hoạt động chậm hơn bình thường.",
        onClose: () => {},
        closeAriaLabel: "Đóng thông báo",
    },
}

/** No description — only the required title line is shown. */
export const TitleOnly: Story = {
    args: {
        status: "default",
        title: "Đã lưu bản nháp",
        description: undefined,
    },
}
