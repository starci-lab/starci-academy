"use client"

import React, {
    useCallback,
    useMemo,
    useState,
} from "react"
import {
    Button,
    ProgressBar,
    Skeleton,
    cn,
} from "@heroui/react"
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
} from "../kpiMeta"
import {
    DEFAULT_KPI_TARGETS,
} from "../../WeeklyGoals/map"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyKpisSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyKpisSwr"
import { useMutateSetKpiTargetSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetKpiTargetSwr"
import { useMutateClaimKpiRewardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateClaimKpiRewardSwr"
import type { KpiKey, QueryKpiItemData } from "@/modules/api/graphql/queries/types/my-kpis"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"

/** Props for {@link Kpi}. */
export type KpiProps = WithClassNames<undefined>

/**
 * The `/kpi` editor page body: the composite score header, then one row per
 * weekly KPI (icon · label · current/target · progress · preset target
 * buttons). Picking a preset writes the target via `setKpiTarget` and
 * revalidates. Self-fetches the KPIs + owns the mutation.
 *
 * @param props - optional className for the root element.
 */
export const Kpi = ({
    className,
}: KpiProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, mutate } = useQueryMyKpisSwr()
    const { trigger: triggerSetTarget } = useMutateSetKpiTargetSwr()
    const { trigger: triggerClaimReward } = useMutateClaimKpiRewardSwr()
    const runGraphQL = useGraphQLWithToast()
    // the `${key}:${preset}` currently being saved, or null when idle
    const [savingKey, setSavingKey] = useState<string | null>(null)
    // the KPI key currently being claimed, or null when idle
    const [claimingKey, setClaimingKey] = useState<KpiKey | null>(null)

    /** Navigate to the dashboard (breadcrumb root). */
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
                        throw new Error(t("dashboard.kpi.error"))
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
                        throw new Error(t("dashboard.kpi.error"))
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

    // first load — placeholder rows so the page never jumps
    if (!data) {
        return (
            <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-10 p-6", className)}>
                <Skeleton className="h-8 w-40 rounded-medium" />
                {Array.from({
                    length: 6,
                }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-20 w-full rounded-3xl"
                    />
                ))}
            </div>
        )
    }

    const { percent, completed, total } = data.composite
    // days/hours left until the weekly reset — mirrors WeeklyBoard/WeeklyGoals
    const remaining = Math.max(0, new Date(data.resetAt).getTime() - Date.now())
    const countdown = {
        days: Math.floor(remaining / 86_400_000),
        hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    }

    return (
        <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-10 p-6", className)}>
            <PageHeader
                breadcrumb={(
                    <ResponsiveBreadcrumb
                        items={[
                            {
                                key: "home",
                                label: t("nav.home"),
                                onPress: onNavigateHome,
                            },
                            {
                                key: "kpi",
                                label: t("dashboard.kpi.title"),
                            },
                        ]}
                    />
                )}
                title={(
                    <InfoTooltip
                        title={t("dashboard.kpi.title")}
                        description={t("dashboard.kpi.help")}
                    >
                        {t("dashboard.kpi.title")}
                    </InfoTooltip>
                )}
                description={(total > 0
                    ? t("dashboard.kpi.summary", {
                        percent,
                        completed,
                        total,
                    })
                    : t("dashboard.kpi.subtitle")) + ` · ${t("dashboard.kpi.resetIn", {
                    days: countdown.days,
                    hours: countdown.hours,
                })}`}
            />

            {/* one editable row per KPI — a single joined surface, not N separate boxes */}
            <SurfaceListCard>
                {KPI_META.map(({ key, Icon, labelKey, presets }) => {
                    const item = itemByKey.get(key)
                    const current = item?.current ?? 0
                    // effective target = the learner's custom goal, or a sensible default
                    // (mirrors the dashboard card — meter always runs, never rỗng chờ config)
                    const target = item?.target ?? DEFAULT_KPI_TARGETS[key]
                    return (
                        <SurfaceListCardItem key={key} className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {/* icon leading cùng màu với label cạnh nó (icon.md §6) */}
                                    <Icon className="size-5 shrink-0 text-foreground" />
                                    <span className="text-sm font-medium text-foreground">
                                        {t(`dashboard.kpi.labels.${labelKey}`)}
                                    </span>
                                </div>
                                <span className="shrink-0 text-sm text-muted">
                                    {current}/{target}
                                </span>
                            </div>

                            <ProgressBar
                                aria-label={t(`dashboard.kpi.labels.${labelKey}`)}
                                value={current}
                                maxValue={target || 1}
                                color="accent"
                                size="sm"
                            >
                                <ProgressBar.Track>
                                    <ProgressBar.Fill />
                                </ProgressBar.Track>
                            </ProgressBar>

                            {/* preset target — single-select radio (always exactly 1 chosen, no clear) */}
                            <FlexWrapButtonRadio
                                ariaLabel={t(`dashboard.kpi.labels.${labelKey}`)}
                                value={String(target)}
                                onChange={(value) => void onChoose(key, Number(value))}
                                items={presets.map((preset) => ({
                                    value: String(preset),
                                    content: preset,
                                    isDisabled: savingKey !== null && savingKey !== `${key}:${preset}`,
                                }))}
                            />

                            {/* coin reward — only once a REAL target is set server-side */}
                            {item?.coinReward != null ? (
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={cn(
                                            "text-xs",
                                            item.canClaim ? "text-accent-soft-foreground" : "text-muted",
                                        )}
                                    >
                                        {t("dashboard.kpi.coinReward", { count: item.coinReward })}
                                    </span>
                                    {item.claimed ? (
                                        <span className="text-xs text-muted">{t("dashboard.kpi.claimed")}</span>
                                    ) : item.canClaim ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            isPending={claimingKey === key}
                                            isDisabled={claimingKey !== null && claimingKey !== key}
                                            onPress={() => void onClaim(key)}
                                        >
                                            {t("dashboard.kpi.claimReward")}
                                        </Button>
                                    ) : null}
                                </div>
                            ) : null}
                        </SurfaceListCardItem>
                    )
                })}
            </SurfaceListCard>
        </div>
    )
}
