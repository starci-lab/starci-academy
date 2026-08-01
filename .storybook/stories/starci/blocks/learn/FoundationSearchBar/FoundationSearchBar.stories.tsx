import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    FoundationSearchBar,
    type FoundationSearchSuggestion,
} from "@sb-components/starci/blocks/learn/FoundationSearchBar/FoundationSearchBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationSearchBar`: the search row — debounced-typeahead field
 * left, a live match count right, one `StackH` seam apart. See the component
 * file header for why this is a SIBLING of `FoundationCategorySearchBar`
 * (not a reach past it) and for the independent-count-loading axis that makes
 * it a distinct block rather than the same one reused.
 *
 * 📐 ONE LEAF (§14d.2). `isSkeleton`, `isCountLoading`, an empty vs. populated
 * suggestion list, and every value `resultCount` can take (unknown / zero / N)
 * are all DATA on the same fixed structure — no node appears or disappears —
 * so they are STATES inside the single `Default` leaf, not leaves of their own.
 */
const meta: Meta<typeof FoundationSearchBar> = {
    title: "StarCi/Blocks/Learn/FoundationSearchBar/FoundationSearchBar",
    component: FoundationSearchBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationSearchBar>

const SUGGESTIONS: Array<FoundationSearchSuggestion> = [
    { id: "docker-101", label: "Docker for beginners" },
    { id: "docker-compose", label: "Advanced Docker Compose" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the horizontal frame holding the field and the count on one baseline, one seam apart", storyId: "frames-stack-stackh--default" },
    "SearchAutocomplete": { tier: "atom", role: "the debounced suggest-as-you-type field, fed the block's mapped domain suggestions", storyId: "atoms-forms-searchautocomplete--overview" },
    "Typography": { tier: "atom", role: "the match-count text, or its skeleton mirror while `isSkeleton`/`isCountLoading` — content and wording owned entirely by this block", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the one shape this block has: field + count. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationSearchBar"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "resultCount = 12, empty query",
                        why: "The resting shape of the row: an empty field and the full match count sitting beside it. This is what the reader sees before typing anything.",
                        code: `<FoundationSearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    resultCount={12}
/>`,
                        render: (
                            <FoundationSearchBar
                                anatPart="FoundationSearchBar"
                                showAnatomy
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                                resultCount={12}
                            />
                        ),
                    },
                    {
                        name: "query = \"docker\", suggestions matching",
                        why: "The reader has typed a query and the typeahead read answered with matches; the count on the right still reflects the last completed search, since in `src` it comes from a separate SWR read than the suggestions do.",
                        code: `<FoundationSearchBar
    query="docker"
    onQueryChange={setQuery}
    suggestions={[{ id: "docker-101", label: "Docker for beginners" }, { id: "docker-compose", label: "Advanced Docker Compose" }]}
    onSelectSuggestion={onSelect}
    resultCount={12}
/>`,
                        render: (
                            <FoundationSearchBar
                                query="docker"
                                onQueryChange={() => {}}
                                suggestions={SUGGESTIONS}
                                onSelectSuggestion={() => {}}
                                resultCount={12}
                            />
                        ),
                    },
                    {
                        name: "isCountLoading = true, suggestions already loaded",
                        why: "The count's own SWR read is still in flight while the typeahead has already answered — only the count text shimmers, the field and its dropdown stay fully interactive. This is the behaviour that makes this block a sibling of `FoundationCategorySearchBar` rather than the same block: the two reads there never fall out of sync.",
                        code: `<FoundationSearchBar
    query="docker"
    onQueryChange={setQuery}
    suggestions={suggestions}
    onSelectSuggestion={onSelect}
    isCountLoading
/>`,
                        render: (
                            <FoundationSearchBar
                                query="docker"
                                onQueryChange={() => {}}
                                suggestions={SUGGESTIONS}
                                onSelectSuggestion={() => {}}
                                isCountLoading
                            />
                        ),
                    },
                    {
                        name: "resultCount = 0 (no matches)",
                        why: "A real, newsworthy zero — the search genuinely matched nothing — so the block renders its own honest zero-match wording instead of hiding the count. Silence here would read as the count still loading rather than as an honest empty result.",
                        code: `<FoundationSearchBar
    query="xyz123"
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    resultCount={0}
/>`,
                        render: (
                            <FoundationSearchBar
                                query="xyz123"
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                                resultCount={0}
                            />
                        ),
                    },
                    {
                        name: "resultCount = undefined (unknown)",
                        why: "The screen has not resolved a count yet — distinct from a real zero — so this block renders nothing on the right rather than guess. The caller passes `isCountLoading` for the loading mirror instead; a bare `undefined` here is for a screen that has no count to show at all.",
                        code: `<FoundationSearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
/>`,
                        render: (
                            <FoundationSearchBar
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Nothing has loaded yet, so the field and the count both swap to their own resting shimmer mirrors rather than showing a stale or empty count.",
                        code: `<FoundationSearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    isSkeleton
/>`,
                        render: (
                            <FoundationSearchBar
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
