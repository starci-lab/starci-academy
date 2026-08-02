import React from "react"
import { CaretRightIcon, CardsIcon, MagnifyingGlassIcon, RowsIcon, SquaresFourIcon } from "@phosphor-icons/react"
import { InputSearch } from "@sb-components/atoms/forms/Input/Input"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { ProgressGauge } from "@sb-components/atoms/display/Progress/Progress"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    SurfaceCard,
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"

/**
 * `FlashcardDeckList` — the course's deck picker: search, switch between a grid
 * of tiles and a scan-friendly line list, page through results, and open any
 * deck. Four leaves: `GridView` (tiles in a responsive `Grid`), `LineView`
 * (rows in one `SurfaceCardList`), `SearchEmpty` (`AsyncContentEmpty`,
 * view-agnostic), and `Loading` (a guessed tile count through each composite's
 * mirror). Toggling `view` or `isSkeleton` on a populated list repaints the same
 * tree.
 */

/** How the deck track is currently laid out. Persisted by the caller, not a leaf-driving prop by itself (see file header). */
export type FlashcardDeckListView = "grid" | "line"

/** One deck row/tile — plain DATA; the block decides which chips and meters it earns. */
export interface FlashcardDeckListDeck {
    /** Stable id — the React key, and what `onSelectDeck` fires with. */
    id: string
    /** Deck title. */
    title: string
    /** Optional blurb. Grid: clamped to two lines. Line: the row's subtitle (falls back to a card count when absent). */
    description?: string
    /** Difficulty tier — the block builds `VariantChipDifficulty` itself. */
    difficulty: Difficulty
    /** Cards due for review right now. Omit or `0` → no due chip (see file header). */
    dueCount?: number
    /** Cards the viewer has already mastered. Paired with `totalCount` for the mastery meter. */
    masteredCount?: number
    /** Total cards in the deck. */
    totalCount: number
}

/** Props for {@link FlashcardDeckList}. */
export interface FlashcardDeckListProps {
    /** The current page's decks, in display order. */
    decks: Array<FlashcardDeckListDeck>
    /** Current search text (controlled). */
    query: string
    /** Fired on every keystroke in the search field. */
    onQueryChange: (query: string) => void
    /** Which shape the track renders as — a persisted VIEWER SETTING, not a one-off UI toggle. */
    view: FlashcardDeckListView
    /** Fired with the shape the viewer picked. */
    onViewChange: (view: FlashcardDeckListView) => void
    /** 1-based current page. */
    page: number
    /** Total page count — see the file header's "added prop" note. */
    totalPages: number
    /** Fired with the 1-based page the viewer picked. */
    onPageChange: (page: number) => void
    /** Fired with a deck's id when its tile/row is pressed. */
    onSelectDeck: (id: string) => void
    /** Overrides the default grid-tile CTA wording ("Study now"). Localization override, not domain data (mirrors `seeMoreLabel`/`removeLabel`). */
    ctaLabel?: string
    /** `true` → grid tiles and list rows also carry the per-viewer mastery meter. `false` → a plain browse surface with no progress talk. */
    showProgress: boolean
    /** `true` → the track renders its own mirror. `decks` empty while on → guesses a placeholder count in the current `view`'s shape (§12c). */
    isSkeleton?: boolean
}

/** The block's own wording for the grid-tile CTA — overridable via `ctaLabel`. */
const DEFAULT_CTA_LABEL = "Study now"

/** View-toggle tabs — icon only, labels are `sr-only` (the atom takes a `ReactNode` label, so this is within its own contract, not a hack around it). */
const VIEW_ITEMS: Array<TabItem> = [
    { key: "grid", label: <span className="sr-only">Grid view</span>, icon: SquaresFourIcon },
    { key: "line", label: <span className="sr-only">List view</span>, icon: RowsIcon },
]

/** Placeholder rows/tiles for the guessed skeleton count (§12c) — never carry a press handler. */
const skeletonDecks = (count: number): Array<FlashcardDeckListDeck> =>
    Array.from({ length: count }, (_unused, index) => ({
        id: `skeleton-${index}`,
        title: "",
        difficulty: "beginner" as Difficulty,
        totalCount: 0,
    }))

/**
 * The block's decision at a glance:
 * ─────────────────────────────────────────────────────────────────────────────
 * DECIDE → track is empty (search or fetch found nothing) → LEAF 3, everything below skipped
 *        → still no decks AND still loading           → LEAF 4, placeholder count
 *        → view === "grid"                            → LEAF 1
 *        → view === "line"                             → LEAF 2
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @param props - {@link FlashcardDeckListProps}
 */
