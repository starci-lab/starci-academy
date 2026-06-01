"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    LockKeyIcon,
    ShoppingCartSimpleIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources"

/**
 * Medium-style inline paywall for a premium ("đọc thử") lesson the viewer has
 * not unlocked. Sits directly under the faded-out teaser body and invites the
 * user to buy the course to keep reading. Self-contained: reads the locale +
 * `courseId` route segment and owns its navigation handler.
 */
export const PremiumPaywall = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams<{ courseId: string }>()

    /** Go to the course detail page where the user can enroll/buy. */
    const onBuy = useCallback(
        () => router.push(
            pathConfig()
                .locale(locale)
                .course(params.courseId)
                .build(),
        ),
        [router, locale, params.courseId],
    )

    return (
        <div className="mx-auto w-full max-w-[680px] px-3 pb-12">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-divider bg-content1 px-6 py-10 text-center">
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
