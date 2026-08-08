"use client"

import React, {
    useMemo,
} from "react"
import { Chip, ScrollShadow } from "@heroui/react"
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
import { useQueryMyCreditUsageHistoryInfiniteSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCreditUsageHistoryInfiniteSwr"
import { AiCeilSurface } from "@/modules/api/graphql/mutations/types/set-ai-ceil"
import type { QueryMyCreditUsageHistoryItem } from "@/modules/api/graphql/queries/types/my-credit-usage-history"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackV } from "@/components/frames/Stack"

/** Days shown in the per-day spend chart (matches the chart title copy). */
const CHART_DAYS = 14

/** Display label per provider key; null = the free Auto lane. */
const PROVIDER_LABELS: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Gemini",
}

/**
 * Human label for what a charge row was for. `surface` distinguishes an
 * interview-grading / chatbot charge from a challenge-grading one — rows
 * predating the `surface` column (or from a surface not yet passing it
 * through) fall back to the "Grade challenge" label.
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

/** Props for {@link AiUsageHistory}. */
export type AiUsageHistoryProps = Record<string, never>
/**
 * AI usage insight for the `/profile/ai-usage` page: a per-day spend chart, a
 * "by provider" {@link SegmentBar} breakdown, and the charge history as an
 * infinite-scroll list. Self-contained: drives its own `useSWRInfinite` over
 * `myCreditUsageHistory` (offset paginated). Chart/breakdown are computed
 * client-side from the loaded rows.
 *
 * NOTE: linking a charge back to its challenge needs the backend to expose
 * `attemptId` on the history item — not surfaced yet, so rows are read-only.
 *
 * @param props - optional className (placement only).
 */
export const AiUsageHistory = () => {
    const t = useTranslations()

    const {
        data,
        isLoading,
        isValidating,
        error,
        size,
        setSize,
        mutate,
    } = useQueryMyCreditUsageHistoryInfiniteSwr()

    const pages = useMemo(() => data ?? [], [data])
    const items = useMemo(() => pages.flatMap((page) => page.items), [pages])
    const total = pages[0]?.total ?? 0
    const hasMore = items.length < total
    const isLoadingMore = isValidating && size > 0

    // per-day spend buckets (last CHART_DAYS days), from all loaded rows
    const chartData = useMemo(() => {
        const today = dayjs().startOf("day")
        const buckets = new Map<string, number>()
        for (let offset = CHART_DAYS - 1; offset >= 0; offset--) {
            buckets.set(today.subtract(offset, "day").format("DD/MM"), 0)
        }
        for (const item of items) {
            const key = dayjs(item.createdAt).startOf("day").format("DD/MM")
            if (buckets.has(key)) {
                buckets.set(key, (buckets.get(key) ?? 0) + item.credits)
            }
        }
        return [...buckets.entries()].map(([day, credits]) => ({ day, credits }))
    }, [items])

    // credits spent per provider (null provider = free Auto lane)
    const providerSegments = useMemo(() => {
        const byProvider = new Map<string, number>()
        for (const item of items) {
            const key = item.provider ?? "free"
            byProvider.set(key, (byProvider.get(key) ?? 0) + item.credits)
        }
        return [...byProvider.entries()]
            .filter(([, credits]) => credits > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([key, credits]) => ({
                key,
                label: key === "free" ? t("aiQuota.freeTier") : PROVIDER_LABELS[key] ?? key,
                value: credits,
            }))
    }, [items, t])

    const historyItems: Array<SurfaceCardListItem> = items.map((item) => ({
        key: item.id,
        title: item.model ?? t("aiQuota.history.autoModel"),
        subtitle: `${purposeLabel(item, t)} · ${dayjs(item.createdAt).format("HH:mm DD/MM")}`,
        trailing: () => (
            <Chip
                size="sm"
                variant="soft"
                color={item.credits > 0 ? "warning" : "success"}
            >
                <Chip.Label>
                    {`${item.credits} ${t("aiQuota.history.creditsUnit")}`}
                </Chip.Label>
            </Chip>
        ),
    }))

    return (
        <AsyncContent
            isLoading={isLoading && items.length === 0}
            skeleton={(
                <StackV
                    gap={6}
                    items={[
                        () => (
                            <LabeledCard label={t("aiQuota.history.chartTitle")}>
                                <Skeleton className="h-44 w-full rounded-xl" />
                            </LabeledCard>
                        ),
                        () => (
                            <LabeledCard label={t("aiQuota.history.breakdownTitle")}>
                                <Skeleton.SegmentBar legendItems={3} />
                            </LabeledCard>
                        ),
                        () => (
                            <LabeledCard label={t("aiQuota.history.title")}>
                                <StackV
                                    gap={3}
                                    principle="sibling-stack"
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    items={[0, 1, 2, 3].map((row) => () => (
                                        <Skeleton key={row} className="h-12 w-full rounded-xl" />
                                    ))}
                                />
                            </LabeledCard>
                        ),
                    ]}
                />
            )}
            isEmpty={items.length === 0}
            emptyContent={{ title: t("aiQuota.history.empty") }}
            error={error}
            errorContent={{
                title: t("aiQuota.history.title"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
        >
            <div className={""}>
                <StackV
                    gap={6}
                    items={[
                        () => (
                            <LabeledCard label={t("aiQuota.history.chartTitle")}>
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
                                            <Bar dataKey="credits" fill="currentColor" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </LabeledCard>
                        ),
                        ...(providerSegments.length > 0
                            ? [() => (
                                <LabeledCard label={t("aiQuota.history.breakdownTitle")}>
                                    <SegmentBar
                                        ariaLabel={t("aiQuota.history.breakdownTitle")}
                                        segments={providerSegments}
                                    />
                                </LabeledCard>
                            )]
                            : []),
                        () => (
                            <ScrollShadow className="max-h-96">
                                <SurfaceCardList
                                    label={t("aiQuota.history.title")}
                                    items={historyItems}
                                />
                                <InfiniteScrollSentinel
                                    onReach={() => setSize((current) => current + 1)}
                                    disabled={!hasMore || isLoadingMore}
                                />
                            </ScrollShadow>
                        ),
                    ]}
                />
            </div>
        </AsyncContent>
    )
}
