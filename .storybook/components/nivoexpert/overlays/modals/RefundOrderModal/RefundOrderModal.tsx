import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { ButtonGroup } from "@sb-components/composites/buttons/ButtonGroup/ButtonGroup"
import { KeyValueList } from "@sb-components/composites/data/KeyValue/KeyValue"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `RefundOrderModal` — a blocking, DANGER confirmation for refunding one order:
 * the order/amount summary, a warning that refunding revokes the member's course
 * access, and a destructive confirm. Built on `ModalShell` directly (not the
 * generic `ConfirmDialog`) because the order/amount summary needs its own rows,
 * richer than `ConfirmDialog`'s single description string. The confirm button
 * does NOT close the modal itself — the caller closes it once the refund
 * mutation resolves, keeping it open while `isConfirming`.
 */

/** The order being refunded — the summary this modal shows above the warning. */
export interface RefundOrderSummary {
    /** Order number (e.g. "8821" → "Order #8821"). */
    orderNumber: string
    /** Name of the purchased package/plan. */
    packageName: string
    /** Already-formatted amount (e.g. "$899"). */
    amountLabel: string
    /** Payment gateway that processed the order (`"SePay"`, `"PayOS"`), or `null` for a free order. */
    gatewayLabel?: string | null
}

/** Props for {@link RefundOrderModal}. */
export interface RefundOrderModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button, or the caller closing after confirm resolves. Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The order being refunded. Unset while `isSkeleton` (nothing to show yet). */
    order?: RefundOrderSummary
    /** Fires when the reviewer presses the destructive confirm. Run the refund mutation here; the modal does NOT close itself. */
    onConfirm: () => void
    /** `true` → the confirm button shows a spinner and blocks further presses; cancel locks too. */
    isConfirming?: boolean
    /** `true` → the order summary rows shimmer; the footer is omitted (nothing to confirm yet). */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: RefundOrderModalLabels
}

/** The already-resolved copy the modal renders. */
export interface RefundOrderModalLabels {
    /** Modal title (e.g. "Refund this order?"). */
    title: string
    /** Row label for the order (paired with the package name as the value). */
    orderLabel: string
    /** Row label for the amount (paired with the gateway as the hint). */
    amountLabel: string
    /** Row label for the payment gateway. */
    gatewayLabel: string
    /** Shown for an order with no gateway (a free enrollment). */
    noGatewayLabel: string
    /** Warning copy — what refunding this order does to the member's access. */
    warningTitle: string
    /** Cancel button label. */
    cancelLabel: string
    /** Destructive confirm button label. */
    confirmLabel: string
}

/**
 * The refund confirmation modal. See the file header for why it is a modal, not a
 * drawer, and why it is built on `ModalShell` rather than the generic `ConfirmDialog`.
 *
 * @param props - {@link RefundOrderModalProps}
 */
const RefundOrderModal = ({ isOpen, onOpenChange, order, onConfirm, isConfirming = false, isSkeleton = false, labels }: RefundOrderModalProps) => (
    <div>
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.title}
            size="sm"
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <KeyValueList
                                isSkeleton={isSkeleton}
                                skeletonRows={2}
                                items={[
                                    { key: "order", label: labels.orderLabel, value: order?.packageName ?? "" },
                                    {
                                        key: "amount",
                                        label: labels.amountLabel,
                                        value: order?.amountLabel ?? "",
                                        hint: order?.gatewayLabel ?? labels.noGatewayLabel,
                                        emphasis: true,
                                    },
                                ]}
                            />
                        ),
                        ...(isSkeleton
                            ? []
                            : [() => <Alert status="danger" tone="soft" title={labels.warningTitle} />]),
                    ]}
                />
            )}
            footer={
                isSkeleton
                    ? undefined
                    : () => (
                        <ButtonGroup
                            align="end"
                            classNames={["w-full"]}
                            items={[
                                {
                                    key: "cancel",
                                    label: labels.cancelLabel,
                                    variant: "secondary",
                                    isDisabled: isConfirming,
                                    onPress: () => onOpenChange(false),
                                },
                                {
                                    key: "confirm",
                                    label: labels.confirmLabel,
                                    variant: "danger",
                                    isPending: isConfirming,
                                    onPress: onConfirm,
                                },
                            ]}
                        />
                    )
            }
        />
    </div>
)

export { RefundOrderModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "RefundOrderModal" } as const
