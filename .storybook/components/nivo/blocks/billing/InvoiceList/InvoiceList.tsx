import { ReceiptIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `InvoiceList` — the owner-side list of invoices, each payable while unpaid. One
 * composition: a titled card with a row per invoice (item + amount, date, status
 * chip, Pay on unpaid). Two DATA states of the single shape: `empty` and
 * `with-rows`. Grounded in the real `InvoiceEntity`; the item name is resolved off
 * its linked catalog order.
 */

/** The three invoice statuses — mirrors `InvoiceStatus` (`unpaid` · `paid` · `cancelled`). */
export type InvoiceStatusKey = "unpaid" | "paid" | "cancelled"

/** One invoice row — a subset of `InvoiceEntity` with the item name resolved off its order. */
export interface InvoiceRow {
    /** Invoice id. */
    id: string
    /** Name of the catalog item this invoice pays for (`InvoiceEntity.catalogOrder.catalogItem.name`). */
    itemName: string
    /** Invoice amount in VND (`InvoiceEntity.amountVnd`). */
    amountVnd: number
    /** Where the invoice sits in its lifecycle (`InvoiceEntity.status`). */
    status: InvoiceStatusKey
    /** Already-formatted issue/due date (`InvoiceEntity.createdAt` / `dueAt`). */
    dateLabel: string
}

/** Props for {@link InvoiceList}. */
export interface InvoiceListProps {
    /** The invoices, newest first. */
    invoices: Array<InvoiceRow>
    /** Pay one still-unpaid invoice — the connected layer runs the checkout. */
    onPay: (invoiceId: string) => void
    /**
     * Open one invoice's own detail — optional. When set, each row becomes a
     * whole-row press target (`SurfaceCard`'s stretched-link `actions` pattern)
     * while the unpaid Pay button stays independently pressable above the
     * overlay. Omitted → a row is the exact plain (non-pressable) shape this
     * block always rendered, so every existing caller is unaffected.
     */
    onOpenInvoice?: (invoiceId: string) => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of invoice-shaped rows with every content node
     * shimmering (§12b). Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: InvoiceListLabels
}

/** The already-resolved copy the block renders. */
export interface InvoiceListLabels {
    /** Card title (e.g. "Invoices"). */
    title: string
    /** Pay-button label, shown on unpaid rows. */
    payLabel: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<InvoiceStatusKey, string>
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Status → chip tone. Unpaid asks for attention (warning), paid is done (success), cancelled is inert (muted default). */
const STATUS_TONE: Record<InvoiceStatusKey, ChipTone> = {
    unpaid: "warning",
    paid: "success",
    cancelled: "default",
}

/** Money is a raw VND `Int` on the entity; the block owns the grouping + suffix, never a formatted string in. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** How many placeholder rows the loading mirror draws while `invoices` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_INVOICES: Array<InvoiceRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    itemName: "Invoice item name",
    amountVnd: 0,
    status: "unpaid",
    dateLabel: "01/01/2026",
}))

/** The item name + date column shared by every row shape below. */
const InvoiceRowLeading = ({ invoice, isSkeleton }: { invoice: InvoiceRow; isSkeleton: boolean }) => (
    <StackV
        gap={1}
        isSkeleton={isSkeleton}
        items={[
            () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={invoice.itemName} />,
            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={invoice.dateLabel} />,
        ]}
    />
)

/** The amount + status chip column shared by every row shape below. */
const InvoiceRowMeta = ({ invoice, labels, isSkeleton }: { invoice: InvoiceRow; labels: InvoiceListLabels; isSkeleton: boolean }) => (
    <StackH
        gap={3}
        isSkeleton={isSkeleton}
        items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={formatVnd(invoice.amountVnd)}
                />
            ),
            () => (
                <Chip
                    tone={STATUS_TONE[invoice.status]}
                    isSkeleton={isSkeleton}
                    text={labels.statusOptions[invoice.status]}
                />
            ),
        ]}
    />
)