const FlashcardDeckList = ({
    decks,
    query,
    onQueryChange,
    view,
    onViewChange,
    page,
    totalPages,
    onPageChange,
    onSelectDeck,
    ctaLabel,
    showProgress,
    isSkeleton = false,
}: FlashcardDeckListProps) => {
    // Empty while loading (no real decks yet) → guess a placeholder count in the
    // CURRENT view's shape, keeping the right footprint for when real data lands
    // (§8). Once real `decks` exist, keep the exact count already there.
    const usingPlaceholders = isSkeleton && decks.length === 0
    const source = usingPlaceholders ? skeletonDecks(view === "grid" ? 6 : 4) : decks

    // LEAF 3 — the whole track is replaced by the message; nothing below runs.
    // Reached whether `view` is grid or line, so it forks on data, not on shape.
    const isEmpty = !isSkeleton && decks.length === 0
    const hasQuery = query.trim().length > 0

    /** One grid tile's content — computed only when it will actually render (skeleton tiles never see it). */
    const deckTileBody = (deck: FlashcardDeckListDeck) => {
        const chips: Array<ComponentTypeWithSkeleton> = [
            () => <VariantChipDifficulty difficulty={deck.difficulty} />,
        ]
        if (deck.dueCount) {
            chips.push(() => <Chip tone="warning" text={`${deck.dueCount} due`} />)
        }
        const titleAndDescription = (
            <>
                <Typography size="sm" weight="medium" truncate text={deck.title} />
                {deck.description ? (
                    <Typography size="xs" color="muted" lineClamp={2} text={deck.description} />
                ) : null}
            </>
        )

        const progressRow = (
            <>
                <div className="flex-1">
                    <ProgressGauge
                        value={((deck.masteredCount ?? 0) / deck.totalCount) * 100}
                        size="sm"
                        ariaLabel={`Mastery level for the ${deck.title} deck`}

                    />
                </div>
                <Typography
                    size="xs"
                    color="muted"
                    text={`${deck.masteredCount ?? 0}/${deck.totalCount}`}

                />
            </>
        )

        const ctaRow = (
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    color="accent-soft"
                    text={ctaLabel ?? DEFAULT_CTA_LABEL}

                />
                <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4 shrink-0 text-accent-soft-foreground" />
            </>
        )

        const tileBody = (
            <>
                <StackV gap={1} isSkeleton={isSkeleton} items={[() => titleAndDescription]} />
                <Cluster gap={3} items={chips} />
                {showProgress && deck.totalCount > 0 ? (
                    <StackH gap={2} isSkeleton={isSkeleton} items={[() => progressRow]} />
                ) : null}
                <StackH gap={2} principles={["icon-text"]} justify="end" isSkeleton={isSkeleton} items={[() => ctaRow]} />
            </>
        )

        return (
            <StackV gap={3} isSkeleton={isSkeleton} items={[() => tileBody]} />
        )
    }

    const tiles: Array<GridItem> = source.map((deck) => ({
        key: deck.id,
        content: () => (
            <div>
                <SurfaceCard
                    isSkeleton={isSkeleton}
                    // Always set, even during a placeholder tile: `Base`'s skeleton-mirror
                    // branch intercepts BEFORE this ever reaches a real button (see
                    // SurfaceCard.tsx), so it's inert while `isSkeleton` is true — it only
                    // needs to be present so the merged `.Pressable` shape (not the plain
                    // `SurfaceCard` shape) is the one that renders once loading finishes.
                    onPress={() => onSelectDeck(deck.id)}
                    ariaLabel={deck.title}

                    body={() => (isSkeleton ? null : deckTileBody(deck))}
                />
            </div>
        ),
    }))

    const rows: Array<SurfaceCardListItem> = source.map((deck) => {
        const metaChips: Array<ComponentTypeWithSkeleton> = []
        if (!isSkeleton) {
            metaChips.push(() => <VariantChipDifficulty difficulty={deck.difficulty} />)
            if (deck.dueCount) {
                metaChips.push(() => <Chip tone="warning" text={`${deck.dueCount} due`} />)
            }
        }
        return {
            key: deck.id,
            leadingIcon: CardsIcon,
            title: deck.title,
            // The block owns this fallback (§14d.1): a deck with no blurb still says
            // something useful — its card count — instead of a blank second line.
            subtitle: deck.description ?? `${deck.totalCount} cards`,
            meta: metaChips.length > 0 ? () => <Cluster gap={3} items={metaChips} /> : undefined,
            trailing:
                showProgress && !isSkeleton && deck.totalCount > 0
                    ? () => <Typography size="xs" color="muted" text={`${deck.masteredCount ?? 0}/${deck.totalCount}`} />
                    : undefined,
            onPress: usingPlaceholders ? undefined : () => onSelectDeck(deck.id),
        }
    })

    const track = isEmpty ? (
        <AsyncContentEmpty
            icon={hasQuery ? MagnifyingGlassIcon : undefined}
            title={hasQuery ? `No decks match “${query}”` : "This course has no decks yet"}
            description={hasQuery ? "Try a different search term." : undefined}


        />
    ) : view === "grid" ? (
        <div>
            <Grid columns={{ base: 1, sm: 2, md: 3 }} gap={4} principles={["sibling-stack"]} items={tiles} />
        </div>
    ) : (
        <SurfaceCardList isSkeleton={isSkeleton} items={rows} />
    )

    const searchAndView = (
        <>
            <div className="min-w-0 flex-1">
                <InputSearch
                    value={query}
                    onValueChange={onQueryChange}
                    placeholder="Search decks"
                    ariaLabel="Search decks"

                />
            </div>
            <div>
                <Tabs
                    items={VIEW_ITEMS}
                    selectedKey={view}
                    onSelectionChange={(key) => onViewChange(key as FlashcardDeckListView)}
                    ariaLabel="Display style"

                />
            </div>
        </>
    )

    const listBody = (
        <>
            <StackH gap={3} principles={["flex-action"]} at="sm" isSkeleton={isSkeleton} items={[() => searchAndView]} />
            {track}
            {!isSkeleton && decks.length > 0 ? (
                <div>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
                </div>
            ) : null}
        </>
    )

    return (
        <StackV gap={4} isSkeleton={isSkeleton} items={[() => listBody]} />
    )
}

export { FlashcardDeckList }
