import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    RefundOrderModal,
    type RefundOrderModalLabels,
    type RefundOrderSummary,
} from "@sb-components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `RefundOrderModal` — a blocking, DANGER confirmation for refunding one order:
 * the order/amount summary, a warning that refunding revokes the member's course
 * access, and a destructive confirm. Built on `ModalShell` directly (not the
 * generic `ConfirmDialog`) because the order/amount summary needs its own rows,
 * richer than `ConfirmDialog`'s single description string. The confirm button
 * does NOT close the modal itself — the caller closes it once the refund
 * mutation resolves, keeping it open while `isConfirming`.
 */
const meta: Meta<typeof RefundOrderModal> = {
    title: "NivoExpert/Overlays/Modals/RefundOrderModal/RefundOrderModal",
    component: RefundOrderModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RefundOrderModal>

const LABELS: RefundOrderModalLabels = {
    title: "Refund this order?",
    orderLabel: "Order",
    amountLabel: "Amount",
    gatewayLabel: "Gateway",
    noGatewayLabel: "—",
    warningTitle: "Refunding this order revokes the member's access to the course.",
    cancelLabel: "Cancel",
    confirmLabel: "Refund",
}

const ORDER: RefundOrderSummary = {
    orderNumber: "8821",
    packageName: "Enterprise",
    amountLabel: "$899",
    gatewayLabel: "SePay",
}

// Real DOM: ModalShell(title="Refund this order?") > StackV(KeyValueList[order/amount]
// + Alert(danger)) + Modal.Footer[ButtonGroup(cancel, confirm)].
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "KeyValueList": { tier: "composite", role: "the order and amount summary", storyId: "composites-data-keyvalue-keyvaluelist--default" },
    "Alert": { tier: "atom", role: "the danger warning — refunding revokes course access", storyId: "atoms-feedback-alert-alert--statuses" },
    "ButtonGroup": { tier: "composite", role: "cancel + the destructive confirm", storyId: "composites-buttons-buttongroup-buttongroup--default" },
}

/** Shared controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledRefundOrderModal = ({
    triggerLabel,
    order,
    isConfirming,
}: {
    triggerLabel: string
    order?: RefundOrderSummary
    isConfirming?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label={triggerLabel} variant="danger" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <RefundOrderModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                order={order}
                onConfirm={() => {}}
                isConfirming={isConfirming}
                labels={LABELS}
            />
        </div>
    )
}

/** All states live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="RefundOrderModal"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A blocking danger confirmation, not a drawer — refunding is a decision the reviewer must answer before the order changes state. The order/amount summary is DATA the caller resolved (from OrderDetailDrawer's own order), and the confirm button never closes the modal itself: the caller closes it through onOpenChange once the mutation resolves."
            states={[
                {
                    name: "resting",
                    why: "The order and amount summary above the danger warning, with cancel and the destructive \"Refund\" confirm.",
                    code: "<RefundOrderModal isOpen={isOpen} onOpenChange={setIsOpen} order={order} onConfirm={refundOrder} labels={labels} />",
                    render: <ControlledRefundOrderModal triggerLabel="Open — resting" order={ORDER} />,
                },
                {
                    name: "isConfirming = true",
                    why: "The refund mutation is in flight: the confirm button shows a spinner and locks, cancel locks too, and the modal stays open until the caller closes it through onOpenChange.",
                    code: "<RefundOrderModal order={order} isConfirming … />",
                    render: <ControlledRefundOrderModal triggerLabel="Open — confirming" order={ORDER} isConfirming />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The modal's own first fetch is in flight: the order/amount rows shimmer, and the footer is omitted — there is nothing to confirm yet.",
                    code: "<RefundOrderModal isSkeleton … />",
                    render: (
                        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
                            <RefundOrderModal isOpen onOpenChange={() => {}} onConfirm={() => {}} isSkeleton labels={LABELS} />
                        </div>
                    ),
                },
            ]}
        />
    ),
}
