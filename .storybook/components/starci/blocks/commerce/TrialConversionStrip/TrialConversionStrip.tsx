import React from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { PriceBreakdown, PriceTagProminent } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"
// The NON-legacy version (`designs/commerce/…`) — the `_legacy` version of the same
// name still exists but is a dead end; screens are forbidden from touching `_legacy`
// so every link in the chain has to move off it.
import { PhaseScarcityNote, PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { TitledText } from "@sb-components/composites/text/TitledText/TitledText"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/page/CourseContents/TrialConversionStrip`, made
 * TIER-3 PRESENTATIONAL: `src` reads `useQueryCoursePricePreviewSwr` (SWR) +
 * `usePaymentOverlayState` (zustand) itself; this port takes the same data as
 * PLAIN PROPS (`price`, `isSkeleton`, `onEnroll`) so it renders standalone
 * with no store/SWR wiring. The `next-intl` strings are INLINED locally (vi).
 * Composed from lower-tier locals — {@link IconTile} (lock icon, accent tone,
 * sm) + {@link PriceTag} + {@link PhaseScarcityNote} + {@link Skeleton.Typography}
 * (price-loading mirror) + {@link Button} (enroll CTA). Synced to `src` later.
 */

/** Minimal price-preview shape this block needs (mirrors `coursePricePreview` fields actually read). */
export interface TrialConversionStripPrice {
    discountedPriceVnd: number
    originalPriceVnd?: number | null
    phasePriceVnd: number
    discountPercent: number
    currentPhase: PricingPhase
    seatsRemainingInCurrentPhase: number | null
    nextPhasePriceVnd: number | null
}

/** Props for the {@link TrialConversionStrip} block. */
export interface TrialConversionStripProps {
    /** FREE lessons the trial viewer hasn't read yet — powers the goal-gradient line. */
    freeLessonsRemaining: number
    /** Price preview for the course; `undefined`/`null` while absent (see `isSkeleton`). */
    price?: TrialConversionStripPrice | null
    /**
     * `true` → this block is at REST. Only the PRICE region rests: the header (icon,
     * title, description) and the CTA do not depend on the price, so they render
     * immediately and the shimmer stands exactly where PriceTag + PhaseScarcityNote will
     * land, which is what stops the layout jumping when the price arrives.
     *
     * Named `isSkeleton`, not `isPriceLoading` (§12g.0a: ONE vocabulary across all five
     * tiers). The old name was a second word for the same idea at this tier only, so a
     * reader crossing the block boundary had to translate it every time — and the screen
     * had to write `isPriceLoading={isSkeleton}` to bridge the two.
     */
    isSkeleton?: boolean
    /** Fired when the enroll CTA is pressed (caller owns opening the payment flow). */
    onEnroll?: () => void
    /** Layout utilities on the root, from the closed positioning union (SurfaceCard's `className` door was deleted, COMPOSITE-4). */
    classNames?: Array<AllowedClassName>
}

/**
 * Trial → enroll conversion strip on the content-home. Bundles three honest
 * levers on the surface they actually land on: (1) LOSS-AVERSION — "you've
 * read N/M free lessons, keep going"; (2) SCARCITY — the real pricing-phase
 * seats + next-tier price via {@link PhaseScarcityNote}; (3) the enroll CTA.
 * Every number is a prop from the caller — this block never fabricates one.
 *
 * @param props - {@link TrialConversionStripProps}
 */
const TrialConversionStripBase = ({
    freeLessonsRemaining,
    price,
    isSkeleton = false,
    onEnroll,
    classNames,
}: TrialConversionStripProps) => {
    const hasFreeLeft = freeLessonsRemaining > 0

    const breakdown: PriceBreakdown | undefined = price
        ? {
            phase: price.phasePriceVnd,
            loyaltyPercent: price.discountPercent,
        }
        : undefined

    const headerRow = (
        <StackH gap={4} align="center" items={[
            () => (
                <IconTile
                    icon={LockIcon}
                    tone="accent"
                    size="sm"

                />
            ),
            // The "title + description" cluster is ONE SEMANTIC UNIT ⇒ goes through
            // ONE frame, not two separate `Typography`.
            // `TitledText size="row"` (default) already OWNS exactly this scale:
            // title `sm` medium · subtitle `xs` muted. Hand-building two atoms means
            // the block decides its own font sizes — one style per spot, with
            // nothing keeping them in sync.
            () => (
                <TitledText
                    classNames={["flex-1"]}

                    isSkeleton={isSkeleton && !price}
                    title="Free trial — unlock the full course"
                    subtitle={
                        hasFreeLeft
                            ? `${freeLessonsRemaining} free lessons left unread — keep reading or unlock the full course now.`
                            : "You've read every free lesson — unlock the full course to keep going."
                    }
                />
            ),
        ]} />
    )

    // `grouped`. Read the seam by RELATIONSHIP, not by tier: the
    // scarcity line is a CAPTION OF THE PRICE, so price + scarcity are one
    // cluster and this is an INTRA-cluster seam. `section` (6) belongs to the
    // seams AROUND this cluster — to the lead cluster above and to the CTA
    // beside it. Applying "design ↔ design = 6"
    // mechanically here would produce the rhythm 24/12/24/24, i.e. the caption
    // as far from its own price as the CTA is from everything — a uniform
    // rhythm stops reading as groups. With 3 the
    // card reads 24/12/12/24 — two groups, which is what it is.
    const priceColumn = (
        <StackV gap={4} items={
            isSkeleton && !price ? [
                // The CTA card renders instantly once the outline
                // resolves, but the price is a second fetch — mirror the price
                // line instead of showing an empty gap until it lands.
                () => <Typography size="h4" isSkeleton classNames={["w-1/3"]} />,
                () => <Typography size="xs" isSkeleton classNames={["w-1/2"]} />,
            ] : price?.discountedPriceVnd != null ? [
                () => (
                    <PriceTagProminent
                        discounted={price.discountedPriceVnd}
                        original={price.originalPriceVnd}
                        breakdown={breakdown}

                    />
                ),
                () => (
                    <PhaseScarcityNote

                        currentPhase={price.currentPhase}
                        seatsRemaining={price.seatsRemainingInCurrentPhase}
                        nextPhasePriceVnd={price.nextPhasePriceVnd}
                    />
                ),
            ] : []
        } />
    )

    // Price is a NUMBER — shrinking it means nothing, unlike a long title that
    // can truncate. The correct behaviour for this row is to WRAP when tight:
    // the button drops to the next line instead of the price getting squeezed.
    // That's `StackH` with `wrap` — children are ARBITRARY.
    // The seam between the lead cluster and the price block is a SEAM, not a
    // BOUNDARY: `gap-6` on the parent stack already separates the two regions;
    // adding a `border-t` on top says the same thing twice in two languages.
    const footerRow = (
        <StackH
            gap={6}
            align="end"
            justify="between"
            wrap

            items={[
                () => priceColumn,
                // ATOM `Button`, NOT the `_legacy` version: going around the port is drift —
                // fixing the atom in one place won't propagate here.
                // `suffixIcon` takes a COMPONENT REF, the atom forces scale + weight.
                () => (
                    <Button
                        variant="primary"
                        size="lg"
                        classNames={["shrink-0"]}
                        label="Unlock the full course"
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onEnroll}

                    />
                ),
            ]}
        />
    )

    return (
        // The frame owns radius/shadow/padding from ONE source: `SurfaceCard`.
        // `padding` defaults to `3` — the system's actual `p-3` card rule.
        <SurfaceCard
            classNames={classNames}
            body={() => (
                <StackV gap={6} items={[
                    () => headerRow,
                    () => footerRow,
                ]} />
            )}
        />
    )
}

/**
 * `TrialConversionStrip.*` — namespace.
 *
 * The root stays CALLABLE so bare call-sites work; `.Base` is the standard path.
 */
export { TrialConversionStripBase as TrialConversionStrip }
