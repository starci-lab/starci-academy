"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import {
    KPI_META,
} from "@/modules/utils/kpi-meta"
import {
    DEFAULT_KPI_TARGETS,
} from "@/modules/utils/weekly-goals-map"
import { useQueryMyKpisSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyKpisSwr"
import { useMutateSetKpiTargetSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetKpiTargetSwr"
import { useMutateClaimKpiRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClaimKpiRewardSwr"
import type { KpiKey, QueryKpiItemData } from "@/modules/api/graphql/queries/types/my-kpis"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { _KpiPage, type KpiRowData } from "./component"

/**
 * Props for {@link KpiPage}. Only positioning — the route hands this nothing else, it
 * self-fetches. Renamed from the old `className: string` to the house
 * `classNames: Array<AllowedClassName>` convention every frame/atom already uses.
 */
export type KpiPageProps = Record<string, never>
/** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
/*
 * The `/kpi` editor page: the connected half of {@link _KpiPage}. Self-fetches the
 * weekly KPIs, owns the set-target + claim-reward mutations, resolves every
 * label (incl. interpolation), and hands them to the presentational `_KpiPage`.
 * See `tiers/split.md`.
 *
 * @param props - {@link KpiPageProps}
 */
export const KpiPage = (_props: KpiPageProps) => {
    void _props
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error, mutate } = useQueryMyKpisSwr()
    const { trigger: triggerSetTarget } = useMutateSetKpiTargetSwr()
    const { trigger: triggerClaimReward } = useMutateClaimKpiRewardSwr()
    const runGraphQL = useGraphQLWithToast()
    // the `${key}:${preset}` currently being saved, or null when idle
    const [savingKey, setSavingKey] = useState<string | null>(null)
    // the KPI key currently being claimed, or null when idle
    const [claimingKey, setClaimingKey] = useState<KpiKey | null>(null)

    /** Navigate to the DashboardPage (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale(locale).build()),
        [router, locale],
    )

    /** Index the KPI items by key for O(1) lookup while rendering meta order. */
    const itemByKey = useMemo(
        () => {
            const map = new Map<KpiKey, QueryKpiItemData>()
            for (const item of data?.items ?? []) {
                map.set(item.key, item)
            }
            return map
        },
        [
            data,
        ],
    )

    /** Persist a chosen target for one KPI, then revalidate. */
    const onChoose = useCallback(
        async (key: KpiKey, target: number) => {
            setSavingKey(`${key}:${target}`)
            try {
                const ok = await runGraphQL(async () => {
                    const result = await triggerSetTarget({
                        key,
                        target,
                    })
                    const env = result?.data?.setKpiTarget
                    if (!env) {
                        throw new Error(t("DashboardPage.kpi.error"))
                    }
                    // returned envelope drives the success / error toast
                    return env
                })
                if (ok) {
                    await mutate()
                }
            } finally {
                setSavingKey(null)
            }
        },
        [
            triggerSetTarget,
            mutate,
            runGraphQL,
        ],
    )

    /** Claim one KPI's coin reward, then revalidate. */
    const onClaim = useCallback(
        async (key: KpiKey) => {
            setClaimingKey(key)
            try {
                const ok = await runGraphQL(async () => {
                    const result = await triggerClaimReward({
                        key,
                    })
                    const env = result?.data?.claimKpiReward
                    if (!env) {
                        throw new Error(t("DashboardPage.kpi.error"))
                    }
                    return env
                })
                if (ok) {
                    await mutate()
                }
            } finally {
                setClaimingKey(null)
            }
        },
        [
            triggerClaimReward,
            mutate,
            runGraphQL,
            t,
        ],
    )

    // days/hours left until the weekly reset — mirrors WeeklyBoard/WeeklyGoals
    const remaining = data ? Math.max(0, new Date(data.resetAt).getTime() - Date.now()) : 0
    const countdown = {
        days: Math.floor(remaining / 86_400_000),
        hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    }

    // composite-score sentence (or the plain subtitle before any target is set) + the reset countdown
    const description = data
        ? (data.composite.total > 0
            ? t("DashboardPage.kpi.summary", {
                percent: data.composite.percent,
                completed: data.composite.completed,
                total: data.composite.total,
            })
            : t("DashboardPage.kpi.subtitle")) + ` · ${t("DashboardPage.kpi.resetIn", {
            days: countdown.days,
            hours: countdown.hours,
        })}`
        : ""

    // one resolved row per weekly KPI, meta order — presets carry their disabled
    // state pre-computed (a global save lock, matching the pre-split behaviour:
    // saving ANY preset on ANY row locks every OTHER preset everywhere).
    const rows: Array<KpiRowData> = KPI_META.map(({ key, Icon, labelKey, presets }) => {
        const item = itemByKey.get(key)
        const current = item?.current ?? 0
        // effective target = the learner's custom goal, or a sensible default
        // (mirrors the DashboardPage card — meter always runs, never sits empty waiting for config)
        const target = item?.target ?? DEFAULT_KPI_TARGETS[key]
        return {
            key,
            icon: Icon,
            label: t(`DashboardPage.kpi.labels.${labelKey}`),
            current,
            target,
            presets: presets.map((preset) => ({
                value: preset,
                isDisabled: savingKey !== null && savingKey !== `${key}:${preset}`,
            })),
            onChoosePreset: (chosenTarget: number) => {
                void onChoose(key, chosenTarget)
            },
            coinRewardText: item?.coinReward != null
                ? t("DashboardPage.kpi.coinReward", {
                    count: item.coinReward,
                })
                : undefined,
            claimed: item?.claimed ?? false,
            canClaim: item?.canClaim ?? false,
            isClaiming: claimingKey === key,
            isClaimDisabled: claimingKey !== null && claimingKey !== key,
            onClaim: () => {
                void onClaim(key)
            },
        }
    })

    return (
        <_KpiPage
            // first load with no cached data → skeleton; a first-load query error
            // shows the retryable error slot instead of a permanent skeleton
            isSkeleton={!data}
            error={!data ? error : undefined}
            onRetry={() => {
                void mutate()
            }}
            onNavigateHome={onNavigateHome}
            rows={rows}
            labels={{
                title: t("DashboardPage.kpi.title"),
                tooltipDescription: t("DashboardPage.kpi.help"),
                homeLabel: t("nav.home"),
                description,
                errorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
                claimLabel: t("DashboardPage.kpi.claimReward"),
                claimedLabel: t("DashboardPage.kpi.claimed"),
            }}
        />
    )
}
