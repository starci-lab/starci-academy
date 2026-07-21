import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { NotificationList } from "./NotificationList"
import type { NotificationGroup } from "./NotificationList"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof NotificationList> = {
    title: "Block/Notifications/NotificationList",
    component: NotificationList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NotificationList>

const ANATOMY = {
    primitives: [
        { name: "NotificationItem", role: "mỗi dòng thông báo (icon tone + title/body + thời gian + unread)" },
        { name: "EmptyState", role: "fallback khi không có thông báo nào" },
    ],
    reason:
        "Gom nhiều NotificationItem thành một danh sách cuộn có header (tiêu đề + đánh dấu đã đọc hết) và nhãn gom theo ngày; khi rỗng thì tự rơi về EmptyState thay vì một khối trống. Feature chỉ gom dữ liệu theo ngày và truyền các dòng đã format — không phải tự dựng lại header, nhóm, và trạng thái rỗng ở mỗi nơi.",
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

/** A framed surface so the list reads like it does inside the bell popover. */
const listFrame = (children: React.ReactNode) => (
    <div className="w-[380px] rounded-2xl border border-separator bg-surface p-1">{children}</div>
)

export const Populated: Story = {
    render: () =>
        blockShell(
            listFrame(<NotificationList title="Notifications" onMarkAllRead={() => {}} groups={SAMPLE_GROUPS} />),
            ANATOMY,
        ),
}

export const Empty: Story = {
    render: () =>
        blockShell(
            listFrame(
                <NotificationList
                    title="Notifications"
                    groups={[{ items: [] }]}
                    emptyState={
                        <EmptyState
                            title="Chưa có thông báo nào"
                            description="Khi có hoạt động mới trên khoá học của bạn, thông báo sẽ xuất hiện ở đây."
                        />
                    }
                />,
            ),
            ANATOMY,
        ),
}

/** One skeleton notification row — mirrors NotificationItem: tone tile + title/body/time text bars. */
const SkeletonNotificationRow = () => (
    <div className="flex w-full items-start gap-3 rounded-2xl p-3">
        <Skeleton className="size-10 shrink-0 rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton.Typography type="body-sm" width="3/4" />
            <Skeleton.Typography type="body-xs" width="full" />
            <Skeleton.Typography type="body-xs" width="1/3" />
        </div>
    </div>
)

export const SkeletonLoading: Story = {
    render: () =>
        blockShell(
            listFrame(
                <div className="flex flex-col">
                    {/* header: title + mark-all-read button */}
                    <div className="flex items-center justify-between gap-3 px-3 py-2">
                        <Skeleton.Typography type="body-sm" width="1/3" />
                        <Skeleton.Button width="w-28" />
                    </div>
                    {/* one day group: label + rows */}
                    <div className="flex max-h-[420px] flex-col gap-3 p-1">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="mx-3 mt-1 h-3 w-16 rounded" />
                            <SkeletonNotificationRow />
                            <SkeletonNotificationRow />
                            <SkeletonNotificationRow />
                        </div>
                    </div>
                </div>,
            ),
            ANATOMY,
        ),
}
