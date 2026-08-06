"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { _FlashcardDeckList, type DeckView } from "./component"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { type FlashcardDeckEntity } from "@/modules/types/entities/flashcard-deck"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { useStartFlashcardReviewSession } from "../useStartFlashcardReviewSession"
import type { FlashcardReviewMode } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"

/** Decks shown per page in the topic list before the pager kicks in. */
const DECKS_PER_PAGE = 10

/** localStorage key persisting the chosen deck view across sessions. */
const VIEW_STORAGE_KEY = "starci.flashcard.deckView"

/** Props for {@link FlashcardDeckList}. */
export interface FlashcardDeckListProps {
    /** Called with the chosen deck id when the learner opens a deck. */
    onSelectDeck: (deckId: string) => void
    /** CTA label on each deck card. Defaults to the study label. */
    ctaLabel?: string
    /** Show the per-viewer spaced-repetition chrome (due chip + mastery meter).
     * The quiz tab passes `false` — SR state is irrelevant when picking a
     * topic to drill aloud. Defaults to `true`. */
    showProgress?: boolean
}

/**
 * Lists the flashcard decks owned by the active course as a topic picker, shared
 * by both the study and quiz tabs — the CONNECTED half: it fetches the decks,
 * owns the search/pager/view UI state, resolves every label, and hands them to
 * the presentational {@link _FlashcardDeckList}. See `tiers/split.md`.
 *
 * @param props - {@link FlashcardDeckListProps}
 */
export const FlashcardDeckList = ({
    onSelectDeck,
    ctaLabel,
    showProgress = true,
}: FlashcardDeckListProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // read the owning course id from the store — no prop drilling needed
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    // eager resolve-or-start (teacher 2026-07-11: "pressing Study should show
    // isPending on the study button itself ... once the session is created,
    // router push into the same page as quick study") — only meaningful in the study ("Study cards") context; a
    // hypothetical future reuse with `showProgress={false}` (picking a deck for
    // something OTHER than a review session) falls back to `onSelectDeck`.
    const { start: startReview, startingDeckId } = useStartFlashcardReviewSession(courseId)
    // deck whose review-mode modal is open (teacher 2026-07-13: "Study" opens a modal to choose
    // full/forgotten-only before entering), null = closed. Held as the whole deck so the modal
    // reads its title + total + dueCount without a re-fetch.
    const [modeDeck, setModeDeck] = useState<FlashcardDeckEntity | null>(null)
    // live search query filtering decks by title/description
    const [query, setQuery] = useState("")
    // 1-based page for the client-side deck pager
    const [page, setPage] = useState(1)
    // grid (default) vs line layout; hydrated from localStorage after mount (SSR-safe)
    const [view, setView] = useState<DeckView>("grid")
    useEffect(() => {
        const saved = window.localStorage.getItem(VIEW_STORAGE_KEY)
        if (saved === "grid" || saved === "line") {
            setView(saved)
        }
    }, [])
    const onChangeView = useCallback((next: DeckView) => {
        setView(next)
        try {
            window.localStorage.setItem(VIEW_STORAGE_KEY, next)
        } catch {
            // storage unavailable (private mode) — view simply won't persist
        }
    }, [])

    // fetch the decks for this course; null key suspends until the course hydrates
    const { data, isLoading, error, mutate } = useSWR(
        courseId ? ["flashcard-decks-by-course", courseId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    const decks = data ?? []

    // decks in display order, narrowed by the (case-insensitive) search query
    const filteredDecks = useMemo(() => {
        const sorted = [...decks].sort((prev, next) => prev.sortIndex - next.sortIndex)
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return sorted
        }
        return sorted.filter((deck) => {
            const haystack = `${deck.title ?? ""} ${deck.description ?? ""}`.toLowerCase()
            return haystack.includes(normalized)
        })
    }, [decks, query])

    // paginate the filtered decks client-side
    const totalPages = Math.max(1, Math.ceil(filteredDecks.length / DECKS_PER_PAGE))
    // a new search shrinks the list — snap back to the first page
    useEffect(() => {
        setPage(1)
    }, [query])
    const pagedDecks = filteredDecks.slice((page - 1) * DECKS_PER_PAGE, page * DECKS_PER_PAGE)

    /** "Study" pressed → open the mode modal (study context), or fall straight
     *  through to `onSelectDeck` for a non-study reuse (`showProgress={false}`). */
    const onPressStart = useCallback(
        (deck: FlashcardDeckEntity) => {
            if (!showProgress || !displayId) {
                onSelectDeck(deck.id)
                return
            }
            setModeDeck(deck)
        },
        [showProgress, displayId, onSelectDeck],
    )
    /** Chosen a mode in the modal → resolve-or-start with that scope, then
     *  `router.push` into the live session (mirrors the old eager idiom, now
     *  gated behind the modal's "Start"). */
    const onStartWithMode = useCallback(
        async (mode: FlashcardReviewMode) => {
            if (!modeDeck || !displayId) {
                return
            }
            const cardIds = (modeDeck.cards ?? []).map((deckCard) => deckCard.id)
            const sessionId = await startReview(modeDeck.id, cardIds, mode)
            if (sessionId) {
                setModeDeck(null)
                router.push(
                    pathConfig().locale(locale).course(displayId).learn().flashcards().due(sessionId).build(),
                )
            }
        },
        [modeDeck, displayId, startReview, router, locale],
    )
    /** Modal close — blocked while ITS OWN deck is mid-start (mirrors the old inline check). */
    const onModalClose = useCallback(() => {
        if (!modeDeck || startingDeckId !== modeDeck.id) {
            setModeDeck(null)
        }
    }, [modeDeck, startingDeckId])

    return (
        <_FlashcardDeckList
            // first load, nothing in hand → shimmer (loading-and-skeleton.md); same formula as before
            isSkeleton={(isLoading || !courseId) && decks.length === 0}
            isEmpty={decks.length === 0}
            // only a settled fetch error (no cached decks to fall back on) reaches the block
            error={decks.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            showProgress={showProgress}
            ctaLabel={ctaLabel}
            pagedDecks={pagedDecks}
            filteredCount={filteredDecks.length}
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={onChangeView}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onPressStart={onPressStart}
            modalDeck={modeDeck}
            onModalClose={onModalClose}
            onModalStart={(mode) => { void onStartWithMode(mode) }}
            isModalPending={modeDeck != null && startingDeckId === modeDeck.id}
            labels={{
                errorTitle: t("flashcard.empty"),
                emptyTitle: t("flashcard.empty"),
                searchPlaceholder: t("flashcard.searchPlaceholder"),
                foundCount: t("flashcard.deck.found", { count: filteredDecks.length }),
                searchEmptyMessage: t("flashcard.searchEmpty", { query: query.trim() }),
                viewAria: t("flashcard.deck.viewAria"),
                viewGrid: t("flashcard.deck.viewGrid"),
                viewLine: t("flashcard.deck.viewLine"),
                study: t("flashcard.study"),
                difficultyLabel: (difficulty) => t(`flashcard.difficulty.${difficulty}`),
                dueLabel: (count) => t("flashcard.deck.due", { count }),
                masteredLabel: (mastered, total) => t("flashcard.deck.mastered", { mastered, total }),
                cardCountLabel: (count) => t("flashcard.cardCount", { count }),
            }}
        />
    )
}
