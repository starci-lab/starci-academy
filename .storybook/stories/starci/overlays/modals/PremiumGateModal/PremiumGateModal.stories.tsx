import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    PremiumGateModal,
    type PremiumGateModalPrice,
    type PremiumGateModalProps,
} from "@sb-components/starci/overlays/modals/PremiumGateModal/PremiumGateModal"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PremiumGateModal` — the value-first buy/register prompt opened when a viewer
 * taps a locked premium tab or the "Practice" rail button on a trial-read
 * lesson. Opened via the app's global overlay store; this port takes plain
 * `isOpen`/`onOpenChange` props. One leaf (`Default`): the wrapper shape never
 * changes — only the price region's content (resolving / landed with a saving /
 * landed with no saving) and the header wording (named course vs generic) vary,
 * all states.
 */
const meta: Meta<typeof PremiumGateModal> = {
    title: "StarCi/Overlays/Modals/PremiumGateModal/PremiumGateModal",
    component: PremiumGateModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PremiumGateModal>

// Real DOM (size="md"): Modal.CloseTrigger + Modal.Header > Typography(title+description)
// + Modal.Body > StackV > (StackV > Cluster×3 unlock rows) + (StackV > PriceTagProminent +
// PhaseScarcityNote, OR two skeleton Typography bars) + Modal.Footer > Button.
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "header title + description (named-course or generic, from the block's own `GATE_HEADER` table) — merges with the unlock-row labels and the resting price bars, all the same atom", storyId: "atoms-text-typography-typography--overview" },
    "Modal.Body": { tier: "heroui", role: "the body region — unlock checklist above the price/scarcity region" },
    "StackV": { tier: "frame", role: "vertical column(s): the body's own section stack, and the row-stack holding the three unlock lines", storyId: "frames-stack-stackv--default" },
    "Cluster": { tier: "frame", role: "one unlock line — a check glyph beside its benefit label; repeats once per `GATE_UNLOCKS` row", storyId: "frames-cluster-cluster--default" },
    "PriceTagProminent": { tier: "block", role: "amount due + struck-through original price + savings chip, when there is a saving to show", storyId: "starci-blocks-commerce-pricetag--prominent" },
    "PhaseScarcityNote": { tier: "block", role: "seats left in the current phase + the price it rises to; renders nothing on its own `seatsRemaining === null` contract", storyId: "starci-blocks-commerce-phasescarcitynote-phasescarcitynote--default" },
    "Modal.Footer": { tier: "heroui", role: "the action row — a single full-width upgrade CTA" },
    "Button": { tier: "atom", role: "the upgrade CTA — caller owns close+open-payment handoff (Rule 13)", storyId: "atoms-buttons-button-button--default" },
}

/** Sample landed price — early-bird phase, a real saving, 12 seats left before it rises. */
const SAMPLE_PRICE: PremiumGateModalPrice = {
    discountedPriceVnd: 1_990_000,
    originalPriceVnd: 2_990_000,
    phasePriceVnd: 2_490_000,
    discountPercent: 20,
    currentPhase: PricingPhase.EarlyBird,
    seatsRemaining: 12,
    nextPhasePriceVnd: 2_490_000,
}

/** Same phase, but priced at list — no saving, no scarcity to mention. */
const NO_SAVING_PRICE: PremiumGateModalPrice = {
    discountedPriceVnd: 2_490_000,
    originalPriceVnd: null,
    phasePriceVnd: 2_490_000,
    discountPercent: 0,
    currentPhase: PricingPhase.Regular,
    seatsRemaining: null,
    nextPhasePriceVnd: null,
}

/** Controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledPremiumGateModal = ({
    triggerLabel,
    ...modalProps
}: {
    triggerLabel: string
} & Omit<PremiumGateModalProps, "isOpen" | "onOpenChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"

                onPress={() => setIsOpen(true)}
            />
            <PremiumGateModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}


                {...modalProps}
            />
        </div>
    )
}

/**
 * ONE LEAF. The wrapper shape never changes; `price`/`isSkeleton`/`courseTitle`
 * only vary the CONTENT inside the same tree — see the file header.
 */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="PremiumGateModal"
            tier="block"
            leaf="Default"
            parts={[]}
            annotate={ANNOTATE}
            reason="Value-first buy prompt: what unlocks, the loyalty-aware price, one CTA — nothing else. The header and the unlock checklist are static chrome (fixed local vocabulary, per `ContentModeNav`'s `MODE_LABEL` pattern); only the price/scarcity region ever waits on data, mirroring `TrialConversionStrip`'s own `isSkeleton` contract."
            states={[
                {
                    name: "price resolved, with a saving",
                    why: "The common case: a real discount and real seats-remaining scarcity, both handed to `PriceTagProminent` + `PhaseScarcityNote` exactly as `TrialConversionStrip` composes them.",
                    code: `<PremiumGateModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    courseTitle="Backend Engineering"
    price={price}
    onUpgrade={handleUpgrade}
/>`,
                    render: (
                        <ControlledPremiumGateModal
                            triggerLabel="Open gate — with saving"
                            courseTitle="Backend Engineering"
                            price={SAMPLE_PRICE}
                            onUpgrade={() => {}}
                        />
                    ),
                },
                {
                    name: "price resolved, no saving",
                    why: "`originalPriceVnd` equals the charge and `seatsRemaining` is `null` — `PriceTagProminent` shows the plain amount with no strike-through/chip, and `PhaseScarcityNote` renders nothing at all on its own null-seats contract (it is never told to hide; it decides that itself).",
                    code: `<PremiumGateModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    price={priceAtListNoScarcity}
    onUpgrade={handleUpgrade}
/>`,
                    render: (
                        <ControlledPremiumGateModal
                            triggerLabel="Open gate — no saving"
                            price={NO_SAVING_PRICE}
                            onUpgrade={() => {}}
                        />
                    ),
                },
                {
                    name: "isSkeleton = true, price not yet arrived",
                    why: "Only the price/scarcity region rests: two shimmer bars stand exactly where `PriceTagProminent` + `PhaseScarcityNote` will land, sized `h4`/`w-1/3` and `xs`/`w-1/2` — the header and the unlock checklist paint immediately since neither depends on the price.",
                    code: "<PremiumGateModal isOpen={isOpen} onOpenChange={setIsOpen} isSkeleton onUpgrade={handleUpgrade} />",
                    render: (
                        <ControlledPremiumGateModal
                            triggerLabel="Open gate — loading price"
                            isSkeleton
                            onUpgrade={() => {}}
                        />
                    ),
                },
                {
                    name: "courseTitle omitted — generic header",
                    why: "With no course in scope yet (e.g. opened from a rail button rather than a specific locked tab), the header falls back to `GATE_HEADER.generic` instead of a caller-supplied placeholder string.",
                    code: `<PremiumGateModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    price={price}
    onUpgrade={handleUpgrade}
/>`,
                    render: (
                        <ControlledPremiumGateModal
                            triggerLabel="Open gate — generic header"
                            price={SAMPLE_PRICE}
                            onUpgrade={() => {}}
                        />
                    ),
                },
            ]}
        />
    ),
}
