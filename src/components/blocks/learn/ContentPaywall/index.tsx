import React from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { IconTile } from "@/components/atoms/display/IconTile"
import { Typography } from "@/components/atoms/text/Typography"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { PriceTagProminent } from "@/components/blocks/commerce/PriceTag"
import type { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { StackV } from "@/components/frames/Stack"

/**
 * `ContentPaywall` — the offer at the point the lesson stops. Flat, with no card
 * of its own, so it sits inside the reading card under the faded body tail as
 * one surface that runs out. It reuses the course page's price and scarcity
 * blocks and owns only the frame the offer arrives in: the lock, the sentence,
 * the order, and one call to action. Losing the scarcity line and `isSkeleton`
 * are each their own leaf; whether an original price strikes through is data.
 */

/** Props for {@link ContentPaywall}. */
export interface ContentPaywallProps {
    /** Headline, localized by the caller — e.g. "The rest is for enrolled learners". */
    title: string
    /** One sentence on what buying unlocks. */
    description?: string
    /** Price after discount, in VND. */
    discountedPriceVnd: number
    /** Price before discount, for the struck-through original. */
    originalPriceVnd?: number | null
    /** Which pricing phase the course is in — drives the scarcity line. */
    currentPhase?: PricingPhase
    /** Seats left in the current phase. `null` → the phase is not capped. */
    seatsRemaining?: number | null
    /** What the next phase will cost, so the reader can see waiting is not free. */
    nextPhasePriceVnd?: number | null
    /** Label of the single call to action, localized by the caller. */
    ctaLabel: string
    /** Fired when the reader takes the offer. */
    onPurchase: () => void
    /**
     * `true` → the price and the scarcity line mirror themselves. The lock, the
     * headline and the button stay REAL: they are known before any price request,
     * and shimmering them would hide an offer that was already legible.
     */
    isSkeleton?: boolean
}

/**
 * The offer where the lesson stops. See the file header for the full contract.
 *
 * @param props - {@link ContentPaywallProps}
 */
const ContentPaywall = ({
    title,
    description,
    discountedPriceVnd,
    originalPriceVnd,
    currentPhase,
    seatsRemaining = null,
    nextPhasePriceVnd = null,
    ctaLabel,
    onPurchase,
    isSkeleton = false,
}: ContentPaywallProps) => {
    return (
        <StackV
            identity={{ tier: "block", component: "ContentPaywall" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            align="center"
            items={[
                () => <IconTile icon={LockIcon} tone="accent" size="sm" />,
                // real source (`PremiumPaywall/index.tsx:54`): `text-xl font-semibold` (a bare div,
                // not routed through Typography) — matches `size="h4"` (heading, 20px), not body `lg`.
                () => <Typography size="h4" weight="semibold" align="center" text={title} />,
                ...(description != null ? [() => (
                    <Typography size="sm" color="muted" align="center" text={description} />
                )] : []),
                () => (
                    <PriceTagProminent
                        discounted={discountedPriceVnd}
                        original={originalPriceVnd}
                        isSkeleton={isSkeleton}

                    />
                ),
                ...(currentPhase != null ? [() => (
                    <PhaseScarcityNote
                        currentPhase={currentPhase}
                        seatsRemaining={seatsRemaining}
                        nextPhasePriceVnd={nextPhasePriceVnd}


                    />
                )] : []),
                () => (
                    <Button
                        label={ctaLabel}
                        variant="primary"
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onPurchase}

                    />
                ),
            ]}
        />
    )
}

export { ContentPaywall }
