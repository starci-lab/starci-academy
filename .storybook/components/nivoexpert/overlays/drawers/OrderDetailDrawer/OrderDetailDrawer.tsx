import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { KeyValueList } from "@sb-components/composites/data/KeyValue/KeyValue"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OrderDetailDrawer` -- the full-detail surface for ONE order: paying member,
 * package, amount, gateway, and status, with a refund action that hands off to
 * `RefundOrderModal`. This shell does NOT run the refund itself -- `onRefund` is the
 * hand-off; the caller owns what happens next.
 */

/** Payment state of the order shown -- drives both the status chip and whether refund is offered. */
export type OrderDetailStatus = "paid" | "installment" | "free" | "refunded"

/** The order this drawer shows in full. */
export interface OrderDetailView {
    /** Order number, shown in the drawer title (e.g. "8821" -> "Order #8821"). */
    orderNumber: string
    /** Display name of the paying member. */
    memberName: string
    /** Name of the purchased package/plan. */
    packageName: string
    /** Already-formatted amount (e.g. "$899", "$299 x 3"). */
    amountLabel: string
    /** Already-resolved status copy (e.g. "Paid", "Period 1 of 3", "Free", "Refunded"). */
    statusLabel: string
    /** Payment state -- drives the status chip's tone and whether the refund action shows. */
    status: OrderDetailStatus
    /** Payment gateway that processed the order (`"SePay"`, `"PayOS"`), or `null` for a free order. */
    gatewayLabel?: string | null
}

/** Props for {@link OrderDetailDrawer}. */
export interface OrderDetailDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The order being viewed. Unset while `isSkeleton` (nothing to show yet). */
    order?: OrderDetailView
    /** Fired when the refund action is pressed -- the connected layer opens `RefundOrderModal`. */
    onRefund: () => void
    /** `true` -> the drawer's own first fetch is in flight; the title and every row shimmer, and the footer is omitted (nothing to act on yet). */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OrderDetailDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface OrderDetailDrawerLabels {
    /** Drawer title prefix, before the order number (e.g. "Order #"). */
    titlePrefix: string
    /** Row label for the paying member. */
    memberLabel: string
    /** Row label for the purchased package. */
    packageLabel: string
    /** Row label for the amount. */
    amountLabel: string
    /** Row label for the payment gateway. */
    gatewayLabel: string
    /** Row label for the order status. */
    statusLabel: string
    /** Shown for an order with no gateway (a free enrollment). */
    noGatewayLabel: string
    /** Refund button label. */
    refundActionLabel: string
}

/** Order status -> chip tone. Paid/refunded are settled states, installment is still running, free needs none. */
const STATUS_TONE: Record<OrderDetailStatus, ChipTone> = {
    paid: "success",
    installment: "warning",
    free: "default",
    refunded: "default",
}

/** Only a fully paid order is offered a refund -- an installment plan, a free enrollment, or an already-refunded order have nothing (further) to refund. */
const isRefundable = (status: OrderDetailStatus) => status === "paid"

/**
 * The order-detail drawer. See the file header for why refund is a hand-off,
 * never run from inside this shell.
 *
 * @param props - {@link OrderDetailDrawerProps}
 */
const OrderDetailDrawer = ({ isOpen, onOpenChange, order, onRefund, isSkeleton = false, labels }: OrderDetailDrawerProps) => {
    const title = order != null ? `${labels.titlePrefix}${order.orderNumber}` : labels.titlePrefix

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={title}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <KeyValueList
                                    isSkeleton={isSkeleton}
                                    skeletonRows={3}
                                    items={[
                                        { key: "member", label: labels.memberLabel, value: order?.memberName ?? "" },
                                        { key: "package", label: labels.packageLabel, value: order?.packageName ?? "" },
                                        { key: "amount", label: labels.amountLabel, value: order?.amountLabel ?? "" },
                                        { key: "gateway", label: labels.gatewayLabel, value: order?.gatewayLabel ?? labels.noGatewayLabel },
                                    ]}
                                />
                            ),
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.statusLabel} />,
                                        () =>
                                            isSkeleton || order == null ? (
                                                <Typography size="sm" isSkeleton />
                                            ) : (
                                                <Chip tone={STATUS_TONE[order.status]} text={order.statusLabel} />
                                            ),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
                footer={
                    isSkeleton || order == null || !isRefundable(order.status)
                        ? undefined
                        : () => <Button variant="danger" size="sm" label={labels.refundActionLabel} onPress={onRefund} />
                }
            />
        </div>
    )
}

export { OrderDetailDrawer }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "OrderDetailDrawer" } as const
