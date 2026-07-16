import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { NotificationBell } from "@/components/blocks/notifications/NotificationBell"
import { SAMPLE_GROUPS } from "./components"

const meta: Meta<typeof NotificationBell> = {
    title: "Blocks/Notifications/NotificationBell",
    component: NotificationBell,
}
export default meta
type Story = StoryObj<typeof NotificationBell>

/**
 * A bell button with an unread-count badge (hidden at 0, capped at "9+" past the
 * threshold) that opens a popover containing NotificationList on click. The story
 * controls open via external state so the panel is shown in the canvas.
 */
export const WithUnreadCount: Story = {
    parameters: {
        usage: "Use in the navbar: a bell button with an unread-count badge that opens a popover of recent notifications on click. The badge is hidden at 0 and caps at '9+' past the threshold. Supports both controlled (isOpen + onOpenChange) and uncontrolled use.",
    },
    render: () => {
        const [isOpen, setOpen] = useState(true)
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label>With an unread count (controlled open)</Label>
                    <Typography type="body-sm" color="muted">
                        The badge shows the unread count; the popover is open to reveal the date-grouped list inside.
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
