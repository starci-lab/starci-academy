import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    UpgradeTierConfirmModal,
    type UpgradeTierConfirmModalLabels,
    type UpgradeTierConfirmModalOrder,
} from "@sb-components/nivo/blocks/catalog/UpgradeTierConfirmModal/UpgradeTierConfirmModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `UpgradeTierConfirmModal` — the last step before an owned catalog order is
 * upgraded to a higher tier of the same item: recap the current tier and the
 * target tier, show the proration amount due, then request the upgrade. It
 * owns one domain-shaped selection (product, current tier, target tier,
 * proration), which is exactly why it sits in `blocks/catalog` rather than
 * `overlays/modals` — the same placement `BuyConfirmModal` uses in this
 * folder (OVERLAY-9: the surface is generic, the entity belongs to the block
 * inside it). Grounded in `CatalogOrderEntity` + `CatalogTierEntity`;
 * confirming does not swap the tier itself — it issues the Unpaid
 * `CatalogUpgrade` proration invoice, and the swap applies once that invoice
 * is paid (`upgradeCatalogTier` mutation).
 */
const meta: Meta<typeof UpgradeTierConfirmModal> = {
    title: "Nivo/Blocks/Catalog/UpgradeTierConfirmModal/UpgradeTierConfirmModal",
    component: UpgradeTierConfirmModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof UpgradeTierConfirmModal>

const LABELS: UpgradeTierConfirmModalLabels = {
    titlePrefix: "Confirm upgrade",
    currentPlanLabel: "Current plan",
    dueLabel: "Amount due",
    noteText: "An invoice for the difference will be issued, due in 7 days. The upgrade applies once it's paid.",
    freeLabel: "Free",
    cancelLabel: "Cancel",
    confirmLabel: "Request upgrade",
}

const BUSINESS_UPGRADE: UpgradeTierConfirmModalOrder = {
    productName: "AI Academy",
    currentTierName: "Starter",
    targetTierName: "Professional",
    currentPriceMonthlyVnd: 99000,
    targetPriceMonthlyVnd: 299000,
    description: "Custom domain, unlimited courses, AI tutor, certificates.",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    Typography: { tier: "atom", role: "the proration amount due, the target tier's positioning copy, the current-plan row, the invoice note, and the inline error" },
    Button: { tier: "atom", role: "cancel (ghost) and request-upgrade (primary, busy while the mutation runs)" },
}

/** Shared controlled wrapper — one `isOpen`/`isConfirming`/`errorMessage` state feeds every leaf state below. */
const ControlledUpgradeTierConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [, setIsConfirming] = useState(false)

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        order: BUSINESS_UPGRADE,
        onConfirm: () => setIsConfirming(true),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Upgrade to Professional" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="UpgradeTierConfirmModal"
                tier="block"
                leaf="Confirm a tier upgrade"
                annotate={ANNOTATE}
                reason="A presentational recap modal: it only shows the current tier, the target tier, and the proration amount due — there is no payment step here, because confirming only issues the Unpaid proration invoice; the tier swap itself applies once that invoice is paid. Confirming is blocked until an order + target tier exists, so the button can never fire on an empty selection."
                states={[
                    {
                        name: "order set (Starter → Professional)",
                        why: "A higher tier has been chosen for an owned order: the recap shows the proration amount due (target price minus current price), the target tier's positioning copy, and which plan is current today.",
                        code: `<UpgradeTierConfirmModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    order={order}
    onConfirm={confirm}
    labels={labels}
/>`,
                        render: <UpgradeTierConfirmModal {...base} />,
                    },
                    {
                        name: "isConfirming = true",
                        why: "The upgrade is being requested — the confirm button shows its busy state and Cancel locks, so the operator can't double-submit the request.",
                        code: "<UpgradeTierConfirmModal isConfirming … />",
                        render: <UpgradeTierConfirmModal {...base} isConfirming />,
                    },
                    {
                        name: "errorMessage set",
                        why: "The `upgradeCatalogTier` mutation was rejected (e.g. the order is no longer active) — the reason renders inline above the footer instead of a separate banner, and the operator can retry or cancel.",
                        code: "<UpgradeTierConfirmModal errorMessage=\"This order can no longer be upgraded.\" … />",
                        render: <UpgradeTierConfirmModal {...base} errorMessage="This order can no longer be upgraded." />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch (resolving the order's current tier) hasn't resolved yet, so the amount due, the positioning copy, and the current-plan row all shimmer together.",
                        code: "<UpgradeTierConfirmModal isSkeleton … />",
                        render: <UpgradeTierConfirmModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All four states (set, confirming, error, loading) live inside one `BlockAnatomy` panel — see its `states` array. Closed does not apply — the modal renders nothing when `isOpen` is false. */
export const Default: Story = {
    render: () => <ControlledUpgradeTierConfirmModal />,
}
