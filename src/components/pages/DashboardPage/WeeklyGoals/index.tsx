"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import {
    _WeeklyGoals,
    type WeeklyGoalsItem,
} from "./component"
import {
    DEFAULT_KPI_TARGETS,
    KPI_ORDER,
} from "@/modules/utils/weekly-goals-map"
import { useQueryMyKpisSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyKpisSwr"
import type { KpiKey, QueryKpiItemData } from "@/modules/api/graphql/queries/types/my-kpis"

/**
 * "Weekly goals" content — the CONNECTED half of {@link _WeeklyGoals}: self-fetches the
 * viewer's weekly KPI snapshot, folds it against the sensible per-metric defaults so the
 * summary + meters always track this week's activity (even before a custom goal is set),
 * resolves every label, and hands the resolved rows to the presentational `_WeeklyGoals`.
 * Content only — the parent {@link import("@/components/blocks").LabeledCard} frames it.
 * See `tiers/split.md`.
 */
export const WeeklyGoals = () => {
    const t = useTranslations()
    const {
        data: kpis,
        error,
        mutate,
    } = useQueryMyKpisSwr()

    /** Index KPI items by key for O(1) lookup while building rows in display order. */
    const itemByKey = useMemo(
        () => {
            const map = new Map<KpiKey, QueryKpiItemData>()
            for (const item of kpis?.items ?? []) {
                map.set(item.key, item)
            }
            return map
        },
        [
            kpis,
        ],
    )

    /** Days/hours left until the weekly reset (computed from `resetAt`). Mirrors WeeklyBoard. */
    const countdown = useMemo(
        () => {
            if (!kpis) {
                return null
            }
            const remaining = Math.max(0, new Date(kpis.resetAt).getTime() - Date.now())
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [kpis],
    )

    // composite over EFFECTIVE targets (custom OR default) so the summary + meters
    // always track this week's activity, even before a custom goal is set.
    const composite = useMemo(() => {
        let completed = 0
        let sumCurrent = 0
        let sumTarget = 0
        for (const key of KPI_ORDER) {
            const item = itemByKey.get(key)
            const current = item?.current ?? 0
            const target = item?.target ?? DEFAULT_KPI_TARGETS[key]
            sumTarget += target
            sumCurrent += Math.min(current, target)
            if (current >= target) {
                completed += 1
            }
        }
        return {
            completed,
            total: KPI_ORDER.length,
            percent: sumTarget > 0 ? Math.round((sumCurrent / sumTarget) * 100) : 0,
        }
    }, [itemByKey])

    const items: Array<WeeklyGoalsItem> = KPI_ORDER.map((key) => {
        const item = itemByKey.get(key)
        const current = item?.current ?? 0
        // effective target = the learner's custom goal, or a sensible default
        // (so the meter tracks this week's activity out of the box)
        const target = item?.target ?? DEFAULT_KPI_TARGETS[key]
        return {
            key,
            label: t(`DashboardPage.kpi.labels.${key}`),
            current,
            target,
            // only once a REAL target is set server-side (the client-only default above
            // doesn't persist a floor/reward)
            coinRewardText: item?.coinReward != null
                ? t("DashboardPage.kpi.coinReward", { count: item.coinReward })
                : undefined,
            canClaim: item?.canClaim ?? false,
        }
    })

    const summaryText = `${t("DashboardPage.kpi.summary", {
        percent: composite.percent,
        completed: composite.completed,
        total: composite.total,
    })}${countdown
        ? ` · ${t("DashboardPage.kpi.resetIn", {
            days: countdown.days,
            hours: countdown.hours,
        })}`
        : ""}`

    return (
        <_WeeklyGoals
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!kpis && !error}
            error={error}
            onRetry={() => { void mutate() }}
            items={items}
            summaryText={summaryText}
            labels={{
                errorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
            }}
        />
    )
}
