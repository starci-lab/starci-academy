import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    MyOrdersList,
    type MyOrderRow,
    type MyOrdersListLabels,
} from "@sb-components/nivo/blocks/catalog/MyOrdersList/MyOrdersList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MyOrdersList` — the buyer's own catalog orders, one row per purchase. One
 * composition: a titled card with a row per order (product + tier, order date,
 * status chip) — no per-row action, since an order is managed from its own
 * product console rather than from this list. Two DATA states of the single
 * shape: `empty` and `with-rows`. Grounded in the real `CatalogOrderEntity`; the
 * product/tier names are resolved off its linked catalog item + tier.
 */
const meta: Meta<typeof MyOrdersList> = {
    title: "Nivo/Blocks/Catalog/MyOrdersList/MyOrdersList",
    component: MyOrdersList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MyOrdersList>

const LABELS: MyOrdersListLabels = {
    title: "My orders",
    statusOptions: {
        pending_payment: "Pending payment",
        active: "Active",
        in_progress: "In progress",
        completed: "Completed",
        suspended: "Suspended",
        cancelled: "Cancelled",
    },
    emptyTitle: "No orders yet",
    emptyDescription: "Choose a plan above to get started — pay from your wallet or top it up with SePay/PayOS.",
}

const ORDERS: Array<MyOrderRow> = [
    { id: "order-1", productName: "AI Academy", tierName: "Professional", status: "active", dateLabel: "02/08/2026" },
    { id: "order-2", productName: "nivo AI Agent", tierName: "Pro", status: "active", dateLabel: "15/07/2026" },
    { id: "order-3", productName: "AI Academy", tierName: "Business", status: "pending_payment", dateLabel: "01/08/2026" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per order" },
    EmptyState: { tier: "composite", role: "the empty branch when no order has been placed yet" },
    Chip: { tier: "atom", role: "the order's lifecycle status" },
    Typography: { tier: "atom", role: "the product — tier label and the order date" },
}

/** LEAF — the list has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MyOrdersList"
                tier="block"
                leaf="My orders"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the buyer's own orders entity, so empty vs with-rows are states of one shape. No row is pressable — an order's own console (not this list) is where it's managed, so the row's only job is to say what was bought, when, and where it stands."
                states={[
                    {
                        name: "orders = []",
                        why: "A brand-new account with no purchase yet. The card keeps its title and reads as an intentional empty state pointing back at the catalog above it, rather than a blank panel.",
                        code: `<MyOrdersList
    orders={[]}
    labels={labels}
/>`,
                        render: <MyOrdersList orders={[]} labels={LABELS} />,
                    },
                    {
                        name: "orders populated",
                        why: "Three orders across three statuses — two active (AI Academy Professional, nivo AI Agent Pro) and one pending payment (a second AI Academy order awaiting its invoice).",
                        code: "<MyOrdersList orders={orders} labels={labels} />",
                        render: <MyOrdersList orders={ORDERS} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of order-shaped rows — label and date shimmering — matching the loaded row so nothing jumps when the orders land.",
                        code: `<MyOrdersList
    orders={[]}
    labels={labels}
    isSkeleton
/>`,
                        render: <MyOrdersList orders={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
