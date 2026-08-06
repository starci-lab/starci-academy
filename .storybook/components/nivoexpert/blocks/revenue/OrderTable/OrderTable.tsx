import { ReceiptIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OrderTable` -- the "recent orders" card on the revenue dashboard: member, package,
 * amount, gateway, and status, one row per order -- tapping a row opens the order's
 * detail drawer. The `empty` and `with-orders` pictures are DATA, so they are STATES
 * of the single shape. Grounded in the real `PaymentModule` order ledger -- `status`
 * mirrors an order's payment state (paid outright, mid-installment schedule, or a
 * free enrollment), and `gatewayLabel` names the real gateways the app wires: SePay,
 * PayOS, or none for a free order.
 */

/** Payment state of one order (`PaymentModule`'s order status). */
export type OrderStatus = "paid" | "installment" | "free"

/** One order row -- a subset of the real order ledger. */
export interface OrderRowView {
    /** Order id -- the value reported to {@link OrderTableProps.onSelectOrder}. */
    id: string
    /** Display name of the paying member. */
    memberName: string
    /** Name of the purchased package/plan. */
    packageName: string
    /** Already-formatted amount (e.g. "$899", "$299 x 3") -- the connected layer resolves currency + installment notation. */
    amountLabel: string
    /** Already-resolved status copy (e.g. "Paid", "Period 1 of 3", "Free"). */
    statusLabel: string
    /** Payment state -- drives the status chip's tone. */
    status: OrderStatus
    /** Payment gateway that processed the order (`"SePay"`, `"PayOS"`), or `null` for a free order. */
    gatewayLabel?: string | null
}

/** Props for {@link OrderTable}. */
export interface OrderTableProps {
    /** The orders, newest first. Empty is the `empty` state. */
    orders: Array<OrderRowView>
    /** Fired with an order id when its row is tapped -- the connected layer opens `OrderDetailDrawer`. */
    onSelectOrder: (orderId: string) => void
    /**
     * `true` -> the card's own first fetch is in flight: the title stays put and a
     * fixed count of order-shaped rows shimmer (§12b), threaded straight down --
     * never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OrderTableLabels
}

/** The already-resolved copy the block renders. */
export interface OrderTableLabels {
    /** Card title (e.g. "Recent orders"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Column header for the paying member. */
    memberColumn: string
    /** Column header for the purchased package. */
    packageColumn: string
    /** Column header for the amount. */
    amountColumn: string
    /** Column header for the payment gateway. */
    gatewayColumn: string
    /** Column header for the order status. */
    statusColumn: string
    /** Accessible name for the orders table. */
    tableAriaLabel: string
    /** Shown for an order with no gateway (a free enrollment). */
    noGatewayLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { member: "member", package: "package", amount: "amount", gateway: "gateway", status: "status" } as const

/** Order status -> chip tone. Paid is settled, installment is still running, free needs no settlement. */
const STATUS_TONE: Record<OrderStatus, ChipTone> = {
    paid: "success",
    installment: "warning",
    free: "default",
}

/** How many placeholder rows the loading mirror draws while `orders` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder orders -- sized like a real row so the table's shimmer mirrors the loaded shape. */
const SKELETON_ORDERS: Array<OrderRowView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    memberName: "Member name",
    packageName: "Package name",
    amountLabel: "Amount",
    statusLabel: "Status",
    status: "paid",
    gatewayLabel: "Gateway",
}))

/**
 * The recent-orders table. See the file header for why empty and with-orders are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link OrderTableProps}
 */
const OrderTable = ({ orders, onSelectOrder, isSkeleton = false, labels }: OrderTableProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.member, header: labels.memberColumn },
        { key: COLUMN_KEY.package, header: labels.packageColumn },
        { key: COLUMN_KEY.amount, header: labels.amountColumn },
        { key: COLUMN_KEY.gateway, header: labels.gatewayColumn },
        { key: COLUMN_KEY.status, header: labels.statusColumn, align: "end" },
    ]

    // While loading the table renders the SAME shape from a fixed count of
    // placeholder orders; `isSkeleton` threads into every cell so it shimmers
    // instead of exposing a real row.
    const orderRows = isSkeleton ? SKELETON_ORDERS : orders
    const rows: ReadonlyArray<TableRowItem> = orderRows.map((order): TableRowItem => ({
        key: order.id,
        [COLUMN_KEY.member]: <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={order.memberName} />,
        [COLUMN_KEY.package]: <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={order.packageName} />,
        [COLUMN_KEY.amount]: <Typography size="sm" weight="medium" tabularNums isSkeleton={isSkeleton} text={order.amountLabel} />,
        [COLUMN_KEY.gateway]: <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={order.gatewayLabel ?? labels.noGatewayLabel} />,
        [COLUMN_KEY.status]: isSkeleton ? (
            <Typography size="sm" isSkeleton />
        ) : (
            <Chip tone={STATUS_TONE[order.status]} text={order.statusLabel} />
        ),
    }))

    return (
        <div data-tier="block" data-component="OrderTable">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        principle="sibling-stack" gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.description} />,
                            () =>
                                !isSkeleton && orders.length === 0 ? (
                                    <EmptyState icon={ReceiptIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                                ) : (
                                    <Table
                                        columns={columns}
                                        items={rows}
                                        ariaLabel={labels.tableAriaLabel}
                                        isSkeleton={isSkeleton}
                                        onRowPress={isSkeleton ? undefined : onSelectOrder}
                                    />
                                ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { OrderTable }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OrderTable" } as const
