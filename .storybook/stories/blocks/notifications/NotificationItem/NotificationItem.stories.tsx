import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Typography } from "@heroui/react"
import { BellIcon, ChatCircleIcon, CheckCircleIcon, FlameIcon } from "@phosphor-icons/react"
import { NotificationItem } from "./NotificationItem"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof NotificationItem> = {
    title: "Design/Notifications/NotificationItem",
    component: NotificationItem,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NotificationItem>

const ANATOMY = {
    primitives: [
        {
            name: "IconTile",
            role: "ô icon vuông tô màu theo tone (default/success/warning/accent) — hiện đang inline trong block (size-10), nên compose IconTile khi sync về src",
        },
    ],
    reason:
        "Một dòng thông báo gộp ô icon theo tone + cột title/body + nhãn thời gian đã format + tín hiệu unread (dot accent + nền accent nhạt) + action slot cuối dòng, để feature chỉ ánh xạ kind → icon/tone và truyền copy đã dịch. Cả dòng bấm được khi có onPress.",
}

/** Default — neutral `tone="default"`, already read, no `onPress` (static row, not interactive). */
export const Default: Story = {
    render: () =>
        blockShell(
            <NotificationItem
                icon={<BellIcon />}
                title="A new lesson was published in your course"
                body="System Design Mastery — module 4, lesson 3 is now available."
                timeLabel="3 days ago"
            />,
            ANATOMY,
        ),
}

export const Unread: Story = {
    render: () =>
        blockShell(
            <NotificationItem
                icon={<CheckCircleIcon />}
                tone="success"
                title="Your submission has been graded"
                body="API Gateway challenge — scored 92/100, passed every test case."
                timeLabel="2 hours ago"
                isUnread
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const Read: Story = {
    render: () =>
        blockShell(
            <NotificationItem
                icon={<FlameIcon />}
                tone="warning"
                title="Don't lose your 12-day study streak"
                body="Study one more lesson today to keep your streak going."
                timeLabel="Yesterday"
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

export const WithAction: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}

/** No icon — a text-only row; the leading icon tile is omitted entirely (`icon` not passed). */
export const TextOnly: Story = {
    name: "Không icon",
    render: () =>
        blockShell(
            <NotificationItem
                title="Your payment method was updated"
                body="Visa ending in 4242 is now your default payment method."
                timeLabel="1 day ago"
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

/** No body — title-only row, the optional secondary detail line is omitted. */
export const TitleOnly: Story = {
    name: "Chỉ tiêu đề",
    render: () =>
        blockShell(
            <NotificationItem
                icon={<CheckCircleIcon />}
                tone="success"
                title="Your certificate has been issued"
                timeLabel="Just now"
                isUnread
                onPress={() => {}}
            />,
            ANATOMY,
        ),
}

/** Long title + body — both `line-clamp-2`, so overflow clips to two lines instead of pushing the row taller. */
export const LongText: Story = {
    name: "Chữ dài (clamp 2 dòng)",
    render: () =>
        blockShell(
            <div className="w-80">
                <NotificationItem
                    icon={<FlameIcon />}
                    tone="warning"
                    title="Don't lose your 45-day study streak — you have studied every single day since you first enrolled and it would be a shame to lose it now"
                    body="Study one more lesson today to keep your streak going, otherwise your progress resets back down to zero and you will have to start building it up again from scratch"
                    timeLabel="6 hours ago"
                    onPress={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}
