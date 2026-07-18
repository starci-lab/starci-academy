"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import { Button, Chip, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SurfaceListCard, SurfaceListCardRow, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { VerdictHeroCard, type VerdictHeroBand } from "@/components/blocks/stats/VerdictHeroCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { queryMyFlashcardQuizStats } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-stats"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"

/** Coverage color BY VALUE (0..100) — mirrors `FlashcardReviewStats`'s `retentionColorOf`. */
const coverageColorOf = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 70 ? "warning" : "success"

/**
 * Hero band by MEANING relative to a target (not the fixed thresholds above):
 * below target is only "danger" once it's actually low — near-target still
 * reads as progress-in-motion ("warning"), never a false "success".
 */
const coverageBandOf = (percent: number, target: number): VerdictHeroBand =>
    percent >= target ? "success" : percent < 50 ? "danger" : "warning"

/** Coverage-vs-target verdict floor (thầy chốt per proposal §C — "mục tiêu 80% để coi như nắm chắc module"). FE-only, no server field (contract). */
const COVERAGE_TARGET = 80

/** Props for {@link FlashcardQuizStats}. */
export interface FlashcardQuizStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate quick-quiz ("Hỏi nhanh") stats to show. */
    courseId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state + coverage-gap CTA action). */
    onStartQuiz?: () => void
}

/**
 * "Hỏi nhanh" aggregate stats — the setup screen's "Thống kê" tab, rút gọn per
 * `stats-canonical-fold` (1 hero + 1 zone): ZONE 1 is a `VerdictHeroCard`
 * judging COVERAGE against a target (không phải số phủ trơ); ZONE 2 ranks
 * EVERY attempted tag worst-first (`byTag`) plus one honest aggregate row for
 * topics never attempted at all (no per-topic name exists server-side for
 * those — `conceptCoverage` only carries a count, so this row states the
 * count, it doesn't invent topic identities). Gated behind `insufficientData`
 * (server-computed off completed QUIZ sessions).
 * @param props - {@link FlashcardQuizStatsProps}
 */
