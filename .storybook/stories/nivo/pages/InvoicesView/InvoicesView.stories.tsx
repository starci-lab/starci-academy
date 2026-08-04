import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    InvoicesView,
    type InvoicesViewLabels,
} from "@sb-components/nivo/pages/InvoicesView/InvoicesView"
import type { InvoiceDetailModalInvoice } from "@sb-components/nivo/blocks/billing/InvoiceDetailModal/InvoiceDetailModal"
import type { InvoiceRow } from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InvoicesView` — the PAGE at `/invoices`: every invoice raised from the
 * catalog (a new order or a renewal), across all three statuses. Each row
 * opens its own `InvoiceDetailModal` (`InvoiceList`'s `onOpenInvoice`), while
 * the row's own Pay button stays independently pressable for a fast unpaid
 * settle without leaving the list. A page is a list of functions: this one
 * NAMES `InvoiceList` above `InvoiceDetailModal` — nothing drawn inline beyond
 * the section heading. Grounded in the real `InvoiceEntity`
 * (`status: unpaid | paid | cancelled`,
 * `purpose: catalog_order | catalog_upgrade | catalog_renewal`); the item name
 * is resolved off each invoice's linked `CatalogOrderEntity.catalogItem`.
 *
 * `InvoiceDetailModal` is composed HERE for the same reason `CatalogView`
 * composes `BuyConfirmModal`: one short-lived modal, one row action that opens
 * it, no reason to split the open/selection state out to a separate mount
 * point. That state still arrives as PROPS (`detail.isOpen`/`detail.invoice`),
 * owned by the connected layer or a story's `Controlled` wrapper — this file
 * stays a pure function of its props.
 *
 * A page's story is one complete STATE per story — `loading`, `empty`
 * (a brand-new account with nothing billed yet, the critical case — a clear
 * path back to the catalog), `with-invoices` — not a leaf-per-prop map.
 */
const meta: Meta<typeof InvoicesView> = {
    title: "Nivo/Pages/InvoicesView/InvoicesView",
    component: InvoicesView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InvoicesView>

const LABELS: InvoicesViewLabels = {
    title: "Invoices",
    subtitle: "Every invoice raised from the catalog and its renewals.",
    list: {
        title: "Invoices",
        payLabel: "Pay",
        statusOptions: { unpaid: "Unpaid", paid: "Paid", cancelled: "Cancelled" },
        emptyTitle: "No invoices yet",
        emptyDescription: "Invoices for the products you order will appear here.",
    },
    detail: {
        title: "Invoice details",
        serviceLabel: "Service",
        amountLabel: "Amount",
        statusLabel: "Status",
        dueLabel: "Due",
        paidOnLabel: "Paid on",
        statusOptions: { unpaid: "Unpaid", paid: "Paid", cancelled: "Cancelled" },
        closeLabel: "Close",
        payLabel: "Pay now",
    },
}

const INVOICES: Array<InvoiceRow> = [
    { id: "inv-1042", itemName: "nivo AI Agent — Pro", amountVnd: 990000, status: "unpaid", dateLabel: "20/08/2026" },
    { id: "inv-2", itemName: "AI Academy — Professional", amountVnd: 299000, status: "paid", dateLabel: "02/07/2026" },
    { id: "inv-3", itemName: "Domain — anhducstudio.vn", amountVnd: 299000, status: "cancelled", dateLabel: "10/06/2026" },
]

/** `InvoiceRow` → the richer `InvoiceDetailModalInvoice` shape the detail modal reads — the same resolved fields, plus a paid date once settled. */
const detailOf = (invoice: InvoiceRow): InvoiceDetailModalInvoice => ({
    itemName: invoice.itemName,
    amountVnd: invoice.amountVnd,
    status: invoice.status,
    dueDateLabel: invoice.dateLabel,
    paidDateLabel: invoice.status === "paid" ? invoice.dateLabel : null,
})

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm — heading above the invoice list" },
    InvoiceList: {
        tier: "block",
        role: "every invoice, across all three statuses — each row opens its own detail",
        storyId: "nivo-blocks-billing-invoicelist-invoicelist--default",
    },
    InvoiceDetailModal: {
        tier: "block",
        role: "the read-out a row opens into, with Pay while unpaid",
        storyId: "nivo-blocks-billing-invoicedetailmodal-invoicedetailmodal--default",
    },
    Typography: { tier: "atom", role: "the page heading and subtitle" },
}

/** Shared controlled wrapper — one `detail` state feeds the `invoices`-driven leaves below. */
const ControlledInvoicesView = ({ invoices }: { invoices: Array<InvoiceRow> }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [invoice, setInvoice] = useState<InvoiceDetailModalInvoice | null>(null)
    const [isPaying, setIsPaying] = useState(false)

    return (
        <InvoicesView
            invoices={invoices}
            onPayInvoice={NOOP}
            onOpenInvoice={(invoiceId) => {
                const row = invoices.find((candidate) => candidate.id === invoiceId)
                if (row) {
                    setInvoice(detailOf(row))
                    setIsOpen(true)
                }
            }}
            detail={{
                isOpen,
                invoice,
                onOpenChange: setIsOpen,
                onPay: () => setIsPaying(true),
                isPaying,
            }}
            labels={LABELS}
        />
    )
}

/** STATE — the page is still loading; the skeleton mirror holds the resolved shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InvoicesView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The skeleton mirrors the loaded shape (heading, then the invoice list's own three-row mirror) so nothing jumps when the invoices resolve."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The invoices are still fetching. The list draws its resting shape, matching the loaded layout exactly.",
                        code: "<InvoicesView {...props} isSkeleton />",
                        render: (
                            <InvoicesView
                                invoices={[]}
                                onPayInvoice={NOOP}
                                onOpenInvoice={NOOP}
                                detail={{ isOpen: false, invoice: null, onOpenChange: NOOP, onPay: NOOP }}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account: nothing billed yet, the critical case with a clear path back to the catalog. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InvoicesView"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="The brand-new-account case: the page doesn't special-case emptiness itself — the embedded `InvoiceList` falls to its own empty branch, which points back at the catalog rather than showing a blank panel."
                states={[
                    {
                        name: "invoices = []",
                        why: "Nothing has been billed yet. `InvoiceList` shows its intentional empty state under the heading.",
                        code: "<InvoicesView invoices={[]} onPayInvoice={pay} onOpenInvoice={openInvoice} detail={detail} labels={labels} />",
                        render: <ControlledInvoicesView invoices={[]} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved invoice list across all three statuses. */
export const WithInvoices: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InvoicesView"
                tier="screen"
                leaf="With invoices"
                annotate={ANNOTATE}
                reason="The full invoices page: three invoices across every status — unpaid (with its own Pay button, independently pressable), paid, and cancelled — any row opening its own `InvoiceDetailModal`, closed until then."
                states={[
                    {
                        name: "invoices populated, detail closed",
                        why: "One unpaid invoice (nivo AI Agent — Pro), one paid (AI Academy — Professional), one cancelled (a domain order) — pressing any row opens its detail; pressing the unpaid row's own Pay button settles it directly without opening the modal.",
                        code: `<InvoicesView
    invoices={invoices /* unpaid, paid, cancelled */}
    onPayInvoice={pay}
    onOpenInvoice={openInvoice}
    detail={detail}
    labels={labels}
/>`,
                        render: <ControlledInvoicesView invoices={INVOICES} />,
                    },
                ]}
            />
        </div>
    ),
}
