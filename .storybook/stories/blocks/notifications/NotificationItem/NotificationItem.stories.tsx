import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
} from "@phosphor-icons/react"
import { NotificationItem } from "@/components/blocks/notifications/NotificationItem"

const meta: Meta<typeof NotificationItem> = {
    title: "Core/Notifications/NotificationItem",
    component: NotificationItem,
}
export default meta
type Story = StoryObj<typeof NotificationItem>

/**
 * Three states side by side: unread (soft accent background + accent dot), read
 * (transparent background), and a row with a trailing action. The icon tile changes
 * color by `tone`, and the time is a pre-formatted relative string.
 */
export const States: Story = {
    parameters: {
        usage: "Use for a single notification row on the learning platform: an icon tile colored by tone, a title + optional body, a pre-formatted time label, an accent dot + soft accent background when unread, and a trailing action slot. The whole row is clickable when onPress is set.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Unread</Label>
                <Typography type="body-sm" color="muted">
                    An unread row has a soft accent background and an accent dot next to the title — the unread signal comes from tokens, not a state overlay.
                </Typography>
                <NotificationItem
                    icon={<CheckCircleIcon />}
                    tone="success"
                    title="Your submission has been graded"
                    body="API Gateway challenge — scored 92/100, passed every test case."
                    timeLabel="2 hours ago"
                    isUnread
                    onPress={() => {}}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Read</Label>
                <Typography type="body-sm" color="muted">
                    A read row drops the tint background and accent dot, keeping only hover when clickable.
                </Typography>
                <NotificationItem
                    icon={<FlameIcon />}
                    tone="warning"
                    title="Don't lose your 12-day study streak"
                    body="Study one more lesson today to keep your streak going."
                    timeLabel="Yesterday"
                    onPress={() => {}}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>With a trailing action</Label>
                <Typography type="body-sm" color="muted">
                    The trailing action slot keeps its size and doesn't force the text column to shrink.
                </Typography>
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
            </div>
        </div>
    ),
}
