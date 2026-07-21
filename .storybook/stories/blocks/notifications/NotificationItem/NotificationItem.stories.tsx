import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Typography } from "@heroui/react"
import { ChatCircleIcon, CheckCircleIcon, FlameIcon } from "@phosphor-icons/react"
import { NotificationItem } from "./NotificationItem"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof NotificationItem> = {
    title: "Block/Notifications/NotificationItem",
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
