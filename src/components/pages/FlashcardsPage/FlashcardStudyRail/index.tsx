"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { useFlashcardNav } from "../useFlashcardNav"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { useAppSelector } from "@/redux/hooks"
import { _FlashcardStudyRail } from "./component"
import type { FlashcardStudyRailDeck } from "./component"
import type { FlashcardDeckEntity } from "@/modules/types/entities/flashcard-deck"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardStudyRail}. */
export type FlashcardStudyRailProps = WithClassNames<undefined>

/**
 * The flashcards LEFT RAIL — CONNECTED half of {@link _FlashcardStudyRail}
 * (`tiers/split.md`): fetches the course's decks, owns the mode/deck/search
 * URL state (via `useFlashcardNav`), computes `isSkeleton` from the first-load
 * formula and `isEmpty` from the resolved (sorted + filtered) decks, and
 * resolves every label — handing all of it down as already-resolved props.
 * Reads the owning course id from the store; shares the deck SWR key with the
 * page.
 *
 * @param props - {@link FlashcardStudyRailProps}
 */
export const FlashcardStudyRail = ({ className }: FlashcardStudyRailProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const { mode, deckId, session, goMode, goDeck } = useFlashcardNav()
    const [query, setQuery] = useState("")

    // the deck highlighted in the rail = the open deck (none during the due session)
    const activeDeckId = session === "due" ? null : deckId

    const { data, isLoading, error, mutate } = useSWR(
        courseId ? ["flashcard-decks-by-course", courseId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    const decks = useMemo<Array<FlashcardDeckEntity>>(() => {
        const sorted = [...(data ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex)
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return sorted
        }
        return sorted.filter((deck) =>
            `${deck.title ?? ""} ${deck.description ?? ""}`.toLowerCase().includes(normalized),
        )
    }, [data, query])

    // first load, nothing in hand → shimmer (loading-and-skeleton.md) — same condition the
    // pre-split `AsyncContent.isLoading` used.
    const isSkeleton = (isLoading || !courseId) && (data ?? []).length === 0
    // settled (after loading + search) with nothing to show
    const isEmpty = decks.length === 0
    // settled fetch error with nothing cached to fall back to
    const settledError = (data ?? []).length === 0 ? error : undefined

    const rows: Array<FlashcardStudyRailDeck> = decks.map((deck) => ({
        id: deck.id,
        title: deck.title,
        dueCount: deck.dueCount,
    }))

    return (
        <_FlashcardStudyRail
            className={className}
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            error={settledError}
            onRetry={() => { void mutate() }}
            mode={mode}
            onModeChange={goMode}
            query={query}
            onQueryChange={setQuery}
            activeDeckId={activeDeckId}
            decks={rows}
            onSelectDeck={goDeck}
            labels={{
                modeAria: t("flashcard.title"),
                modeStudy: t("flashcard.mode.study"),
                modeQuiz: t("flashcard.mode.quiz"),
                decksLabel: t("flashcard.decksLabel"),
                searchAria: t("flashcard.searchPlaceholder"),
                searchPlaceholder: t("flashcard.searchPlaceholder"),
                emptyTitle: query.trim()
                    ? t("flashcard.searchEmpty", { query: query.trim() })
                    : t("flashcard.empty"),
                errorTitle: t("flashcard.empty"),
            }}
        />
    )
}
