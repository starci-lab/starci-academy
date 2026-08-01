"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { queryMyFlashcardQuizStats } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-stats"
import { useAppSelector } from "@/redux/hooks"
import { _FlashcardQuizStats, COVERAGE_TARGET } from "./component"

/** Props for {@link FlashcardQuizStats}. */
export interface FlashcardQuizStatsProps {
    /** Course whose aggregate quick-quiz ("Quick quiz") stats to show. */
    courseId: string
    /** Jumps the setup tab strip back to "Start" (empty-state + coverage-gap CTA action). */
    onStartQuiz?: () => void
}

/**
 * "Quick quiz" aggregate stats — the CONNECTED half: it fetches the stats, reads the course slug,
 * resolves every label (incl. interpolation), and hands them to the presentational
 * {@link _FlashcardQuizStats}. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link FlashcardQuizStatsProps}
 */
export const FlashcardQuizStats = ({ courseId, onStartQuiz }: FlashcardQuizStatsProps) => {
    const t = useTranslations()
    // slug for the RAG "Study suggestions" deep links (this surface is course-scoped but only carries the id).
    const displayId = useAppSelector((state) => state.course.displayId)

    const statsSwr = useSWR(
        ["flashcard-quiz-stats", courseId],
        async () => {
            const response = await queryMyFlashcardQuizStats({ request: { courseId } })
            return response.data?.myFlashcardQuizStats.data ?? null
        },
    )

    const stats = statsSwr.data
    const conceptCoverage = stats?.conceptCoverage ?? null

    // ZONE 1 evidence: coverage% vs the local target — `conceptCoverage` is
    // null only when the course itself has zero tag data (guards divide-by-zero,
    // see BE contract), in which case there is nothing honest to judge.
    const coveragePercent = conceptCoverage && conceptCoverage.total > 0
        ? Math.round((conceptCoverage.covered / conceptCoverage.total) * 100)
        : null
    const untouchedTopicCount = conceptCoverage ? Math.max(0, conceptCoverage.total - conceptCoverage.covered) : 0

    // ZONE 2 evidence: every attempted tag, worst-first.
    const tags = useMemo(
        () => [...(stats?.byTag ?? [])].sort((a, b) => a.coverage - b.coverage),
        [stats?.byTag],
    )

    return (
        <_FlashcardQuizStats
            isLoading={statsSwr.isLoading && !stats}
            error={!stats ? statsSwr.error : undefined}
            onRetry={() => { void statsSwr.mutate() }}
            isEmpty={!stats || stats.insufficientData}
            coveragePercent={coveragePercent}
            untouchedTopicCount={untouchedTopicCount}
            tags={tags}
            courseId={courseId}
            displayId={displayId}
            onStartQuiz={onStartQuiz}
            labels={{
                errorTitle: t("flashcard.quiz.quizStatsError"),
                retry: t("flashcard.quiz.retry"),
                emptyTitle: t("flashcard.quiz.quizStatsEmptyTitle"),
                emptyDescription: t("flashcard.quiz.quizStatsEmptyDescription"),
                emptyAction: t("flashcard.quiz.quizHistoryEmptyAction"),
                coverageZone: t("flashcard.quiz.quizStatsCoverageVsTargetLabel"),
                coverageVerdict: t("flashcard.quiz.quizStatsCoverageSentence", {
                    coverage: coveragePercent ?? 0,
                    remaining: untouchedTopicCount,
                    total: conceptCoverage?.total ?? 0,
                }),
                coverageSub: t("flashcard.quiz.quizStatsCoverageTargetCaption", { target: COVERAGE_TARGET }),
                coverageDrillCta: t("flashcard.quiz.quizStatsCoverageDrillCta", { count: untouchedTopicCount }),
                gapZone: t("flashcard.quiz.quizStatsGapLabel"),
                topicOftenWrong: t("flashcard.quiz.quizStatsTopicOftenWrong"),
                topicNeverTried: t("flashcard.quiz.quizStatsTopicNeverTried"),
                topicEmptyChip: t("flashcard.quiz.quizStatsTopicEmptyChip"),
                studyHeading: t("flashcard.review.stats.studyHeading"),
            }}
        />
    )
}
