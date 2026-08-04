"use client"

import React from "react"
import { useTranslations, useLocale } from "next-intl"
import { useQueryInterviewSessionAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryInterviewSessionAttemptsSwr"
import type { InterviewSessionItem } from "@/modules/api/graphql/queries/types/interview-sessions"
import {
    _InterviewSessionDetailDrawer,
    type InterviewSessionDetailDrawerAttempt,
    type InterviewSessionDetailDrawerSummary,
} from "./component"

/** Props for {@link InterviewSessionDetailDrawer}. */
export interface InterviewSessionDetailDrawerProps {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** Course the run belongs to (for the scoped query header). */
    courseId: string
    /** The run being inspected (drives the summary header); null when closed. */
    session: InterviewSessionItem | null
}

/**
 * Drawer showing the per-question detail of ONE mock-interview run — the CONNECTED half: it fetches the
 * run's attempts, formats the localized date + counts, and resolves every label (incl. per-attempt
 * interpolation), then hands them to the presentational {@link _InterviewSessionDetailDrawer}. See
 * `tiers/split.md` — the page owns the open flag + selected run.
 *
 * @param props - {@link InterviewSessionDetailDrawerProps}
 */
export const InterviewSessionDetailDrawer = ({
    isOpen,
    onOpenChange,
    courseId,
    session,
}: InterviewSessionDetailDrawerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error, mutate } = useQueryInterviewSessionAttemptsSwr(
        courseId,
        isOpen ? session?.sessionId ?? null : null,
    )

    const summary: InterviewSessionDetailDrawerSummary | null = session ? {
        dateLabel: new Date(session.startedAt).toLocaleDateString(
            locale === "vi" ? "vi-VN" : "en-US",
            { day: "numeric", month: "short", year: "numeric" },
        ),
        questionCountLabel: t("flashcard.interview.historyQuestionCount", { count: session.questionCount }),
        averageScore: session.averageScore,
        passCount: session.passCount,
        borderlineCount: session.borderlineCount,
        failCount: session.failCount,
    } : null

    const attempts: Array<InterviewSessionDetailDrawerAttempt> = (data ?? []).map((attempt, index) => ({
        id: attempt.id,
        verdict: attempt.verdict,
        scoreLabel: t("flashcard.interview.score", { score: attempt.score }),
        questionLabel: t("flashcard.interview.questionN", { n: index + 1 }),
        question: attempt.question,
        level: attempt.level ?? undefined,
        levelLabel: attempt.level ? t(`flashcard.level.${attempt.level}`) : undefined,
        tags: attempt.tags,
        strengths: attempt.strengths,
        gaps: attempt.gaps,
        modelAnswerHint: attempt.modelAnswerHint ?? undefined,
    }))

    return (
        <_InterviewSessionDetailDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && !data}
            isEmpty={Boolean(data) && (data?.length ?? 0) === 0}
            error={data ? undefined : error}
            onRetry={() => void mutate()}
            session={summary}
            attempts={attempts}
            labels={{
                detailTitle: t("flashcard.interview.detailTitle"),
                avgScore: t("flashcard.interview.avgScore").toLowerCase(),
                pass: t("flashcard.interview.pass"),
                borderline: t("flashcard.interview.borderline"),
                fail: t("flashcard.interview.fail"),
                strengths: t("flashcard.interview.strengths"),
                gaps: t("flashcard.interview.gaps"),
                hint: t("flashcard.interview.hint"),
                emptyTitle: t("flashcard.interview.detailEmpty"),
                errorTitle: t("flashcard.interview.detailError"),
                retry: t("flashcard.interview.retry"),
            }}
        />
    )
}

export default InterviewSessionDetailDrawer
