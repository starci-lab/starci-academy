import React from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PhaseScarcityNote } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { PriceTagProminent } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"
import type { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentPaywall`: the offer at the point the lesson stops. Lock glyph,
 * what is behind it, the price, and one way forward.
 *
 * FLAT ON PURPOSE — no card of its own. It lives INSIDE the reading card, right
 * under the faded tail of the body, so the page reads as one surface that runs
 * out rather than as a second card interrupting a first (a card inside a card).
 *
 * ⭐ BLOCK IMPORTS BLOCK, and this is the case that justifies the rule. Price and
 * scarcity are already blocks built for the course page (`PriceTagProminent`,
 * `PhaseScarcityNote`), and the same WHY — "sell this course" — turns up here in
 * a different screen. Rebuilding either would fork the pricing vocabulary in two
 * places, and they WILL drift.
 *
 * IT EARNS ITS OWN LAYER by deciding the frame the offer arrives in: the lock,
 * the sentence, the ORDER, and the single call to action. What it does not do is
 * re-decide what a price looks like.
 *
 * ONE WAY FORWARD. There is exactly one button. A second control here would ask a
 * reader who just hit a wall to also make a choice.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContentPaywall}. */
export interface ContentPaywallProps {
    /** Headline, localized by the caller — e.g. "Phần còn lại dành cho học viên". */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ContentPaywallProps) => (
    <div data-anat-part={anatPart}>
        <StackV gap="grouped" align="center" anatPart={showAnatomy ? "StackV" : undefined}>
            <IconTile icon={LockIcon} tone="accent" size="sm" showAnatomy={showAnatomy} />
            <Typography size="lg" weight="semibold" align="center" text={title} anatPart={showAnatomy ? "Typography" : undefined} />
            {description != null ? (
                <Typography size="sm" color="muted" align="center" text={description} anatPart={showAnatomy ? "Typography" : undefined} />
            ) : null}
            <PriceTagProminent
                discounted={discountedPriceVnd}
                original={originalPriceVnd}
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "PriceTagProminent" : undefined}
            />
            {currentPhase != null ? (
                <PhaseScarcityNote
                    currentPhase={currentPhase}
                    seatsRemaining={seatsRemaining}
                    nextPhasePriceVnd={nextPhasePriceVnd}
                    anatPart={showAnatomy ? "PhaseScarcityNote" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            <Button
                label={ctaLabel}
                variant="primary"
                suffixIcon={ArrowRightIcon}
                iconSlide
                onPress={onPurchase}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        </StackV>
    </div>
)

export { ContentPaywall }
