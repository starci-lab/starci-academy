import React from "react"
import { cn } from "@heroui/react"
import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { PriceTag, type PriceBreakdown } from "@sb-components/_legacy/designs/commerce/PriceTag/PriceTag"
import { PhaseScarcityNote, PricingPhase } from "@sb-components/_legacy/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/features/learn/CourseContents/TrialConversionStrip`, made
 * TIER-3 PRESENTATIONAL: `src` reads `useQueryCoursePricePreviewSwr` (SWR) +
 * `usePaymentOverlayState` (zustand) itself; this port takes the same data as
 * PLAIN PROPS (`price`, `isPriceLoading`, `onEnroll`) so it renders standalone
 * with no store/SWR wiring. The `next-intl` strings are INLINED locally (vi).
 * Composed from local primitives — {@link IconTile} (lock icon, accent tone,
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
    /** Price preview for the course; `undefined`/`null` while absent (see `isPriceLoading`). */
    price?: TrialConversionStripPrice | null
    /** `true` while the price fetch is in flight AND no price has landed yet → shows the skeleton mirror. */
    isPriceLoading?: boolean
    /** Fired when the enroll CTA is pressed (caller owns opening the payment flow). */
    onEnroll?: () => void
    /** Extra classes on the root. */
    className?: string
    /** When on, emit `data-anat-part` on each composed part so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
    /**
     * Anatomy tag cho CHÍNH block này — để caller badge nó như MỘT node (§11a).
     * Thiếu prop này thì screen phải bọc `<div data-anat-part>` bên ngoài, tức screen
     * lại thêm một node DOM không thuộc cây thật (§14b).
     */
    anatPart?: string
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
export const TrialConversionStrip = ({
    freeLessonsRemaining,
    price,
    isPriceLoading = false,
    onEnroll,
    className,
    showAnatomy = false,
    anatPart,
}: TrialConversionStripProps) => {
    const hasFreeLeft = freeLessonsRemaining > 0

    const breakdown: PriceBreakdown | undefined = price
        ? {
            phase: price.phasePriceVnd,
            loyaltyPercent: price.discountPercent,
        }
        : undefined

    return (
        <div data-anat-part={anatPart} className={cn("flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface", className)}>
            <div className="flex items-start gap-3">
                <IconTile.Base
                    icon={LockIcon}
                    tone="accent"
                    size="sm"
                    anatPart={showAnatomy ? "IconTile" : undefined}
                />
                <div className="flex min-w-0 flex-col gap-1">
                    <Typography.Base
                        weight="medium"
                        showAnatomy={showAnatomy}
                        text="Học thử — mở khoá toàn bộ khoá học"
                    />
                    <Typography.Base size="sm"
                        color="muted"
                        showAnatomy={showAnatomy}
                        text={
                            hasFreeLeft
                                ? `Còn ${freeLessonsRemaining} bài miễn phí chưa đọc — đọc tiếp hoặc mở khoá toàn bộ ngay.`
                                : "Bạn đã đọc hết bài học miễn phí — mở khoá toàn bộ khoá học để tiếp tục."
                        }
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-default pt-3">
                <div className="flex flex-col gap-1">
                    {isPriceLoading && !price ? (
                        // 2026-07-12: the CTA card renders instantly once the outline
                        // resolves, but the price is a second fetch — mirror the price
                        // line instead of showing an empty gap until it lands.
                        <>
                            <Typography size="h4" isSkeleton className="w-1/3" anatPart={showAnatomy ? "Skeleton.Price" : undefined} />
                            <Typography size="xs" isSkeleton className="w-1/2" anatPart={showAnatomy ? "Skeleton.Seats" : undefined} />
                        </>
                    ) : price?.discountedPriceVnd != null ? (
                        <>
                            <PriceTag
                                discounted={price.discountedPriceVnd}
                                original={price.originalPriceVnd}
                                size="md"
                                breakdown={breakdown}
                                anatPart={showAnatomy ? "PriceTag" : undefined}
                                showAnatomy={showAnatomy}
                            />
                            <PhaseScarcityNote
                                currentPhase={price.currentPhase}
                                seatsRemaining={price.seatsRemainingInCurrentPhase}
                                nextPhasePriceVnd={price.nextPhasePriceVnd}
                                showAnatomy={showAnatomy}
                            />
                        </>
                    ) : null}
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="shrink-0"
                    icon={<ArrowRightIcon aria-hidden focusable="false" />}
                    onPress={onEnroll}
                    anatPart={showAnatomy ? "Button" : undefined}
                >
                    Mở khoá toàn bộ khoá học
                </Button>
            </div>
        </div>
    )
}
