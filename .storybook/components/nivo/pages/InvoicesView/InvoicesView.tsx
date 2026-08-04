import type { ReactNode } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    InvoiceDetailModal,
    type InvoiceDetailModalInvoice,
    type InvoiceDetailModalLabels,
} from "@sb-components/nivo/blocks/billing/InvoiceDetailModal/InvoiceDetailModal"
import {
    InvoiceList,
    type InvoiceListLabels,
    type InvoiceRow,
} from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"

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

/** Already-localized copy for every region this page arranges. */
export interface InvoicesViewLabels {
    /** Page heading (e.g. "Invoices"). */
    title: string
    /** Subtitle under the heading. */
    subtitle: string
    /** Forwarded to `InvoiceList`. */
    list: InvoiceListLabels
    /** Forwarded to `InvoiceDetailModal`. */
    detail: InvoiceDetailModalLabels
}

/** The `InvoiceDetailModal` region — its own props minus `labels`, which the page forwards from `labels.detail`. */
export interface InvoicesViewDetail {
    /** Whether the modal is open. */
    isOpen: boolean
    /** The invoice being read, or null before any row has been opened. */
    invoice: InvoiceDetailModalInvoice | null
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** Pay the open invoice. */
    onPay: () => void
    /** `true` → the checkout is in flight. */
    isPaying?: boolean
}

/** Props for {@link InvoicesView}. */
export interface InvoicesViewProps {
    /** The invoices, newest first. */
    invoices: Array<InvoiceRow>
    /** Pay one still-unpaid invoice directly from the list row — the connected layer runs the checkout. */
    onPayInvoice: (invoiceId: string) => void
    /** Open one invoice's own detail — the connected layer populates `detail.invoice` and opens it. */
    onOpenInvoice: (invoiceId: string) => void
    /** The invoice-detail modal's own state. */
    detail: InvoicesViewDetail
    /** Already-localized copy. */
    labels: InvoicesViewLabels
    /** `true` → the page is still loading; the skeleton mirror is shown. */
    isSkeleton?: boolean
}

/**
 * The invoices page. See the file header for why `InvoiceDetailModal` is
 * composed here rather than left for a caller to mount.
 *
 * @param props - {@link InvoicesViewProps}
 */
const InvoicesView = ({ invoices, onPayInvoice, onOpenInvoice, detail, labels, isSkeleton = false }: InvoicesViewProps) => {
    const shell = (children: ReactNode) => (
        <div data-tier="page" data-component="InvoicesView" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
            {children}
        </div>
    )

    const heading = (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="h2" weight="bold" isSkeleton={isSkeleton} text={labels.title} />,
                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.subtitle} />,
            ]}
        />
    )

    // ── LOADING: the heading plus the list's own skeleton mirror.
    if (isSkeleton) {
        return shell(
            <StackV
                gap={6}
                items={[
                    () => heading,
                    () => <InvoiceList invoices={[]} onPay={() => {}} labels={labels.list} isSkeleton />,
                ]}
            />,
        )
    }

    return shell(
        <>
            <StackV
                gap={6}
                items={[
                    () => heading,
                    () => (
                        <InvoiceList
                            invoices={invoices}
                            onPay={onPayInvoice}
                            onOpenInvoice={onOpenInvoice}
                            labels={labels.list}
                        />
                    ),
                ]}
            />
            <InvoiceDetailModal
                isOpen={detail.isOpen}
                onOpenChange={detail.onOpenChange}
                invoice={detail.invoice}
                onPay={detail.onPay}
                isPaying={detail.isPaying}
                labels={labels.detail}
            />
        </>,
    )
}

export { InvoicesView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "InvoicesView" } as const
