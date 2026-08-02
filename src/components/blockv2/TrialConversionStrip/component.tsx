import React from "react"
import { Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { QueryCoursePricePreviewData } from "@/modules/api/graphql/queries/types/course-price-preview"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _TrialConversionStrip} — presentational; all text + price resolved, no fetch/store/i18n. */
export interface TrialConversionStripProps extends WithClassNames<undefined> {
    /** Card title (already localized). */
    title: string
    /** Supporting line under the title — the connected file already picked the goal-gradient vs generic copy. */
    description: string
    /** Enroll CTA label (already localized). */
    cta: string
    /** Resolved pre-checkout price; omitted/null → the price line is skipped. */
    price?: QueryCoursePricePreviewData | null
    /** `true` while the price is still fetching → the price line shimmers instead of showing an empty gap. */
    isPriceLoading?: boolean
    /** Open the shared payment modal in the course-enroll flow. */
    onEnroll: () => void
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
    isPriceLoading = false,
    onEnroll,
    className,
}: TrialConversionStripProps) => (
    <div className={cn("flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface", className)}>
        <div className="flex items-start gap-3">
            <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />
            <div className="flex min-w-0 flex-col gap-1">
                <Typography type="body" weight="semibold">
                    {title}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {description}
                </Typography>
            </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-default pt-3">
            <div className="flex flex-col gap-1">
                {isPriceLoading && !price ? (
                    // The CTA card renders instantly once the outline resolves, but the price is a
                    // second fetch — mirror the price line instead of an empty gap until it lands.
                    <>
                        <Skeleton.Typography type="h4" width="1/3" />
                        <Skeleton.Typography type="body-xs" width="1/2" />
                    </>
                ) : price?.discountedPriceVnd != null ? (
                    <>
                        <PriceTag
                            discounted={price.discountedPriceVnd}
                            original={price.originalPriceVnd}
                            size="md"
                            breakdown={{
                                phase: price.phasePriceVnd,
                                loyaltyPercent: price.discountPercent,
                            }}
                        />
                        <PhaseScarcityNote
                            currentPhase={price.currentPhase}
                            seatsRemaining={price.seatsRemainingInCurrentPhase}
                            nextPhasePriceVnd={price.nextPhasePriceVnd}
                        />
                    </>
                ) : null}
            </div>
            <Button
                variant="primary"
                size="lg"
                className="shrink-0"
                onPress={onEnroll}
            >
                {cta}
                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
            </Button>
        </div>
    </div>
)
