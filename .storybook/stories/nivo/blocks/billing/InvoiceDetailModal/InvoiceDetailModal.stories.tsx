import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    InvoiceDetailModal,
    type InvoiceDetailModalInvoice,
    type InvoiceDetailModalLabels,
} from "@sb-components/nivo/blocks/billing/InvoiceDetailModal/InvoiceDetailModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InvoiceDetailModal` — the read-out of one invoice: what it's for, how much,
 * its status, and — while unpaid — a Pay action, the same intent `InvoiceList`
 * exposes per row. It owns one domain-shaped invoice, which is why it sits in
 * `blocks/billing` rather than `overlays/modals` (OVERLAY-9, the same placement
 * `ConnectChannelModal` uses). Grounded in the real `InvoiceEntity`; the item
 * name is resolved off its linked catalog order, and the date shown follows the
 * invoice's own lifecycle — due while unpaid, paid-on once settled.
 */
const meta: Meta<typeof InvoiceDetailModal> = {
    title: "Nivo/Blocks/Billing/InvoiceDetailModal/InvoiceDetailModal",
    component: InvoiceDetailModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InvoiceDetailModal>

const LABELS: InvoiceDetailModalLabels = {
    title: "Invoice details",
    serviceLabel: "Service",
    amountLabel: "Amount",
    statusLabel: "Status",
    dueLabel: "Due",
    paidOnLabel: "Paid on",
    statusOptions: { unpaid: "Unpaid", paid: "Paid", cancelled: "Cancelled" },
    closeLabel: "Close",
    payLabel: "Pay now",
}

const UNPAID_INVOICE: InvoiceDetailModalInvoice = {
    itemName: "nivo AI Agent — Pro",
    amountVnd: 990000,
    status: "unpaid",
    dueDateLabel: "20/08/2026",
}

const PAID_INVOICE: InvoiceDetailModalInvoice = {
    itemName: "AI Academy — Professional",
    amountVnd: 299000,
    status: "paid",
    dueDateLabel: "02/07/2026",
    paidDateLabel: "02/07/2026",
}

const CANCELLED_INVOICE: InvoiceDetailModalInvoice = {
    itemName: "Domain — anhducstudio.vn",
    amountVnd: 299000,
    status: "cancelled",
    dueDateLabel: "10/06/2026",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    Typography: { tier: "atom", role: "the field labels and their values — service, amount, and the due/paid date" },
    Chip: { tier: "atom", role: "the invoice's status, toned the same way `InvoiceList` tones its row" },
    Button: { tier: "atom", role: "close (ghost, always) and Pay now (primary, unpaid only)" },
}

/** Shared controlled wrapper — one `isOpen`/`invoice`/`isPaying` state feeds every leaf state below. */
const ControlledInvoiceDetailModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [, setIsPaying] = useState(false)

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        invoice: UNPAID_INVOICE,
        onPay: () => setIsPaying(true),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open invoice" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="InvoiceDetailModal"
                tier="block"
                leaf="Read one invoice"
                annotate={ANNOTATE}
                reason="A presentational read-out of one invoice: service, amount, status, and a due/paid date that follows the invoice's own lifecycle — the Pay action only ever appears while `status` is `unpaid`, the same rule `InvoiceList`'s row already enforces, so paying a settled or cancelled invoice is never offered."
                states={[
                    {
                        name: "status = unpaid",
                        why: "An open invoice: the due date shows, the status chip reads warning-toned, and the Pay now action is available.",
                        code: `<InvoiceDetailModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    invoice={invoice}
    onPay={pay}
    labels={labels}
/>`,
                        render: <InvoiceDetailModal {...base} />,
                    },
                    {
                        name: "status = paid",
                        why: "A settled invoice: the date row switches from Due to Paid on, the chip reads success-toned, and the Pay action is gone — nothing left to do.",
                        code: "<InvoiceDetailModal invoice={{ ...invoice, status: \"paid\", paidDateLabel }} … />",
                        render: <InvoiceDetailModal {...base} invoice={PAID_INVOICE} />,
                    },
                    {
                        name: "status = cancelled",
                        why: "A cancelled invoice: the due date still reads (nothing was ever paid), the chip is muted, and there's no Pay action — a cancelled invoice can't be settled.",
                        code: "<InvoiceDetailModal invoice={{ ...invoice, status: \"cancelled\" }} … />",
                        render: <InvoiceDetailModal {...base} invoice={CANCELLED_INVOICE} />,
                    },
                    {
                        name: "isPaying = true",
                        why: "Checkout is in flight — the Pay now button shows its busy state and Close locks, so the buyer can't double-trigger the payment.",
                        code: "<InvoiceDetailModal isPaying … />",
                        render: <InvoiceDetailModal {...base} isPaying />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch hasn't resolved yet, so every field row shimmers in place, matching the loaded shape so nothing jumps when the invoice lands.",
                        code: "<InvoiceDetailModal isSkeleton … />",
                        render: <InvoiceDetailModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All five states (unpaid, paid, cancelled, paying, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledInvoiceDetailModal />,
}
