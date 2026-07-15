"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import {
    Button,
    Card,
    Chip,
    Input,
    Pagination,
    Separator,
    TextField,
    Typography,
} from "@heroui/react"
import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { FlashcardDeckListSkeleton } from "./FlashcardDeckListSkeleton"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { ChallengeDifficulty } from "@/modules/types/enums/challenge-difficulty"
import { type FlashcardDeckEntity } from "@/modules/types/entities/flashcard-deck"
import { type WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { useStartFlashcardReviewSession } from "../useStartFlashcardReviewSession"
import { FlashcardReviewModeModal } from "../FlashcardReviewModeModal"
import type { FlashcardReviewMode } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"

/** Decks shown per page in the topic list before the pager kicks in. */
const DECKS_PER_PAGE = 10

/** How the deck list is laid out — a roomy card grid or a compact row list. */
type DeckView = "grid" | "line"

/** localStorage key persisting the chosen deck view across sessions. */
const VIEW_STORAGE_KEY = "starci.flashcard.deckView"

/** HeroUI Chip color per difficulty tier. */
const DIFFICULTY_COLOR: Record<ChallengeDifficulty, "success" | "warning" | "danger"> = {
    [ChallengeDifficulty.Easy]: "success",
    [ChallengeDifficulty.Medium]: "warning",
    [ChallengeDifficulty.Hard]: "danger",
    [ChallengeDifficulty.Insane]: "danger",
    [ChallengeDifficulty.Expert]: "danger",
}

/** Props for {@link FlashcardDeckList}. */
export interface FlashcardDeckListProps extends WithClassNames<undefined> {
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
 * by both the study and quiz tabs. Renders the decks either as a roomy card
 * GRID (default — keeps the topic description) or a compact LINE list (one row
 * per deck), toggled by a view switch and persisted across sessions. Each deck
 * shows its difficulty + card count and (in study mode) the viewer's due chip +
 * a thin mastery bar; the CTA label and SR chrome are caller-controlled so the
 * same list drives "Study" and "Quiz". Reads the owning course id from the
 * course Redux slice; data states go through {@link AsyncContent}.
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
    // eager resolve-or-start (thầy 2026-07-11: "bấm vô học thì isPending ở cái
    // nút học ... tạo xong session xong là router push vào trang tương tự với
    // học nhanh") — only meaningful in the study ("Học thẻ") context; a
    // hypothetical future reuse with `showProgress={false}` (picking a deck for
    // something OTHER than a review session) falls back to `onSelectDeck`.
    const { start: startReview, startingDeckId } = useStartFlashcardReviewSession(courseId)
    // deck whose review-mode modal is open (thầy 2026-07-13: "Học" mở modal chọn
    // full/quên trước khi vào), null = closed. Held as the whole deck so the modal
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
    const pageNumbers = Array.from({ length: totalPages }, (_unused, index) => index + 1)

    /** Difficulty chip — shared by both views. */
    const difficultyChip = (deck: FlashcardDeckEntity) => (
        <Chip size="sm" variant="soft" color={DIFFICULTY_COLOR[deck.difficulty]}>
            {t(`flashcard.difficulty.${deck.difficulty}`)}
        </Chip>
    )
    /** Due chip (per-viewer, study only) — shared by both views. */
    const dueChip = (deck: FlashcardDeckEntity) =>
        showProgress && deck.dueCount ? (
            <Chip size="sm" variant="soft" color="warning">
                {t("flashcard.deck.due", { count: deck.dueCount })}
            </Chip>
        ) : null
    /** "Học" pressed → open the mode modal (study context), or fall straight
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
     *  gated behind the modal's "Bắt đầu"). */
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
    /** The "Học" CTA — the only action on a deck (card itself is not pressable). */
    const cta = (deck: FlashcardDeckEntity) => (
        <Button
            size="sm"
            variant="primary"
            className="shrink-0"
            onPress={() => onPressStart(deck)}
        >
            {ctaLabel ?? t("flashcard.study")}
        </Button>
    )

    return (
        <>
            {/* one modal instance, driven by `modeDeck` — the picked mode + resolve-or-start
            live here (the CTA no longer starts directly). */}
            {modeDeck ? (
                <FlashcardReviewModeModal
                    isOpen={Boolean(modeDeck)}
                    onClose={() => { if (startingDeckId !== modeDeck.id) setModeDeck(null) }}
                    deckTitle={modeDeck.title}
                    totalCount={modeDeck.cards?.length ?? 0}
                    dueCount={modeDeck.dueCount ?? 0}
                    isPending={startingDeckId === modeDeck.id}
                    onStart={(mode) => { void onStartWithMode(mode) }}
                />
            ) : null}
            <AsyncContent
                isLoading={(isLoading || !courseId) && decks.length === 0}
                skeleton={<FlashcardDeckListSkeleton />}
                isEmpty={decks.length === 0}
                emptyContent={{ title: t("flashcard.empty") }}
                error={decks.length === 0 ? error : undefined}
                errorContent={{
                    title: t("flashcard.empty"),
                    onRetry: () => { void mutate() },
                }}
            >
                <div className="flex flex-col gap-3">
                    {/* search row: filter input (left) + result count & view toggle (right).
                    The input sits on the page background → no variant (clean bg-field). */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <TextField className="w-full sm:max-w-sm">
                            <Input
                                type="search"
                                aria-label={t("flashcard.searchPlaceholder")}
                                placeholder={t("flashcard.searchPlaceholder")}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </TextField>
                        <div className="flex shrink-0 items-center gap-3">
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.deck.found", { count: filteredDecks.length })}
                            </Typography>
                            {/* grid ⇆ line layout toggle (icon-only; persisted) */}
                            <TabsCard
                                variant="primary"
                                leftTabs={{
                                    selectedKey: view,
                                    ariaLabel: t("flashcard.deck.viewAria"),
                                    onSelectionChange: (key) => onChangeView(String(key) as DeckView),
                                    items: [
                                        {
                                            key: "grid",
                                            label: (
                                                <SquaresFourIcon
                                                    className="size-5"
                                                    aria-label={t("flashcard.deck.viewGrid")}
                                                    focusable="false"
                                                />
                                            ),
                                        },
                                        {
                                            key: "line",
                                            label: (
                                                <ListIcon
                                                    className="size-5"
                                                    aria-label={t("flashcard.deck.viewLine")}
                                                    focusable="false"
                                                />
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {filteredDecks.length === 0 ? (
                        <Typography type="body-sm" color="muted">
                            {t("flashcard.searchEmpty", { query: query.trim() })}
                        </Typography>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {view === "grid" ? (
                            /* GRID — roomy cards in a responsive grid; keeps the description. */
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {pagedDecks.map((deck: FlashcardDeckEntity) => {
                                        const total = deck.cards?.length ?? 0
                                        const mastered = deck.masteredCount ?? 0
                                        return (
                                            <Card key={deck.id}>
                                                <div className="flex h-full flex-col gap-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <Typography type="body-sm" weight="medium" className="line-clamp-2">
                                                            {deck.title}
                                                        </Typography>
                                                        <div className="flex shrink-0 items-center gap-2">
                                                            {dueChip(deck)}
                                                            {difficultyChip(deck)}
                                                        </div>
                                                    </div>
                                                    {deck.description ? (
                                                        <Typography type="body-xs" color="muted" className="line-clamp-2">
                                                            {deck.description}
                                                        </Typography>
                                                    ) : null}
                                                    {/* per-viewer mastery — count + a plain divider (study only) */}
                                                    {showProgress && total > 0 ? (
                                                        <div className="mt-auto flex flex-col gap-2">
                                                            <Typography type="body-xs" color="muted">
                                                                {t("flashcard.deck.mastered", { mastered, total })}
                                                            </Typography>
                                                            <Separator />
                                                        </div>
                                                    ) : null}
                                                    <div className="flex items-center justify-between gap-2 pt-1">
                                                        <Typography type="body-xs" color="muted">
                                                            {t("flashcard.cardCount", { count: total })}
                                                        </Typography>
                                                        {cta(deck)}
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            ) : (
                            /* LINE — one compact row per deck (title + chips + mastery + CTA),
                            joined into a single SurfaceListCard (bordered — this list sits
                            nested under the search row/AsyncContent, not a bare top-level
                            surface). Rows are static (own CTA button drives the action, not
                            the row itself) — SurfaceListCardItem with no onPress/href. */
                                <SurfaceListCard bordered>
                                    {pagedDecks.map((deck: FlashcardDeckEntity) => {
                                        const total = deck.cards?.length ?? 0
                                        const mastered = deck.masteredCount ?? 0
                                        return (
                                            <SurfaceListCardItem key={deck.id}>
                                                <div className="flex items-center gap-3">
                                                    <Typography type="body-sm" weight="medium" className="min-w-0 flex-1 truncate">
                                                        {deck.title}
                                                    </Typography>
                                                    {dueChip(deck)}
                                                    {difficultyChip(deck)}
                                                    {showProgress && total > 0 ? (
                                                        <Typography type="body-xs" color="muted" className="shrink-0">
                                                            {t("flashcard.deck.mastered", { mastered, total })}
                                                        </Typography>
                                                    ) : (
                                                        <Typography type="body-xs" color="muted" className="shrink-0">
                                                            {t("flashcard.cardCount", { count: total })}
                                                        </Typography>
                                                    )}
                                                    {cta(deck)}
                                                </div>
                                            </SurfaceListCardItem>
                                        )
                                    })}
                                </SurfaceListCard>
                            )}

                            {/* pager: left-aligned with the cards, hidden on a single page.
                            HeroUI Pagination bakes no hover/cursor → add per the rule. */}
                            {totalPages > 1 ? (
                                <Pagination
                                    aria-label={t("common.pagination.navAria")}
                                    className="justify-start"
                                    size="sm"
                                >
                                    <Pagination.Content className="flex flex-wrap justify-start gap-2">
                                        <Pagination.Item>
                                            <Pagination.Previous
                                                aria-label={t("common.pagination.previous")}
                                                isDisabled={page <= 1}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                                onPress={() => setPage((current) => Math.max(1, current - 1))}
                                            >
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        {pageNumbers.map((pageNumber) => (
                                            <Pagination.Item key={pageNumber}>
                                                <Pagination.Link
                                                    isActive={pageNumber === page}
                                                    className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                                    onPress={() => setPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Item>
                                            <Pagination.Next
                                                aria-label={t("common.pagination.next")}
                                                isDisabled={page >= totalPages}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                                onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                            >
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            ) : null}
                        </div>
                    )}
                </div>
            </AsyncContent>
        </>
    )
}
