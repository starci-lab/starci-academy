"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon, TargetIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
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
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { queryMyFlashcardQuizStats } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-stats"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import type { QueryFlashcardQuizWeakTagLink } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-stats"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Coverage color BY VALUE (0..100) — mirrors `FlashcardReviewStats`'s `retentionColorOf`. */
const coverageColorOf = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 70 ? "warning" : "success"

/** Props for {@link FlashcardQuizStats}. */
export interface FlashcardQuizStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate quick-quiz ("Hỏi nhanh") stats to show. */
    courseId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action). */
    onStartQuiz?: () => void
}

/**
 * "Hỏi nhanh" aggregate stats — the setup screen's "Thống kê" tab. Job of this
 * surface is DIAGNOSIS of knowledge gaps (thầy 2026-07-13 "thống kê vô nghĩa
 * quá, render lại" — the quiz analogue of the review-stats OUTCOME redesign,
 * but its hero is TOPIC/CARD gaps to LEARN, not memory-decay): ZONE 1 HERO
 * ranks EVERY weak tag (`weakTagLinks`, not just the single worst) as a "study
 * this" list + CTA deep-linked to the offending module/content; ZONE 2 the
 * hardest CARDS (`hardCards`, lowest per-card coverage — the quiz leech); then
 * per-tag mastery, the coverage trend (real `recharts` line over `completedAt`
 * + an "N phiên" tile), and per-deck footprint. Gated behind `insufficientData`
 * (server-computed off completed QUIZ sessions).
 * @param props - {@link FlashcardQuizStatsProps}
 */
