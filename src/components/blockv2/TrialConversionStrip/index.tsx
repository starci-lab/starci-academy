"use client"

import React, { useCallback } from "react"
import { useTranslations } from "next-intl"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { PaymentFlow } from "@/modules/types/payment"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _TrialConversionStrip } from "./component"

/** Props for {@link TrialConversionStrip}. */
export interface TrialConversionStripProps extends WithClassNames<undefined> {
    /** Course id (raw uuid) — prices the enroll offer. */
    courseId: string
    /** FREE lessons the trial viewer hasn't read yet — powers the goal-gradient line. */
    freeLessonsRemaining: number
}

/**
 * Trial → enroll conversion strip on the content-home — the CONNECTED half: it fetches the
 * viewer's pre-checkout price (SWR), owns the payment-overlay handler, resolves the loss-aversion
 * copy (goal-gradient when free lessons remain, else the generic pitch), and hands it all to the
 * presentational {@link _TrialConversionStrip}. Rendered ONLY for a trial (not-yet-enrolled)
 * learner — the parent gates it. See `design/storybook/architecture/split.md`.
 */
export const TrialConversionStrip = ({
    courseId,
    freeLessonsRemaining,
    className,
}: TrialConversionStripProps) => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const priceSwr = useQueryCoursePricePreviewSwr(courseId)

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )

    // goal-gradient: when free lessons remain, frame by "N left to read" (near a
    // milestone) rather than the generic pitch.
    const description = freeLessonsRemaining > 0
        ? t("courseContents.trial.descRemaining", { remaining: freeLessonsRemaining })
        : t("courseContents.trial.desc")

    return (
        <_TrialConversionStrip
            title={t("courseContents.trial.title")}
            description={description}
            cta={t("courseContents.trial.cta")}
            price={priceSwr.data}
            isPriceLoading={priceSwr.isLoading}
            onEnroll={onEnroll}
            className={className}
        />
    )
}
