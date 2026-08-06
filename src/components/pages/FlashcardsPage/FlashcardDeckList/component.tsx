import { InputSearch } from "@/components/atoms/forms"
import React from "react"
import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Divider } from "@/components/atoms/display/Divider"

import { Pagination } from "@/components/atoms/navigation/Pagination"
import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import { FlashcardReviewModeModal } from "../FlashcardReviewModeModal"
import { ChallengeDifficulty } from "@/modules/types/enums/challenge-difficulty"
import { type FlashcardDeckEntity } from "@/modules/types/entities/flashcard-deck"
import type { FlashcardReviewMode } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"

/**
 * `_FlashcardDeckList` — the SRC TWIN of the presentational deck-picker. Presentational:
 * typed props, already resolved (paginated/filtered decks, interpolated labels); no
 * fetch/store/i18n (that lives in the connected `./index.tsx`, see `tiers/split.md`).
 *
 * Four states in the fixed order error → skeleton → empty → content
 * (`loading-and-skeleton.md`): `error` falls to the shared `AsyncContentError` frame,
 * settled-empty (`!isSkeleton && isEmpty`) to `AsyncContentEmpty`, and otherwise the ONE
 * real tree renders with `isSkeleton` threaded to every leaf so the shimmer mirrors the
 * loaded shape — a grid/line of placeholder deck rows, same row component, same count.
 */

/** How the deck list is laid out — a roomy card grid or a compact row list. */
export type DeckView = "grid" | "line"

/** Placeholder rows shown while the FIRST load is shimmering (mirrors the old `FlashcardDeckListSkeleton` default). */
const SKELETON_ROW_COUNT = 3

/** Chip tone per difficulty tier — a pure rendering concern, not data or i18n. */
const DIFFICULTY_TONE: Record<ChallengeDifficulty, ChipTone> = {
    [ChallengeDifficulty.Easy]: "success",
    [ChallengeDifficulty.Medium]: "warning",
    [ChallengeDifficulty.Hard]: "danger",
    [ChallengeDifficulty.Insane]: "danger",
    [ChallengeDifficulty.Expert]: "danger",
}

/** All display text, already localized by the connected `FlashcardDeckList`; per-row values arrive as small resolver functions (count/plural interpolation the block itself doesn't have the values for at label-build time). */
export interface FlashcardDeckListLabels {
    errorTitle: string
    emptyTitle: string
    searchPlaceholder: string
    /** "Found N decks" — pre-interpolated with the current filtered count. */
    foundCount: string
    /** "No deck matches \"…\"" — pre-interpolated with the current query. */
    searchEmptyMessage: string
    viewAria: string
    viewGrid: string
    viewLine: string
    /** Default CTA label — overridden per-call by `ctaLabel` when the caller passes one. */
    study: string
    difficultyLabel: (difficulty: ChallengeDifficulty) => string
    dueLabel: (count: number) => string
    masteredLabel: (mastered: number, total: number) => string
    cardCountLabel: (count: number) => string
}

/** Props for {@link _FlashcardDeckList}. */
export interface FlashcardDeckListProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero decks in the course → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats skeleton + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void
    /** Show the per-viewer spaced-repetition chrome (due chip + mastery meter). */
    showProgress?: boolean
    /** CTA label on each deck card. Falls back to `labels.study`. */
    ctaLabel?: string
    /** Decks for the CURRENT page, already search-filtered and paginated. */
    pagedDecks?: Array<FlashcardDeckEntity>
    /** Search-filtered deck count (before pagination) — drives the "found" label and the search-empty branch. */
    filteredCount?: number
    /** Live search query. */
    query: string
    onQueryChange: (value: string) => void
    /** Grid vs line layout. */
    view: DeckView
    onViewChange: (view: DeckView) => void
    /** 1-based current page. */
    page: number
    totalPages?: number
    onPageChange: (page: number) => void
    /** "Study" pressed on a deck row/card. */
    onPressStart: (deck: FlashcardDeckEntity) => void
    /** The deck whose review-mode modal is open, or `null`/omitted when closed. */
    modalDeck?: FlashcardDeckEntity | null
    onModalClose: () => void
    onModalStart: (mode: FlashcardReviewMode) => void
    /** True while the picked mode is being persisted (drives the modal's "Start" spinner). */
    isModalPending?: boolean
    labels: FlashcardDeckListLabels
}

