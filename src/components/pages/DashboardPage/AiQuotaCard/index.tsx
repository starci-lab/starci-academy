"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import {
    _AiQuotaCard,
    type AiQuotaCardWindow,
} from "./component"

/**
 * Right-rail AI-credit mini card — the CONNECTED half: self-fetches the viewer's quota snapshot,
 * resolves the two rolling-window rows (label + interpolated "remaining/limit" readout) and every
 * other label, then hands them to the presentational {@link _AiQuotaCard}. Surfaces the AI
 * allowance on the home surface so the learner sees it before hitting the limit mid-task. See
 * `tiers/split.md`.
 */
export const AiQuotaCard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error, mutate } = useQueryMyAiQuotaSwr()

    // the two rolling windows rendered as remaining/limit + a usage bar
    const windows: Array<AiQuotaCardWindow> = data ? [
        {
            key: "window5h",
            label: t("DashboardPage.aiQuota.window5h"),
            creditsText: t("DashboardPage.aiQuota.credits", {
                remaining: data.credit.remaining5h,
                limit: data.credit.limit5h,
            }),
            used: data.credit.used5h,
            limit: data.credit.limit5h,
        },
        {
            key: "windowWeek",
            label: t("DashboardPage.aiQuota.windowWeek"),
            creditsText: t("DashboardPage.aiQuota.credits", {
                remaining: data.credit.remainingWeek,
                limit: data.credit.limitWeek,
            }),
            used: data.credit.usedWeek,
            limit: data.credit.limitWeek,
        },
    ] : []

    return (
        <_AiQuotaCard
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            // signed out / no snapshot yet, settled with no fetch error → self-hide (a secondary
            // widget; matches the sibling right-rail cards, e.g. StreakFreezeCard)
            isEmpty={!data}
            // only surface the error slot when there is no cached data to fall back to (a stale
            // card beats a scary error on a transient blip) — shares the same errorTitle/retry
            // copy as the other DashboardPage right-rail cards, no new i18n key
            error={!data ? error : undefined}
            onRetry={() => { void mutate() }}
            tier={data?.tier ?? undefined}
            windows={windows}
            onUpgradePress={() => router.push(`/${locale}/profile/settings/ai-subscription`)}
            labels={{
                title: t("DashboardPage.aiQuota.title"),
                poolCaption: t("DashboardPage.aiQuota.poolCaption"),
                upgrade: t("DashboardPage.aiQuota.upgrade"),
                errorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
            }}
        />
    )
}
