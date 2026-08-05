"use client"

import React from "react"
import {
    FlameIcon,
    LightningIcon,
    GiftIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import { useQueryMyWeeklyStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyWeeklyStatsSwr"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { _IdentityStats } from "./component"

/** Props for {@link IdentityStats}. */
/**
 * Viewer "standing" stat rows for the identity column — the CONNECTED half: fetches the
 * three independent SWR leaves (streak, remaining weekly AI credit, reward balance),
 * computes each row's own first-load `isSkeleton` / settled `isEmpty`
 * (loading-and-skeleton.md §2, formula unchanged from the legacy block: `isLoading && !data`
 * / `!data`), resolves every label/value string, and hands them to the presentational
 * {@link _IdentityStats}. See `tiers/split.md`. Self-fetches; no data props.
 *
 */
export const IdentityStats = () => {
    const t = useTranslations()
    const weeklySwr = useQueryMyWeeklyStatsSwr()
    const quotaSwr = useQueryMyAiQuotaSwr()
    const walletSwr = useQueryMyRewardWalletSwr()
    const { data: weekly } = weeklySwr
    const { data: quota } = quotaSwr
    const { data: wallet } = walletSwr

    return (
        <_IdentityStats
            streak={{
                isSkeleton: weeklySwr.isLoading && !weekly,
                isEmpty: !weekly,
                icon: FlameIcon,
                label: t("DashboardPage.identityStats.streak"),
                value: t("DashboardPage.identityStats.streakValue", { count: weekly?.streak ?? 0 }),
            }}
            credit={{
                isSkeleton: quotaSwr.isLoading && !quota,
                isEmpty: !quota,
                icon: LightningIcon,
                label: t("DashboardPage.identityStats.credit"),
                value: quota ? `${quota.credit.remainingWeek}/${quota.credit.limitWeek}` : "",
            }}
            reward={{
                isSkeleton: walletSwr.isLoading && !wallet,
                isEmpty: !wallet,
                icon: GiftIcon,
                label: t("DashboardPage.identityStats.reward"),
                value: t("DashboardPage.rewardBalance", { count: wallet?.balance ?? 0 }),
            }}
        />
    )
}
