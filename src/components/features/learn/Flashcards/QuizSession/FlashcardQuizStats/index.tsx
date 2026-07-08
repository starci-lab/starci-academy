"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import { Alert, Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { queryMyFlashcardQuizStats } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-stats"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardQuizStats}. */
export interface FlashcardQuizStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate quick-quiz ("Hỏi nhanh") stats to show. */
    courseId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action). */
    onStartQuiz?: () => void
}

/**
 * "Hỏi nhanh" aggregate stats — the setup screen's "Thống kê" tab. Job of
 * this surface is DIAGNOSIS: the weakest-tag callout is the HERO (a
 * "study this" CTA deep-linked straight to the offending module/content,
 * derived from each session's own `weakTags` snapshot — no re-derivation),
 * followed by per-tag mastery (`TopicMasteryGrid`), then a headline average
 * coverage, then the coverage/XP trend sparkline, then per-deck progress.
 * Gated behind `insufficientData` (server-computed off completed QUIZ
 * sessions scanned by this same query — not lifetime review count).
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

    const weakest = stats?.weakTagLinks[0] ?? null
    const studyHref = useMemo(() => {
        const base = pathConfig().locale(locale).course(courseDisplayId).learn()
        return (weakest?.moduleId && weakest?.contentId)
            ? base.module(weakest.moduleId).content(weakest.contentId).build()
            : base.content().build()
    }, [locale, courseDisplayId, weakest?.moduleId, weakest?.contentId])

    const avgCoverage = useMemo(() => {
        const points = stats?.trend ?? []
        if (points.length === 0) {
            return 0
        }
        return Math.round(
            (points.reduce((sum, point) => sum + point.coverage, 0) / points.length) * 100,
        )
    }, [stats?.trend])

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                <div className="flex flex-col gap-6">
                    <Skeleton.Card />
                    <Skeleton.Card />
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
                    {/* hero: weakest tag → "study this" CTA, derived from each session's OWN
                        weakTags snapshot (server-side, most-recent occurrence per tag) — mirrors
                        MockInterviewStats's own weakest-phase/kind callout. */}
                    {weakest ? (
                        <Alert status="warning" className="shadow-none bg-warning/10">
                            <Alert.Content>
                                <Alert.Title>
                                    {t("flashcard.quiz.quizStatsWeakestCallout", {
                                        label: weakest.tag,
                                        coverage: Math.round(weakest.coverage * 100),
                                    })}
                                </Alert.Title>
                                <Alert.Description>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="mt-3"
                                        onPress={() => router.push(studyHref)}
                                    >
                                        {t("flashcard.quiz.quizStatsWeakCta", { label: weakest.tag })}
                                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                </Alert.Description>
                            </Alert.Content>
                        </Alert>
                    ) : null}

                    {/* by-tag mastery — pushed to the top (before the trend sparkline), the
                        existing (previously unused) TopicMasteryGrid block */}
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

                    {/* headline = average coverage across the trend window, client-computed
                        mean (mirrors how MockInterviewStats computes its own avgScore) */}
                    <SectionCard contentClassName="flex flex-col gap-2">
                        <div className="flex items-baseline gap-1.5">
                            <Typography type="h2" weight="semibold">
                                {avgCoverage}%
                            </Typography>
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.quiz.quizStatsAvgCoverageLabel")}
                            </Typography>
                        </div>
                    </SectionCard>

                    {/* trend: no canonical sparkline block exists yet (fe/components/INDEX.md
                        gap) — minimal inline bars until a 2nd usage justifies extracting one */}
                    <LabeledCard label={t("flashcard.quiz.quizStatsTrendLabel")}>
                        {stats.trend.length === 0 ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.quiz.quizStatsEmptyDescription")}
                            </Typography>
                        ) : (
                            <div className="flex items-end gap-1">
                                {stats.trend.map((point, position) => (
                                    <div key={`${point.completedAt}-${position}`} className="flex flex-1 flex-col items-center gap-1">
                                        <Typography type="body-xs" weight="medium" color="muted" className="tabular-nums">
                                            {point.xpEarned}
                                        </Typography>
                                        <div className="flex h-14 w-full items-end">
                                            <div
                                                title={`${Math.round(point.coverage * 100)}%`}
                                                style={{ height: `${Math.max(6, Math.round(point.coverage * 100))}%` }}
                                                className="w-full rounded-t bg-accent/70"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </LabeledCard>

                    {/* by-deck progress — a simple row list, mirroring FlashcardQuizHistory's rows */}
                    <LabeledCard label={t("flashcard.quiz.quizStatsByDeckLabel")}>
                        <div className="flex flex-col gap-2">
                            {stats.byDeck.length === 0 ? (
                                <Typography type="body-xs" color="muted">
                                    {t("flashcard.quiz.quizStatsEmptyDescription")}
                                </Typography>
                            ) : (
                                stats.byDeck.map((deck) => (
                                    <div
                                        key={deck.deckId}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-default bg-default px-3 py-2"
                                    >
                                        <Typography type="body-sm" weight="medium" className="min-w-0 truncate">
                                            {deck.deckTitle}
                                        </Typography>
                                        <Typography type="body-xs" color="muted" className="shrink-0">
                                            {t("flashcard.quiz.quizStatsDeckMeta", {
                                                cardsAnswered: deck.cardsAnswered,
                                                totalCards: deck.totalCards,
                                                sessionCount: deck.sessionCount,
                                            })}
                                        </Typography>
                                    </div>
                                ))
                            )}
                        </div>
                    </LabeledCard>
                </div>
            )}
        </AsyncContent>
    )
}
