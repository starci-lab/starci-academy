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
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

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

/** Plain canvas — each leaf wraps its own BlockAnatomy panel below. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Shared popover panel subtree — identical across every leaf (only the bell
// trigger's badge differs). `PopoverContent` FRAMES the `NotificationList` block,
// whose header (title + mark-all-read button) sits above the day-grouped rows.
// Mirrors the real DOM: PopoverContent → NotificationList → { header parts, rows }.
const PANEL_PART: AnatomyNode = {
    name: "PopoverContent",
    tier: "primitive",
    role: "panel nổi 360px neo dưới-phải nút chuông",
    children: [
        {
            name: "NotificationList",
            tier: "block",
            role: "danh sách gom theo ngày + header đánh dấu đã đọc",
            children: [
                { name: "Typography", tier: "primitive", role: 'tiêu đề panel ("Thông báo")' },
                {
                    name: "Button · markAllRead",
                    tier: "primitive",
                    role: "nút đánh dấu tất cả đã đọc (tertiary, sm)",
                    children: [
                        { name: "ChecksIcon", tier: "primitive", role: "icon check dẫn đầu nút" },
                        { name: "Typography", tier: "primitive", role: 'nhãn "Đánh dấu tất cả đã đọc"' },
                    ],
                },
                {
                    name: "NotificationItem",
                    tier: "design",
                    role: "một dòng thông báo (lặp ×N theo group)",
                    children: [
                        { name: "IconTile", tier: "primitive", role: "ô icon dẫn đầu, màu theo tone" },
                        {
                            name: "Typography",
                            tier: "primitive",
                            role: "cột chữ: tiêu đề · nội dung · nhãn thời gian",
                        },
                    ],
                },
            ],
        },
    ],
}

// WITH-BADGE composition (unread > 0): the bell trigger carries a count Badge
// (anchored over the BellIcon via Badge.Anchor) and opens the shared panel.
const WITH_BADGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Popover",
        tier: "primitive",
        role: "gốc: neo nút chuông với panel nổi, đóng/mở có kiểm soát",
        children: [
            {
                name: "Button · iconOnly",
                tier: "primitive",
                role: "nút chuông mở popover (tertiary, bo tròn)",
                children: [
                    {
                        name: "Badge.Anchor",
                        tier: "primitive",
                        role: "neo badge đếm vào góc chuông",
                        children: [
                            { name: "BellIcon", tier: "primitive", role: "biểu tượng chuông" },
                            { name: "Badge", tier: "primitive", role: 'đếm chưa đọc, chốt "9+"', state: "danger" },
                        ],
                    },
                ],
            },
            PANEL_PART,
        ],
    },
]

// NO-BADGE composition (unread = 0): same tree WITHOUT the Badge — the trigger's
// icon is a bare BellIcon (no Badge.Anchor wrapper), then the same shared panel.
const NO_BADGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Popover",
        tier: "primitive",
        role: "gốc: neo nút chuông với panel nổi, đóng/mở có kiểm soát",
        children: [
            {
                name: "Button · iconOnly",
                tier: "primitive",
                role: "nút chuông mở popover (tertiary, bo tròn) — không badge ở 0",
                children: [
                    { name: "BellIcon", tier: "primitive", role: "biểu tượng chuông (không badge ở 0)" },
                ],
            },
            PANEL_PART,
        ],
    },
]

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
                showAnatomy
            />
        </div>
    )
}

/** WITH UNREAD — badge shows the count and the popover is open over NotificationList. */
export const WithUnread: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationBell"
                tier="block"
                leaf="Có chưa đọc"
                parts={WITH_BADGE_PARTS}
                reason="Nút chuông ở navbar gộp badge đếm chưa đọc (ẩn ở 0, chốt '9+') với một Popover mở ra NotificationList. Đóng gói cả affordance điểm-vào lẫn panel nội dung vào một block, để navbar chỉ truyền unreadCount + groups mà không phải tự nối badge, popover, và list."
            >
                <NotificationBellDemo unreadCount={3} defaultOpen />
            </BlockAnatomy>,
        ),
}

/** NO UNREAD — count is zero → the badge is hidden entirely (bell only). */
export const NoUnread: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationBell"
                tier="block"
                leaf="Đã đọc hết"
                parts={NO_BADGE_PARTS}
                note="unreadCount = 0 → Badge biến mất hoàn toàn, chỉ còn nút chuông; composition khác leaf 'Có chưa đọc'."
            >
                <NotificationBellDemo unreadCount={0} defaultOpen={false} />
            </BlockAnatomy>,
        ),
}

/** OVER CAP — count above the threshold → the badge caps at "9+". Same composition as WithUnread. */
export const OverCap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationBell"
                tier="block"
                leaf="Vượt ngưỡng"
                parts={WITH_BADGE_PARTS}
                note='unreadCount > 9 → Badge chốt nhãn "9+" nhưng CÙNG composition với leaf "Có chưa đọc".'
            >
                <NotificationBellDemo unreadCount={15} defaultOpen={false} />
            </BlockAnatomy>,
        ),
}
