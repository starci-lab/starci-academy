import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    OrderDetailDrawer,
    type OrderDetailDrawerLabels,
    type OrderDetailView,
} from "@sb-components/nivoexpert/overlays/drawers/OrderDetailDrawer/OrderDetailDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OrderDetailDrawer` — the full-detail surface for ONE order: paying member,
 * package, amount, gateway, and status, with a refund action that hands off to
 * `RefundOrderModal`. This shell does NOT run the refund itself — `onRefund` is the
 * hand-off; the caller owns what happens next.
 */
const meta: Meta<typeof OrderDetailDrawer> = {
    title: "NivoExpert/Overlays/Drawers/OrderDetailDrawer/OrderDetailDrawer",
    component: OrderDetailDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OrderDetailDrawer>

const LABELS: OrderDetailDrawerLabels = {
    titlePrefix: "Order #",
    memberLabel: "Member",
    packageLabel: "Package",
    amountLabel: "Amount",
    gatewayLabel: "Gateway",
    statusLabel: "Status",
    noGatewayLabel: "—",
    refundActionLabel: "Refund",
}

const PAID_ORDER: OrderDetailView = {
    orderNumber: "8821",
    memberName: "Hoang Nam",
    packageName: "Enterprise",
    amountLabel: "$899",
    statusLabel: "Paid",
    status: "paid",
    gatewayLabel: "SePay",
}

const FREE_ORDER: OrderDetailView = {
    orderNumber: "8819",
    memberName: "Quoc Bao",
    packageName: "Starter",
    amountLabel: "$0",
    statusLabel: "Free",
    status: "free",
    gatewayLabel: null,
}

const INSTALLMENT_ORDER: OrderDetailView = {
    orderNumber: "8820",
    memberName: "Thu Ha",
    packageName: "Professional · installment",
    amountLabel: "$299 × 3",
    statusLabel: "Period 1 of 3",
    status: "installment",
    gatewayLabel: "PayOS",
}

// Real DOM (content branch, refundable): DrawerShell(title="Order #8821") >
// StackV(KeyValueList[member/package/amount/gateway] + StackH(status label + Chip))
// + Drawer.Footer[Button(refund)]?.
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "KeyValueList": { tier: "composite", role: "member, package, amount, and gateway", storyId: "composites-data-keyvalue-keyvaluelist--default" },
    "Typography (status label)": { tier: "atom", role: "the status row's caption" },
    "Chip (status)": { tier: "atom", role: "the order's payment state — paid, mid-installment, free, or refunded" },
    "Button (refund)": { tier: "atom", role: "hands off to RefundOrderModal — only shown for a fully paid order" },
}

/** Shared controlled wrapper — the trigger reopens the drawer after it closes. */
type ControlledOrderDetailDrawerProps = {
    triggerLabel: string
    order?: OrderDetailView
}
const ControlledOrderDetailDrawer = ({ triggerLabel, order }: ControlledOrderDetailDrawerProps) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <div className="self-start">
                <Button label={triggerLabel} variant="secondary" size="sm" onPress={() => setIsOpen(true)} />
            </div>
            <OrderDetailDrawer isOpen={isOpen} onOpenChange={setIsOpen} order={order} onRefund={() => {}} labels={LABELS} />
        </div>
    )
}

/** All states live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="OrderDetailDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A presentational overlay drawer over one order. `status` is DATA, so paid/installment/free are states of the single shape, and it alone decides whether the refund action shows — only a fully paid order is refundable; an installment plan, a free enrollment, or an already-refunded order have nothing (further) to refund."
            states={[
                {
                    name: "paid — refund available",
                    why: "A fully settled order through SePay: the status chip reads \"Paid\", and the footer shows the danger \"Refund\" action, which hands off to RefundOrderModal without running the refund itself.",
                    code: "<OrderDetailDrawer isOpen={isOpen} onOpenChange={setIsOpen} order={order} onRefund={openRefundModal} labels={labels} />",
                    render: <ControlledOrderDetailDrawer triggerLabel="Open — paid" order={PAID_ORDER} />,
                },
                {
                    name: "installment — mid-schedule, no refund action",
                    why: "A plan still running through PayOS, on period 1 of 3: the status chip reads the current period, and the footer is empty — an installment plan in progress is not offered a refund.",
                    code: "<OrderDetailDrawer order={{ ...order, status: \"installment\" }} … />",
                    render: <ControlledOrderDetailDrawer triggerLabel="Open — installment" order={INSTALLMENT_ORDER} />,
                },
                {
                    name: "free — no gateway, no refund action",
                    why: "A free enrollment: the gateway row falls back to its dash, and there is nothing to refund, so the footer is empty.",
                    code: "<OrderDetailDrawer order={{ ...order, status: \"free\", gatewayLabel: null }} … />",
                    render: <ControlledOrderDetailDrawer triggerLabel="Open — free" order={FREE_ORDER} />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The drawer's own first fetch is in flight: the title and every row shimmer, and the footer is omitted — there is nothing to act on yet.",
                    code: "<OrderDetailDrawer isSkeleton … />",
                    render: (
                        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
                            <OrderDetailDrawer isOpen onOpenChange={() => {}} onRefund={() => {}} isSkeleton labels={LABELS} />
                        </div>
                    ),
                },
            ]}
        />
    ),
}
