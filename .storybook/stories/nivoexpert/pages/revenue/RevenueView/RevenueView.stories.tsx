import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    RevenueView,
    type RevenueViewLabels,
} from "@sb-components/nivoexpert/pages/revenue/RevenueView/RevenueView"
import type { RevenueSummaryMetrics } from "@sb-components/nivoexpert/blocks/revenue/RevenueSummary/RevenueSummary"
import type { OrderRowView, OrderTableLabels } from "@sb-components/nivoexpert/blocks/revenue/OrderTable/OrderTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `RevenueView` — the revenue PAGE: the headline summary tiles above the recent-orders
 * table (member · package · amount · gateway · status — coupons and installment plans
 * surface as data inside those two blocks, not as separate sections). A page's story
 * is one complete STATE per story — `loading`, `content`, `empty-orders` — not a
 * leaf-per-prop map. Grounded in the real `PaymentModule` order ledger, `CouponEntity`
 * redemptions, and `InstallmentPlanEntity` schedules.
 */
const meta: Meta<typeof RevenueView> = {
    title: "NivoExpert/Pages/Revenue/RevenueView/RevenueView",
    component: RevenueView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RevenueView>

const NOOP = () => {}

const LABELS: RevenueViewLabels = {
    title: "Revenue",
    description: "Orders, packages, coupons, and installment plans across every gateway.",
}

const ORDER_TABLE_LABELS: OrderTableLabels = {
    title: "Recent orders",
    description: "Tap a row to see the full order — gateway, status, and the refund action.",
    memberColumn: "Member",
    packageColumn: "Package",
    amountColumn: "Amount",
    gatewayColumn: "Gateway",
    statusColumn: "Status",
    tableAriaLabel: "Recent orders",
    noGatewayLabel: "—",
    emptyTitle: "No orders yet",
    emptyDescription: "Orders will show up here as members purchase a package.",
}

const SUMMARY: RevenueSummaryMetrics = {
    monthlyRevenue: { value: "$4,820", label: "Revenue this month", hint: "+12% vs last month" },
    orders: { value: "690", label: "Orders" },
    couponsRedeemed: { value: "54", label: "Coupons redeemed" },
    installmentsInProgress: { value: "37", label: "Installment plans running" },
}

const EMPTY_SUMMARY: RevenueSummaryMetrics = {
    monthlyRevenue: { value: "$0", label: "Revenue this month", hint: "no orders yet" },
    orders: { value: "0", label: "Orders" },
    couponsRedeemed: { value: "0", label: "Coupons redeemed" },
    installmentsInProgress: { value: "0", label: "Installment plans running" },
}

const ORDERS: Array<OrderRowView> = [
    { id: "order-8821", memberName: "Hoang Nam", packageName: "Enterprise", amountLabel: "$899", statusLabel: "Paid", status: "paid", gatewayLabel: "SePay" },
    { id: "order-8820", memberName: "Thu Ha", packageName: "Professional · installment", amountLabel: "$299 × 3", statusLabel: "Period 1 of 3", status: "installment", gatewayLabel: "PayOS" },
    { id: "order-8819", memberName: "Quoc Bao", packageName: "Starter", amountLabel: "$0", statusLabel: "Free", status: "free", gatewayLabel: null },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography (heading)": { tier: "atom", role: "the page heading" },
    "RevenueSummary": {
        tier: "block",
        role: "the four headline tiles",
        storyId: "nivoexpert-blocks-revenue-revenuesummary-revenuesummary--default",
    },
    "OrderTable": {
        tier: "block",
        role: "the recent-orders card — tapping a row hands off to `OrderDetailDrawer`",
        storyId: "nivoexpert-blocks-revenue-ordertable-ordertable--default",
    },
}

/** STATE — the resolved dashboard with orders spanning every payment state. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RevenueView"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The page composes the RevenueSummary and OrderTable blocks rather than rebuilding either shape inline; gateways, coupons, and installment plans surface as DATA inside those two blocks (a gateway column, an installment status label), not as separate page sections."
                states={[
                    {
                        name: "orders present",
                        why: "The resolved summary tiles above three orders spanning every payment state: a paid enterprise order, a professional plan mid-installment, and a free starter enrollment.",
                        code: "<RevenueView summary={summary} orders={orders} onSelectOrder={openOrder} labels={labels} orderTableLabels={orderTableLabels} />",
                        render: (
                            <RevenueView
                                summary={SUMMARY}
                                orders={ORDERS}
                                onSelectOrder={NOOP}
                                labels={LABELS}
                                orderTableLabels={ORDER_TABLE_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the page's first fetch is in flight. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RevenueView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render. While the ledger query is still in flight the page shows a shimmering heading above the two blocks' own skeleton mirrors, threaded straight down — never a separate skeleton tree."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Nothing has resolved yet: the heading, the four summary tiles, and the orders table all shimmer in their real layout, so the resolved dashboard drops in without a jump.",
                        code: "<RevenueView summary={summary} orders={[]} isSkeleton … />",
                        render: (
                            <RevenueView
                                summary={SUMMARY}
                                orders={[]}
                                onSelectOrder={NOOP}
                                isSkeleton
                                labels={LABELS}
                                orderTableLabels={ORDER_TABLE_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new academy with no orders booked yet. */
export const EmptyOrders: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RevenueView"
                tier="screen"
                leaf="Empty orders"
                annotate={ANNOTATE}
                reason="A brand-new academy: the summary tiles still show (every count reading zero, per RevenueSummary's own reasoning), and the orders card falls to its empty state rather than the section disappearing."
                states={[
                    {
                        name: "orders = [] · all-zero summary",
                        why: "No orders booked yet: every summary tile reads zero, and the recent-orders card shows its empty-state message instead of a blank table.",
                        code: "<RevenueView summary={emptySummary} orders={[]} … />",
                        render: (
                            <RevenueView
                                summary={EMPTY_SUMMARY}
                                orders={[]}
                                onSelectOrder={NOOP}
                                labels={LABELS}
                                orderTableLabels={ORDER_TABLE_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
