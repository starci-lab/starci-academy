import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { NotificationBell } from "./NotificationBell"
import type { NotificationGroup } from "../NotificationList/NotificationList"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof NotificationBell> = {
    title: "Block/Notifications/NotificationBell",
    component: NotificationBell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NotificationBell>

const ANATOMY = {
    primitives: [
        { name: "NotificationList", role: "nội dung panel: danh sách thông báo gom theo ngày + header đánh dấu đã đọc" },
    ],
    reason:
        "Nút chuông ở navbar gộp badge đếm chưa đọc (ẩn ở 0, chốt '9+') với một Popover mở ra NotificationList. Đóng gói cả affordance điểm-vào lẫn panel nội dung vào một block, để navbar chỉ truyền unreadCount + groups mà không phải tự nối badge, popover, và list.",
}

/** Date-based groups ("Today" / "Earlier") with real learning data and pre-formatted times. */
const SAMPLE_GROUPS: NotificationGroup[] = [
    {
        label: "Today",
        items: [
            {
                icon: <CheckCircleIcon />,
                tone: "success",
                title: "Your submission has been graded",
                body: "API Gateway challenge — scored 92/100.",
                timeLabel: "2 hours ago",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <ChatCircleIcon />,
                tone: "accent",
                title: "Ethan replied to your comment",
                body: "Right, that part should be split out into its own service.",
                timeLabel: "45 minutes ago",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <VideoCameraIcon />,
                tone: "warning",
                title: "Your mock interview is about to start",
                body: "System Design interview at 8:00 PM — about an hour to go.",
                timeLabel: "1 hour ago",
                onPress: () => {},
            },
        ],
    },
    {
        label: "Earlier",
        items: [
            {
                icon: <BookOpenIcon />,
                tone: "accent",
                title: "New course just launched: Kubernetes in practice",
                body: "Enroll early this week to get a special offer.",
                timeLabel: "Yesterday",
                onPress: () => {},
            },
            {
                icon: <FlameIcon />,
                tone: "warning",
                title: "Don't lose your 12-day study streak",
                body: "Study one more lesson today to keep your streak going.",
                timeLabel: "2 days ago",
                onPress: () => {},
            },
        ],
    },
]

/**
 * Local controlled wrapper — each specimen owns its own open/close state (via
 * `isOpen` + `onOpenChange`) so its popover can be shown independently.
 */
const NotificationBellDemo = ({
    unreadCount,
    defaultOpen,
}: {
    unreadCount: number
    defaultOpen: boolean
}) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    return (
        <div className="flex min-h-[420px] items-start justify-end pr-2">
            <NotificationBell
                unreadCount={unreadCount}
                groups={SAMPLE_GROUPS}
                onMarkAllRead={() => {}}
                isOpen={isOpen}
                onOpenChange={setOpen}
            />
        </div>
    )
}

export const WithUnread: Story = {
    render: () => blockShell(<NotificationBellDemo unreadCount={3} defaultOpen />, ANATOMY),
}

export const NoUnread: Story = {
    render: () => blockShell(<NotificationBellDemo unreadCount={0} defaultOpen={false} />, ANATOMY),
}

export const OverCap: Story = {
    render: () => blockShell(<NotificationBellDemo unreadCount={15} defaultOpen={false} />, ANATOMY),
}
