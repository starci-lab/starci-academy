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
import { Cluster, type ClusterItem } from "@sb-components/frames/Cluster/Cluster"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FlashcardDeckList`: the course's DECK PICKER — search a deck, switch
 * between a grid of tiles and a scan-friendly line list, and jump into any deck
 * from either shape. Shared by the plain browse surface and the SR (spaced
 * repetition) study entry point — this block carries no SR CHROME itself, it
 * just needs to be truthful about which decks have cards due, which is why
 * `dueCount` and `showProgress` exist at all.
 *
 * REUSE, NOT A REBUILD (the exact trap `ContentModeNav`'s header warns about).
 * No existing composite bundles "search a repeating list + toggle its shape +
 * page it" — `ModuleLessonList`/`ModuleChallengeList` are both a single
 * `SurfaceCardList`, nothing else. So THIS block is assembled from primitives
 * that already own each piece:
 *   • `InputSearch` (atom)                — the query field, verbatim.
 *   • `Tabs` (atom), icon-only             — same atom `FlashcardModeSwitch` and
 *     `ContentModeNav` use for a mode row; here the two "modes" are view shapes.
 *   • `SurfaceCard` (composite)   — one deck tile, GRID view.
 *   • `SurfaceCardList` (composite)        — the bounded row list, LINE view.
 *   • `VariantChipDifficulty` (design)     — the difficulty chip, unchanged.
 *   • `Chip` (atom)                        — the due-count chip (`tone="warning"`).
 *   • `Pagination` (atom)                  — the page nav, verbatim.
 *   • `ProgressGauge` (atom)               — the per-viewer mastery meter.
 *   • `Grid` (frame)                       — the responsive tile track.
 * None of these get reshaped; this block only decides WHICH ones fire for a
 * given deck and WHAT their numbers mean.
 *
 * ⭐ ADDED PROP NOT IN THE ORIGINAL BRIEF — `totalPages`. `Pagination` (§4:
 * STRICT props) needs both `currentPage` AND `totalPages` to clamp itself and
 * decide when to collapse into an ellipsis; there is no way to build a real
 * pager without knowing how many pages exist. `decks` is only the CURRENT
 * page's slice (search/pagination happen server-side), so the count can't be
 * derived from `decks.length`. Documented here rather than silently invented.
 *
 * LEAF BY STRUCTURE (§14d.2), four of them:
 *   1. Grid view    — tiles (`SurfaceCard`) inside a `Grid`.
 *   2. Line view    — rows inside one bounded `SurfaceCardList`.
 *   3. Search empty — the whole track is REPLACED by `AsyncContentEmpty`; no
 *      grid, no list, just the message. Happens whether `view` is grid or line,
 *      so it doesn't fork by view — it forks by `decks.length === 0`.
 *   4. Loading      — `decks` is still empty and `isSkeleton` is on: a guessed
 *      row/tile count renders through the SAME shape the real data will use,
 *      each tile/row its own composite's built-in mirror.
 *   `view` toggling between an already-populated grid/list, and `isSkeleton`
 *   firing while `decks` is already non-empty (a background refetch), are
 *   STATES of the leaves above, not new leaves — nothing DISAPPEARS, the same
 *   tree just repaints.
 *
 * ⭐ JUDGEMENT CALL — the search field and the view toggle are NEVER
 * skeletonised, same reasoning as `ContentModeNav`/`FlashcardModeSwitch`: both
 * controls are usable before any deck has loaded (typing a query, or picking a
 * shape, doesn't depend on the list already being there), so they stay live
 * chrome across every leaf.
 *
 * ⭐ JUDGEMENT CALL — a GRID tile's accessible name is the deck TITLE alone
 * (`label` passed explicitly), not "whatever text is inside the card". Without
 * it, `SurfaceCard` reads its own visible text as the name, which
 * would include the difficulty word, the due count, the mastery fraction and
 * the CTA label in one run-on sentence per tile. Naming the tile after the
 * title only keeps the announcement to what a card actually IS.
 *
 * ⭐ JUDGEMENT CALL — the CTA at the foot of a grid tile ("Học ngay" by default,
 * `ctaLabel`) is DECORATIVE text, not a second interactive element. The whole
 * tile is already one press target (`onSelectDeck`); nesting a real `<button>`
 * inside `SurfaceCard`'s own `<button>` is illegal HTML, and the
 * `actions` escape hatch on `SurfaceCard` exists for controls that act
 * INDEPENDENTLY of the card press — "start studying" is exactly what pressing
 * the card already does, so it rides as a plain label + caret instead.
 *
 * ⛔ A DUE COUNT OF ZERO NEVER SHOWS A CHIP — same rule `ContentModeNav`'s
 * count suffix follows: a "0 due" chip claims something is waiting when
 * nothing is. `dueCount` omitted or `0` ⇒ no chip at all.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Overrides the default grid-tile CTA wording ("Học ngay"). Localization override, not domain data (mirrors `seeMoreLabel`/`removeLabel`). */
    ctaLabel?: string
    /** `true` → grid tiles and list rows also carry the per-viewer mastery meter. `false` → a plain browse surface with no progress talk. */
    showProgress: boolean
    /** `true` → the track renders its own mirror. `decks` empty while on → guesses a placeholder count in the current `view`'s shape (§12c). */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The block's own wording for the grid-tile CTA — overridable via `ctaLabel`. */
const DEFAULT_CTA_LABEL = "Học ngay"

/** View-toggle tabs — icon only, labels are `sr-only` (the atom takes a `ReactNode` label, so this is within its own contract, not a hack around it). */
const VIEW_ITEMS: Array<TabItem> = [
    { key: "grid", label: <span className="sr-only">Dạng lưới</span>, icon: SquaresFourIcon },
    { key: "line", label: <span className="sr-only">Dạng danh sách</span>, icon: RowsIcon },
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
    showAnatomy = false,
    anatPart,
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
        const chips: Array<ClusterItem> = [
            {
                key: "difficulty",
                content: <VariantChipDifficulty difficulty={deck.difficulty} anatPart={showAnatomy ? "VariantChipDifficulty" : undefined} />,
            },
        ]
        if (deck.dueCount) {
            chips.push({
                key: "due",
                content: <Chip tone="warning" text={`${deck.dueCount} đến hạn`} anatPart={showAnatomy ? "Chip" : undefined} />,
            })
        }
        return (
            <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography size="sm" weight="medium" truncate text={deck.title} anatPart={showAnatomy ? "Typography" : undefined} />
                    {deck.description ? (
                        <Typography size="xs" color="muted" lineClamp={2} text={deck.description} anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : null}
                </StackV>
                <Cluster gap="related" items={chips} anatPart={showAnatomy ? "Cluster" : undefined} />
                {showProgress && deck.totalCount > 0 ? (
                    <StackH gap="tight" anatPart={showAnatomy ? "StackH" : undefined}>
                        <div className="flex-1" data-anat-part={showAnatomy ? "ProgressGauge" : undefined}>
                            <ProgressGauge
                                value={((deck.masteredCount ?? 0) / deck.totalCount) * 100}
                                size="sm"
                                ariaLabel={`Mức độ thuộc bộ thẻ ${deck.title}`}
                                showAnatomy={showAnatomy}
                            />
                        </div>
                        <Typography
                            size="xs"
                            color="muted"
                            text={`${deck.masteredCount ?? 0}/${deck.totalCount}`}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    </StackH>
                ) : null}
                <StackH gap="tight" justify="end" anatPart={showAnatomy ? "StackH" : undefined}>
                    <Typography
                        size="sm"
                        weight="medium"
                        color="accent-soft"
                        text={ctaLabel ?? DEFAULT_CTA_LABEL}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4 shrink-0 text-accent-soft-foreground" />
                </StackH>
            </StackV>
        )
    }

    const tiles: Array<GridItem> = source.map((deck) => ({
        key: deck.id,
        content: (
            <div data-anat-part={showAnatomy ? "SurfaceCard" : undefined}>
                <SurfaceCard
                    isSkeleton={isSkeleton}
                    // Always set, even during a placeholder tile: `Base`'s skeleton-mirror
                    // branch intercepts BEFORE this ever reaches a real button (see
                    // SurfaceCard.tsx), so it's inert while `isSkeleton` is true — it only
                    // needs to be present so the merged `.Pressable` shape (not the plain
                    // `SurfaceCard` shape) is the one that renders once loading finishes.
                    onPress={() => onSelectDeck(deck.id)}
                    ariaLabel={deck.title}
                    showAnatomy={showAnatomy}
                >
                    {isSkeleton ? null : deckTileBody(deck)}
                </SurfaceCard>
            </div>
        ),
    }))

    const rows: Array<SurfaceCardListItem> = source.map((deck) => {
        const metaChips: Array<ClusterItem> = []
        if (!isSkeleton) {
            metaChips.push({
                key: "difficulty",
                content: <VariantChipDifficulty difficulty={deck.difficulty} anatPart={showAnatomy ? "VariantChipDifficulty" : undefined} />,
            })
            if (deck.dueCount) {
                metaChips.push({
                    key: "due",
                    content: <Chip tone="warning" text={`${deck.dueCount} đến hạn`} anatPart={showAnatomy ? "Chip" : undefined} />,
                })
            }
        }
        return {
            key: deck.id,
            leadingIcon: CardsIcon,
            title: deck.title,
            // The block owns this fallback (§14d.1): a deck with no blurb still says
            // something useful — its card count — instead of a blank second line.
            subtitle: deck.description ?? `${deck.totalCount} thẻ`,
            meta: metaChips.length > 0 ? <Cluster gap="related" items={metaChips} anatPart={showAnatomy ? "Cluster" : undefined} /> : undefined,
            trailing:
                showProgress && !isSkeleton && deck.totalCount > 0 ? (
                    <Typography size="xs" color="muted" text={`${deck.masteredCount ?? 0}/${deck.totalCount}`} anatPart={showAnatomy ? "Typography" : undefined} />
                ) : undefined,
            onPress: usingPlaceholders ? undefined : () => onSelectDeck(deck.id),
        }
    })

    const track = isEmpty ? (
        <AsyncContentEmpty
            icon={hasQuery ? MagnifyingGlassIcon : undefined}
            title={hasQuery ? `Không tìm thấy bộ thẻ nào khớp “${query}”` : "Chưa có bộ thẻ nào trong khoá học này"}
            description={hasQuery ? "Thử một từ khoá khác." : undefined}
            anatPart={showAnatomy ? "AsyncContentEmpty" : undefined}
            showAnatomy={showAnatomy}
        />
    ) : view === "grid" ? (
        <div data-anat-part={showAnatomy ? "Grid" : undefined}>
            <Grid columns={{ base: 1, sm: 2, md: 3 }} gap="grouped" items={tiles} showAnatomy={showAnatomy} />
        </div>
    ) : (
        <SurfaceCardList anatPart={showAnatomy ? "SurfaceCardList" : undefined} isSkeleton={isSkeleton} items={rows} />
    )

    return (
        <StackV gap="grouped" anatPart={anatPart}>
            <StackH gap="related" wrap anatPart={showAnatomy ? "StackH" : undefined}>
                <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "InputSearch" : undefined}>
                    <InputSearch
                        value={query}
                        onValueChange={onQueryChange}
                        placeholder="Tìm bộ thẻ"
                        ariaLabel="Tìm bộ thẻ"
                        showAnatomy={showAnatomy}
                    />
                </div>
                <div data-anat-part={showAnatomy ? "Tabs" : undefined}>
                    <Tabs
                        items={VIEW_ITEMS}
                        selectedKey={view}
                        onSelectionChange={(key) => onViewChange(key as FlashcardDeckListView)}
                        ariaLabel="Kiểu hiển thị"
                        showAnatomy={showAnatomy}
                    />
                </div>
            </StackH>
            {track}
            {!isSkeleton && decks.length > 0 ? (
                <div data-anat-part={showAnatomy ? "Pagination" : undefined}>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showAnatomy={showAnatomy} />
                </div>
            ) : null}
        </StackV>
    )
}

export { FlashcardDeckList }
