import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    InvoiceList,
    type InvoiceListLabels,
    type InvoiceRow,
} from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InvoiceList` — the owner-side list of invoices, each payable while unpaid. One
 * composition: a titled card with a row per invoice (item + amount, date, status
 * chip, Pay on unpaid). Two DATA states of the single shape: `empty` and
 * `with-rows`. Grounded in the real `InvoiceEntity`; the item name is resolved off
 * its linked catalog order.
 */
const meta: Meta<typeof InvoiceList> = {
    title: "Nivo/Blocks/Billing/InvoiceList/InvoiceList",
    component: InvoiceList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InvoiceList>

const LABELS: InvoiceListLabels = {
    title: "Invoices",
    payLabel: "Pay",
    statusOptions: { unpaid: "Unpaid", paid: "Paid", cancelled: "Cancelled" },
    emptyTitle: "No invoices yet",
    emptyDescription: "Invoices for the products you order will appear here.",
}

const INVOICES: Array<InvoiceRow> = [
    {
        id: "inv-1",
        itemName: "AI Academy — Professional",
        amountVnd: 299000,
        status: "unpaid",
        dateLabel: "01/08/2026",
    },
    {
        id: "inv-2",
        itemName: "nivo AI Agent — Pro",
        amountVnd: 990000,
        status: "paid",
        dateLabel: "24/07/2026",
    },
    {
        id: "inv-3",
        itemName: "AI Academy — Business",
        amountVnd: 899000,
        status: "cancelled",
        dateLabel: "12/07/2026",
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per invoice" },
    EmptyState: { tier: "composite", role: "the empty branch when no invoices have been issued" },
    Chip: { tier: "atom", role: "the invoice's status, toned by where it sits (unpaid warning, paid success, cancelled muted)" },
    Button: { tier: "atom", role: "the Pay action, shown only on an unpaid invoice" },
    Typography: { tier: "atom", role: "the item name, date, and amount in VND" },
}

/** LEAF — the list has one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InvoiceList"
                tier="block"
                leaf="Invoice list"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the invoices entity, so empty vs with-rows are states of one shape. It emits the one intent it owns — `onPay` — and only on an UNPAID row, because paying a paid or cancelled invoice is meaningless. Amount formatting (`VND` grouping) is the block's job since `amountVnd` arrives as a raw integer."
                states={[
                    {
                        name: "invoices = []",
                        why: "No invoices issued yet. The card keeps its title and reads as an intentional empty state, telling the owner where invoices will appear rather than showing a blank panel.",
                        code: `<InvoiceList
    invoices={[]}
    onPay={pay}
    labels={labels}
/>`,
                        render: <InvoiceList invoices={[]} onPay={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "invoices populated",
                        why: "Three invoices across all three statuses — unpaid (warning + a Pay button), paid (success), cancelled (muted). Only the unpaid row exposes the Pay action; the settled rows carry their chip alone.",
                        code: "<InvoiceList invoices={invoices} onPay={pay} … />",
                        render: <InvoiceList invoices={INVOICES} onPay={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of invoice-shaped rows — item, date, amount and status chip all shimmering — matching the loaded row so nothing jumps when the invoices land.",
                        code: `<InvoiceList
    invoices={[]}
    onPay={pay}
    labels={labels}
    isSkeleton
/>`,
                        render: <InvoiceList invoices={[]} onPay={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
