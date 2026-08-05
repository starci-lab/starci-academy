import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { FlashcardDeckList, type FlashcardDeckListDeck, type FlashcardDeckListView } from "@sb-components/starci/blocks/learn/FlashcardDeckList/FlashcardDeckList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FlashcardDeckList` — the course's deck picker: search, switch between a grid
 * of tiles and a scan-friendly line list, page through results, and open any
 * deck. Four leaves: `GridView` (tiles in a responsive `Grid`), `LineView`
 * (rows in one `SurfaceCardList`), `SearchEmpty` (`AsyncContentEmpty`,
 * view-agnostic), and `Loading` (a guessed tile count through each composite's
 * mirror). Toggling `view` or `isSkeleton` on a populated list repaints the same
 * tree.
 */
const meta: Meta<typeof FlashcardDeckList> = {
    title: "StarCi/Blocks/Learn/FlashcardDeckList/FlashcardDeckList",
    component: FlashcardDeckList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardDeckList>

const DECKS: Array<FlashcardDeckListDeck> = [
    {
        id: "docker-basics",
        title: "Docker basics",
        description: "Images, containers, volumes — the groundwork before Compose.",
        difficulty: "beginner",
        dueCount: 6,
        masteredCount: 14,
        totalCount: 40,
    },
    {
        id: "dockerfile-optimize",
        title: "Optimizing Dockerfiles",
        description: "Layer caching, multi-stage builds, shrinking image size.",
        difficulty: "intermediate",
        masteredCount: 8,
        totalCount: 25,
    },
    {
        id: "compose-networking",
        title: "Compose & Networking",
        difficulty: "advanced",
        dueCount: 2,
        masteredCount: 3,
        totalCount: 30,
    },
    {
        id: "k8s-scheduling",
        title: "Advanced K8s scheduling",
        description: "Affinity, taint/toleration, resource request/limit.",
        difficulty: "insane",
        masteredCount: 0,
        totalCount: 18,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the toolbar row, the deck track and the pager, one seam owning all three", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal row — either the search+toggle toolbar, or the two lines inside a grid tile (title cluster, mastery row, CTA row)", storyId: "frames-stack-stackh--default" },
    "InputSearch": { tier: "atom", role: "the query field — chrome that stays live across every leaf, including loading (see file header)", storyId: "atoms-forms-input-inputsearch--default" },
    "Tabs": { tier: "atom", role: "the icon-only grid/line view toggle, the same data-driven tab-strip atom `FlashcardModeSwitch`/`ContentModeNav` use", storyId: "atoms-navigation-tabs-tabs--default" },
    "Grid": { tier: "frame", role: "the responsive tile track for the grid leaf, reflowing 1→2→3 columns by container width", storyId: "frames-grid-grid--default" },
    "SurfaceCard": { tier: "composite", role: "one deck tile — the whole card is the press target, its own `isSkeleton` mirror stands in while loading", storyId: "composites-cards-surfacecard-surfacecard--pressable" },
    "SurfaceCardList": { tier: "composite", role: "the bounded row list for the line leaf, one divided surface owning every row's box and separator", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "Cluster": { tier: "frame", role: "the wrapping chip row inside a tile/row — difficulty chip, plus a due chip only when `dueCount` is truthy", storyId: "frames-cluster-cluster--default" },
    "VariantChipDifficulty": { tier: "block", role: "the difficulty chip — dot colour + label by tier, the block never reshapes it", storyId: "starci-blocks-learn-variantchip-variantchipdifficulty--levels" },
    "Chip": { tier: "atom", role: "the due-count chip (`tone=\"warning\"`) — omitted entirely when `dueCount` is `0`/absent", storyId: "atoms-chips-chip-chip--default" },
    "ProgressGauge": { tier: "atom", role: "the per-viewer mastery meter, shown only when `showProgress` is on and the deck has cards", storyId: "atoms-display-progress-progressgauge--overview" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — a title, a blurb, the mastery fraction, or the CTA label", storyId: "atoms-text-typography-typography--overview" },
    "Pagination": { tier: "atom", role: "the page nav under the track, hidden while the track is empty or loading", storyId: "atoms-navigation-pagination-pagination--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the empty-track message — replaces the grid/list entirely, wording forks on whether a search query is active", storyId: "composites-async-asynccontent-asynccontent--empty" },
}

/** A tiny controlled wrapper so a Storybook reader can actually search/page/switch view — matches the `render` pattern other interactive leaves in this tree use. */
type InteractiveProps = {
    decks: Array<FlashcardDeckListDeck>
    initialView: FlashcardDeckListView
    initialQuery?: string
    showProgress: boolean
    isSkeleton?: boolean
}
const Interactive = ({
    decks,
    initialView,
    initialQuery = "",
    showProgress,
    isSkeleton,
}: InteractiveProps) => {
    const [view, setView] = useState<FlashcardDeckListView>(initialView)
    const [query, setQuery] = useState(initialQuery)
    const [page, setPage] = useState(1)
    return (
        <FlashcardDeckList


            decks={decks}
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={setView}
            page={page}
            totalPages={3}
            onPageChange={setPage}
            onSelectDeck={() => {}}
            showProgress={showProgress}
            isSkeleton={isSkeleton}
        />
    )
}

/** LEAF 1 — tiles inside a responsive `Grid`. */
export const GridView: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Grid view"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "view = \"grid\", showProgress = true",
                        why: "The default browse shape — each deck is a tile carrying its title, blurb, difficulty and (when a card is due) a due chip, its mastery meter, and a decorative \"Study now\" cue. The whole tile is one press target, so the CTA never becomes a second nested button.",
                        code: `<FlashcardDeckList
    decks={decks}
    query={query}
    onQueryChange={setQuery}
    view="grid"
    onViewChange={setView}
    page={1}
    totalPages={3}
    onPageChange={setPage}
    onSelectDeck={onSelectDeck}
    showProgress
/>`,
                        render: <Interactive decks={DECKS} initialView="grid" showProgress />,
                    },
                    {
                        name: "showProgress = false",
                        why: "A plain browse surface (e.g. an unenrolled preview) drops the mastery meter entirely rather than showing a meaningless 0/0 — the caller decides whether progress talk belongs on screen at all.",
                        code: "<FlashcardDeckList decks={decks} view=\"grid\" showProgress={false} /* … */ />",
                        render: <Interactive decks={DECKS} initialView="grid" showProgress={false} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 2 — rows inside one bounded `SurfaceCardList`. */
export const LineView: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Line view"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "view = \"line\"",
                        why: "A scan-friendly shape for a long catalog — one bounded surface, each deck a single row with its chips riding as meta and its mastery fraction trailing on the right. A deck with no blurb falls back to its card count instead of a blank second line.",
                        code: `<FlashcardDeckList
    decks={decks}
    view="line"
    onViewChange={setView}
    showProgress
    /* … */
/>`,
                        render: <Interactive decks={DECKS} initialView="line" showProgress />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 3 — the track becomes the empty message; forks on whether a search query is active. */
export const SearchEmpty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Search empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "query = \"advanced kubernetes\", decks = []",
                        why: "The search field stays live and shows exactly what was typed, but the grid/list itself is REPLACED by one centred message naming the query — there is nothing left to browse for this term, so no empty grid or empty list ever renders.",
                        code: "<FlashcardDeckList decks={[]} query=\"advanced kubernetes\" /* … */ />",
                        render: <Interactive decks={[]} initialView="grid" initialQuery="advanced kubernetes" showProgress />,
                    },
                    {
                        name: "query = \"\", decks = []",
                        why: "The course genuinely has no decks yet — no search was involved, so the wording drops the query-specific phrasing and the \"try another word\" hint that would make no sense here.",
                        code: "<FlashcardDeckList decks={[]} query=\"\" /* … */ />",
                        render: <Interactive decks={[]} initialView="grid" showProgress />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 4 — `decks` still empty and `isSkeleton` on; a guessed count mirrors the current view's shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "isSkeleton = true, decks = [] (grid)",
                        why: "The first fetch hasn't resolved yet. The toolbar stays fully interactive (typing/switching view doesn't need the list to exist first); the track guesses six placeholder tiles, each rendering `SurfaceCard`'s own generic mirror instead of this block's chip/mastery/CTA content, which is never built for a placeholder.",
                        code: "<FlashcardDeckList decks={[]} isSkeleton view=\"grid\" /* … */ />",
                        render: <Interactive decks={[]} initialView="grid" showProgress isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
