"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    SettingsBreadcrumb,
} from "../Settings/SettingsBreadcrumb"
import {
    TierGrid,
} from "./TierGrid"
import {
    AiSubscriptionSkeleton,
} from "./AiSubscriptionSkeleton"
import { useQueryAiSubscriptionTiersSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiSubscriptionTiersSwr"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { StackV } from "@/components/frames/Stack"

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
    // need the tiers SWR here only to gate the skeleton vs grid
    const tiersSwr = useQueryAiSubscriptionTiersSwr()

    // Gate only the data-dependent tier grid; breadcrumb + header are static chrome
    // (i18n/router only) so they render immediately, outside the gate. `isValidating` is
    // intentionally excluded — a background revalidate keeps the existing grid instead of
    // flashing back to the placeholder.
    const isSkeleton = tiersSwr.isLoading && !tiersSwr.data

    // error beats a stale loading flag (BLOCK-8 order).
    const grid = () => {
        if (tiersSwr.error) {
            return (
                <AsyncContentError
                    title={t("aiSubscription.loadError.title")}
                    description={t("aiSubscription.loadError.description")}
                    onRetry={() => tiersSwr.mutate()}
                    retryLabel={t("aiSubscription.loadError.retry")}
                />
            )
        }
        return isSkeleton ? <AiSubscriptionSkeleton /> : <TierGrid />
    }

    return (
        <StackV
            identity={{ tier: "block", component: "AiSubscription" }}
            gap={8}
            items={[
                () => (
                    <PageHeader
                        breadcrumb={<SettingsBreadcrumb current={t("aiSubscription.title")} />}
                        title={t("aiSubscription.title")}
                        description={t("aiSubscription.subtitle")}
                    />
                ),
                grid,
            ]}
        />
    )
}
