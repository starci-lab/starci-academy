"use client"

import React, { useMemo, useState } from "react"
import { Input, TextField, Typography, cn } from "@heroui/react"
import { SquaresFourIcon, ListIcon } from "@phosphor-icons/react"
import { AsyncContent } from "../../async/AsyncContent/AsyncContent"
import { TabsCard } from "../../navigation/TabsCard/TabsCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { AnatomyOverlay } from "../../layout/AnatomyOverlay/AnatomyOverlay"
import { DeckCard, type DeckCardProps } from "../DeckCard/DeckCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK port of the flashcard-deck browse REGION
 * rendered by `@/components/features/learn/Flashcards/FlashcardDeckList`. A BLOCK
 * = a real layout region (not a lone item): search + result-count + grid/line
 * toggle + the deck grid, wrapped in `AsyncContent` so loading / empty / error /
 * search-empty are all real states. Composes the `DeckCard` item + `AsyncContent`
 * + `TabsCard` primitives — NOT a hand-rolled one-off. Authored in Storybook (not
 * `src`); synced back later. NO `@/components` imports.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One deck row the list renders — the {@link DeckCard} data minus its handler. */
export interface FlashcardDeckListDeck
    extends Pick<DeckCardProps, "title" | "description" | "difficulty" | "dueCount" | "masteredCount" | "cardCount"> {
    /** Stable id (list key + open payload). */
    id: string
}

/** Grid ⇆ line view of the deck list (persisted by the real feature). */
export type DeckView = "grid" | "line"

/** Props for the {@link FlashcardDeckList} block. */
export interface FlashcardDeckListProps {
    /** The decks to render (already fetched by the caller). */
    decks: Array<FlashcardDeckListDeck>
    /** SWR loading — the block shows the skeleton grid while true AND no decks yet. */
    isLoading?: boolean
    /** SWR error — the block shows the error state while set AND no decks. */
    error?: unknown
    /** Retry handler for the empty/error states. */
    onRetry?: () => void
    /** Fired with a deck id when its "Học" CTA is pressed. */
    onOpenDeck: (id: string) => void
    /** Whether to show per-viewer mastery on each card (study vs quiz mode). */
    showProgress?: boolean
    /** Seed the search box (demo/deep-link). */
    defaultQuery?: string
    /**
     * `true` → ANATOMY overlay: each composed part self-annotates with an ABSOLUTE
     * tier-tagged {@link AnatomyOverlay} (no layout change). `showAnatomy` cascades
     * down to the composed DeckCard / TabsCard / AsyncContent. Dev/spec only.
     */
    showAnatomy?: boolean
    /** Extra classes on the block wrapper. */
    className?: string
}

/** How many skeleton deck cards the loading grid renders. */
const SKELETON_COUNT = 4

/**
 * FlashcardDeckList — the deck-browse region. Owns the search filter, the
 * result-count, the grid/line view toggle, and the `AsyncContent` state machine
 * (loading → empty → error → content, plus its own search-empty branch). The
 * grid maps each deck onto a {@link DeckCard}; loading maps onto skeleton
 * DeckCards so the frame never shifts.
 *
 * @param props - {@link FlashcardDeckListProps}
 */
export const FlashcardDeckList = ({
    decks,
    isLoading = false,
    error,
    onRetry,
    onOpenDeck,
    showProgress = true,
    defaultQuery = "",
    showAnatomy = false,
    className,
}: FlashcardDeckListProps) => {
    const [query, setQuery] = useState(defaultQuery)
    const [view, setView] = useState<DeckView>("grid")

    // case-insensitive filter over title + description
    const filteredDecks = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) {
            return decks
        }
        return decks.filter((d) =>
            (d.title + " " + (d.description ?? "")).toLowerCase().includes(q))
    }, [decks, query])

    const skeletonGrid = (
        <div className="grid grid-cols-1 gap-3 @app-sm:grid-cols-2">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <DeckCard
                    key={index}
                    isSkeleton
                    title=""
                    difficulty="intermediate"
                    cardCount={0}
                    onOpen={() => {}}
                    showAnatomy={showAnatomy}
                />
            ))}
        </div>
    )

    // The list body: search-empty message OR the grid/line of decks. The muted
    // line is a Typography FlashcardDeckList renders directly (inside AsyncContent's
    // content branch), so it still gets its own anatomy tag.
    const listBody = filteredDecks.length === 0 ? (
        <Typography
            type="body-sm"
            color="muted"
            data-anat-part={showAnatomy ? "Typography" : undefined}
        >
            {`Không tìm thấy bộ thẻ nào khớp "${query.trim()}".`}
        </Typography>
    ) : (
        <div className={cn(
            view === "grid" ? "grid grid-cols-1 gap-3 @app-sm:grid-cols-2" : "flex flex-col gap-3",
        )}
        >
            {filteredDecks.map((deck) => (
                <DeckCard
                    key={deck.id}
                    title={deck.title}
                    description={deck.description}
                    difficulty={deck.difficulty}
                    dueCount={deck.dueCount}
                    masteredCount={deck.masteredCount}
                    cardCount={deck.cardCount}
                    showProgress={showProgress}
                    onOpen={() => onOpenDeck(deck.id)}
                    showAnatomy={showAnatomy}
                />
            ))}
        </div>
    )

    return (
        <div
            className={cn("flex flex-col gap-3", showAnatomy && "relative", className)}
            data-anat={showAnatomy ? "" : undefined}
        >
            {showAnatomy ? <AnatomyOverlay label="FlashcardDeckList" tier="block" href="/?path=/docs/block-learn-flashcarddecklist--docs" /> : null}
            {/* SEARCH ROW — region chrome; ALWAYS visible, only the LIST swaps state. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <TextField
                    className="w-full @app-sm:max-w-sm"
                    data-anat-part={showAnatomy ? "TextField · Input" : undefined}
                >
                    <Input
                        type="search"
                        aria-label="Tìm bộ flashcard"
                        placeholder="Tìm bộ flashcard..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </TextField>
                <div className="flex shrink-0 items-center gap-3">
                    {isLoading && decks.length === 0 ? (
                        <Skeleton.Typography
                            type="body-sm"
                            width="w-24"
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : (
                        // Result-count Typography FlashcardDeckList renders directly —
                        // tagged like the loading Skeleton.Typography it mirrors above.
                        <Typography
                            type="body-sm"
                            color="muted"
                            data-anat-part={showAnatomy ? "Typography" : undefined}
                        >
                            {`Tìm thấy ${filteredDecks.length} bộ thẻ`}
                        </Typography>
                    )}
                    <TabsCard
                        variant="primary"
                        showAnatomy={showAnatomy}
                        leftTabs={{
                            selectedKey: view,
                            ariaLabel: "Kiểu hiển thị",
                            onSelectionChange: (key) => setView(String(key) as DeckView),
                            items: [
                                { key: "grid", label: <SquaresFourIcon className="size-5" aria-label="Lưới" focusable="false" /> },
                                { key: "line", label: <ListIcon className="size-5" aria-label="Danh sách" focusable="false" /> },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* LIST — the loading / empty / error / search-empty / data state machine. */}
            <AsyncContent
                isLoading={isLoading && decks.length === 0}
                skeleton={skeletonGrid}
                isEmpty={decks.length === 0}
                emptyContent={{ title: "Chưa có bộ thẻ nào", showAnatomy }}
                error={decks.length === 0 ? error : undefined}
                errorContent={{ title: "Không tải được bộ thẻ", onRetry, showAnatomy }}
                showAnatomy={showAnatomy}
            >
                {listBody}
            </AsyncContent>
        </div>
    )
}
