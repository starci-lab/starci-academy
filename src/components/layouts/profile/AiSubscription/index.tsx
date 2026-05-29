"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Breadcrumbs,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryAiSubscriptionTiersSwr,
    useQueryMyAiSettingsSwr,
    usePaymentOverlayState,
} from "@/hooks/singleton"
import {
    PaymentFlow,
} from "@/modules/types"
import {
    pathConfig,
} from "@/resources"
import {
    SubPageHeader,
} from "@/components/reuseable"
import {
    TierGrid,
} from "./TierGrid"
import {
    AiSubscriptionSkeleton,
} from "./AiSubscriptionSkeleton"

/**
 * AI subscription feature container.
 *
 * Owns data (SWR tiers + current settings) and the buy action; renders
 * presentational children. Mounted by the `/profile/ai-subscription` route.
 * `"use client"` because it reads SWR singletons and opens the payment overlay.
 */
export const AiSubscription = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const tiersSwr = useQueryAiSubscriptionTiersSwr()
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    // shared payment modal — opening it with the tier lets the user pick a
    // payment method, which then runs the purchase mutation + checkout
    const { open: openPaymentModal } = usePaymentOverlayState()

    /** Navigate back to the profile page. */
    const onBack = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )

    /** Navigate to the profile page (breadcrumb parent). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Purchasable tiers from the query (empty until loaded). */
    const tiers = useMemo(
        () => tiersSwr.data ?? [],
        [
            tiersSwr.data,
        ],
    )
    /** The user's current tier slug, or `null` for the free tier. */
    const currentTier = useMemo<string | null>(
        () => myAiSettingsSwr.data?.tier ?? null,
        [
            myAiSettingsSwr.data?.tier,
        ],
    )

    /** Open the shared payment modal for `tier`; the modal runs the purchase. */
    const onBuy = useCallback(
        (tier: string) => {
            // hand the chosen tier to the modal — it will create the checkout
            // with whichever payment method the user picks, then redirect
            openPaymentModal({
                flow: PaymentFlow.AiSubscription,
                tier,
            })
        },
        [
            openPaymentModal,
        ],
    )

    // gate only the data-dependent tier grid; breadcrumb + header are static
    // chrome (i18n/router only) so they render immediately, outside the gate.
    // isValidating is intentionally excluded — background revalidate keeps the
    // existing grid instead of flashing back to the skeleton
    const tiersReady = !tiersSwr.isLoading && !!tiersSwr.data && !tiersSwr.error

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("aiSubscription.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("aiSubscription.title")}
                description={t("aiSubscription.subtitle")}
                onBack={onBack}
            />
            {tiersReady ? (
                <TierGrid
                    tiers={tiers}
                    currentTier={currentTier}
                    // the purchase spinner now lives inside the payment modal, so no
                    // tier is ever in a "creating checkout" state on the grid itself
                    purchasingTier={null}
                    onBuy={onBuy}
                />
            ) : (
                <AiSubscriptionSkeleton />
            )}
        </div>
    )
}