/**
 * Lists the flashcard decks of the active course as a topic picker, shared by both the
 * study and quiz tabs. See the file header for the four-state contract and
 * `tiers/split.md` for the presentational/connected split.
 *
 * @param props - {@link FlashcardDeckListProps}
 */
export const _FlashcardDeckList = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    showProgress = true,
    ctaLabel,
    pagedDecks = [],
    filteredCount = 0,
    query,
    onQueryChange,
    view,
    onViewChange,
    page,
    totalPages = 1,
    onPageChange,
    onPressStart,
    modalDeck,
    onModalClose,
    onModalStart,
    isModalPending = false,
    labels,
}: FlashcardDeckListProps) => {
    // error beats a stale skeleton flag; empty only once settled (loading-and-skeleton.md).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={labels.emptyTitle} />
    }

    /** Difficulty chip — shared by both views. Always renders (also while shimmering, mirrors the old skeleton's fixed chip slot). */
    const difficultyChip = (deck: FlashcardDeckEntity | undefined) => (
        <Chip
            tone={deck ? DIFFICULTY_TONE[deck.difficulty] : "default"}
            isSkeleton={isSkeleton}
            text={deck ? labels.difficultyLabel(deck.difficulty) : ""}
        />
    )
    /** Due chip (per-viewer, study only) — omitted while shimmering, the real count is indeterminate until data lands. */
    const dueChip = (deck: FlashcardDeckEntity | undefined) => {
        if (isSkeleton || !showProgress || !deck?.dueCount) {
            return null
        }
        return <Chip tone="warning" text={labels.dueLabel(deck.dueCount)} />
    }
    /** The "Study" CTA — the only action on a deck row/card. */
    const cta = (deck: FlashcardDeckEntity | undefined) => (
        <Button
            variant="primary"
            size="sm"
            isSkeleton={isSkeleton}
            label={ctaLabel ?? labels.study}
            onPress={deck ? () => onPressStart(deck) : undefined}
        />
    )

    /** GRID card body: title + chips, description, mastery + divider, footer (count + CTA) — stacked. */
    const deckGridCardBody = (deck: FlashcardDeckEntity | undefined) => {
        const total = deck?.cards?.length ?? 0
        const mastered = deck?.masteredCount ?? 0
        return (
            <StackV gap={3} principle="sibling-stack" items={[
                () => (
                    <StackH gap={3} justify="between" align="start" items={[
                        () => (
                            <Typography
                                size="sm"
                                weight="medium"
                                lineClamp={2}
                                isSkeleton={isSkeleton}
                                text={deck?.title}
                                classNames={["min-w-0", "flex-1"]}
                            />
                        ),
                        () => (
                            <StackH gap={3} principle="chip-row" align="center" classNames={["shrink-0"]} items={[
                                () => dueChip(deck),
                                () => difficultyChip(deck),
                            ]} />
                        ),
                    ]} />
                ),
                // description — always shown while shimmering (mirrors the old skeleton's fixed line);
                // once loaded, only when the deck actually carries one.
                ...(isSkeleton || deck?.description ? [
                    () => (
                        <Typography size="xs" color="muted" lineClamp={2} isSkeleton={isSkeleton} text={deck?.description} />
                    ),
                ] : []),
                // per-viewer mastery — count + a plain divider (study only, never while shimmering:
                // the old skeleton never carried this row either).
                ...(!isSkeleton && showProgress && total > 0 ? [
                    () => (
                        <StackV gap={3} principle="sibling-stack" items={[
                            () => <Typography size="xs" color="muted" text={labels.masteredLabel(mastered, total)} />,
                            () => <Divider />,
                        ]} />
                    ),
                ] : []),
                () => (
                    <StackH gap={3} principle="flex-action" justify="between" align="center" items={[
                        () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.cardCountLabel(total)} />,
                        () => cta(deck),
                    ]} />
                ),
            ]} />
        )
    }

    /** LINE row body: one compact horizontal row — title, chips, mastery-or-count, CTA. */
    const deckLineRowBody = (deck: FlashcardDeckEntity | undefined) => {
        const total = deck?.cards?.length ?? 0
        const mastered = deck?.masteredCount ?? 0
        const showMastered = !isSkeleton && showProgress && total > 0
        return (
            <StackH gap={4} principle="content-row" align="center" items={[
                () => (
                    <Typography
                        size="sm"
                        weight="medium"
                        truncate
                        isSkeleton={isSkeleton}
                        text={deck?.title}
                        classNames={["min-w-0", "flex-1"]}
                    />
                ),
                () => dueChip(deck),
                () => difficultyChip(deck),
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={["shrink-0"]}
                        text={showMastered ? labels.masteredLabel(mastered, total) : labels.cardCountLabel(total)}
                    />
                ),
                () => cta(deck),
            ]} />
        )
    }

    // rows: while shimmering, placeholder rows keep the SAME row/card component and the SAME
    // count shape as the old `FlashcardDeckListSkeleton` default; otherwise the current page's decks.
    const rows: Array<FlashcardDeckEntity | undefined> = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, () => undefined)
        : pagedDecks

    const showSearchEmpty = !isSkeleton && filteredCount === 0
    const showPager = !isSkeleton && totalPages > 1

    // Peer deck cards at gap={4} (12px) — content-row owns the step-4 seam.
    const gridItems = rows.map((deck, index) => ({
        key: deck?.id ?? `pending-${index}`,
        content: () => <SurfaceCard isSkeleton={isSkeleton} body={() => deckGridCardBody(deck)} />,
    }))
    const gridView = (
        <Grid
            columns={{ base: 1, sm: 2 }}
            principle="content-row"
            items={gridItems}
        />
    )

    const lineView = (
        <SurfaceListCard bordered>
            {rows.map((deck, index) => (
                <SurfaceListCardItem key={deck?.id ?? `pending-${index}`}>
                    {deckLineRowBody(deck)}
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    )

    return (
        <>
            {/* one modal instance, driven by `modalDeck` — the picked mode + resolve-or-start
            live in the connected file (this component only renders what it's handed). */}
            {modalDeck ? (
                <FlashcardReviewModeModal
                    isOpen={Boolean(modalDeck)}
                    onClose={onModalClose}
                    deckTitle={modalDeck.title}
                    totalCount={modalDeck.cards?.length ?? 0}
                    dueCount={modalDeck.dueCount ?? 0}
                    isPending={isModalPending}
                    onStart={onModalStart}
                />
            ) : null}
            {(() => {
                // Hoisted so the outer gap-only column is not scanned as owning nested
                // justify/at from its children (check-pattern-coverage opens to `>`).
                const deckListColumnItems = [
                    () => (
                        // search row: filter input (left) + result count & view toggle (right).
                        <StackH gap={4} principle="content-row" at="sm" justify="between" align="center" items={[
                            () => (
                                <Box className="w-full @app-sm:max-w-sm">
                                    <InputSearch
                                        value={query}
                                        onValueChange={onQueryChange}
                                        isSkeleton={isSkeleton}
                                        ariaLabel={labels.searchPlaceholder}
                                        placeholder={labels.searchPlaceholder}
                                    />
                                </Box>
                            ),
                            () => (
                                <StackH gap={4} principle="flex-action" align="center" classNames={["shrink-0"]} items={[
                                    () => (
                                        <Typography
                                            size="sm"
                                            color="muted"
                                            isSkeleton={isSkeleton}
                                            text={labels.foundCount}
                                            classNames={isSkeleton ? ["w-1/4"] : undefined}
                                        />
                                    ),
                                    // grid ⇆ line layout toggle (icon-only; persistence lives in the connected file).
                                    // Chrome control over local view state, not fetched data — it does not shimmer.
                                    () => (
                                        <TabsCard
                                            variant="primary"
                                            leftTabs={{
                                                selectedKey: view,
                                                ariaLabel: labels.viewAria,
                                                onSelectionChange: (key) => onViewChange(String(key) as DeckView),
                                                items: [
                                                    {
                                                        key: "grid",
                                                        label: (
                                                            <SquaresFourIcon
                                                                className="size-5"
                                                                aria-label={labels.viewGrid}
                                                                focusable="false"
                                                            />
                                                        ),
                                                    },
                                                    {
                                                        key: "line",
                                                        label: (
                                                            <ListIcon
                                                                className="size-5"
                                                                aria-label={labels.viewLine}
                                                                focusable="false"
                                                            />
                                                        ),
                                                    },
                                                ],
                                            }}
                                        />
                                    ),
                                ]} />
                            ),
                        ]} />
                    ),
                    () => (
                        showSearchEmpty ? (
                            <Typography size="sm" color="muted" text={labels.searchEmptyMessage} />
                        ) : (
                            <StackV gap={4} items={[
                                () => (view === "grid" ? gridView : lineView),
                                ...(showPager ? [
                                    () => <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />,
                                ] : []),
                            ]} />
                        )
                    ),
                ]
                return <StackV gap={4} items={deckListColumnItems} />
            })()}
        </>
    )
}
