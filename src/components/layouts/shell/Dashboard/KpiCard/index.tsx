"use client"

import React, {
    useMemo,
} from "react"
import {
    Button,
    ProgressBar,
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
    pathConfig,
} from "@/resources/path"
import {
    KPI_META,
} from "@/components/layouts/kpi/kpiMeta"
import type {
    KpiKey,
    QueryKpiItemData,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link KpiCard}. */
export type KpiCardProps = WithClassNames<undefined>

/**
 * Dashboard "KPI tuần" card: the composite score header + a "Sửa" button to the
 * `/kpi` editor, then a read-only breakdown of each weekly KPI (icon · label ·
 * current/target · progress). Targets are set on the editor page, not here.
 * Self-fetches its own leaf query; renders nothing while still loading.
 *
 * @param props - optional className for the root element.
 */
export const KpiCard = ({
    className,
}: KpiCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data } = useQueryMyKpisSwr()

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

    // avoid a flash while the KPIs are still loading
    if (!data) {
        return null
    }

    const { percent, completed, total } = data.composite
    // no target on any KPI yet → prompt; else show the composite
    const hasTargets = total > 0

    return (
        <div className={cn("flex flex-col gap-3 p-3", className)}>
            {/* header: composite summary */}
            <span className="font-medium text-foreground">
                {hasTargets
                    ? t("dashboard.kpi.summary", {
                        percent,
                        completed,
                        total,
                    })
                    : t("dashboard.kpi.prompt")}
            </span>

            {/* per-KPI breakdown (read-only — editing lives on /kpi) — 2-col grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {KPI_META.map(({ key, Icon, labelKey }) => {
                    const item = itemByKey.get(key)
                    const current = item?.current ?? 0
                    const target = item?.target ?? null
                    return (
                        <div
                            key={key}
                            className="flex flex-col gap-1.5"
                        >
                            <div className="flex items-center justify-between gap-1.5 text-xs">
                                <span className="flex items-center gap-1.5 text-muted">
                                    <Icon className="size-4 shrink-0" />
                                    {t(`dashboard.kpi.labels.${labelKey}`)}
                                </span>
                                <span className="shrink-0 text-muted">
                                    {current}
                                    {target !== null ? `/${target}` : null}
                                </span>
                            </div>
                            {target !== null ? (
                                <ProgressBar
                                    aria-label={t(`dashboard.kpi.labels.${labelKey}`)}
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

            {/* edit affordance pinned to the foot of the card */}
            <Button
                variant="tertiary"
                size="sm"
                className="self-start"
                onPress={() => router.push(pathConfig().locale(locale).kpi().build())}
            >
                {t("dashboard.kpi.edit")}
            </Button>
        </div>
    )
}
