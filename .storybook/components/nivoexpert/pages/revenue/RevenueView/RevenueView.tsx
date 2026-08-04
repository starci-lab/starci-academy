import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    OrderTable,
    type OrderRowView,
    type OrderTableLabels,
} from "@sb-components/nivoexpert/blocks/revenue/OrderTable/OrderTable"
import {
    RevenueSummary,
    type RevenueSummaryMetrics,
} from "@sb-components/nivoexpert/blocks/revenue/RevenueSummary/RevenueSummary"

/**
 * `RevenueView` — the revenue PAGE: the headline summary tiles above the recent-orders
 * table (member · package · amount · gateway · status — coupons and installment plans
 * surface as data inside those two blocks, not as separate sections). A page's story
 * is one complete STATE per story — `loading`, `content`, `empty-orders` — not a
 * leaf-per-prop map. Grounded in the real `PaymentModule` order ledger, `CouponEntity`
 * redemptions, and `InstallmentPlanEntity` schedules.
 */

/** Props for {@link RevenueView}. */
export interface RevenueViewProps {
    /** The headline tiles — forwarded to {@link RevenueSummary}. */
    summary: RevenueSummaryMetrics
    /** The recent orders — forwarded to {@link OrderTable}. Empty is the `empty-orders` state. */
    orders: Array<OrderRowView>
    /** Fired with an order id when its row is tapped — the connected layer opens `OrderDetailDrawer`. */
    onSelectOrder: (orderId: string) => void
    /**
     * `true` → the page's own first fetch is in flight: the heading, the summary
     * tiles, and the orders table all draw their skeleton mirror (§12b), threaded
     * straight down — never a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy for the page's own chrome. */
    labels: RevenueViewLabels
    /** Already-localized copy forwarded to the embedded {@link OrderTable}. */
    orderTableLabels: OrderTableLabels
}

/** The already-resolved copy the page renders for its own chrome. */
export interface RevenueViewLabels {
    /** Page heading (e.g. "Revenue"). */
    title: string
    /** Supporting line under the heading. */
    description: string
}

/**
 * The revenue dashboard page. See the file header for why it composes the
 * `RevenueSummary` and `OrderTable` blocks rather than rebuilding their shapes, and
 * why its story is one complete state per render.
 *
 * @param props - {@link RevenueViewProps}
 */
const RevenueView = ({ summary, orders, onSelectOrder, isSkeleton = false, labels, orderTableLabels }: RevenueViewProps) => (
    <div data-tier="page" data-component="RevenueView" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="h3" weight="semibold" isSkeleton={isSkeleton} text={labels.title} />,
                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.description} />,
            ]}
        />
        <RevenueSummary metrics={summary} isSkeleton={isSkeleton} />
        <OrderTable orders={isSkeleton ? [] : orders} onSelectOrder={onSelectOrder} isSkeleton={isSkeleton} labels={orderTableLabels} />
    </div>
)

export { RevenueView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "RevenueView" } as const
