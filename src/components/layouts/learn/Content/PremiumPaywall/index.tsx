"use client"

import { Lock as LockKeyIcon, ShoppingCart as ShoppingCartSimpleIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    usePaymentOverlayState,
} from "@/hooks"
import {
    PaymentFlow,
} from "@/modules/types"

/**
 * Medium-style inline paywall for a premium ("trial read") lesson the viewer has
 * not unlocked. Sits directly under the faded-out teaser body and opens the
 * shared payment modal (course-enroll flow) so the user can buy without leaving
 * the lesson. Course context comes from redux (`state.course`, loaded by the
 * learn layout), which the payment modal reads.
 */
export const PremiumPaywall = () => {
    const t = useTranslations()
    const { open } = usePaymentOverlayState()

    /** Open the shared payment modal in the course-enroll flow. */
    const onBuy = useCallback(
        () => open({
            flow: PaymentFlow.CourseEnroll,
        }),
        [open],
    )

    return (
        <div className="mx-auto w-full max-w-[680px] px-3 pb-12">
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-divider bg-content1 px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                    <LockKeyIcon className="h-6 w-6 text-warning" />
                </div>
                <div className="text-xl font-semibold text-foreground">
                    {t("course.paywall.title")}
                </div>
                <div className="max-w-[480px] text-sm text-muted">
                    {t("course.paywall.description")}
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="mt-2 w-full max-w-[280px]"
                    onPress={onBuy}
                >
                    <ShoppingCartSimpleIcon className="h-5 w-5" />
                    {t("course.paywall.buy")}
                </Button>
            </div>
        </div>
    )
}
