"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
    Chip,
    ScrollShadow,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import dayjs from "dayjs"
import {
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import {
    useAiQuotaHistorySwr,
} from "../hooks"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { AiCeilSurface } from "@/modules/api/graphql/mutations/types/set-ai-ceil"
import type { QueryMyCreditUsageHistoryItem } from "@/modules/api/graphql/queries/types/my-credit-usage-history"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One day bucket for the usage history chart. */
interface AiQuotaHistoryChartPoint {
    /** Day label on the X axis (`DD/MM`). */
    day: string
    /** Credits consumed that day. */
    credits: number
}

/** Props for {@link AiQuotaHistoryTab}. */
export interface AiQuotaHistoryTabProps extends WithClassNames<undefined> {
    /** When true, load history even outside the modal (full usage page). */
    alwaysLoad?: boolean
}

/**
 * Human label for what a charge row was for. `surface` distinguishes an
 * interview-grading / chatbot charge from a challenge-grading one — rows
 * predating the `surface` column (or from a surface not yet passing it
 * through) fall back to the "Chấm challenge" label.
 */
const purposeLabel = (
    item: QueryMyCreditUsageHistoryItem,
    t: ReturnType<typeof useTranslations>,
): string => {
    switch (item.surface) {
    case AiCeilSurface.Interview:
        return t("aiQuota.history.purposeInterview")
    case AiCeilSurface.Chatbot:
        return t("aiQuota.history.purposeChatbot")
    default:
        return t("aiQuota.history.purposeGrade")
    }
}

/**
 * AI quota modal — history tab (chart + recent charges).
 * @param props - {@link AiQuotaHistoryTabProps}
 */
export const AiQuotaHistoryTab = ({
    alwaysLoad = false,
    className,
}: AiQuotaHistoryTabProps) => {
    const t = useTranslations()
    const { data: history, isLoading } = useAiQuotaHistorySwr({
        enabled: alwaysLoad,
    })

    const chartData = useMemo((): Array<AiQuotaHistoryChartPoint> => {
        const today = dayjs().startOf("day")
        const buckets = new Map<string, number>()
        for (let offset = 7 - 1; offset >= 0; offset--) {
            buckets.set(today.subtract(offset, "day").format("DD/MM"), 0)
        }
        for (const item of history?.items ?? []) {
            const key = dayjs(item.createdAt).startOf("day").format("DD/MM")
            if (buckets.has(key)) {
                buckets.set(key, (buckets.get(key) ?? 0) + item.credits)
            }
        }
        return [...buckets.entries()].map(([day, credits]) => ({
            day,
            credits,
        }))
    }, [history])

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* Chart — surface-in-surface: border only, no fill */}
            <div className="flex flex-col gap-2">
                <Typography type="body-sm" weight="semibold">
                    {t("aiQuota.history.chartTitle")}
                </Typography>
                <div className="overflow-hidden rounded-xl border border-default p-4">
                    <div className="h-44 w-full text-accent-soft-foreground">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="currentColor"
                                    className="text-divider"
                                    vertical={false}
                                />
                                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={1} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                                <Tooltip
                                    cursor={{ fill: "currentColor", opacity: 0.08 }}
                                    formatter={(value) => [`${value} ${t("aiQuota.history.creditsUnit")}`, ""]}
                                />
                                <Bar
                                    dataKey="credits"
                                    fill="currentColor"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* History list — surface-in-surface: border only, p-0, rows own their padding */}
            <div className="flex flex-col gap-2">
                <Typography type="body-sm" weight="semibold">
                    {t("aiQuota.history.title")}
                </Typography>
                {isLoading ? (
                    <div className="flex flex-col gap-2 rounded-xl border border-default p-4">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="flex items-center justify-between gap-2">
                                {/* two stacked lines — model (body-sm) + purpose·time (body-xs) */}
                                <div className="flex min-w-0 flex-col">
                                    <Skeleton.Typography type="body-sm" className="w-32" />
                                    <Skeleton.Typography type="body-xs" className="w-40" />
                                </div>
                                <Skeleton.Chip />
                            </div>
                        ))}
                    </div>
                ) : (history?.items.length ?? 0) === 0 ? (
                    <EmptyContent title={t("aiQuota.history.empty")} />
                ) : (
                    <SurfaceListCard bordered>
                        <ScrollShadow className="flex max-h-64 flex-col">
                            {history?.items.map((item) => (
                                <SurfaceListCardItem key={item.id}>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <Typography type="body-sm" weight="medium" truncate>
                                                {item.model ?? t("aiQuota.history.autoModel")}
                                            </Typography>
                                            <Typography type="body-xs" color="muted" truncate>
                                                {purposeLabel(item, t)}
                                                {" · "}
                                                {dayjs(item.createdAt).format("HH:mm DD/MM")}
                                            </Typography>
                                        </div>
                                        <Chip size="sm" variant="soft" color={item.credits > 0 ? "warning" : "success"}>
                                            {`${item.credits} ${t("aiQuota.history.creditsUnit")}`}
                                        </Chip>
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </ScrollShadow>
                    </SurfaceListCard>
                )}
            </div>
        </div>
    )
}
