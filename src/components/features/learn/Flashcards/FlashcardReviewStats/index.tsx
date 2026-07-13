"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import dayjs from "dayjs"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon, CheckCircleIcon, FireIcon, FlameIcon, TrophyIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
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
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { queryMyFlashcardReviewStats } from "@/modules/api/graphql/queries/query-my-flashcard-review-stats"
import { queryMyFlashcardStats } from "@/modules/api/graphql/queries/query-my-flashcard-stats"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { DUE_REVIEW_LIMIT } from "../constants"
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
 * "Học thẻ" aggregate stats — the study overview's "Thống kê" tab, dẫn bằng
 * OUTCOME + việc-cần-sửa. Every zone is a `LabeledCard` (label OUTSIDE + Card
 * body, one metric each — thầy 2026-07-13 "render kiểu labeled card, tách block
 * ra": KHÔNG cram nhiều metric vào 1 SectionCard trần) — hero "Cần ôn lại"
 * (leech) · "Tỷ lệ nhớ" · "Đang cải thiện?" trend · "Phân bố kết quả ôn" ·
 * "Khối lượng" (due) · "Bộ thẻ theo độ nhớ" · "Thói quen". Gated behind the
 * same lifetime-review floor so a near-empty history doesn't read as broken.
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
    // "Đến hạn" number — read the SAME LIVE `myDueFlashcards` the overview hero
    // (`DueReviewHero`) reads, on the SAME SWR key, so the "Khối lượng" zone
    // shows the IDENTICAL count the overview does (thầy 2026-07-13: "thống kê
    // chuẩn không, đã ôn hết chưa?" — the projection's `dueToday` counted only
    // overdue REVIEW ROWS, excluding never-seen NEW cards the overview DOES
    // count as due today, and could lag as a cached aggregate → the two
    // surfaces disagreed). `dueCount` = overdue reviews + today's capped new batch.
    const dueSwr = useSWR(
        ["my-due-flashcards", courseId ?? null, DUE_REVIEW_LIMIT],
        async () => {
            const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
            return response.data?.myDueFlashcards.data ?? null
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
    // canonical, LIVE due count (matches the overview exactly) — NOT the
    // projection's narrower `stats.dueToday`.
    const dueToday = dueSwr.data?.dueCount ?? 0
    const dueReviewCount = dueSwr.data?.dueReviewCount ?? 0
    const newCount = dueSwr.data?.newCount ?? 0
    const mastery = stats?.masteryBreakdown
    // OUTCOME aggregates (thầy 2026-07-13 "render lại" — dẫn bằng việc-cần-sửa)
    const leechCards = stats?.leechCards ?? []
    const weakReviewTag = stats?.weakReviewTag ?? null
    const deckRetention = stats?.deckRetention ?? []
    // deck to drill from the hero CTA / when there's a weakest one: the lowest-
    // retention deck (BE returns `deckRetention` weakest-first), else the top
    // leech card's own deck.
    const weakestDeckId = deckRetention[0]?.deckId ?? leechCards[0]?.deckId ?? null
    /** Open a deck's reviewer (the single onward action shared by every row/CTA here). */
    const openDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(displayId).learn().flashcards().review(deckId).build(),
    )

    // short "DD/MM" tick label per day — same date-axis treatment
    // `AiUsageHistory`'s own per-day chart uses. `date` is `YYYY-MM-DD`; append
    // a midday UTC time so the Date lands on the intended calendar day in any
    // viewer timezone (a bare `YYYY-MM-DD` parses as UTC midnight → can slip a
    // day west of UTC).
    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }),
        [locale],
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
    // retention trend line — "đang cải thiện?" (only days WITH reviews, most-recent last)
    const retentionTrendData = useMemo(
        () => (stats?.retentionTrend ?? []).map((point) => ({
            day: dateFormatter.format(new Date(`${point.date}T12:00:00Z`)),
            retention: point.retention,
        })),
        [stats?.retentionTrend, dateFormatter],
    )

    return (
        <AsyncContent
            isLoading={isLoading}
            skeleton={(
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
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
                    {/* ZONE 1 — HERO "Cần ôn lại" (leech): the ONE actionable thing.
                        LabeledCard (label ngoài) — thầy 2026-07-13 "render kiểu labeled
                        card". Only when there's a leech to fix; each row + the CTA drill
                        the weak spot. */}
                    {leechCards.length > 0 ? (
                        <LabeledCard
                            label={t("flashcard.review.leechHeroLabel")}
                            icon={<FireIcon className="size-5 text-danger" weight="fill" aria-hidden focusable="false" />}
                            contentClassName="flex flex-col gap-3"
                        >
                            <SurfaceListCard>
                                {leechCards.map((card) => (
                                    <SurfaceListCardRow
                                        key={card.cardId}
                                        title={card.question}
                                        subtitle={card.deckTitle}
                                        hover="underline"
                                        onPress={() => openDeck(card.deckId)}
                                        meta={(
                                            <Chip size="sm" variant="soft" color="danger" className="shrink-0">
                                                {t("flashcard.review.forgotCount", { count: card.forgotCount })}
                                            </Chip>
                                        )}
                                    />
                                ))}
                            </SurfaceListCard>
                            {weakReviewTag ? (
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.review.weakTagLabel", {
                                        tag: weakReviewTag.tag,
                                        retention: weakReviewTag.retention,
                                    })}
                                </Typography>
                            ) : null}
                            {weakestDeckId ? (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="self-start"
                                    onPress={() => openDeck(weakestDeckId)}
                                >
                                    {t("flashcard.review.reviewNowCta")}
                                    <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                </Button>
                            ) : null}
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 2 — "Tỷ lệ nhớ" (retention headline, TÁCH riêng khỏi trend +
                        phân bố — mỗi metric 1 LabeledCard). */}
                    <LabeledCard label={t("flashcard.review.retentionHeroLabel")} contentClassName="flex flex-col gap-3">
                        <Typography type="h2" weight="semibold" className={retentionTextColorOf(retentionRate)}>
                            {retentionRate}%
                        </Typography>
                        <ProgressMeter value={retentionRate} max={100} color={retentionColorOf(retentionRate)} />
                    </LabeledCard>

                    {/* ZONE 3 — "Đang cải thiện?" retention trend (TÁCH). */}
                    {retentionTrendData.length > 1 ? (
                        <LabeledCard label={t("flashcard.review.retentionTrendLabel")}>
                            <div className="h-28 w-full text-accent">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={retentionTrendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-divider" vertical={false} />
                                        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                                        <Tooltip
                                            cursor={{ stroke: "currentColor", opacity: 0.2 }}
                                            formatter={(value) => [`${value as number}%`, ""]}
                                        />
                                        <Line dataKey="retention" stroke="currentColor" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 4 — "Phân bố kết quả ôn" (grade distribution, TÁCH). */}
                    {gradeDistribution ? (
                        <LabeledCard label={t("flashcard.review.gradeDistributionLabel")}>
                            <SegmentBar
                                ariaLabel={t("flashcard.review.gradeDistributionLabel")}
                                segments={[
                                    { key: "again", label: t("flashcard.review.gradeAgain"), value: gradeDistribution.again, color: "var(--danger)" },
                                    { key: "hard", label: t("flashcard.review.gradeHard"), value: gradeDistribution.hard, color: "var(--warning)" },
                                    { key: "good", label: t("flashcard.review.gradeGood"), value: gradeDistribution.good, color: "color-mix(in oklch, var(--success) 65%, transparent)" },
                                    { key: "easy", label: t("flashcard.review.gradeEasy"), value: gradeDistribution.easy, color: "var(--success)" },
                                ]}
                            />
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 5 — "Khối lượng": due-today count. 0 → POSITIVE caught-up
                        (thầy: 0 không nên là số chết). Dự báo TÁCH thành card riêng bên dưới. */}
                    <LabeledCard label={t("flashcard.review.volumeLabel")} contentClassName="flex flex-col gap-3">
                        {dueToday === 0 ? (
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon className="size-7 shrink-0 text-success" aria-hidden focusable="false" />
                                <div className="flex flex-col">
                                    <Typography type="body-sm" weight="medium">
                                        {t("flashcard.review.caughtUpTitle")}
                                    </Typography>
                                    <Typography type="body-xs" color="muted">
                                        {t("flashcard.review.caughtUpHint")}
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-1.5">
                                    <Typography type="h2" weight="semibold">{dueToday}</Typography>
                                    <Typography type="body-sm" color="muted">
                                        {t("flashcard.review.dueTodayLabel")}
                                    </Typography>
                                </div>
                                {/* same breakdown the overview hero shows (overdue + capped
                                    new batch) so the two surfaces read identically. */}
                                {dueReviewCount > 0 && newCount > 0 ? (
                                    <Typography type="body-xs" color="muted">
                                        {t("flashcard.due.countBreakdown", { overdue: dueReviewCount, newCapped: newCount })}
                                    </Typography>
                                ) : null}
                            </>
                        )}
                    </LabeledCard>

                    {/* ZONE 5b — "Dự báo 7 ngày tới": TÁCH thành LabeledCard riêng (thầy
                        2026-07-13 "dự báo 7 ngày tới tách labeled card ra") — 1 metric khác
                        nghĩa (outlook) = 1 card, độc lập với due-today. Chart khi có lịch,
                        else caption thật (all-zero window vẽ blank box đọc BROKEN). */}
                    <LabeledCard label={t("flashcard.review.dueForecastLabel")}>
                        {forecastData.some((point) => point.count > 0) ? (
                            <div className="h-20 w-full text-accent">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={forecastData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                                        <Tooltip
                                            cursor={{ fill: "currentColor", opacity: 0.08 }}
                                            formatter={(value) => [t("flashcard.review.statsTrendTooltip", { count: value as number }), ""]}
                                        />
                                        <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.forecastEmpty")}
                            </Typography>
                        )}
                    </LabeledCard>

                    {/* ZONE 6 — "Bộ thẻ theo ĐỘ NHỚ" (weakest first, outcome — replaces the
                        footprint byDeck). frameless: content is itself a SurfaceListCard. */}
                    {deckRetention.length > 0 ? (
                        <LabeledCard label={t("flashcard.review.deckByRetentionLabel")} frameless>
                            <SurfaceListCard>
                                {deckRetention.map((deck) => (
                                    <SurfaceListCardRow
                                        key={deck.deckId}
                                        title={deck.deckTitle}
                                        subtitle={t("flashcard.review.deckRetentionMeta", { reviewCount: deck.reviewCount })}
                                        hover="underline"
                                        onPress={() => openDeck(deck.deckId)}
                                        meta={(
                                            <Chip size="sm" variant="soft" color={retentionColorOf(deck.retention)} className="shrink-0">
                                                {t("flashcard.review.deckRetentionChip", { retention: deck.retention })}
                                            </Chip>
                                        )}
                                    />
                                ))}
                            </SurfaceListCard>
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 7 — "Thói quen" (DEMOTED, cuối trang): streak + heatmap 90d
                        + độ chín + lần cuối ôn. 1 viz hoạt-động duy nhất. */}
                    <LabeledCard label={t("flashcard.review.habitLabel")} contentClassName="flex flex-col gap-4">
                        {currentStreak > 0 || longestStreak > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
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
                        ) : null}
                        {heatmapCells.length > 0 ? (
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
                        ) : null}
                        {mastery ? (
                            <SegmentBar
                                ariaLabel={t("flashcard.stats.barAria", {
                                    mastered: mastery.mastered,
                                    learning: mastery.learning,
                                    newCount: mastery.new,
                                    total: mastery.mastered + mastery.learning + mastery.new,
                                })}
                                segments={[
                                    { key: "mastered", label: t("flashcard.stats.mastered"), value: mastery.mastered, color: "var(--success)" },
                                    { key: "learning", label: t("flashcard.stats.learning"), value: mastery.learning, color: "var(--warning)" },
                                    { key: "new", label: t("flashcard.stats.new"), value: mastery.new, color: "var(--default)" },
                                ]}
                            />
                        ) : null}
                        {lastReviewedAt ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.review.lastReviewedCaption", {
                                    date: dayjs(lastReviewedAt).format("DD/MM/YYYY HH:mm"),
                                })}
                            </Typography>
                        ) : null}
                    </LabeledCard>
                </div>
            )}
        </AsyncContent>
    )
}
