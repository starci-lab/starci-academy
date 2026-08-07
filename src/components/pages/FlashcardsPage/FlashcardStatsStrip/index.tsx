"use client"

import React from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { DUE_REVIEW_LIMIT } from "../constants"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { queryMyDueFlashcards } from "@/modules/api/graphql/queries/query-my-due-flashcards"
import { queryMyFlashcardStats } from "@/modules/api/graphql/queries/query-my-flashcard-stats"
import { useAppSelector } from "@/redux/hooks"
import { _FlashcardStatsStrip } from "./component"

/** Connected flashcards home progress block — no public props. */
export const FlashcardStatsStrip = () => {
    const t = useTranslations()
    // scope mastery + new-backlog to THIS course (shared keys with the siblings)
    const courseId = useAppSelector((state) => state.course.entity?.id)

    // streak / retention / lifetime reviews
    const stats = useSWR(["my-flashcard-stats"], async () => {
        const response = await queryMyFlashcardStats({})
        return response.data?.myFlashcardStats.data ?? null
    })
    // decks → mastered + total cards (same key as FlashcardDeckList → cache shared)
    const decks = useSWR(
        courseId ? ["flashcard-decks-by-course", courseId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )
    // new (never-reviewed) backlog (same key as DueReviewHero → cache shared)
    const due = useSWR(
        ["my-due-flashcards", courseId ?? null, DUE_REVIEW_LIMIT],
        async () => {
            const response = await queryMyDueFlashcards({
                request: { courseId, limit: DUE_REVIEW_LIMIT },
            })
            return response.data?.myDueFlashcards.data ?? null
        },
    )

    // mastery split across the course's decks (all derived from existing data)
    const deckList = decks.data ?? []
    const total = deckList.reduce((sum, deck) => sum + (deck.cards?.length ?? 0), 0)
    const mastered = deckList.reduce((sum, deck) => sum + (deck.masteredCount ?? 0), 0)
    const newCount = Math.min(due.data?.newTotalCount ?? 0, total)
    const learning = Math.max(0, total - mastered - newCount)

    const streak = stats.data?.currentStreak ?? 0
    const retention = stats.data?.retentionRate ?? 0
    const totalReviewed = stats.data?.totalReviewed ?? 0
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0

    // still hydrating when no facet has resolved yet
    const isSkeleton =
        (stats.isLoading || decks.isLoading || due.isLoading) &&
        !stats.data && !decks.data && !due.data

    return (
        <_FlashcardStatsStrip
            isSkeleton={isSkeleton}
            // nothing to show only when the course has no cards at all
            isEmpty={total === 0}
            // only the deck-list fetch is watched here (unchanged from the legacy call)
            error={decks.error}
            onRetry={() => { void decks.mutate() }}
            mastered={mastered}
            total={total}
            learning={learning}
            newCount={newCount}
            streak={streak}
            totalReviewed={totalReviewed}
            labels={{
                label: t("flashcard.stats.label"),
                errorTitle: t("flashcard.empty"),
                masteredLine: `${t("flashcard.stats.masteredLine", { mastered, total })} · ${percent}%`,
                streakChip: t("flashcard.stats.streakChip", { count: streak }),
                barAria: t("flashcard.stats.barAria", { mastered, learning, newCount, total }),
                mastered: t("flashcard.stats.mastered"),
                learning: t("flashcard.stats.learning"),
                new: t("flashcard.stats.new"),
                retentionCaption: t("flashcard.stats.retentionCaption", { percent: retention }),
                firstReviewHint: t("flashcard.stats.firstReviewHint"),
            }}
        />
    )
}
