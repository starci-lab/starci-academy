"use client"

import { ArrowRightIcon, LockIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { PaymentFlow } from "@/modules/types/payment"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { PriceTagInline } from "@/components/blocks/commerce/PriceTag"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/**
 * Medium-style inline paywall for a premium ("trial read") lesson the viewer has
 * not unlocked. Sits directly under the faded-out teaser body and opens the
 * shared payment modal (course-enroll flow) so the user can buy without leaving
 * the lesson. Course context comes from redux (`state.course`, loaded by the
 * learn layout), which feeds both the loyalty-aware price ({@link PriceTag}, the
 * SAME source/render as the payment modal) and the payment modal itself.
 *
 * FLAT — no card frame: it lives INSIDE the lesson body card (`card.md`: no
 * card-in-card), right under the faded teaser, as one continuous surface.
 */
export const PremiumPaywall = () => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // loyalty-aware price preview — same query/render as PaymentModal + PremiumGateModal
    const priceSwr = useQueryCoursePricePreviewSwr(courseId ?? null)
    const price = priceSwr.data
    const isPriceSkeleton = Boolean(courseId) && !priceSwr.data && !priceSwr.error

    /** Open the shared payment modal in the course-enroll flow. */
    const onBuy = useCallback(
        () => open({
            flow: PaymentFlow.CourseEnroll,
        }),
        [open],
    )

    // Only the PRICE rests — the lock, the heading, the description and the CTA are
    // static and render immediately (error beats a stale loading flag).
    const priceRegion = () => {
        if (priceSwr.error) {
            return <AsyncContentError title={t("payment.priceError")} />
        }
        if (isPriceSkeleton) {
            return <Skeleton className="h-7 w-32 rounded-xl" />
        }
        return price?.discountedPriceVnd != null ? (
            <PriceTagInline
                discounted={price.discountedPriceVnd}
                original={price.originalPriceVnd}
               
                breakdown={{
                    phase: price.phasePriceVnd,
                    loyaltyPercent: price.discountPercent,
                }}
            />
        ) : null
    }

    // The extra breathing room above the paywall sits on `Box`: `padding` on a frame is
    // symmetric (x/y) and `AllowedClassName` carries no `pt-*`, so a TOP-only seam has no
    // vocabulary. Arguably it belongs to the parent stack anyway (the parent owns the
    // seam), but that stack gives every item one uniform gap — so it lives here, visibly,
    // until either the scale grows a per-side step or the reader's stack varies its seam.
    return (
        <Box
            identity={{ tier: "block", component: "PremiumPaywall" }}
            className="pt-6"
        >
            <StackV
                gap={4}
                principle="card-caption"
                align="center"
                items={[
                    () => <IconTile icon={<LockIcon aria-hidden focusable="false" />} tone="accent" size="sm" />,
                    () => <Typography size="h5" weight="semibold" text={t("course.paywall.title")} />,
                    // the description keeps a readable measure — a width cap no closed union carries
                    () => (
                        <Box className="max-w-[480px] text-center">
                            <Typography size="sm" color="muted" text={t("course.paywall.description")} />
                        </Box>
                    ),
                    priceRegion,
                    ...(price ? [() => (
                        <PhaseScarcityNote
                            currentPhase={price.currentPhase}
                            seatsRemaining={price.seatsRemainingInCurrentPhase}
                            nextPhasePriceVnd={price.nextPhasePriceVnd}
                        />
                    )] : []),
                    () => (
                        <Box className="w-full max-w-[280px]">
                            <Button
                                label={t("course.paywall.buy")}
                                variant="primary"
                                size="lg"
                                suffixIcon={ArrowRightIcon}
                                onPress={onBuy}
                                classNames={["w-full"]}
                            />
                        </Box>
                    ),
                ]}
            />
        </Box>
    )
}
