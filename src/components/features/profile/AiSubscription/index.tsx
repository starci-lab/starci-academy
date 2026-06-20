"use client"

import React, {
    useCallback,
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
} from "@/hooks"
import {
    pathConfig,
} from "@/resources"
import {
    PageHeader,
} from "@/components/blocks"
import {
    TierGrid,
} from "./TierGrid"
import {
    AiSubscriptionSkeleton,
} from "./AiSubscriptionSkeleton"

/**
 * AI subscription feature container.
 *
 * Owns only the page chrome (breadcrumb + header) and the loading gate. Data
 * fetching, current-tier derivation, and the buy action are delegated to
 * {@link TierGrid} which reads its own SWR singletons and opens the payment
 * overlay directly. Mounted by the `/profile/ai-subscription` route.
 * `"use client"` because it uses next/navigation hooks.
 */
export const AiSubscription = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    // need the tiers SWR here only to gate the skeleton vs grid
    const tiersSwr = useQueryAiSubscriptionTiersSwr()

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

    // gate only the data-dependent tier grid; breadcrumb + header are static
    // chrome (i18n/router only) so they render immediately, outside the gate.
    // isValidating is intentionally excluded — background revalidate keeps the
    // existing grid instead of flashing back to the skeleton
    const tiersReady = !tiersSwr.isLoading && !!tiersSwr.data && !tiersSwr.error

    return (
        <div className="flex flex-col gap-6">
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
            <PageHeader
                title={t("aiSubscription.title")}
                description={t("aiSubscription.subtitle")}
            />
            {tiersReady ? (
                <TierGrid />
            ) : (
                <AiSubscriptionSkeleton />
            )}
        </div>
    )
}
