"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { useMutateRedeemRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRedeemRewardSwr"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _StreakFreezeCard, FREEZE_COST, MAX_FREEZES } from "./component"

/**
 * Right-rail "streak freeze" card — the CONNECTED half: self-fetches `myWeeklyStats`, owns the
 * `buyStreakFreeze` mutation (toasting the result) and revalidates the shared leaf query on success,
 * and resolves every label (incl. interpolation) before handing them to the presentational
 * {@link _StreakFreezeCard}. See `tiers/split.md`.
 */
export const StreakFreezeCard = () => {
    const t = useTranslations()
    const {
        data,
        error,
        mutate,
    } = useQueryMyWeeklyStatsSwr()
    const { trigger: triggerRedeem } = useMutateRedeemRewardSwr()
    const runGraphQL = useGraphQLWithToast()
    // whether a purchase is currently in flight
    const [buying, setBuying] = useState(false)

    /** Buy one freeze, toast the result, then revalidate the weekly stats. */
    const onBuy = useCallback(
        async () => {
            setBuying(true)
            try {
                const ok = await runGraphQL(async () => {
                    const result = await triggerRedeem({
                        rewardKey: "streakFreeze",
                    })
                    return result.data!.redeemReward
                })
                if (ok) {
                    await mutate()
                }
            } finally {
                setBuying(false)
            }
        },
        [
            triggerRedeem,
            mutate,
            runGraphQL,
        ],
    )

    const owned = data?.streakFreezes ?? 0

    return (
        <_StreakFreezeCard
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            // settled with no data (signed out / genuinely no stats) → self-hide
            isEmpty={!data}
            // only surface the error slot when there is no cached data to fall back to (a stale
            // card beats a scary error on a transient blip)
            error={!data ? error : undefined}
            onRetry={() => { void mutate() }}
            owned={owned}
            buying={buying}
            onBuy={() => void onBuy()}
            labels={{
                title: t("streakFreeze.title"),
                errorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
                owned: t("streakFreeze.owned", {
                    count: owned,
                    max: MAX_FREEZES,
                }),
                explainer: t("streakFreeze.explainer"),
                buy: t("streakFreeze.buy", {
                    cost: FREEZE_COST,
                }),
                full: t("streakFreeze.full"),
            }}
        />
    )
}
