import type { Meta, StoryObj } from "@storybook/nextjs"
import { MindMapRail, type MindMapRailItem } from "@sb-components/starci/blocks/learn/MindMapRail/MindMapRail"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MindMapRail` — the keyword lookup pane beside a mind-map canvas: search a term,
 * narrow by popularity tier, pick a result. Two shapes: `Default` (funnel popover
 * closed — loading/empty/populated are states of the single region below the header
 * row, swapped by `AsyncContent`) and `FilterOpen` (the popover panel open, so the
 * tier `ButtonRadioGroup` becomes a real node). The open panel renders through a
 * portal, outside the box `BlockAnatomy` scans.
 */
const meta: Meta<typeof MindMapRail> = {
    title: "StarCi/Blocks/Learn/MindMapRail/MindMapRail",
    component: MindMapRail,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MindMapRail>

const RESULTS: Array<MindMapRailItem> = [
    { id: "tcp-handshake", label: "TCP handshake", popularity: 92, breadcrumb: "Networking > TCP" },
    { id: "load-balancer", label: "Load balancer", popularity: 78, breadcrumb: "System Design > Scaling" },
    { id: "cache-invalidation", label: "Cache invalidation", popularity: 54, breadcrumb: "System Design > Caching" },
    { id: "eventual-consistency", label: "Eventual consistency", popularity: 41, breadcrumb: "Distributed Systems > CAP" },
    { id: "idempotency-key", label: "Idempotency key", popularity: 18, breadcrumb: "API Design > Reliability" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the horizontal frame holding the search field and the funnel trigger, so both sit on one row with one seam", storyId: "frames-stack-stackh--at" },
    "InputSearch": { tier: "atom", role: "the query field this rail reads and writes on every keystroke", storyId: "atoms-forms-input-inputsearch--default" },
    "Popover": { tier: "atom", role: "the funnel trigger + its panel; this block never hand-rolls a dropdown", storyId: "atoms-overlay-popover-popover--with-trigger-icon" },
    "Badge": { tier: "atom", role: "a dot on the funnel trigger, present only while a non-default tier is active", storyId: "atoms-display-badge-badge--anchored" },
    "ButtonRadioGroup": { tier: "atom", role: "the tier control inside the popover panel — value + onChange, same atom QuizSetup/SubmissionAttemptSelector use", storyId: "composites-buttons-buttonradiogroup--default" },
    "SurfaceCardList": { tier: "composite", role: "the bounded row surface for results, its dividers, and its own row mirror while loading", storyId: "composites-cards-surfacecard-surfacecardlist--verdict" },
    "AsyncContentEmpty": { tier: "composite", role: "the no-matches message, worded differently with vs without a query", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/** LEAF — funnel popover closed: loading / empty / populated are states of this one tree. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MindMapRail"
                tier="block"
                leaf="Default"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The rail's own query/tier fetch is in flight, so the result region swaps to a mirror while the search field and funnel trigger stay live — both are usable before any result has loaded, so neither one shimmers.",
                        code: `<MindMapRail
    query=""
    onQuery={setQuery}
    tier="all"
    onTier={setTier}
    items={[]}
    onPick={handlePick}
    isLoading
    ariaLabel="Search keywords in the mind map"
    tierAriaLabel="Popularity tier"
/>`,
                        render: (
                            <MindMapRail


                                query=""
                                onQuery={() => {}}
                                tier="all"
                                onTier={() => {}}
                                items={[]}
                                onPick={() => {}}
                                isLoading
                                ariaLabel="Search keywords in the mind map"
                                tierAriaLabel="Popularity tier"
                            />
                        ),
                    },
                    {
                        name: "items = [] (no keyword matches)",
                        why: "The query resolved with nothing found, so the result region carries the no-matches message instead of the list. The message names the exact query the reader typed, which is why it differs from the before-any-search empty state this block also owns.",
                        code: `<MindMapRail
    query="quantum tunneling"
    onQuery={setQuery}
    tier="all"
    onTier={setTier}
    items={[]}
    onPick={handlePick}
    isLoading={false}
    ariaLabel="Search keywords in the mind map"
    tierAriaLabel="Popularity tier"
/>`,
                        render: (
                            <MindMapRail
                                query="quantum tunneling"
                                onQuery={() => {}}
                                tier="all"
                                onTier={() => {}}
                                items={[]}
                                onPick={() => {}}
                                isLoading={false}
                                ariaLabel="Search keywords in the mind map"
                                tierAriaLabel="Popularity tier"
                            />
                        ),
                    },
                    {
                        name: "items populated (tone-per-row by popularity)",
                        why: "Each row's left band comes from its own popularity score — a hub term like \"TCP handshake\" (92) reads accent, a middling term like \"Eventual consistency\" (41) reads a quieter warning, and a rarely-referenced term like \"Idempotency key\" (18) stays bare so the rail doesn't turn into a wall of colour.",
                        code: `<MindMapRail
    query="networking"
    onQuery={setQuery}
    tier="all"
    onTier={setTier}
    items={results}
    selectedId="load-balancer"
    onPick={handlePick}
    isLoading={false}
    ariaLabel="Search keywords in the mind map"
    tierAriaLabel="Popularity tier"
/>`,
                        render: (
                            <MindMapRail
                                query="networking"
                                onQuery={() => {}}
                                tier="all"
                                onTier={() => {}}
                                items={RESULTS}
                                selectedId="load-balancer"
                                onPick={() => {}}
                                isLoading={false}
                                ariaLabel="Search keywords in the mind map"
                                tierAriaLabel="Popularity tier"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — funnel popover expanded: the tier `ButtonRadioGroup` becomes a real node. */
export const FilterOpen: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MindMapRail"
                tier="block"
                leaf="Filter open"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "tier = \"high\" (filter active)",
                        why: "The funnel trigger's panel is open, revealing the popularity tier radio group — a whole control that does not exist in the Default leaf. A dot on the trigger also appears because the active tier isn't \"all\", so the reader can tell a filter is on even with the panel closed.",
                        code: `<MindMapRail
    query=""
    onQuery={setQuery}
    tier="high"
    onTier={setTier}
    items={results.filter((r) => r.popularity >= 70)}
    onPick={handlePick}
    isLoading={false}
    ariaLabel="Search keywords in the mind map"
    tierAriaLabel="Popularity tier"
    defaultFilterOpen
/>`,
                        render: (
                            <MindMapRail


                                query=""
                                onQuery={() => {}}
                                tier="high"
                                onTier={() => {}}
                                items={RESULTS.filter((result) => result.popularity >= 70)}
                                onPick={() => {}}
                                isLoading={false}
                                ariaLabel="Search keywords in the mind map"
                                tierAriaLabel="Popularity tier"
                                defaultFilterOpen
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