export const FlashcardQuizStats = ({ courseId, onStartQuiz, className }: FlashcardQuizStatsProps) => {
    const t = useTranslations()
    // slug for the RAG "Gợi ý học" deep links (this surface is course-scoped but only carries the id).
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

    // ZONE 2 evidence: every attempted tag, worst-first (replaces the old
    // single-weakest `weakTagLinks` callout with the full ranked map).
    const worstFirstTags = useMemo(
        () => [...(stats?.byTag ?? [])].sort((a, b) => a.coverage - b.coverage),
        [stats?.byTag],
    )

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                // MIRROR the loaded 2-zone tree (label + VerdictHeroCard, then label +
                // ranked SurfaceListCard) so switching INTO this sub-tab doesn't collapse
                // then jump back on resolve (thầy 2026-07-13 "tab bị giật" — skeleton must
                // mirror its layout).
                <div className="flex flex-col gap-6">
                    {/* ZONE 1 — "Độ phủ vs mục tiêu": label + verdict hero */}
                    <section className="flex flex-col gap-3">
                        <Skeleton className="h-[14px] w-40 rounded" />
                        <SectionCard>
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-9 w-20 rounded" />
                                <Skeleton className="h-[14px] w-6 rounded" />
                            </div>
                            <Skeleton.Typography type="body-sm" width="3/4" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                            <Skeleton.ProgressBar />
                            <Skeleton.Button width="w-44" />
                        </SectionCard>
                    </section>

                    {/* ZONE 2 — "Chủ đề yếu": label + ranked list (tag + coverage chip) */}
                    <section className="flex flex-col gap-3">
                        <Skeleton className="h-[14px] w-32 rounded" />
                        <SurfaceListCard>
                            {Array.from({ length: 4 }).map((_unused, index) => (
                                <SurfaceListCardItem key={index}>
                                    <div className="flex items-center justify-between gap-3">
                                        <Skeleton.Typography type="body-sm" width="1/3" />
                                        <Skeleton className="h-6 w-12 shrink-0 rounded-full" />
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </section>
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
                    {/* ZONE 1 — HERO "Độ phủ vs mục tiêu": coverage judged against
                        COVERAGE_TARGET (không phải % trơ). Null only on a course with
                        zero tag data — nothing honest to judge, so the zone is skipped
                        rather than faking a verdict. */}
                    {coveragePercent !== null ? (
                        <LabeledCard label={t("flashcard.quiz.quizStatsCoverageVsTargetLabel")} frameless>
                            <VerdictHeroCard
                                value={coveragePercent}
                                unit="%"
                                band={coverageBandOf(coveragePercent, COVERAGE_TARGET)}
                                verdict={t("flashcard.quiz.quizStatsCoverageSentence", {
                                    coverage: coveragePercent,
                                    remaining: untouchedTopicCount,
                                    total: conceptCoverage?.total ?? 0,
                                })}
                                sub={t("flashcard.quiz.quizStatsCoverageTargetCaption", { target: COVERAGE_TARGET })}
                                meter={{ value: coveragePercent, max: 100, target: COVERAGE_TARGET }}
                                action={untouchedTopicCount > 0 && onStartQuiz ? (
                                    <Button variant="primary" size="sm" onPress={onStartQuiz}>
                                        {t("flashcard.quiz.quizStatsCoverageDrillCta", { count: untouchedTopicCount })}
                                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                ) : undefined}
                            />
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 2 — "Chủ đề yếu": every attempted tag ranked worst-first
                        (reuses `quizStatsGapLabel`, freed up by the hero move above),
                        plus ONE honest aggregate row for topics never attempted — no
                        per-topic name exists for those server-side, so the row states
                        the real count instead of inventing topic identities. */}
                    {worstFirstTags.length > 0 || untouchedTopicCount > 0 ? (
                        <LabeledCard label={t("flashcard.quiz.quizStatsGapLabel")} frameless>
                            <SurfaceListCard>
                                {worstFirstTags.map((tagStat, index) => {
                                    const percent = Math.round(tagStat.coverage * 100)
                                    return (
                                        <SurfaceListCardRow
                                            key={tagStat.tag}
                                            title={tagStat.tag}
                                            // only flag the single worst tag — the rest of the
                                            // ranked list already speaks for itself via the chip
                                            subtitle={index === 0 && percent < 70
                                                ? t("flashcard.quiz.quizStatsTopicOftenWrong")
                                                : undefined}
                                            meta={(
                                                <Chip size="sm" variant="soft" color={coverageColorOf(percent)} className="shrink-0">
                                                    {percent}%
                                                </Chip>
                                            )}
                                        />
                                    )
                                })}
                                {untouchedTopicCount > 0 ? (
                                    <SurfaceListCardRow
                                        title={t("flashcard.quiz.quizStatsTopicNeverTried")}
                                        meta={(
                                            <Chip size="sm" variant="soft" className="shrink-0">
                                                {untouchedTopicCount} {t("flashcard.quiz.quizStatsTopicEmptyChip")}
                                            </Chip>
                                        )}
                                    />
                                ) : null}
                            </SurfaceListCard>
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 3 — passive RAG "Gợi ý học": weakest-coverage tags → course-wide
                        content search (self-hiding when empty / no match). Same end-of-surface
                        study payoff as `FlashcardReviewStats`; waits on the slug for deep links. */}
                    {displayId ? (
                        <RelatedContentList
                            courseId={courseId}
                            courseDisplayId={displayId}
                            query={worstFirstTags.map((tagStat) => tagStat.tag).join(" ")}
                            label={t("flashcard.review.stats.studyHeading")}
                        />
                    ) : null}

                </div>
            )}
        </AsyncContent>
    )
}
