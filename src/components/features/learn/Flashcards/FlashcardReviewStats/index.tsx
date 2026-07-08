"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import dayjs from "dayjs"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ChartLineUpIcon, FlameIcon, TrophyIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { queryMyFlashcardReviewStats } from "@/modules/api/graphql/queries/query-my-flashcard-review-stats"
import { queryMyFlashcardStats } from "@/modules/api/graphql/queries/query-my-flashcard-stats"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Retention headline color BY VALUE — mirrors `MockInterviewStats`'s own `scoreColorOf`. */
const retentionColorOf = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 75 ? "warning" : "success"

/** {@link retentionColorOf}'s result as a `text-*` class, for the headline number. */
const retentionTextColorOf = (percent: number): string => {
    const color = retentionColorOf(percent)
    return color === "danger" ? "text-danger" : color === "warning" ? "text-warning" : "text-success"
}

/** How many of the trailing 90 daily-activity points the heatmap renders. */
const HEATMAP_DAYS = 90
/** Columns in the heatmap grid (one ISO week). */
const HEATMAP_COLUMNS = 7

/** Props for {@link FlashcardReviewStats}. */
export interface FlashcardReviewStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate "Học thẻ" review stats to show. */
    courseId: string
    /** Jumps the overview tab strip back to the study overview (empty-state action). */
    onStartReview?: () => void
}

/** Below this many lifetime reviews the aggregates are noise — mirrors
 *  `FlashcardStatsStrip`'s own `RETENTION_MIN_REVIEWS` gate constant. */
const RETENTION_MIN_REVIEWS = 5

/**
 * "Học thẻ" aggregate stats — the study overview's "Thống kê" tab: a
 * reviewed-count trend (real `recharts` `BarChart`, mirrors
 * `AiUsageHistory`'s per-day spend chart — thầy 2026-07-09: "dùng recharts vẽ
 * chart dc không", the old hand-rolled inline-div bars read as meaningless
 * placeholder art) + a per-deck breakdown as a clickable `SurfaceListCard`
 * (thầy: "ở dưới render theo list card theo rules mà" — `fe/components/list.md`
 * §"Nguyên tắc chọn block": a list of click-through items reads as ONE card,
 * not hand-rolled `<div>` rows; each row jumps into that deck's reviewer).
 * Gated behind the same lifetime-review floor so a near-empty history doesn't
 * read as a broken dashboard.
 * @param props - {@link FlashcardReviewStatsProps}
 */
