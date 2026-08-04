import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    NotificationsDrawer,
    type NotificationItem,
    type NotificationsDrawerLabels,
} from "@sb-components/nivoexpert/overlays/drawers/NotificationsDrawer/NotificationsDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NotificationsDrawer` — the overlay opened from `ExpertDashboardShell`'s top
 * bar bell: the cross-domain notification feed, with one primary action —
 * mark every notification read.
 */
const meta: Meta<typeof NotificationsDrawer> = {
    title: "NivoExpert/Overlays/Drawers/NotificationsDrawer/NotificationsDrawer",
    component: NotificationsDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NotificationsDrawer>

const LABELS: NotificationsDrawerLabels = {
    title: "Notifications",
    emptyTitle: "You're all caught up",
    emptyDescription: "New course completions, orders, posts, and leads will show up here.",
    markAllReadLabel: "Mark all as read",
}

const NOTIFICATIONS: Array<NotificationItem> = [
    { id: "n1", kind: "completion", message: "A learner completed \"Advanced React\"", timeLabel: "2 minutes ago" },
    { id: "n2", kind: "order", message: "New order — 899,000 VND · Business plan", timeLabel: "18 minutes ago" },
    { id: "n3", kind: "community", message: "3 new community posts pending moderation", timeLabel: "1 hour ago" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    SurfaceCardList: { tier: "composite", role: "the notification feed, one row per event", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    EmptyState: { tier: "composite", role: "shown once every notification has been read" },
    Button: { tier: "atom", role: "the drawer's one primary action — mark every notification read" },
}

/** Shared controlled wrapper — one `isOpen` state feeds every leaf state below, matching how `AgentDetailDrawer`'s story shares its trigger across states. */
const ControlledNotificationsDrawer = () => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open notifications" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="NotificationsDrawer"
                tier="block"
                leaf="Notifications"
                annotate={ANNOTATE}
                reason="A presentational overlay drawer over the cross-domain notification feed (course completions, orders, community posts, leads). Marking every notification read is the drawer's ONE primary action — there is no per-row control, so the footer button stays the single, unambiguous next step."
                states={[
                    {
                        name: "notifications present",
                        why: "The common state: a mixed feed of recent events, newest first, with the mark-all-read action always available.",
                        code: `<NotificationsDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  notifications={notifications}
  onMarkAllRead={markAllRead}
  labels={labels}
/>`,
                        render: (
                            <NotificationsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                notifications={NOTIFICATIONS}
                                onMarkAllRead={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isMarkingAllRead = true",
                        why: "The mark-all-read mutation is in flight — the button shows its busy state so the operator can't double-submit.",
                        code: "<NotificationsDrawer isMarkingAllRead … />",
                        render: (
                            <NotificationsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                notifications={NOTIFICATIONS}
                                onMarkAllRead={() => {}}
                                isMarkingAllRead
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "notifications = [] (all read)",
                        why: "Every notification has already been read — the feed falls to its own empty state, and the mark-all-read action drops away since there is nothing left to mark.",
                        code: "<NotificationsDrawer notifications={[]} … />",
                        render: (
                            <NotificationsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                notifications={[]}
                                onMarkAllRead={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The drawer's own first fetch hasn't resolved yet, so the same layout shimmers end to end — the title and every row — matching the loaded drawer so nothing jumps when the feed lands.",
                        code: "<NotificationsDrawer isSkeleton … />",
                        render: (
                            <NotificationsDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                notifications={NOTIFICATIONS}
                                onMarkAllRead={() => {}}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** All four states (present, marking, empty, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledNotificationsDrawer />,
}
