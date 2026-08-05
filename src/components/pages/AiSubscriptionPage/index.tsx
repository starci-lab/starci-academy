"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useQueryAiSubscriptionTiersSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiSubscriptionTiersSwr"
import { _AiSubscriptionPage } from "./component"

/**
 * `AiSubscriptionPage` — the CONNECTED half of the AI subscription plans screen.
 * Owns the tiers fetch only to answer two questions the screen asks: did it fail,
 * and is it still the first load. The grid reads the same SWR singleton, so this
 * costs no second request.
 */
export const AiSubscriptionPage = () => {
    const t = useTranslations()
    const tiersSwr = useQueryAiSubscriptionTiersSwr()

    return (
        <_AiSubscriptionPage
            error={tiersSwr.error}
            onRetry={() => { void tiersSwr.mutate() }}
            // `isValidating` is deliberately excluded — a background revalidate keeps the
            // grid on screen instead of flashing back to the resting state.
            isSkeleton={tiersSwr.isLoading && !tiersSwr.data}
            labels={{
                title: t("aiSubscription.title"),
                subtitle: t("aiSubscription.subtitle"),
                errorTitle: t("aiSubscription.loadError.title"),
                errorDescription: t("aiSubscription.loadError.description"),
                retry: t("aiSubscription.loadError.retry"),
            }}
        />
    )
}
