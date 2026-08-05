"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
    _FlashcardSessionStats,
    GRADE_ROW_DEFS,
    type FlashcardSessionStatsGradeRow,
    type FlashcardSessionStatsWeakTag,
} from "./component"
import { useQueryMyFlashcardReviewSessionStatsBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionStatsBySessionIdSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"

/** Props for {@link FlashcardSessionStats}. */
export interface FlashcardSessionStatsProps {
    /** The finished (or in-progress) review session to recap. */
    sessionId: string
    /** Owning course id (uuid) — enrollment-guard header + RAG search scope. */
    courseId: string
    /** Owning course slug — needed to build deep links from the study list. */
    courseDisplayId: string
    /** Returns to the flashcards study overview (the single onward path — no dead end). */
    onBack: () => void
}

/**
 * The end-of-session STATS surface for a "Study cards" review run — the CONNECTED half: fetches
 * the session's stats + its context (which kind of run this was), computes `isSkeleton` from the
 * first-load formula and `isEmpty` from the resolved data, and resolves every label (including
 * per-row interpolation) before handing them to the presentational {@link _FlashcardSessionStats}.
 * See `tiers/split.md`.
 *
 * @param props - {@link FlashcardSessionStatsProps}
 */
export const FlashcardSessionStats = ({
    sessionId,
    courseId,
    courseDisplayId,
    onBack,
}: FlashcardSessionStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const statsSwr = useQueryMyFlashcardReviewSessionStatsBySessionIdSwr(sessionId, courseId)
    const stats = statsSwr.data
    // which kind of run this was (single deck vs cross-deck "Due") + the deck identity when
    // applicable — resolved purely from the sessionId (teacher 2026-07-13: "re-render which review
    // session it was, due or deck"), same query the LIVE session already uses to pick its chrome.
    const sessionContextSwr = useQueryMyFlashcardReviewSessionBySessionIdSwr(sessionId, courseId)
    const sessionContext = sessionContextSwr.data

    // next-due date — short "DD Mon" per locale; "—" when nothing scheduled.
    const dueDateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }),
        [locale],
    )

    // seconds → a compact localized duration ("45 seconds" / "6 minutes"); em-dash when unknown.
    const formatDuration = (seconds: number | null): string => {
        if (seconds === null || seconds <= 0) {
            return "—"
        }
        return seconds < 60
            ? t("flashcard.review.stats.durationSeconds", { count: seconds })
            : t("flashcard.review.stats.durationMinutes", { count: Math.round(seconds / 60) })
    }

    // which run this was, folded straight into the TITLE text (not a separate chip — teacher
    // 2026-07-13: "that kind of label, drop the chip") — falls back to the generic caption while
    // resolving/absent (legacy session with no matching row).
    const headerCaption = !sessionContext
        ? t("flashcard.review.stats.headerCaption")
        : sessionContext.kind === "due"
            ? t("flashcard.review.stats.headerCaptionDue")
            : sessionContext.deckTitle
                ? t("flashcard.review.stats.headerCaptionDeck", { deckTitle: sessionContext.deckTitle })
                : t("flashcard.review.stats.headerCaption")

    // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
    const isSkeleton = statsSwr.isLoading && !stats
    // settled with no honest per-grade breakdown: not found/not owned, or a legacy (pre-sessionId)
    // count-only session — a bare, honest fallback with the onward path, never an error.
    const gradeCounts = stats?.gradeCounts
    const gradeTotal = gradeCounts ? gradeCounts.again + gradeCounts.hard + gradeCounts.good + gradeCounts.easy : 0
    const isEmpty = !stats || gradeTotal === 0
    const fallbackCount = stats?.reviewedCount ?? 0

    const gradeRows: Array<FlashcardSessionStatsGradeRow> = GRADE_ROW_DEFS.map((def) => {
        const count = gradeCounts ? gradeCounts[def.key] : 0
        const percent = gradeTotal > 0 ? Math.round((count / gradeTotal) * 100) : 0
        return {
            key: def.key,
            color: def.color,
            label: t(def.labelKey),
            count,
            countPercentLabel: t("flashcard.review.stats.gradeCountPercent", { count, percent }),
        }
    })

    // subtle secondary rollup — never replaces the 4 grades above
    const solid = gradeCounts ? gradeCounts.good + gradeCounts.easy : 0
    const needsWork = gradeCounts ? gradeCounts.again + gradeCounts.hard : 0

    // most-forgotten tags — grouped from grade-0 cards
    const weakTags: Array<FlashcardSessionStatsWeakTag> = (stats?.weakTags ?? []).map((weak) => ({
        tag: weak.tag,
        forgotLabel: t("flashcard.review.stats.forgotCount", { count: weak.forgotCount }),
    }))
    // weak-tag terms drive the RAG "study this" query — the learner types nothing.
    const relatedQuery = (stats?.weakTags ?? []).map((weak) => weak.tag).join(" ")

    return (
        <_FlashcardSessionStats
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={!stats ? statsSwr.error : undefined}
            onRetry={() => { void statsSwr.mutate() }}
            onBack={onBack}
            gradeRows={gradeRows}
            gradeTotal={gradeTotal}
            metricTotalValue={String(fallbackCount)}
            metricDurationValue={formatDuration(stats?.durationSeconds ?? null)}
            metricNextDueValue={stats?.nextDueAt ? dueDateFormatter.format(new Date(stats.nextDueAt)) : "—"}
            metricXpValue={t("flashcard.review.stats.xpValue", { count: stats?.xpEarned ?? 0 })}
            weakTags={weakTags}
            courseId={courseId}
            courseDisplayId={courseDisplayId}
            relatedQuery={relatedQuery}
            labels={{
                backLabel: t("flashcard.title"),
                headerTitle: headerCaption,
                headerDescription: t("flashcard.review.stats.heroSubtitle"),
                errorTitle: t("flashcard.review.statsError"),
                retryLabel: t("flashcard.review.stats.retry"),
                emptyTitle: t("flashcard.review.stats.fallbackTitle", { count: fallbackCount }),
                emptyDescription: t("flashcard.review.stats.fallbackNote"),
                backToReviewLabel: t("flashcard.review.stats.backToReview"),
                rollupLabel: t("flashcard.review.stats.rollup", { solid, needsWork }),
                metricsLabel: t("flashcard.review.stats.metricsLabel"),
                metricTotalLabel: t("flashcard.review.stats.metricTotal"),
                metricDurationLabel: t("flashcard.review.stats.metricDuration"),
                metricNextDueLabel: t("flashcard.review.stats.metricNextDue"),
                metricXpLabel: t("flashcard.review.stats.metricXp"),
                weakTagsHeading: t("flashcard.review.stats.weakTagsHeading"),
                studyHeading: t("flashcard.review.stats.studyHeading"),
            }}
        />
    )
}
