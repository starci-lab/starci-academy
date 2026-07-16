import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { NotificationList } from "@/components/blocks/notifications/NotificationList"
import { SAMPLE_GROUPS } from "./components"

const meta: Meta<typeof NotificationList> = {
    title: "Block/Notifications/NotificationList",
    component: NotificationList,
}
export default meta
type Story = StoryObj<typeof NotificationList>

/** A list with a header + date grouping, scrolling within a fixed max height. */
export const Grouped: Story = {
    parameters: {
        usage: "Use for a notification list with a header (title + mark-all-as-read button) and date-group labels. The list body scrolls within a max height so a long history doesn't balloon the container.",
    },
    render: () => (
        <div className="flex w-[380px] flex-col gap-2 rounded-2xl border border-separator bg-surface p-1">
            <NotificationList
                title="Notifications"
                onMarkAllRead={() => {}}
                groups={SAMPLE_GROUPS}
            />
        </div>
    ),
}

/** No notifications — falls back to the default empty state (reuses feedback/EmptyState). */
export const Empty: Story = {
    parameters: {
        usage: "When there are no notifications, the list shows an empty state (reuses feedback/EmptyState) instead of a blank container — it still keeps the header if one is passed.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Empty</Label>
                <Typography type="body-sm" color="muted">
                    Every group has no items, so the list falls back to the default empty state.
                </Typography>
            </div>
            <div className="w-[380px] rounded-2xl border border-separator bg-surface p-1">
                <NotificationList
                    title="Notifications"
                    groups={[{ items: [] }]}
                />
            </div>
        </div>
    ),
}
