"use client"

import React, { useCallback } from "react"
import { usePaymentOverlayState, usePremiumGateOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { useAppSelector } from "@/redux/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { _PremiumGateModal } from "./component"
import { toPremiumGateModalPrice } from "./map"

/**
 * Premium-gate modal: a VALUE-FIRST register/buy prompt shown when a viewer clicks
 * a locked premium feature (challenge tab, lesson tab, …) on a "trial read" lesson
 * they have not unlocked. Opened via {@link usePremiumGateOverlayState}.
 *
 * CONNECTED half: reads the overlay open-state + course entity (redux) + the
 * loyalty-aware price preview (SWR, same source `PaymentModal` reads) and hands
 * everything to the presentational {@link _PremiumGateModal}, which owns its own
 * header/"what unlocks"/CTA copy (no i18n slot to fill — see `component.tsx`'s
 * file header) — the `map.ts` adapter only bridges field names + the
 * `PricingPhase` enum between the real GraphQL type and the sb-components block.
 * "Buy" closes this modal and opens the shared payment modal (course-enroll flow),
 * mirroring `src/components/modals/PremiumGateModal/index.tsx`'s `onBuy`.
 */
export const PremiumGateModal = () => {
    const { isOpen, setOpen, close } = usePremiumGateOverlayState()
    const { open: openPayment } = usePaymentOverlayState()
    const course = useAppSelector((state) => state.course.entity)

    // loyalty-aware price preview (same source as PaymentModal) — only while the gate is open
    const priceSwr = useQueryCoursePricePreviewSwr(isOpen ? course?.id ?? null : null)
    const priceLoading = Boolean(course?.id) && !priceSwr.data && !priceSwr.error

    /** Close the gate, then open the shared payment modal in the course-enroll flow. */
    const onUpgrade = useCallback(
        () => {
            close()
            openPayment({ flow: PaymentFlow.CourseEnroll })
        },
        [close, openPayment],
    )

    return (
        <_PremiumGateModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            courseTitle={course?.title}
            price={priceSwr.data ? toPremiumGateModalPrice(priceSwr.data) : priceSwr.data}
            isSkeleton={priceLoading}
            onUpgrade={onUpgrade}
        />
    )
}
