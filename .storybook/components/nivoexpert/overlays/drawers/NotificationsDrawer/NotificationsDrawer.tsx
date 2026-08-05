import { ChatCircleIcon, ReceiptIcon, TargetIcon, TrophyIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import type { SkeletonProps } from "@sb-components/frames/_slot"

/**
 * `NotificationsDrawer` -- the overlay opened from `ExpertDashboardShell`'s top
 * bar bell: the cross-domain notification feed, with one primary action --
 * mark every notification read.
 */

/** The four sources folded into one feed -- same vocabulary `ExpertDashboardOverview`'s activity feed uses. */
export type NotificationKind = "completion" | "order" | "community" | "lead"

/** One notification -- already resolved to a single display line + a relative time. */
export interface NotificationItem {
    /** Stable id. */
    id: string
    /** Which domain source this notification came from -- decides the leading icon. */
    kind: NotificationKind
    /** The already-resolved display line (e.g. "A learner completed \"Advanced React\""). */
    message: string
    /** Already-formatted relative time (e.g. "2 minutes ago"). */
    timeLabel: string
}

/** Props for {@link NotificationsDrawer}. */
export interface NotificationsDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The feed, newest first. Empty is the drawer's own empty state. */
    notifications: Array<NotificationItem>
    /** Mark every notification read -- the connected layer runs the mutation and closes the drawer. */
    onMarkAllRead: () => void
    /** `true` -> the mark-all-read mutation is in flight (button busy, locked). */
    isMarkingAllRead?: boolean
    /**
     * `true` -> the drawer's own first fetch is in flight: the title and every
     * row shimmer. Threaded straight down -- never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: NotificationsDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface NotificationsDrawerLabels {
    /** Drawer title (e.g. "Notifications"). */
    title: string
    /** Empty-state title when there is nothing to show. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Primary action label -- mark every notification read. */
    markAllReadLabel: string
}

/** `kind` -> leading icon. A lookup, not a caller choice -- the feed owns what each source means. */
const KIND_ICON: Record<NotificationKind, typeof ReceiptIcon> = {
    completion: TrophyIcon,
    order: ReceiptIcon,
    community: ChatCircleIcon,
    lead: TargetIcon,
}

/** How many placeholder rows the skeleton draws while `notifications` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows -- sized like a real notification so the shimmer mirrors the loaded shape. */
const SKELETON_ITEMS: Array<NotificationItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    kind: "order",
    message: "Notification placeholder message",
    timeLabel: "2 minutes ago",
}))

/**
 * The notifications drawer. See the file header for why marking-all-read is
 * the one primary action rather than a per-row control.
 *
 * @param props - {@link NotificationsDrawerProps}
 */
const NotificationsDrawer = ({
    isOpen,
    onOpenChange,
    notifications,
    onMarkAllRead,
    isMarkingAllRead = false,
    isSkeleton = false,
    labels,
}: NotificationsDrawerProps) => {
    const rows = isSkeleton ? SKELETON_ITEMS : notifications
    const isEmpty = !isSkeleton && notifications.length === 0

    const items: Array<SurfaceCardListItem> = rows.map((item) => ({
        key: item.id,
        leadingIcon: KIND_ICON[item.kind],
        title: item.message,
        trailing: () => <Typography size="xs" color="muted" text={item.timeLabel} />,
    }))

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            title={labels.title}
            isSkeleton={isSkeleton}
            body={({ isSkeleton: skeleton }: SkeletonProps) => (
                <SurfaceCardList
                    variant="nested"
                    items={items}
                    isSkeleton={skeleton}
                    emptyState={() => (
                        <EmptyState icon={ReceiptIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                    )}
                />
            )}
            footer={!isEmpty ? () => (
                <Button
                    variant="primary"
                    label={labels.markAllReadLabel}
                    onPress={onMarkAllRead}
                    isPending={isMarkingAllRead}
                    isDisabled={isSkeleton}
                />
            ) : undefined}
        />
    )
}

export { NotificationsDrawer }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "NotificationsDrawer" } as const
