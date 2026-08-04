import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OrderTable,
    type OrderRowView,
    type OrderTableLabels,
} from "@sb-components/nivoexpert/blocks/revenue/OrderTable/OrderTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OrderTable` — the "recent orders" card on the revenue dashboard: member, package,
 * amount, gateway, and status, one row per order — tapping a row opens the order's
 * detail drawer. The `empty` and `with-orders` pictures are DATA, so they are STATES
 * of the single shape. Grounded in the real `PaymentModule` order ledger — `status`
 * mirrors an order's payment state (paid outright, mid-installment schedule, or a
 * free enrollment), and `gatewayLabel` names the real gateways the app wires: SePay,
 * PayOS, or none for a free order.
 */
const meta: Meta<typeof OrderTable> = {
    title: "NivoExpert/Blocks/Revenue/OrderTable/OrderTable",
    component: OrderTable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OrderTable>

const LABELS: OrderTableLabels = {
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

const ORDERS: Array<OrderRowView> = [
    { id: "order-8821", memberName: "Hoang Nam", packageName: "Enterprise", amountLabel: "$899", statusLabel: "Paid", status: "paid", gatewayLabel: "SePay" },
    { id: "order-8820", memberName: "Thu Ha", packageName: "Professional · installment", amountLabel: "$299 × 3", statusLabel: "Period 1 of 3", status: "installment", gatewayLabel: "PayOS" },
    { id: "order-8819", memberName: "Quoc Bao", packageName: "Starter", amountLabel: "$0", statusLabel: "Free", status: "free", gatewayLabel: null },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the recent-orders card" },
    Table: { tier: "composite", role: "the order rows — member, package, amount, gateway, status", storyId: "composites-data-table-table--default" },
    EmptyState: { tier: "composite", role: "shown when there are no orders yet" },
    Chip: { tier: "atom", role: "one order's status — paid, mid-installment, or free" },
    Typography: { tier: "atom", role: "the member, package, amount, and gateway cells" },
}

/** LEAF — one shape; empty and with-orders are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OrderTable"
                tier="block"
                leaf="Orders"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: the block owns the order entity, so empty and with-orders are states of one shape. A row is the select action — tapping it hands the order id to `onSelectOrder`, which the connected layer wires to open `OrderDetailDrawer`; this block never opens the drawer itself."
                states={[
                    {
                        name: "orders = [] (empty)",
                        why: "No orders booked yet, so the table is replaced by an empty state — the card keeps its title so the section still reads as intentional.",
                        code: "<OrderTable orders={[]} onSelectOrder={openOrder} labels={labels} />",
                        render: <OrderTable orders={[]} onSelectOrder={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "with orders — paid, installment, and free",
                        why: "Three orders spanning every payment state: a paid enterprise order through SePay, a professional plan mid-installment through PayOS (period 1 of 3), and a free starter enrollment with no gateway at all.",
                        code: "<OrderTable orders={orders} onSelectOrder={openOrder} labels={labels} />",
                        render: <OrderTable orders={ORDERS} onSelectOrder={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first fetch hasn't resolved, so the card keeps its title and draws a fixed count of order-shaped rows — every cell shimmering — so nothing jumps when the orders land.",
                        code: "<OrderTable orders={[]} onSelectOrder={openOrder} labels={labels} isSkeleton />",
                        render: <OrderTable orders={[]} onSelectOrder={() => {}} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
