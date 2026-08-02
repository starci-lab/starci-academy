import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    FoundationCategorySearchBar,
    type FoundationCategorySuggestion,
} from "@sb-components/starci/blocks/learn/FoundationCategorySearchBar/FoundationCategorySearchBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationCategorySearchBar`: the Foundations hub's search row —
 * a debounced autocomplete field plus a live "N topics" count riding beside
 * it, one `StackH` seam apart. See the component file header for why this
 * earns its own layer over the bare `SearchAutocomplete` atom (domain
 * mapping + count wording, §14d.1).
 *
 * 📐 ONE LEAF (§14d.2). `isSkeleton`, an empty vs. populated suggestion list,
 * and every value `count` can take (unknown / zero / N) are all DATA — no
 * node appears or disappears across them — so they are STATES inside the
 * single `Default` leaf, not leaves of their own.
 */
const meta: Meta<typeof FoundationCategorySearchBar> = {
    title: "StarCi/Blocks/Learn/FoundationCategorySearchBar/FoundationCategorySearchBar",
    component: FoundationCategorySearchBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationCategorySearchBar>

const SUGGESTIONS: Array<FoundationCategorySuggestion> = [
    { id: "docker", label: "Docker" },
    { id: "docker-compose", label: "Docker Compose" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the horizontal frame holding the field and the count on one baseline, one seam apart", storyId: "frames-stack-stackh--default" },
    "SearchAutocomplete": { tier: "atom", role: "the debounced suggest-as-you-type field, fed the block's mapped domain suggestions", storyId: "atoms-forms-searchautocomplete--overview" },
    "Typography": { tier: "atom", role: "the count text, or its skeleton mirror while `isSkeleton` — content and wording owned entirely by this block", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the one shape this block has: field + count. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationCategorySearchBar"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "count = 12, empty query",
                        why: "The resting shape of the row: an empty field and the full category count sitting beside it. This is what the Foundations hub shows before anyone types anything.",
                        code: `<FoundationCategorySearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    count={12}
/>`,
                        render: (
                            <FoundationCategorySearchBar

                               
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                                count={12}
                            />
                        ),
                    },
                    {
                        name: "query = \"doc\", suggestions matching",
                        why: "The reader has typed a prefix and the backend's completion suggester answered with matches; the count on the right still reflects the last completed search, since it has not caught up to this keystroke yet.",
                        code: `<FoundationCategorySearchBar
    query="doc"
    onQueryChange={setQuery}
    suggestions={[{ id: "docker", label: "Docker" }, { id: "docker-compose", label: "Docker Compose" }]}
    onSelectSuggestion={onSelect}
    count={12}
/>`,
                        render: (
                            <FoundationCategorySearchBar
                                query="doc"
                                onQueryChange={() => {}}
                                suggestions={SUGGESTIONS}
                                onSelectSuggestion={() => {}}
                                count={12}
                            />
                        ),
                    },
                    {
                        name: "count = 0 (no matches)",
                        why: "A real, newsworthy zero — the search genuinely matched nothing — so the block renders \"No topics yet\" instead of hiding the count. Unlike a nav badge, silence here would read as the count still loading rather than as an honest empty result.",
                        code: `<FoundationCategorySearchBar
    query="xyz"
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    count={0}
/>`,
                        render: (
                            <FoundationCategorySearchBar
                                query="xyz"
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                                count={0}
                            />
                        ),
                    },
                    {
                        name: "count = undefined (not yet known)",
                        why: "The screen has not resolved a count yet — distinct from a real zero — so this block renders nothing on the right rather than guess. The caller passes `isSkeleton` instead for the loading mirror; a bare `undefined` here is for a screen that has no count to show at all.",
                        code: `<FoundationCategorySearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
/>`,
                        render: (
                            <FoundationCategorySearchBar
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectSuggestion={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The category list has not answered yet, so the field and the count both swap to their own shimmer mirrors rather than showing a stale or empty count.",
                        code: `<FoundationCategorySearchBar
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectSuggestion={onSelect}
    isSkeleton
/>`,
                        render: (
                            <FoundationCategorySearchBar
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
