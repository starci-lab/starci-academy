import type { ReactNode } from "react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { InvoiceStatusKey } from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"

/**
 * `InvoiceDetailModal` — the read-out of one invoice: what it's for, how much,
 * its status, and — while unpaid — a Pay action, the same intent `InvoiceList`
 * exposes per row. It owns one domain-shaped invoice, which is why it sits in
 * `blocks/billing` rather than `overlays/modals` (OVERLAY-9, the same placement
 * `ConnectChannelModal` uses). Grounded in the real `InvoiceEntity`; the item
 * name is resolved off its linked catalog order, and the date shown follows the
 * invoice's own lifecycle — due while unpaid, paid-on once settled.
 */

/** The invoice being read — a subset of `InvoiceEntity` with the item name resolved off its order. */
export interface InvoiceDetailModalInvoice {
    /** Name of the catalog item this invoice pays for (`InvoiceEntity.catalogOrder.catalogItem.name`). */
    itemName: string
    /** Invoice amount in VND (`InvoiceEntity.amountVnd`). */
    amountVnd: number
    /** Where the invoice sits in its lifecycle (`InvoiceEntity.status`). */
    status: InvoiceStatusKey
    /** Already-formatted due date (`InvoiceEntity.dueAt`). */
    dueDateLabel: string
    /** Already-formatted paid date, set only once `status` is `paid` (`InvoiceEntity.paidAt`). */
    paidDateLabel?: string | null
}

/** Props for {@link InvoiceDetailModal}. */
export interface InvoiceDetailModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The invoice being read, or null before any row has been opened. */
    invoice: InvoiceDetailModalInvoice | null
    /** Pay this invoice — the connected layer runs the checkout. Only reachable while `status` is `unpaid`. */
    onPay: () => void
    /** `true` → the checkout is in flight (Pay button busy, Close locks). */
    isPaying?: boolean
    /**
     * `true` → the modal's own first fetch is in flight: every field row
     * shimmers. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: InvoiceDetailModalLabels
}

/** The already-resolved copy the modal renders. */
export interface InvoiceDetailModalLabels {
    /** Modal title (e.g. "Invoice details"). */
    title: string
    /** Field label for the item row (e.g. "Service"). */
    serviceLabel: string
    /** Field label for the amount row (e.g. "Amount"). */
    amountLabel: string
    /** Field label for the status row (e.g. "Status"). */
    statusLabel: string
    /** Field label for the date row while unpaid or cancelled (e.g. "Due"). */
    dueLabel: string
    /** Field label for the date row once paid (e.g. "Paid on"). */
    paidOnLabel: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<InvoiceStatusKey, string>
    /** Close button label. */
    closeLabel: string
    /** Pay button label. */
    payLabel: string
}

/** Status → chip tone. Unpaid asks for attention (warning), paid is done (success), cancelled is inert (muted default). */
const STATUS_TONE: Record<InvoiceStatusKey, ChipTone> = {
    unpaid: "warning",
    paid: "success",
    cancelled: "default",
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** One `label / value` field row — the fixed shape every row in this modal shares. */
const FieldRow = ({ label, value, isSkeleton = false }: { label: string; value: ReactNode; isSkeleton?: boolean }) => (
    <StackH
        gap={3}
        justify="between"
        isSkeleton={isSkeleton}
        items={[
            () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={label} />,
            () => (typeof value === "string" ? <Typography size="sm" weight="medium" tabularNums isSkeleton={isSkeleton} text={value} /> : value),
        ]}
    />
)

/**
 * The invoice-detail modal. See the file header for why it sits in
 * `blocks/billing` rather than the generic overlay tier.
 *
 * @param props - {@link InvoiceDetailModalProps}
 */
const InvoiceDetailModal = ({
    isOpen,
    onOpenChange,
    invoice,
    onPay,
    isPaying = false,
    isSkeleton = false,
    labels,
}: InvoiceDetailModalProps) => {
    const isPaid = invoice?.status === "paid"
    const dateLabel = isPaid ? labels.paidOnLabel : labels.dueLabel
    const dateValue = isPaid && invoice?.paidDateLabel ? invoice.paidDateLabel : invoice?.dueDateLabel ?? ""

    return (
        <div data-tier="block" data-component="InvoiceDetailModal">
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={labels.title}
                size="md"
                isSkeleton={isSkeleton}
                body={({ isSkeleton: skeleton }: SkeletonProps) => (
                    <StackV
                        gap={3}
                        isSkeleton={skeleton}
                        items={[
                            () => <FieldRow label={labels.serviceLabel} value={invoice?.itemName ?? ""} isSkeleton={skeleton} />,
                            () => <FieldRow label={labels.amountLabel} value={formatVnd(invoice?.amountVnd ?? 0)} isSkeleton={skeleton} />,
                            () => (
                                <FieldRow
                                    label={labels.statusLabel}
                                    value={
                                        <Chip
                                            tone={invoice ? STATUS_TONE[invoice.status] : "default"}
                                            isSkeleton={skeleton}
                                            text={invoice ? labels.statusOptions[invoice.status] : ""}
                                        />
                                    }
                                    isSkeleton={skeleton}
                                />
                            ),
                            () => <FieldRow label={dateLabel} value={dateValue} isSkeleton={skeleton} />,
                        ]}
                    />
                )}
                footer={() => (
                    <>
                        <Button variant="ghost" label={labels.closeLabel} onPress={() => onOpenChange(false)} isDisabled={isPaying} />
                        {!isSkeleton && invoice?.status === "unpaid" ? (
                            <Button variant="primary" label={labels.payLabel} onPress={onPay} isPending={isPaying} />
                        ) : null}
                    </>
                )}
            />
        </div>
    )
}

export { InvoiceDetailModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "InvoiceDetailModal" } as const
