import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    BuyConfirmModal,
    type BuyConfirmModalLabels,
    type BuyConfirmModalOrder,
} from "@sb-components/nivo/blocks/catalog/BuyConfirmModal/BuyConfirmModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `BuyConfirmModal` — the last step before a catalog order is placed: recap the
 * chosen product + tier, show what it costs and what it's paid with, then place
 * the order. It owns one domain-shaped selection (product, tier, price), which is
 * exactly why it sits in `blocks/catalog` rather than `overlays/modals` — the same
 * placement `ConnectChannelModal` uses in `blocks/agent-os` (OVERLAY-9: the surface
 * is generic, the entity belongs to the block inside it). Grounded in
 * `CatalogItemEntity` + `CatalogTierEntity`; payment is read-only against the
 * user's `WalletEntity.balanceVnd` — there is no method picker, because the
 * streamlined catalog pays from the wallet only.
 */
const meta: Meta<typeof BuyConfirmModal> = {
    title: "Nivo/Blocks/Catalog/BuyConfirmModal/BuyConfirmModal",
    component: BuyConfirmModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof BuyConfirmModal>

const LABELS: BuyConfirmModalLabels = {
    titlePrefix: "Confirm purchase",
    payWithLabel: "Pay with",
    walletLabel: "nivo Wallet",
    perMonthLabel: "/ month",
    freeLabel: "Free",
    cancelLabel: "Cancel",
    confirmLabel: "Confirm purchase",
}

const PROFESSIONAL_ORDER: BuyConfirmModalOrder = {
    productName: "AI Academy",
    tierName: "Professional",
    priceMonthlyVnd: 299000,
    description: "Custom domain, unlimited courses, AI tutor, certificates.",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    Typography: { tier: "atom", role: "the price, the tier's positioning copy, and the wallet balance line" },
    Button: { tier: "atom", role: "cancel (ghost) and confirm-purchase (primary, busy while placing the order)" },
}

/** Shared controlled wrapper — one `isOpen`/`isConfirming` state feeds every leaf state below. */
const ControlledBuyConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [, setIsConfirming] = useState(false)

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        order: PROFESSIONAL_ORDER,
        walletBalanceVnd: 3200000,
        onConfirm: () => setIsConfirming(true),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Buy Professional" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="BuyConfirmModal"
                tier="block"
                leaf="Confirm a purchase"
                annotate={ANNOTATE}
                reason="A presentational recap modal: it only shows the chosen product + tier, what it costs, and the wallet it pays from — there is no payment-method picker, because the streamlined catalog pays from the wallet only. Confirming is blocked until a selection exists, so the button can never fire on an empty order."
                states={[
                    {
                        name: "order set (Professional)",
                        why: "A tier has been chosen from the catalog grid: the recap shows its monthly price and positioning copy, and the wallet balance line shows what will pay for it.",
                        code: `<BuyConfirmModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    order={order}
    walletBalanceVnd={3200000}
    onConfirm={confirm}
    labels={labels}
/>`,
                        render: <BuyConfirmModal {...base} />,
                    },
                    {
                        name: "priceOneTimeVnd set (no recurring price)",
                        why: "A one-time-priced tier renders the same shape with no `/ month` suffix — the price text is derived from whichever price field the tier actually carries.",
                        code: "<BuyConfirmModal order={{ ...order, priceMonthlyVnd: null, priceOneTimeVnd: 1490000 }} … />",
                        render: <BuyConfirmModal {...base} order={{ ...PROFESSIONAL_ORDER, priceMonthlyVnd: null, priceOneTimeVnd: 1490000 }} />,
                    },
                    {
                        name: "isConfirming = true",
                        why: "The order is being placed — the confirm button shows its busy state and Cancel locks, so the operator can't double-submit the order.",
                        code: "<BuyConfirmModal isConfirming … />",
                        render: <BuyConfirmModal {...base} isConfirming />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch (resolving the wallet balance) hasn't resolved yet, so the price, the positioning copy, and the wallet line all shimmer together.",
                        code: "<BuyConfirmModal isSkeleton … />",
                        render: <BuyConfirmModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All four states (set, one-time price, confirming, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledBuyConfirmModal />,
}
