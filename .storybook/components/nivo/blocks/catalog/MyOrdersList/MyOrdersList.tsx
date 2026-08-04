import { FolderIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MyOrdersList` — the buyer's own catalog orders, one row per purchase. One
 * composition: a titled card with a row per order (product + tier, order date,
 * status chip) — no per-row action, since an order is managed from its own
 * product console rather than from this list. Two DATA states of the single
 * shape: `empty` and `with-rows`. Grounded in the real `CatalogOrderEntity`; the
 * product/tier names are resolved off its linked catalog item + tier.
 */

/** The six order lifecycle statuses — mirrors `CatalogOrderStatus`. */
export type MyOrderStatusKey = "pending_payment" | "active" | "in_progress" | "completed" | "suspended" | "cancelled"

/** One order row — a subset of `CatalogOrderEntity` with product/tier names resolved. */
export interface MyOrderRow {
    /** Catalog order id. */
    id: string
    /** Ordered catalog item name (`CatalogOrderEntity.catalogItem.name`). */
    productName: string
    /** Ordered tier name, or null for a flat (non-tiered) item (`CatalogOrderEntity.catalogTier.name`). */
    tierName?: string | null
    /** Where the order sits in its lifecycle (`CatalogOrderEntity.status`). */
    status: MyOrderStatusKey
    /** Already-formatted order date (`CatalogOrderEntity.createdAt`). */
    dateLabel: string
}

/** Props for {@link MyOrdersList}. */
export interface MyOrdersListProps {
    /** The orders, newest first. */
    orders: Array<MyOrderRow>
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of order-shaped rows with every content node
     * shimmering. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: MyOrdersListLabels
}

/** The already-resolved copy the block renders. */
export interface MyOrdersListLabels {
    /** Card title (e.g. "My orders"). */
    title: string
    /** The six status labels, keyed by status. */
    statusOptions: Record<MyOrderStatusKey, string>
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/**
 * Status → chip tone. `pending_payment` asks for attention (warning);
 * `active`/`completed` are good outcomes (success); `in_progress` is under way
 * (accent); `suspended` needs the owner's attention (warning); `cancelled` is
 * inert (muted default).
 */
const STATUS_TONE: Record<MyOrderStatusKey, ChipTone> = {
    pending_payment: "warning",
    active: "success",
    in_progress: "accent",
    completed: "success",
    suspended: "warning",
    cancelled: "default",
}

/** How many placeholder rows the loading mirror draws while `orders` hasn't landed yet. */
const SKELETON_ROW_COUNT = 2

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_ORDERS: Array<MyOrderRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    productName: "Catalog product",
    tierName: "Tier",
    status: "active",
    dateLabel: "01/01/2026",
}))

/** Product + tier combined into one line, mirroring how the order reads elsewhere ("AI Academy — Professional"). */
const itemLabelOf = (order: MyOrderRow) => (order.tierName ? `${order.productName} — ${order.tierName}` : order.productName)

/**
 * One order row — item label + order date on the left, the status chip on the
 * right. The SAME shape drives the loaded and the loading rows; `isSkeleton`
 * threads down so a loading row is the loaded row with its content nodes
 * shimmering.
 */
const MyOrderRowItem = ({ order, labels, isSkeleton }: {
    order: MyOrderRow
    labels: MyOrdersListLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={itemLabelOf(order)} />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={order.dateLabel} />,
                            ]}
                        />
                    ),
                    () => <Chip tone={STATUS_TONE[order.status]} isSkeleton={isSkeleton} text={labels.statusOptions[order.status]} />,
                ]}
            />
        )}
    />
)

/**
 * The my-orders list. See the file header for why empty vs with-rows are states
 * of one shape, and why no per-row action is offered.
 *
 * @param props - {@link MyOrdersListProps}
 */
const MyOrdersList = ({ orders, isSkeleton = false, labels }: MyOrdersListProps) => {
    const rows = isSkeleton ? SKELETON_ORDERS : orders
    return (
        <div data-tier="block" data-component="MyOrdersList">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && orders.length === 0 ? (
                        <EmptyState
                            icon={FolderIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((order) => () => (
                                <MyOrderRowItem order={order} labels={labels} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { MyOrdersList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "MyOrdersList" } as const
