import { GlobeIcon, LifebuoyIcon, ReceiptIcon, TargetIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"

/**
 * `RecentActivityCard` — the account's cross-domain activity feed: an
 * invoice getting paid, a lead landing on the expert site, a domain nearing
 * expiry, a support reply. Two DATA states of the single shape: `empty` and
 * `with-rows`.
 */

/** The four activity sources this feed folds together. */
export type ActivityKind = "invoice" | "lead" | "domain" | "support"

/** One activity entry — already resolved to a single display line + a relative time. */
export interface RecentActivityItem {
    /** Stable id. */
    id: string
    /** Which domain source this entry came from — decides the leading icon. */
    kind: ActivityKind
    /** The already-resolved display line (e.g. "Invoice #INV-1042 has been paid"). */
    message: string
    /** Already-formatted relative time (e.g. "2 hours ago"). */
    timeLabel: string
}

/** Props for {@link RecentActivityCard}. */
export interface RecentActivityCardProps {
    /** The feed, newest first. */
    items: Array<RecentActivityItem>
    /**
     * `true` → the feed's own first fetch is in flight: the same titled card
     * renders a fixed count of activity-shaped rows with every content node
     * shimmering, and the header shows no empty branch. Threaded straight
     * down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: RecentActivityCardLabels
}

/** The already-resolved copy the card renders. */
export interface RecentActivityCardLabels {
    /** Card title (e.g. "Recent activity"). */
    title: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** `kind` -> leading icon. A lookup, not a caller choice — the feed owns what each source means. */
const KIND_ICON: Record<ActivityKind, typeof ReceiptIcon> = {
    invoice: ReceiptIcon,
    lead: TargetIcon,
    domain: GlobeIcon,
    support: LifebuoyIcon,
}

/** How many placeholder rows the loading mirror draws while `items` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** Placeholder rows — sized like a real entry so the shimmer mirrors the loaded shape. */
const SKELETON_ITEMS: Array<RecentActivityItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    kind: "invoice",
    message: "Activity placeholder message",
    timeLabel: "2 hours ago",
}))

/**
 * The activity feed. See the file header for why empty vs with-rows are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link RecentActivityCardProps}
 */
const RecentActivityCard = ({ items, isSkeleton = false, labels }: RecentActivityCardProps) => {
    const rows = isSkeleton ? SKELETON_ITEMS : items

    return (
        <div data-tier="block" data-component="RecentActivityCard">
            <SurfaceCardList
                label={labels.title}
                isSkeleton={isSkeleton}
                items={rows.map((item): SurfaceCardListItem => ({
                    key: item.id,
                    leadingIcon: KIND_ICON[item.kind],
                    title: item.message,
                    trailing: () => <Typography size="xs" color="muted" text={item.timeLabel} />,
                }))}
                emptyState={() => (
                    <EmptyState
                        icon={ReceiptIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                    />
                )}
            />
        </div>
    )
}

export { RecentActivityCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "RecentActivityCard" } as const