/**
 * One invoice row — item name + date on the left, amount + status chip (and, only
 * while unpaid, a Pay action) on the right. The SAME shape drives the loaded and
 * the loading rows; `isSkeleton` threads down so a loading row is the loaded row
 * with its content nodes shimmering.
 *
 * `onOpenInvoice` is OPTIONAL: when set (and not `isSkeleton`), the whole row
 * becomes a press target opening the invoice's own detail, via `SurfaceCard`'s
 * stretched-link `actions` pattern — the Pay button then sits ABOVE the overlay
 * so it stays independently pressable instead of nesting a `<button>` inside the
 * row's own `<button>`. Omitted → the exact plain (non-pressable) row this block
 * always rendered, Pay button included inline.
 */
const InvoiceRowItem = ({ invoice, onPay, onOpenInvoice, labels, isSkeleton }: {
    invoice: InvoiceRow
    onPay: (invoiceId: string) => void
    onOpenInvoice?: (invoiceId: string) => void
    labels: InvoiceListLabels
    isSkeleton: boolean
}) => {
    if (onOpenInvoice && !isSkeleton) {
        const payAction = invoice.status === "unpaid" ? (
            <Button variant="primary" size="sm" label={labels.payLabel} onPress={() => onPay(invoice.id)} />
        ) : null
        return (
            <SurfaceCard
                variant="nested"
                padding={3}
                onPress={() => onOpenInvoice(invoice.id)}
                ariaLabel={`${invoice.itemName} — ${labels.statusOptions[invoice.status]}`}
                actions={payAction}
                body={() => (
                    <StackH
                        gap={3}
                        justify="between"
                        items={[
                            () => <InvoiceRowLeading invoice={invoice} isSkeleton={false} />,
                            () => <InvoiceRowMeta invoice={invoice} labels={labels} isSkeleton={false} />,
                        ]}
                    />
                )}
            />
        )
    }
    return (
        <SurfaceCard
            variant="nested"
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <StackH
                    gap={3}
                    principle="flex-action"
                    justify="between"
                    isSkeleton={isSkeleton}
                    items={[
                        () => <InvoiceRowLeading invoice={invoice} isSkeleton={isSkeleton} />,
                        () => (
                            <StackH
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <Typography
                                            size="sm"
                                            weight="medium"
                                            tabularNums
                                            isSkeleton={isSkeleton}
                                            text={formatVnd(invoice.amountVnd)}
                                        />
                                    ),
                                    () => (
                                        <Chip
                                            tone={STATUS_TONE[invoice.status]}
                                            isSkeleton={isSkeleton}
                                            text={labels.statusOptions[invoice.status]}
                                        />
                                    ),
                                    ...(!isSkeleton && invoice.status === "unpaid"
                                        ? [
                                            () => (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    label={labels.payLabel}
                                                    onPress={() => onPay(invoice.id)}
                                                />
                                            ),
                                        ]
                                        : []),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}

/**
 * The invoice list. See the file header for why empty vs with-rows are states of
 * one shape, and how `isSkeleton` mirrors the loaded rows.
 *
 * @param props - {@link InvoiceListProps}
 */
const InvoiceList = ({ invoices, onPay, onOpenInvoice, isSkeleton = false, labels }: InvoiceListProps) => {
    const rows = isSkeleton ? SKELETON_INVOICES : invoices
    return (
        <div data-tier="block" data-component="InvoiceList">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && invoices.length === 0 ? (
                        <EmptyState
                            icon={ReceiptIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((invoice) => () => (
                                <InvoiceRowItem
                                    invoice={invoice}
                                    onPay={onPay}
                                    onOpenInvoice={onOpenInvoice}
                                    labels={labels}
                                    isSkeleton={isSkeleton}
                                />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { InvoiceList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "InvoiceList" } as const
