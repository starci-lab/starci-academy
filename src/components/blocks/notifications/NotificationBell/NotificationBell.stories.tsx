import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { NotificationBell } from "./index"
import type { NotificationGroup } from "../NotificationList"

const meta: Meta<typeof NotificationBell> = {
    title: "Block/Notifications/NotificationBell",
    component: NotificationBell,
}
export default meta
type Story = StoryObj<typeof NotificationBell>

/** Dữ liệu mẫu cho popover, thời gian định dạng sẵn. */
const SAMPLE_GROUPS: NotificationGroup[] = [
    {
        label: "Hôm nay",
        items: [
            {
                icon: <CheckCircleIcon />,
                tone: "success",
                title: "Bài nộp của bạn đã được chấm điểm",
                body: "Thử thách API Gateway — đạt 92/100.",
                timeLabel: "2 giờ trước",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <ChatCircleIcon />,
                tone: "accent",
                title: "Minh Quân đã trả lời bình luận của bạn",
                body: "Đúng rồi, chỗ đó nên tách ra thành một service riêng.",
                timeLabel: "45 phút trước",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <VideoCameraIcon />,
                tone: "warning",
                title: "Buổi phỏng vấn thử sắp bắt đầu",
                body: "Phỏng vấn System Design lúc 20:00.",
                timeLabel: "1 giờ trước",
                isUnread: true,
                onPress: () => {},
            },
        ],
    },
    {
        label: "Trước đó",
        items: [
            {
                icon: <BookOpenIcon />,
                tone: "accent",
                title: "Khoá học mới vừa mở: Kubernetes thực chiến",
                body: "Đăng ký sớm trong tuần này để nhận ưu đãi.",
                timeLabel: "Hôm qua",
                onPress: () => {},
            },
        ],
    },
]

/**
 * Nút chuông có badge đếm số chưa đọc (ẩn khi bằng 0, chốt "9+" khi vượt ngưỡng),
 * bấm mở popover chứa NotificationList. Story điều khiển open bằng state ngoài để
 * panel hiển thị sẵn trong canvas.
 */
export const WithUnreadCount: Story = {
    parameters: {
        usage: "Dùng ở navbar: nút chuông mang badge đếm số chưa đọc, bấm mở popover danh sách thông báo gần đây. Badge ẩn khi bằng 0 và chốt ở '9+' khi vượt ngưỡng. Hỗ trợ cả điều khiển (isOpen + onOpenChange) lẫn không điều khiển.",
    },
    render: () => {
        const [isOpen, setOpen] = useState(true)
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label>Có số chưa đọc (điều khiển mở)</Label>
                    <Typography type="body-sm" color="muted">
                        Badge hiển thị số chưa đọc; popover mở sẵn để thấy danh sách nhóm theo ngày bên trong.
                    </Typography>
                </div>
                <div className="flex min-h-[520px] items-start justify-end pr-2">
                    <NotificationBell
                        unreadCount={3}
                        groups={SAMPLE_GROUPS}
                        onMarkAllRead={() => {}}
                        isOpen={isOpen}
                        onOpenChange={setOpen}
                    />
                </div>
            </div>
        )
    },
}
