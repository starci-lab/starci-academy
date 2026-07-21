import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import {
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
} from "@phosphor-icons/react"
import { NotificationItem } from "@/components/blocks/notifications/NotificationItem"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof NotificationItem> = {
    title: "Blocks/Notifications/NotificationItem",
    component: NotificationItem,
}
export default meta
type Story = StoryObj<typeof NotificationItem>

/**
 * Toàn bộ trạng thái của một dòng thông báo trên nền tảng học tập: unread (nền
 * accent nhạt + dot accent), read (nền trong suốt), và dòng có thêm action slot
 * ở cuối. Icon tile đổi màu theo `tone`, time là chuỗi tương đối đã format sẵn.
 * Cả dòng bấm được khi có `onPress`.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Chưa đọc (unread)"
                hint="Dòng chưa đọc có nền accent nhạt và một dot accent cạnh title — tín hiệu unread đến từ token, không phải overlay trạng thái."
            >
                <NotificationItem
                    icon={<CheckCircleIcon />}
                    tone="success"
                    title="Your submission has been graded"
                    body="API Gateway challenge — scored 92/100, passed every test case."
                    timeLabel="2 hours ago"
                    isUnread
                    onPress={() => {}}
                />
            </Variant>
            <Variant
                label="Đã đọc (read)"
                hint="Dòng đã đọc bỏ nền tint và dot accent, chỉ giữ hover khi vẫn bấm được."
            >
                <NotificationItem
                    icon={<FlameIcon />}
                    tone="warning"
                    title="Don't lose your 12-day study streak"
                    body="Study one more lesson today to keep your streak going."
                    timeLabel="Yesterday"
                    onPress={() => {}}
                />
            </Variant>
            <Variant
                label="Có action slot ở cuối"
                hint="Action slot ở cuối dòng giữ nguyên kích thước, không ép cột text co lại."
            >
                <NotificationItem
                    icon={<ChatCircleIcon />}
                    tone="accent"
                    title="Ethan replied to your comment"
                    body="Right, that part should be split out into its own service."
                    timeLabel="45 minutes ago"
                    isUnread
                    actionSlot={
                        <Typography type="body-xs" className="text-accent-soft-foreground">
                            View
                        </Typography>
                    }
                    onPress={() => {}}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage: "Dùng cho một dòng thông báo đơn trên nền tảng học tập: icon tile tô màu theo tone, title + body tuỳ chọn, time label đã format sẵn, dot accent + nền accent nhạt khi unread, và action slot ở cuối. Cả dòng bấm được khi có onPress.",
    },
}
