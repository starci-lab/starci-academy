"use client"

import React from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { DUE_REVIEW_LIMIT } from "../constants"
import { useStartFlashcardDueReviewSession } from "../useStartFlashcardDueReviewSession"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyInProgressFlashcardDueReviewSessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyInProgressFlashcardDueReviewSessionSwr"
import { pathConfig } from "@/resources/path"
import { _DueReviewHero } from "./component"

/**
 * The flashcards home hero: the spaced-repetition queue. Shows how many cards are due today
 * across every enrolled course and offers the page's PRIMARY action — starting a review
 * session. When nothing is due it collapses to a caught-up empty state. This is the
 * CONNECTED half — it fetches the due queue (and the resumable cross-deck run) directly from
 * the shared `myDueFlashcards` SWR key, resolves every label, and hands them to the
 * presentational {@link _DueReviewHero}. See `tiers/split.md`.
 *
 * Takes no props: the previous `className` was never used by its one call site
 * (`Flashcards/index.tsx`, `<DueReviewHero />`) and a block hands out no `className` escape
 * hatch once it composes entirely through frames (`ContinueCard`'s own doc makes the same
 * call) — see `apiChanged` in this migration's report.
 */
export const DueReviewHero = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // scope the due queue to THIS course (the count must reflect this course's
    // decks, not every deck system-wide); shared SWR key with {@link DueReview}.
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const displayId = useAppSelector((state) => state.course.displayId)

    const { data, error, mutate } = useSWR(
        ["my-due-flashcards", courseId ?? null, DUE_REVIEW_LIMIT],
        async () => {
            const response = await queryMyDueFlashcards({ request: { courseId, limit: DUE_REVIEW_LIMIT } })
            return response.data?.myDueFlashcards.data ?? null
        },
    )

    // eager resolve-or-start right from the CTA (per the teacher's note, 2026-07-11:
    // "pressing the learn button should show isPending right on that button, reviewing
    // 55 cards is also isPending, and once the session is created it routes into the
    // same page as quick-learn") — the button stays
    // ON this screen, pending, until a real sessionId comes back; no more
    // instant navigation to the bare `?session=due` shim + full-page skeleton.
    const { start: startDueReview, starting } = useStartFlashcardDueReviewSession(courseId)
    const handlePressStart = async () => {
        if (!displayId) {
            return
        }
        const cardIds = (data?.cards ?? []).map((dueCard) => dueCard.cardId)
        const sessionId = await startDueReview(cardIds)
        if (sessionId) {
            router.push(pathConfig().locale(locale).course(displayId).learn().flashcards().due(sessionId).build())
        }
    }

    // resumable cross-deck "Due today" run — mirrors QuizSession's own "Zone 0" resume
    // card. Renders like the mock-interview resume card (per the teacher's note, 2026-07-17:
    // "render exactly like Mock Interview"): a progress meter (`value`), NO clock watermark —
    // the `card {current}/{total}` progress carries "in progress".
    const resumeSwr = useQueryMyInProgressFlashcardDueReviewSessionSwr(courseId)
    const resumeData = resumeSwr.data

    const dueCount = data?.dueCount ?? 0
    const dueReviewCount = data?.dueReviewCount ?? 0
    const newCount = data?.newCount ?? 0

    return (
        <_DueReviewHero
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            isEmpty={dueCount === 0}
            error={error}
            onRetry={() => { void mutate() }}
            starting={starting}
            onPressStart={() => { void handlePressStart() }}
            resume={resumeData && displayId ? {
                title: t("flashcard.due.resumeTitle"),
                subtitle: t("flashcard.due.resumeSubtitle", {
                    current: resumeData.currentIndex + 1,
                    total: resumeData.cardIds.length,
                }),
                value: resumeData.currentIndex + 1,
                max: resumeData.cardIds.length,
                ctaLabel: t("flashcard.due.resumeCta"),
                onPress: () => router.push(
                    pathConfig().locale(locale).course(displayId).learn().flashcards().due(resumeData.sessionId).build(),
                ),
            } : undefined}
            labels={{
                sectionLabel: t("flashcard.due.label"),
                // NOTE: reuses the "no flashcards for this course" copy for the error title —
                // carried over verbatim from the pre-migration code, which had no dedicated
                // `flashcard.due.error` key either; not this migration's call to fix.
                errorTitle: t("flashcard.empty"),
                allCaughtTitle: t("flashcard.due.allCaught"),
                allCaughtHint: t("flashcard.due.allCaughtHint"),
                count: t("flashcard.due.count", { count: dueCount }),
                countBreakdown: dueReviewCount > 0 && newCount > 0
                    ? t("flashcard.due.countBreakdown", { overdue: dueReviewCount, newCapped: newCount })
                    : undefined,
                start: t("flashcard.due.start", { count: dueCount }),
            }}
        />
    )
}
