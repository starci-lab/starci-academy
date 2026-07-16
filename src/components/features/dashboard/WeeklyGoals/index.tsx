"use client"

import React, {
    useMemo,
} from "react"
import {
    Button,
    ProgressBar,
    Typography,
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    DEFAULT_KPI_TARGETS,
    KPI_ICON_MAP,
    KPI_ORDER,
} from "./map"
import { useQueryMyKpisSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyKpisSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatGridCard } from "@/components/blocks/stats/StatGridCard"
import type { KpiKey, QueryKpiItemData } from "@/modules/api/graphql/queries/types/my-kpis"

/** Props for {@link WeeklyGoals}. */
export type WeeklyGoalsProps = WithClassNames<undefined>

/**
 * "Mục tiêu tuần" content — the composite weekly-goal summary + a per-metric
 * breakdown (lessons / study-days / challenges / coding / flashcards) with a bar
 * when a target is set, plus a link to the editor. The single weekly-goals surface
 * (targets come from `weeklyKpiTargets` via `myKpis`). Content only (the parent
 * {@link import("@/components/blocks").LabeledCard} frames it). Self-fetches.
 * @param props - optional root class name (placement only)
 */
export const WeeklyGoals = ({
    className,
}: WeeklyGoalsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        data: kpis,
        isLoading,
        error,
        mutate,
    } = useQueryMyKpisSwr()

    /** Index KPI items by key for O(1) lookup while rendering in display order. */
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

    // composite over EFFECTIVE targets (custom OR default) so the summary + bars
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

    return (
        <AsyncContent
            isLoading={kpis === null || kpis === undefined || isLoading}
            error={error}
            errorContent={{
                title: t("dashboard.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
            skeleton={(
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="body-sm" width="2/3" />
                    <StatGridCard
                        items={KPI_ORDER.map((key) => ({
                            key,
                            content: (
                                <>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2">
                                            <Skeleton className="size-5 shrink-0 rounded-full" />
                                            <Skeleton.Typography type="body-sm" width="1/2" />
                                        </span>
                                        <Skeleton.Typography type="body-xs" width="1/4" />
                                    </div>
                                    <Skeleton.Meter />
                                </>
                            ),
                        }))}
                    />
                </div>
            )}
        >
            <div className={cn("flex flex-col gap-3", className)}>
                <Typography type="body-sm" weight="medium">
                    {t("dashboard.kpi.summary", {
                        percent: composite.percent,
                        completed: composite.completed,
                        total: composite.total,
                    })}
                </Typography>
                <StatGridCard
                    items={KPI_ORDER.map((key) => {
                        const item = itemByKey.get(key)
                        const current = item?.current ?? 0
                        // effective target = the learner's custom goal, or a sensible default
                        // (so the meter tracks this week's activity out of the box)
                        const target = item?.target ?? DEFAULT_KPI_TARGETS[key]
                        return {
                            key,
                            content: (
                                <>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2">
                                            {KPI_ICON_MAP[key]}
                                            <Typography type="body-sm">
                                                {t(`dashboard.kpi.labels.${key}`)}
                                            </Typography>
                                        </span>
                                        <Typography type="body-xs" color="muted">
                                            {current}/{target}
                                        </Typography>
                                    </div>
                                    {/* progress line — current toward the (custom or default) target */}
                                    <ProgressBar
                                        aria-label={t(`dashboard.kpi.labels.${key}`)}
                                        value={current}
                                        maxValue={target > 0 ? target : 1}
                                        color="accent"
                                        size="sm"
                                    >
                                        <ProgressBar.Track>
                                            <ProgressBar.Fill />
                                        </ProgressBar.Track>
                                    </ProgressBar>
                                </>
                            ),
                        }
                    })}
                />
                <Button
                    variant="tertiary"
                    size="sm"
                    className="self-start"
                    onPress={() => router.push(pathConfig().locale(locale).kpi().build())}
                >
                    {t("dashboard.kpi.edit")}
                </Button>
            </div>
        </AsyncContent>
    )
}
