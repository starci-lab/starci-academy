import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetaDotRow } from "@sb-components/composites/text/MetaDotRow/MetaDotRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `MetaDotRow`: a row of muted text fragments separated by a `·`
 * mark ("12 lessons · 3 hours · Free"). Replaces the hand-rolled `flex
 * flex-wrap items-center gap-* text-muted` + a bare `<span aria-hidden>·</span>`
 * seen at `PostRow` and `ProfileHero`'s sidebar meta — the composite owns the
 * mark (`Divider` atom, `shape="inline"`), the seam (`separator-dot`, 4px),
 * and the tone (`muted`, on every fragment AND the root, so the marks inherit
 * it).
 *
 * [layout] **1 PROP = 1 LEAF.** `items`, `isSkeleton`, `skeletonCount` each get their
 * own leaf. `classNames` gets none — a pure placement prop with no visible
 * shape of its own to demonstrate.
 */

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "each fragment's text — one Typography instance per string in items, muted xs",
        storyId: "atoms-text-typography-typography--overview",
    },
    "Divider": {
        tier: "atom",
        role: "the `·` mark rendered between two fragments — Divider's own inline-shape glyph",
        storyId: "atoms-display-divider-divider--default",
    },
}

const meta: Meta<typeof MetaDotRow> = {
    title: "Composites/Texts/MetaDotRow",
    component: MetaDotRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof MetaDotRow>

/**
 * Leaf for prop `items` — the fragment list: how many strings, how many `·`
 * marks between them, and how the row wraps once it runs out of width.
 */
export const Items: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MetaDotRow"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="items is the whole content of the row: one Typography fragment per string, joined by N minus 1 `·` marks. A single fragment draws no mark at all — there is nothing yet to separate."
                states={[
                    {
                        name: "items = one fragment",
                        why: "A lone fragment renders with no `·` mark beside it, since a mark only ever sits between two fragments. This is the shape a bare price tag or a single status word takes when there is nothing else to separate it from.",
                        code: "<MetaDotRow items={[\"Free\"]} />",
                        render: <MetaDotRow items={["Free"]} />,
                    },
                    {
                        name: "items = two fragments",
                        why: "Exactly one `·` mark grows between the two fragments. This is the shape a comment byline takes — a relative time next to an \"Edited\" flag — where the reader only needs to see the two facts are related, not ranked.",
                        code: "<MetaDotRow items={[\"12 minutes ago\", \"Edited\"]} />",
                        render: <MetaDotRow items={["12 minutes ago", "Edited"]} />,
                    },
                    {
                        name: "items = three fragments (typical)",
                        why: "Two `·` marks grow between the three fragments, the shape a course card's meta line reaches for most: lesson count, duration, and price all read left to right on one row.",
                        code: "<MetaDotRow items={[\"12 lessons\", \"3 hours\", \"Free\"]} />",
                        render: <MetaDotRow items={["12 lessons", "3 hours", "Free"]} />,
                    },
                    {
                        name: "items = four fragments in a narrow parent (wraps)",
                        why: "Once the row runs out of horizontal room, flex-wrap drops the overflowing fragments to a second line instead of clipping or scrolling — the row never claims more width than its parent allows.",
                        code: "<MetaDotRow items={[\"12 lessons\", \"3 hours\", \"Free\", \"Updated 2 days ago\"]} />",
                        render: (
                            <div data-tier="fixture" className="w-48 rounded-2xl border border-separator p-3">
                                <MetaDotRow items={["12 lessons", "3 hours", "Free", "Updated 2 days ago"]} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — the loading mirror, `skeletonCount` fragments
 * wide, each a Typography shimmer bar.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MetaDotRow"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Each fragment is its own Typography instance, so isSkeleton flows straight into every one of them instead of the row drawing a second, hand-built shimmer to keep in sync with the real one."
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The three real fragments render, each its own muted Typography string with a `·` mark between every pair — the shape the shimmer below mirrors.",
                        code: "<MetaDotRow items={[\"12 lessons\", \"3 hours\", \"Free\"]} />",
                        render: <MetaDotRow items={["12 lessons", "3 hours", "Free"]} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Three shimmer bars render at the default skeletonCount, each a quarter-width Typography placeholder joined by `·` marks, so a loading meta line takes up the same rough shape as the row it stands in for.",
                        code: "<MetaDotRow isSkeleton />",
                        render: <MetaDotRow isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `skeletonCount` — how many fragments the shimmer mirror
 * draws (only meaningful together with `isSkeleton`). Defaults to `3`.
 */
export const SkeletonCount: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MetaDotRow"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `skeletonCount`"
                reason="A caller that already knows its real row will only ever hold two fragments (or five) can size the shimmer to match, instead of every loading meta line defaulting to the same three-fragment guess."
                states={[
                    {
                        name: "skeletonCount = 3 (default)",
                        why: "Three shimmer fragments render — the count MetaDotRow falls back to when skeletonCount is left unset, matching the most common real row on a course card.",
                        code: "<MetaDotRow isSkeleton />",
                        render: <MetaDotRow isSkeleton />,
                    },
                    {
                        name: "skeletonCount = 2",
                        why: "Only two shimmer fragments render, joined by a single `·` mark — the narrower shape a comment byline's loading state takes, matching its real two-fragment row.",
                        code: "<MetaDotRow isSkeleton skeletonCount={2} />",
                        render: <MetaDotRow isSkeleton skeletonCount={2} />,
                    },
                    {
                        name: "skeletonCount = 5",
                        why: "Five shimmer fragments render in a row, showing the count scales up just as freely as it scales down — a wider meta line loads with just as many placeholder fragments as it will have real ones.",
                        code: "<MetaDotRow isSkeleton skeletonCount={5} />",
                        render: <MetaDotRow isSkeleton skeletonCount={5} />,
                    },
                ]}
            />
        </div>
    ),
}
