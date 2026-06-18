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
    useQueryMyKpisSwr,
} from "@/hooks"
import {
    AsyncContent,
    Skeleton,
} from "@/components/blocks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    KpiKey,
    QueryKpiItemData,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    KPI_ICON_MAP,
    KPI_ORDER,
} from "./map"

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

    const composite = kpis?.composite
    const hasTargets = (composite?.total ?? 0) > 0

    return (
        <AsyncContent
            isLoading={isLoading && !kpis}
            error={error}
            errorContent={{
                title: t("dashboard.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
            skeleton={(
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-full rounded-medium" />
                    ))}
                </div>
            )}
        >
            <div className={cn("flex flex-col gap-3", className)}>
                <Typography type="body-sm" weight="medium">
                    {hasTargets && composite
                        ? t("dashboard.kpi.summary", {
                            percent: composite.percent,
                            completed: composite.completed,
                            total: composite.total,
                        })
                        : t("dashboard.kpi.prompt")}
                </Typography>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {KPI_ORDER.map((key) => {
                        const item = itemByKey.get(key)
                        const current = item?.current ?? 0
                        const target = item?.target ?? null
                        return (
                            <div key={key} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        {KPI_ICON_MAP[key]}
                                        <Typography type="body-xs" color="muted">
                                            {t(`dashboard.kpi.labels.${key}`)}
                                        </Typography>
                                    </span>
                                    <Typography type="body-xs" color="muted">
                                        {current}
                                        {target !== null ? `/${target}` : null}
                                    </Typography>
                                </div>
                                {target !== null ? (
                                    <ProgressBar
                                        aria-label={t(`dashboard.kpi.labels.${key}`)}
                                        value={current}
                                        maxValue={target || 1}
                                        color="default"
                                        size="sm"
                                    >
                                        <ProgressBar.Track>
                                            <ProgressBar.Fill />
                                        </ProgressBar.Track>
                                    </ProgressBar>
                                ) : null}
                            </div>
                        )
                    })}
                </div>
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