export const FlashcardReviewStats = ({ courseId, onStartReview, className }: FlashcardReviewStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)

    const statsSwr = useSWR(
        ["flashcard-review-stats", courseId],
        async () => {
            const response = await queryMyFlashcardReviewStats({ request: { courseId } })
            return response.data?.myFlashcardReviewStats.data ?? null
        },
    )
    // lifetime review count — reused only for the empty-state gate (same signal
    // `FlashcardStatsStrip` reads for its own retention caption).
    const lifetimeSwr = useSWR(
        ["my-flashcard-stats"],
        async () => {
            const response = await queryMyFlashcardStats({})
            return response.data?.myFlashcardStats.data ?? null
        },
    )

    const isLoading = (statsSwr.isLoading || lifetimeSwr.isLoading) && !statsSwr.data && !lifetimeSwr.data
    const totalReviewed = lifetimeSwr.data?.totalReviewed ?? 0
    const stats = statsSwr.data
    const retentionRate = lifetimeSwr.data?.retentionRate ?? 0
    const currentStreak = lifetimeSwr.data?.currentStreak ?? 0
    const longestStreak = lifetimeSwr.data?.longestStreak ?? 0
    const lastReviewedAt = lifetimeSwr.data?.lastReviewedAt ?? null
    const gradeDistribution = lifetimeSwr.data?.gradeDistribution
    const dueToday = stats?.dueToday ?? 0
    const mastery = stats?.masteryBreakdown

    // short "DD/MM" tick label per day — same date-axis treatment
    // `AiUsageHistory`'s own per-day chart uses. `date` is `YYYY-MM-DD`; append
    // a midday UTC time so the Date lands on the intended calendar day in any
    // viewer timezone (a bare `YYYY-MM-DD` parses as UTC midnight → can slip a
    // day west of UTC).
    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }),
        [locale],
    )
    // trend chart keeps its original 14-day window — `dailyActivity` now
    // retains 90 days (for the heatmap below), so slice back to the last 14.
    const chartData = useMemo(
        () => (stats?.dailyActivity ?? []).slice(-14).map((point) => ({
            day: dateFormatter.format(new Date(`${point.date}T12:00:00Z`)),
            cardsReviewed: point.cardsReviewed,
        })),
        [stats?.dailyActivity, dateFormatter],
    )
    // due-forecast mini chart — the next 7 days, tomorrow first
    const forecastData = useMemo(
        () => (stats?.dueForecast ?? []).map((point) => ({
            day: dateFormatter.format(new Date(`${point.date}T12:00:00Z`)),
            count: point.count,
        })),
        [stats?.dueForecast, dateFormatter],
    )
    // 90-day heatmap cells — same points the (sliced) trend chart reads, full window
    const heatmapCells = useMemo(() => {
        const points = (stats?.dailyActivity ?? []).slice(-HEATMAP_DAYS)
        const max = Math.max(1, ...points.map((point) => point.cardsReviewed))
        return points.map((point) => ({
            date: point.date,
            cardsReviewed: point.cardsReviewed,
            intensity: point.cardsReviewed === 0 ? 0 : Math.round((point.cardsReviewed / max) * 100),
        }))
    }, [stats?.dailyActivity])

    return (
        <AsyncContent
            isLoading={isLoading}
            skeleton={(
                <div className="flex flex-col gap-6">
                    <Skeleton.Card />
                    <Skeleton.Card />
                </div>
            )}
            error={!stats ? statsSwr.error : undefined}
            errorContent={{
                title: t("flashcard.review.statsError"),
                onRetry: () => { void statsSwr.mutate() },
                retryLabel: t("flashcard.review.retry"),
            }}
        >
            {totalReviewed < RETENTION_MIN_REVIEWS ? (
                <EmptyState
                    icon={<ChartLineUpIcon aria-hidden focusable="false" />}
                    title={t("flashcard.review.statsEmptyTitle")}
                    description={t("flashcard.review.statsEmptyDescription")}
                    action={onStartReview ? (
                        <Button size="sm" variant="secondary" onPress={onStartReview}>
                            {t("flashcard.review.historyEmptyAction")}
                        </Button>
                    ) : undefined}
                />
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* Hero 1 — "how much work is left": due-today headline + a mini
                        7-day forecast bar (recharts, same convention as the trend
                        chart below), so the page opens on WORK REMAINING, not effort
                        already spent. */}
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex items-baseline gap-1.5">
                            <Typography type="h2" weight="semibold">
                                {dueToday}
                            </Typography>
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.dueTodayLabel")}
                            </Typography>
                        </div>
                        <Typography type="body-xs" color="muted">
                            {t("flashcard.review.dueForecastLabel")}
                        </Typography>
                        <div className="h-20 w-full text-accent">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={forecastData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                    <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                                    <Tooltip
                                        cursor={{ fill: "currentColor", opacity: 0.08 }}
                                        formatter={(value) => [
                                            t("flashcard.review.statsTrendTooltip", { count: value as number }),
                                            "",
                                        ]}
                                    />
                                    <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>

                    {/* Hero 2 — "does the work stick": retentionRate as the real headline
                        (colored BY VALUE, mirrors `MockInterviewStats`'s avgScore), a meter
                        toward 100, and the grade distribution as an honest proportion bar
                        (SegmentBar — no new primitive). Streak chips ride along as momentum
                        context. */}
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-baseline gap-1.5">
                                <Typography type="h2" weight="semibold" className={retentionTextColorOf(retentionRate)}>
                                    {retentionRate}%
                                </Typography>
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.review.retentionHeroLabel")}
                                </Typography>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                {currentStreak > 0 ? (
                                    <Chip size="sm" variant="secondary" color="warning" className="bg-warning/10 text-warning">
                                        <FlameIcon className="size-3.5" aria-hidden focusable="false" />
                                        {t("flashcard.stats.streakChip", { count: currentStreak })}
                                    </Chip>
                                ) : null}
                                {longestStreak > 0 ? (
                                    <Chip size="sm" variant="secondary" className="bg-accent/10 text-accent">
                                        <TrophyIcon className="size-3.5" aria-hidden focusable="false" />
                                        {t("flashcard.review.longestStreakChip", { count: longestStreak })}
                                    </Chip>
                                ) : null}
                            </div>
                        </div>
                        <ProgressMeter value={retentionRate} max={100} color={retentionColorOf(retentionRate)} />
                        {gradeDistribution ? (
                            <div className="flex flex-col gap-2">
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.review.gradeDistributionLabel")}
                                </Typography>
                                <SegmentBar
                                    ariaLabel={t("flashcard.review.gradeDistributionLabel")}
                                    segments={[
                                        {
                                            key: "again",
                                            label: t("flashcard.review.gradeAgain"),
                                            value: gradeDistribution.again,
                                            color: "var(--danger)",
                                        },
                                        {
                                            key: "hard",
                                            label: t("flashcard.review.gradeHard"),
                                            value: gradeDistribution.hard,
                                            color: "var(--warning)",
                                        },
                                        {
                                            key: "good",
                                            label: t("flashcard.review.gradeGood"),
                                            value: gradeDistribution.good,
                                            color: "color-mix(in oklch, var(--success) 65%, transparent)",
                                        },
                                        {
                                            key: "easy",
                                            label: t("flashcard.review.gradeEasy"),
                                            value: gradeDistribution.easy,
                                            color: "var(--success)",
                                        },
                                    ]}
                                />
                            </div>
                        ) : null}
                        {lastReviewedAt ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.review.lastReviewedCaption", {
                                    date: dayjs(lastReviewedAt).format("DD/MM/YYYY HH:mm"),
                                })}
                            </Typography>
                        ) : null}
                    </SectionCard>

                    {/* Bổ trợ 1 — card-maturity split, scoped to THIS course (mirrors
                        `FlashcardStatsStrip`'s own mastered/learning/new mix bar). */}
                    {mastery ? (
                        <LabeledCard label={t("flashcard.review.masteryBreakdownLabel")}>
                            <SegmentBar
                                ariaLabel={t("flashcard.stats.barAria", {
                                    mastered: mastery.mastered,
                                    learning: mastery.learning,
                                    newCount: mastery.new,
                                    total: mastery.mastered + mastery.learning + mastery.new,
                                })}
                                segments={[
                                    {
                                        key: "mastered",
                                        label: t("flashcard.stats.mastered"),
                                        value: mastery.mastered,
                                        color: "var(--success)",
                                    },
                                    {
                                        key: "learning",
                                        label: t("flashcard.stats.learning"),
                                        value: mastery.learning,
                                        color: "var(--warning)",
                                    },
                                    {
                                        key: "new",
                                        label: t("flashcard.stats.new"),
                                        value: mastery.new,
                                        color: "var(--default)",
                                    },
                                ]}
                            />
                        </LabeledCard>
                    ) : null}

                    <LabeledCard label={t("flashcard.review.statsTrendLabel")}>
                        <div className="h-44 w-full text-accent">
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
                                        formatter={(value) => [
                                            t("flashcard.review.statsTrendTooltip", { count: value as number }),
                                            "",
                                        ]}
                                    />
                                    <Bar dataKey="cardsReviewed" fill="currentColor" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </LabeledCard>

                    {/* Bổ trợ 2 — 90-day heatmap. No canonical heatmap block exists, so a
                        plain CSS grid (7 columns) inside a LabeledCard — colour intensity
                        via `color-mix` against the accent token (no new primitive/token). */}
                    {heatmapCells.length > 0 ? (
                        <LabeledCard label={t("flashcard.review.heatmapLabel")}>
                            <div
                                className="grid gap-1"
                                style={{ gridTemplateColumns: `repeat(${HEATMAP_COLUMNS}, minmax(0, 1fr))` }}
                            >
                                {heatmapCells.map((cell) => (
                                    <div
                                        key={cell.date}
                                        title={`${cell.date}: ${cell.cardsReviewed}`}
                                        className="aspect-square w-full rounded-sm"
                                        style={{
                                            backgroundColor: cell.intensity === 0
                                                ? "var(--default)"
                                                : `color-mix(in oklch, var(--accent) ${cell.intensity}%, var(--default))`,
                                        }}
                                    />
                                ))}
                            </div>
                        </LabeledCard>
                    ) : null}

                    {/* by-deck — canonical "labeled list card" (card.md §3c): LabeledCard
                        FRAMELESS (label outside, NO inner Card) → SurfaceListCard → rows, so
                        it's ONE surface, not card-in-card. Was `contentClassName="p-0"` on a
                        FRAMED LabeledCard = double-surface + the p-0 gotcha (thầy 2026-07-09:
                        "áp dụng labeled card với list card"). Rows click through to that
                        deck's reviewer (`hover="underline"` = nav row, list.md §5). */}
                    {(stats?.byDeck.length ?? 0) === 0 ? null : (
                        <LabeledCard label={t("flashcard.review.statsByDeckLabel")} frameless>
                            <SurfaceListCard>
                                {stats?.byDeck.map((deck) => (
                                    <SurfaceListCardRow
                                        key={deck.deckId}
                                        title={deck.deckTitle}
                                        subtitle={t("flashcard.review.statsDeckMeta", {
                                            cardsReviewed: deck.cardsReviewed,
                                            totalCards: deck.totalCards,
                                            sessionCount: deck.sessionCount,
                                        })}
                                        hover="underline"
                                        onPress={() => router.push(
                                            pathConfig().locale(locale).course(displayId).learn()
                                                .flashcards().review(deck.deckId).build(),
                                        )}
                                    />
                                ))}
                            </SurfaceListCard>
                        </LabeledCard>
                    )}
                </div>
            )}
        </AsyncContent>
    )
}