export const FlashcardQuizStats = ({ courseId, onStartQuiz, className }: FlashcardQuizStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const statsSwr = useSWR(
        ["flashcard-quiz-stats", courseId],
        async () => {
            const response = await queryMyFlashcardQuizStats({ request: { courseId } })
            return response.data?.myFlashcardQuizStats.data ?? null
        },
    )

    const stats = statsSwr.data

    // OUTCOME aggregates (thầy 2026-07-13 "render lại" — dẫn bằng lỗ hổng)
    const weakTagLinks = stats?.weakTagLinks ?? []
    const hardCards = stats?.hardCards ?? []
    const completedSessionCount = stats?.completedSessionCount ?? 0
    const weakest = weakTagLinks[0] ?? null

    /** Deep-link a weak tag back to its source module/content (the "học lại" action). */
    const studyHrefOf = (link: QueryFlashcardQuizWeakTagLink) => {
        const base = pathConfig().locale(locale).course(courseDisplayId).learn()
        return (link.moduleId && link.contentId)
            ? base.module(link.moduleId).content(link.contentId).build()
            : base.content().build()
    }
    /** Open a deck's reviewer (onward action for a hard card / deck row). */
    const openDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(courseDisplayId).learn().flashcards().review(deckId).build(),
    )

    const avgCoverage = useMemo(() => {
        const points = stats?.trend ?? []
        if (points.length === 0) {
            return 0
        }
        return Math.round(
            (points.reduce((sum, point) => sum + point.coverage, 0) / points.length) * 100,
        )
    }, [stats?.trend])

    // short "DD/MM" tick label per day (same date-axis treatment the review-stats
    // retention line uses); `completedAt` is an ISO timestamp.
    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }),
        [locale],
    )
    const trendData = useMemo(
        () => (stats?.trend ?? []).map((point) => ({
            day: dateFormatter.format(new Date(point.completedAt)),
            coverage: Math.round(point.coverage * 100),
        })),
        [stats?.trend, dateFormatter],
    )

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                // MIRROR the loaded 5-zone height (hero + hard-cards + mastery + trend
                // + by-deck) so switching INTO this sub-tab doesn't collapse to a short
                // 2-card block then jump back tall on resolve (thầy 2026-07-13 "tab bị
                // giật" — skeleton must mirror its layout, `starci-fe-skeleton-apply`).
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-44 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-36 w-full rounded-xl" />
                </div>
            )}
            error={!stats ? statsSwr.error : undefined}
            errorContent={{
                title: t("flashcard.quiz.quizStatsError"),
                onRetry: () => { void statsSwr.mutate() },
                retryLabel: t("flashcard.quiz.retry"),
            }}
        >
            {!stats || stats.insufficientData ? (
                <EmptyState
                    icon={<ChartLineUpIcon aria-hidden focusable="false" />}
                    title={t("flashcard.quiz.quizStatsEmptyTitle")}
                    description={t("flashcard.quiz.quizStatsEmptyDescription")}
                    action={onStartQuiz ? (
                        <Button size="sm" variant="secondary" onPress={onStartQuiz}>
                            {t("flashcard.quiz.quizHistoryEmptyAction")}
                        </Button>
                    ) : undefined}
                />
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* ZONE 1 — HERO "Lỗ hổng cần lấp": EVERY weak tag ranked (not just
                        the single worst — the whole `weakTagLinks` list is now surfaced),
                        each row + the CTA deep-link into the offending lesson to LEARN it
                        (fair-monetization nudge). When there's no gap, a HONEST positive
                        callout instead (không bịa lỗ hổng). */}
                    {weakest ? (
                        <LabeledCard
                            label={t("flashcard.quiz.quizStatsGapLabel")}
                            icon={<TargetIcon className="size-5 text-danger" aria-hidden focusable="false" />}
                            contentClassName="flex flex-col gap-3"
                        >
                            <SurfaceListCard>
                                {weakTagLinks.map((link) => {
                                    const coverage = Math.round(link.coverage * 100)
                                    return (
                                        <SurfaceListCardRow
                                            key={link.tag}
                                            title={link.tag}
                                            hover="underline"
                                            onPress={() => router.push(studyHrefOf(link))}
                                            meta={(
                                                <Chip size="sm" variant="soft" color={coverageColorOf(coverage)} className="shrink-0">
                                                    {coverage}%
                                                </Chip>
                                            )}
                                        />
                                    )
                                })}
                            </SurfaceListCard>
                            <Button
                                variant="primary"
                                size="sm"
                                className="self-start"
                                onPress={() => router.push(studyHrefOf(weakest))}
                            >
                                {t("flashcard.quiz.quizStatsWeakCta", { label: weakest.tag })}
                                <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                            </Button>
                        </LabeledCard>
                    ) : (
                        <LabeledCard
                            label={t("flashcard.quiz.quizStatsGapLabel")}
                            contentClassName="flex items-center gap-3"
                        >
                            <TargetIcon className="size-7 shrink-0 text-success" aria-hidden focusable="false" />
                            <div className="flex flex-col">
                                <Typography type="body-sm" weight="medium">
                                    {t("flashcard.quiz.quizStatsNoGapTitle")}
                                </Typography>
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.quiz.quizStatsNoGapHint")}
                                </Typography>
                            </div>
                        </LabeledCard>
                    )}

                    {/* ZONE 2 — "Câu hay sai": the hardest CARDS (lowest per-card
                        coverage, the quiz analogue of a review leech). Row → open that
                        card's deck reviewer. Only shown when there's one to fix. */}
                    {hardCards.length > 0 ? (
                        <LabeledCard label={t("flashcard.quiz.quizStatsHardCardsLabel")} frameless>
                            <SurfaceListCard>
                                {hardCards.map((card) => (
                                    <SurfaceListCardRow
                                        key={card.cardId}
                                        title={card.question}
                                        subtitle={card.deckTitle}
                                        hover="underline"
                                        onPress={() => openDeck(card.deckId)}
                                        meta={(
                                            <Chip size="sm" variant="soft" color="warning" className="shrink-0">
                                                <WarningCircleIcon className="size-3.5" aria-hidden focusable="false" />
                                                {t("flashcard.quiz.quizStatsHardCardMeta", {
                                                    wrongCount: card.wrongCount,
                                                    attempts: card.attempts,
                                                })}
                                            </Chip>
                                        )}
                                    />
                                ))}
                            </SurfaceListCard>
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 3 — "Theo chủ đề" mastery grid (kept as-is). */}
                    <LabeledCard label={t("flashcard.quiz.quizStatsByTagLabel")}>
                        {stats.byTag.length === 0 ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.quiz.quizStatsEmptyDescription")}
                            </Typography>
                        ) : (
                            <TopicMasteryGrid
                                ariaLabel={t("flashcard.quiz.quizStatsByTagLabel")}
                                topics={stats.byTag.map((tag) => ({
                                    key: tag.tag,
                                    label: tag.tag,
                                    solved: Math.round(tag.coverage * 100),
                                }))}
                            />
                        )}
                    </LabeledCard>

                    {/* ZONE 4 — "Độ phủ theo thời gian": a real recharts line over
                        `completedAt` (replaces the hand-rolled axis-less bars) + a raw
                        "N phiên" + avg-coverage tile. */}
                    <LabeledCard label={t("flashcard.quiz.quizStatsTrendLabel")} contentClassName="flex flex-col gap-3">
                        <div className="flex items-baseline gap-4">
                            <div className="flex items-baseline gap-2">
                                <Typography type="h2" weight="semibold">{avgCoverage}%</Typography>
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.quiz.quizStatsAvgCoverageLabel")}
                                </Typography>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <Typography type="h2" weight="semibold">{completedSessionCount}</Typography>
                                <Typography type="body-sm" color="muted">
                                    {t("flashcard.quiz.quizStatsSessionCountLabel")}
                                </Typography>
                            </div>
                        </div>
                        {trendData.length > 1 ? (
                            <div className="h-28 w-full text-accent">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-divider" vertical={false} />
                                        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                                        <Tooltip
                                            cursor={{ stroke: "currentColor", opacity: 0.2 }}
                                            formatter={(value) => [`${value as number}%`, ""]}
                                        />
                                        <Line dataKey="coverage" stroke="currentColor" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : null}
                    </LabeledCard>

                    {/* ZONE 5 — "Theo bộ thẻ" footprint as a clickable list (đổi
                        div-viền-tay → SurfaceListCard, đồng bộ review-stats). */}
                    {stats.byDeck.length > 0 ? (
                        <LabeledCard label={t("flashcard.quiz.quizStatsByDeckLabel")} frameless>
                            <SurfaceListCard>
                                {stats.byDeck.map((deck) => (
                                    <SurfaceListCardRow
                                        key={deck.deckId}
                                        title={deck.deckTitle}
                                        subtitle={t("flashcard.quiz.quizStatsDeckMeta", {
                                            cardsAnswered: deck.cardsAnswered,
                                            totalCards: deck.totalCards,
                                            sessionCount: deck.sessionCount,
                                        })}
                                        hover="underline"
                                        onPress={() => openDeck(deck.deckId)}
                                    />
                                ))}
                            </SurfaceListCard>
                        </LabeledCard>
                    ) : null}
                </div>
            )}
        </AsyncContent>
    )
}
