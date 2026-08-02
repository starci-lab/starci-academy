"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    ArrowRightIcon,
    LockIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link TrialConversionStrip}. */
export interface TrialConversionStripProps extends WithClassNames<undefined> {
    /** Course id (raw uuid) — prices the enroll offer. */
    courseId: string
    /** FREE lessons the trial viewer hasn't read yet — powers the goal-gradient line. */
    freeLessonsRemaining: number
}

/**
 * Trial → enroll conversion strip on the content-home. Rendered ONLY for a
 * trial (not-yet-enrolled) learner. Bundles three honest levers on the surface
 * they actually land on: (1) LOSS-AVERSION — "you've read N/M free lessons, keep
 * going"; (2) SCARCITY — the real pricing-phase seats + next-tier price via
 * {@link PhaseScarcityNote}; (3) the enroll CTA framed by OUTCOME (build real
 * job proof), not by feature. Every number comes from the backend
 * (`myCourseOutline` progress + `coursePricePreview`) — nothing fabricated
 * (see `CTA.md`). The parent gates this to trial users; social proof is NOT
 * repeated here (the learner count already sits in the page header).
 *
 * @param props - {@link TrialConversionStripProps}
 */
export const TrialConversionStrip = ({
    courseId,
    freeLessonsRemaining,
    className,
}: TrialConversionStripProps) => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const priceSwr = useQueryCoursePricePreviewSwr(courseId)
    const price = priceSwr.data

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({
            flow: PaymentFlow.CourseEnroll,
        }),
        [open],
    )

    // goal-gradient: when free lessons remain, frame by "N left to read" (near a
    // milestone) rather than the generic pitch.
    const hasFreeLeft = freeLessonsRemaining > 0

    return (
        <div className={cn("flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface", className)}>
            <div className="flex items-start gap-3">
                <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />
                <div className="flex min-w-0 flex-col gap-1">
                    <Typography type="body" weight="semibold">
                        {t("courseContents.trial.title")}
                    </Typography>
                    <Typography type="body-sm" color="muted">
                        {hasFreeLeft
                            ? t("courseContents.trial.descRemaining", {
                                remaining: freeLessonsRemaining,
                            })
                            : t("courseContents.trial.desc")}
                    </Typography>
                </div>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-default pt-3">
                <div className="flex flex-col gap-1">
                    {priceSwr.isLoading && !price ? (
                        // 2026-07-12: the CTA card renders instantly once the outline
                        // resolves, but the price is a second fetch — mirror the price
                        // line instead of showing an empty gap until it lands.
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
                    {t("courseContents.trial.cta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                </Button>
            </div>
        </div>
    )
}
