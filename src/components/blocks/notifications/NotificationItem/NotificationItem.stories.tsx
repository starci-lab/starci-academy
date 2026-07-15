import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
} from "@phosphor-icons/react"
import { NotificationItem } from "./index"

const meta: Meta<typeof NotificationItem> = {
    title: "Core/Notifications/NotificationItem",
    component: NotificationItem,
}
export default meta
type Story = StoryObj<typeof NotificationItem>

/**
 * Ba trạng thái cạnh nhau: chưa đọc (nền accent mờ + chấm accent), đã đọc (nền
 * trong suốt), và hàng có action ở cuối. Icon tile đổi màu theo `tone`, thời gian
 * là chuỗi tương đối đã định dạng sẵn.
 */
export const States: Story = {
    parameters: {
        usage: "Dùng cho một dòng thông báo trên nền tảng học tập: icon tile đổi màu theo tone, tiêu đề + body tuỳ chọn, nhãn thời gian định dạng sẵn, chấm accent + nền accent mờ khi chưa đọc, action slot ở cuối. Cả hàng bấm được khi có onPress.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Chưa đọc</Label>
                <Typography type="body-sm" color="muted">
                    Hàng chưa đọc có nền accent mờ và chấm accent cạnh tiêu đề — tín hiệu chưa đọc bằng token, không dùng lớp phủ trạng thái.
                </Typography>
                <NotificationItem
                    icon={<CheckCircleIcon />}
                    tone="success"
                    title="Bài nộp của bạn đã được chấm điểm"
                    body="Thử thách API Gateway — đạt 92/100, vượt qua toàn bộ test case."
                    timeLabel="2 giờ trước"
                    isUnread
                    onPress={() => {}}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Đã đọc</Label>
                <Typography type="body-sm" color="muted">
                    Hàng đã đọc bỏ nền tint và chấm accent, chỉ giữ hover khi bấm được.
                </Typography>
                <NotificationItem
                    icon={<FlameIcon />}
                    tone="warning"
                    title="Đừng để tuột chuỗi học 12 ngày của bạn"
                    body="Học thêm một bài hôm nay để giữ chuỗi streak."
                    timeLabel="Hôm qua"
                    onPress={() => {}}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Có action ở cuối</Label>
                <Typography type="body-sm" color="muted">
                    Action slot ở cuối hàng giữ nguyên kích thước, không ép cột văn bản co lại.
                </Typography>
                <NotificationItem
                    icon={<ChatCircleIcon />}
                    tone="accent"
                    title="Minh Quân đã trả lời bình luận của bạn"
                    body="Đúng rồi, chỗ đó nên tách ra thành một service riêng."
                    timeLabel="45 phút trước"
                    isUnread
                    actionSlot={
                        <Typography type="body-xs" className="text-accent-soft-foreground">
                            Xem
                        </Typography>
                    }
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
