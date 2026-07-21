"use client"

import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { PaymentFlow } from "@/modules/types/payment"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/**
 * Medium-style inline paywall for a premium ("trial read") lesson the viewer has
 * not unlocked. Sits directly under the faded-out teaser body and opens the
 * shared payment modal (course-enroll flow) so the user can buy without leaving
 * the lesson. Course context comes from redux (`state.course`, loaded by the
 * learn layout), which feeds both the loyalty-aware price ({@link PriceTag}, the
 * SAME source/render as the payment modal) and the payment modal itself.
 */
export const PremiumPaywall = () => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // loyalty-aware price preview — same query/render as PaymentModal + PremiumGateModal
    const priceSwr = useQueryCoursePricePreviewSwr(courseId ?? null)
    const price = priceSwr.data
    const priceLoading = Boolean(courseId) && !priceSwr.data && !priceSwr.error

    /** Open the shared payment modal in the course-enroll flow. */
    const onBuy = useCallback(
        () => open({
            flow: PaymentFlow.CourseEnroll,
        }),
        [open],
    )

    return (
        // FLAT — no card frame: lives INSIDE the lesson body card (concepts/card.md:
        // no card-in-card), right under the faded teaser, as one continuous surface.
        <div className="flex flex-col items-center gap-3 pt-6 text-center">
            <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />
            <div className="text-xl font-semibold text-foreground">
                {t("course.paywall.title")}
            </div>
            <div className="max-w-[480px] text-sm text-muted">
                {t("course.paywall.description")}
            </div>
            <AsyncContent
                isLoading={priceLoading}
                skeleton={<Skeleton className="h-7 w-32 rounded-xl" />}
                error={priceSwr.error}
                errorContent={{ title: t("payment.priceError") }}
            >
                {price?.discountedPriceVnd != null ? (
                    <PriceTag
                        discounted={price.discountedPriceVnd}
                        original={price.originalPriceVnd}
                        size="md"
                        className="justify-center"
                        breakdown={{
                            phase: price.phasePriceVnd,
                            loyaltyPercent: price.discountPercent,
                        }}
                    />
                ) : null}
            </AsyncContent>
            {price ? (
                <PhaseScarcityNote
                    currentPhase={price.currentPhase}
                    seatsRemaining={price.seatsRemainingInCurrentPhase}
                    nextPhasePriceVnd={price.nextPhasePriceVnd}
                    className="justify-center"
                />
            ) : null}
            <Button
                variant="primary"
                size="lg"
                className="mt-2 w-full max-w-[280px]"
                onPress={onBuy}
            >
                {t("course.paywall.buy")}
                <ArrowRightIcon className="size-5" />
            </Button>
        </div>
    )
}
