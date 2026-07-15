import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { Callout, type CalloutStatus, STATUS_ACTION_CLASS } from "./index"

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
    parameters: {
        usage: "Dùng cho thông báo trung tính trong card (đã lưu nháp, ghi chú hệ thống) — không mang sắc thái cảnh báo/thành công.",
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
    parameters: {
        usage: "Dùng báo trạng thái mềm TRONG card (nộp bài OK / sắp hết hạn / lỗi kết nối / có bản cập nhật…) — không tạo card-trong-card.",
    },
}

/** Dùng khi thông báo gắn với một hành động cụ thể (hoàn thành module) — icon riêng giúp người dùng nhận diện nhanh hơn icon trạng thái mặc định. */
export const WithCustomIcon: Story = {
    args: {
        status: "success",
        title: "Hoàn thành module",
        description: "Bạn đã hoàn thành toàn bộ 8 bài học trong module này.",
        icon: <CheckCircleIcon />,
    },
    parameters: {
        usage: "Dùng khi thông báo gắn với một hành động cụ thể (hoàn thành module) — icon riêng giúp người dùng nhận diện nhanh hơn icon trạng thái mặc định.",
    },
}

/** Action button per example — the callout's own tone/icon/copy + its CTA label. */
const ACTION_EXAMPLES: Array<{
    status: CalloutStatus
    title: string
    description: string
    icon: React.ReactNode
    actionLabel: string
}> = [
    {
        status: "accent",
        title: "Thử tính năng mới",
        description: "Luyện phỏng vấn AI vừa ra mắt, thử ngay hôm nay.",
        icon: <RocketLaunchIcon />,
        actionLabel: "Thử ngay",
    },
    {
        status: "success",
        title: "Chấm điểm xong",
        description: "Bài nộp của bạn đạt 92/100 — xem chi tiết nhận xét.",
        icon: <CheckCircleIcon />,
        actionLabel: "Xem nhận xét",
    },
    {
        status: "warning",
        title: "Còn 1 bài tập chưa nộp",
        description: "Milestone \"API Gateway\" đóng sau 2 ngày nữa.",
        icon: <RocketLaunchIcon />,
        actionLabel: "Nộp bài ngay",
    },
]

/**
 * Dùng khi muốn người dùng THỬ NGAY một tính năng mới (nút hành động đi kèm) thay vì
 * chỉ đọc rồi bỏ qua. Action luôn `variant="secondary"` + `STATUS_ACTION_CLASS` (KHÔNG
 * HeroUI `secondary` mặc định — nền `--default` gần trắng hoà vào tint callout).
 * `STATUS_ACTION_CLASS` = nền ĐẶC `bg-<status>` (không phải `/10` như tint callout) +
 * `text-<status>-foreground` — tách biệt rõ khỏi nền nhạt của callout mà vẫn cùng
 * family màu với tone riêng của từng callout, không đặc accent cho mọi tone.
 */
export const WithAction: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {ACTION_EXAMPLES.map((example) => (
                <Callout
                    key={example.status}
                    status={example.status}
                    title={example.title}
                    description={example.description}
                    icon={example.icon}
                    action={(
                        <Button size="sm" variant="secondary" className={STATUS_ACTION_CLASS[example.status]}>
                            {example.actionLabel}
                        </Button>
                    )}
                />
            ))}
        </div>
    ),
    parameters: {
        usage: "Dùng khi muốn người dùng THỬ NGAY một tính năng mới (nút hành động đi kèm) thay vì chỉ đọc rồi bỏ qua. Action `variant=\"secondary\"` + nền đặc `bg-<status>` riêng theo tone (không phải `/10` như tint callout) — tách biệt rõ khỏi nền nhạt của callout mà vẫn cùng màu, không đặc accent cho mọi tone.",
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
    parameters: {
        usage: "Dùng cho cảnh báo người dùng có thể tự tắt sau khi đã đọc (kết nối chập chờn) — không nên dùng cho lỗi cần được xử lý bắt buộc.",
    },
}

/** Dùng khi thông điệp đã đủ rõ trong một dòng ngắn (đã lưu nháp) — tránh thêm mô tả thừa gây rối mắt. */
export const TitleOnly: Story = {
    args: {
        status: "default",
        title: "Đã lưu bản nháp",
        description: undefined,
    },
    parameters: {
        usage: "Dùng khi thông điệp đã đủ rõ trong một dòng ngắn (đã lưu nháp) — tránh thêm mô tả thừa gây rối mắt.",
    },
}
