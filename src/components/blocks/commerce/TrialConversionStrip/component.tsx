import React from "react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { type SkeletonProps } from "@/components/composites/_slot"
import { IconTile } from "@/components/atoms/display/IconTile"
import { PriceTagProminent, type PriceBreakdown } from "@/components/blocks/commerce/PriceTag"
// The NON-legacy version (`designs/commerce/…`) — the `_legacy` version of the same
// name still exists but is a dead end; screens are forbidden from touching `_legacy`
// so every link in the chain has to move off it.
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { TitledText } from "@/components/composites/text/TitledText"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { QueryCoursePricePreviewData } from "@/modules/api/graphql/queries/types/course-price-preview"

/** Props for {@link _TrialConversionStrip} — presentational; all text + price resolved, no fetch/store/i18n. */
export interface TrialConversionStripProps {
    /** Card title (already localized). */
    title: string
    /** Supporting line under the title — the connected file already picked the goal-gradient vs generic copy. */
    description: string
    /** Enroll CTA label (already localized). */
    cta: string
    /** Resolved pre-checkout price; omitted/null → the price line is skipped. */
    price?: QueryCoursePricePreviewData | null
    /**
     * `true` while the price is still fetching → the price column shimmers instead of
     * showing an empty gap, KEEPING its line boxes so nothing jumps in layout. The
     * header (icon/title/description) and the CTA never depend on the price fetch, so
     * they always render their real content.
     */
    isSkeleton?: boolean
    /** Open the shared payment modal in the course-enroll flow. */
    onEnroll: () => void
    /** Where this strip sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Trial → enroll conversion strip on the content-home — the presentational half of
 * {@link import("./index").TrialConversionStrip}. Three honest levers: (1) loss-aversion copy,
 * (2) real pricing-phase scarcity via {@link PhaseScarcityNote}, (3) an outcome-framed enroll CTA.
 * Every number is handed in resolved — nothing fabricated. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link TrialConversionStripProps}
 */
export const _TrialConversionStrip = ({
    title,
    description,
    cta,
    price,
    isSkeleton = false,
    onEnroll,
    classNames,
}: TrialConversionStripProps) => {
    const breakdown: PriceBreakdown | undefined = price
        ? {
            phase: price.phasePriceVnd,
            loyaltyPercent: price.discountPercent,
        }
        : undefined

    // Header never rests — title/description already arrived as resolved strings
    // (i18n + the outline), not a fetch, so there is nothing here to shimmer.
    const headerRow = (
        <StackH gap={4} principles={["content-row"]} align="center" items={[
            () => <IconTile icon={LockIcon} tone="accent" size="sm" />,
            () => <TitledText classNames={["flex-1"]} title={title} subtitle={description} />,
        ]} />
    )

    // The scarcity line is a CAPTION OF THE PRICE — price + scarcity are one cluster,
    // this is an intra-cluster seam (not the wider seam around the whole card).
    const priceColumn = (
        <StackV gap={4} isSkeleton={isSkeleton} items={
            isSkeleton && !price ? [
                // The header + CTA render instantly, but the price is a second fetch —
                // mirror the price line instead of showing an empty gap until it lands.
                () => <Typography size="h4" isSkeleton classNames={["w-1/3"]} />,
                () => <Typography size="xs" isSkeleton classNames={["w-1/2"]} />,
            ] : price?.discountedPriceVnd != null ? [
                ({ isSkeleton }: SkeletonProps) => (
                    <PriceTagProminent
                        isSkeleton={isSkeleton}
                        discounted={price.discountedPriceVnd}
                        original={price.originalPriceVnd}
                        breakdown={breakdown}
                    />
                ),
                ({ isSkeleton }: SkeletonProps) => (
                    <PhaseScarcityNote
                        isSkeleton={isSkeleton}
                        currentPhase={price.currentPhase}
                        seatsRemaining={price.seatsRemainingInCurrentPhase}
                        nextPhasePriceVnd={price.nextPhasePriceVnd}
                    />
                ),
            ] : []
        } />
    )

    // Price is a NUMBER — shrinking it means nothing, unlike a long title that can
    // truncate. The row wraps when tight (`StackH`): the button drops to the next
    // line instead of the price getting squeezed.
    const footerRow = (
        <StackH gap={6} principles={["block-boundary"]} align="end" justify="between" at="sm" items={[
            () => priceColumn,
            // ATOM `Button`, NOT the legacy HeroUI one — `suffixIcon` takes a COMPONENT
            // REF, the atom forces scale + weight; the CTA is never gated on the price
            // fetch, so it does not take `isSkeleton`.
            () => (
                <Button
                    variant="primary"
                    size="lg"
                    classNames={["shrink-0"]}
                    label={cta}
                    suffixIcon={ArrowRightIcon}
                    iconSlide
                    onPress={onEnroll}
                />
            ),
        ]} />
    )

    return (
        // The frame owns radius/shadow/padding from ONE source: `SurfaceCard`.
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
