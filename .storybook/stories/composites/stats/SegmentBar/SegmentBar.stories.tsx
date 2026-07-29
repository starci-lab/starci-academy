import type { Meta, StoryObj } from "@storybook/nextjs"
import { SegmentBar } from "@sb-components/composites/stats/SegmentBar/SegmentBar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof SegmentBar> = {
    title: "Composites/Stats/SegmentBar",
    component: SegmentBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SegmentBar>

// leaf có legend (Proportional/WithMax/ManyGroups/Empty): track + legend, không caption.
// The track is bespoke internal geometry (a `role="img"` div, §13z) with no dedicated
// sub-story to link to, so it carries no badge — a link-less node is worse than none.
// `Legend` IS the real `Legend` composite this file renders directly.
const BAR_LEGEND_PARTS: Array<AnatomyNode> = [
    { name: "Legend", tier: "composite", role: "the colour dot + label + count row under the track", storyId: "composites-stats-legend--basic" },
]

// leaf HideLegend: chỉ còn track, legend bị ẩn hẳn. Track stays unbadged (see above).
const BAR_ONLY_PARTS: Array<AnatomyNode> = []

// leaf InlineLabels: có cả legend + caption (câu takeaway muted dưới cùng). Caption renders
// straight HeroUI `Typography`, so it is named for that real import, not its role.
const BAR_LEGEND_CAPTION_PARTS: Array<AnatomyNode> = [
    { name: "Legend", tier: "composite", role: "the colour dot + label row under the track (no count suffix, already printed on the band)", storyId: "composites-stats-legend--basic" },
    { name: "Typography", tier: "heroui", role: "an optional muted takeaway sentence below everything" },
]

// leaf Skeleton: flat track shimmer + a delegated `<Legend isSkeleton />`, no caption bar (the
// default call passes no `caption`). Updated 2026-07-29 — the anatPart/showAnatomy sweep gave
// the track its own `data-anat-part="Skeleton"` (a raw HeroUI bar, no dedicated story), and
// `Legend`'s own isSkeleton branch is now wired through as its own linked node.
const BAR_SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "heroui", role: "the flat track shimmer standing in for the coloured proportion strip while data loads" },
    { name: "Legend", tier: "composite", role: "the delegated shimmer legend row — Legend owns its own isSkeleton, not redrawn by hand here", storyId: "composites-stats-legend--skeleton" },
]

/** No shared total — slices always fill 100% as shares of each other. */
export const Proportional: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="Proportional"
                renderClassName="w-80"
                parts={BAR_LEGEND_PARTS}
                reason="No shared `max` means every slice's width is its own share of the sum of all slices, so the track always fills edge to edge — there is no honest notion of leftover space without a ceiling to measure against."
                states={[
                    {
                        name: "max unset, 3 segments",
                        why: "The track fills completely, each slice's width proportional to its own share of the total. The legend lists each segment's colour dot, label, and raw count below the track.",
                        code: "<SegmentBar ariaLabel=\"Distribution of answers by difficulty\" segments={[{ key: \"easy\", label: \"Easy\", value: 12 }]} />",
                        render: (
                            <SegmentBar
                                ariaLabel="Distribution of answers by difficulty"
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "easy", label: "Easy", value: 12 },
                                    { key: "medium", label: "Medium", value: 20 },
                                    { key: "hard", label: "Hard", value: 8 },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `max` set → widths are `value / max`, leaving an empty remainder for true progress. */
export const WithMax: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="WithMax"
                renderClassName="w-80"
                parts={BAR_LEGEND_PARTS}
                reason="`max` gives the track a real ceiling to measure against, turning it from a pure proportion chart into a true progress bar."
                states={[
                    {
                        name: "max set (max = 50)",
                        why: "Each slice's width becomes `value / max` instead of a share of the other slices, so the track can leave a real empty remainder. This is what makes the bar read as actual progress toward a target rather than a breakdown of a fixed whole.",
                        code: "<SegmentBar ariaLabel=\"Lesson completion progress\" max={50} segments={[{ key: \"done\", label: \"Completed\", value: 18, color: \"var(--success)\" }]} />",
                        render: (
                            <SegmentBar
                                ariaLabel="Lesson completion progress"
                                max={50}
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "done", label: "Completed", value: 18, color: "var(--success)" },
                                    { key: "in-progress", label: "In progress", value: 5, color: "var(--warning)" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `hideLegend` — the bar is a quick summary inside a block that already has its own legend. */
export const HideLegend: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="HideLegend"
                renderClassName="w-80"
                parts={BAR_ONLY_PARTS}
                reason="`hideLegend` exists for a caller whose surrounding block already carries its own legend, so this bar can stay a pure visual summary without repeating the same labels twice."
                states={[
                    {
                        name: "hideLegend = true",
                        why: "Only the `Bar` track renders — the `Legend` node drops out of the tree entirely, not just visually hidden. The track keeps its `role=\"img\"` so the proportions are still announced to assistive tech even without the visible legend.",
                        code: "<SegmentBar hideLegend ariaLabel=\"Ratio of correct and incorrect answers\" segments={[{ key: \"correct\", label: \"Correct\", value: 34, color: \"var(--success)\" }]} />",
                        render: (
                            <SegmentBar
                                hideLegend
                                ariaLabel="Ratio of correct and incorrect answers"
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "correct", label: "Correct", value: 34, color: "var(--success)" },
                                    { key: "incorrect", label: "Incorrect", value: 6, color: "var(--danger)" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Many groups — the legend wraps neatly instead of overflowing. */
export const ManyGroups: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="ManyGroups"
                renderClassName="w-80"
                parts={BAR_LEGEND_PARTS}
                reason="The legend is a wrapping row, not a fixed grid, so it has to keep reading cleanly whether the caller passes three segments or many more."
                states={[
                    {
                        name: "segments = 5 entries",
                        why: "The legend wraps onto a second line instead of overflowing or truncating, while the track above it still fills with five proportional slices. This is the same composition as `Proportional`, just stress-tested with more entries.",
                        code: "<SegmentBar ariaLabel=\"Distribution of assessed skills\" segments={[{ key: \"frontend\", label: \"Frontend\", value: 9 }, { key: \"backend\", label: \"Backend\", value: 14 }]} />",
                        render: (
                            <SegmentBar
                                ariaLabel="Distribution of assessed skills"
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "frontend", label: "Frontend", value: 9 },
                                    { key: "backend", label: "Backend", value: 14 },
                                    { key: "database", label: "Database", value: 6 },
                                    { key: "devops", label: "DevOps", value: 4 },
                                    { key: "testing", label: "Testing", value: 7 },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `inlineLabels` — a thick ladder strip; each band prints its own label + %, plus a closing caption. */
export const InlineLabels: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="InlineLabels"
                renderClassName="w-80"
                parts={BAR_LEGEND_CAPTION_PARTS}
                reason="`inlineLabels` trades the thin track + external legend for a thick ladder strip that carries its own label and percentage on each band, so a reader can take in a slice's identity and its share in one glance instead of cross-referencing a legend below."
                states={[
                    {
                        name: "inlineLabels = true, caption set",
                        why: "The track grows into a thick ladder where each band prints its own label and percentage; the legend below drops the count suffix since that number is already on the band. An optional muted `Caption` sentence closes the block with the one takeaway worth stating in words.",
                        code: `<SegmentBar
    inlineLabels
    ariaLabel="Card maturity breakdown"
    caption="Only 8% of cards have matured — that's the real progress."
    segments={[{ key: "mature", label: "Mature", value: 8, color: "var(--success)" }]}
/>`,
                        render: (
                            <SegmentBar
                                inlineLabels
                                ariaLabel="Card maturity breakdown"
                                caption="Only 8% of cards have matured (retained over a long gap) — that's the real progress, not the raw card count seen."
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "non", label: "Non", value: 52, color: "var(--default)" },
                                    { key: "maturing", label: "Maturing", value: 40, color: "var(--warning)" },
                                    { key: "mature", label: "Mature", value: 8, color: "var(--success)" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** No data yet (all zero) — the bar shows an empty track instead of dividing by zero. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="Empty"
                renderClassName="w-80"
                parts={BAR_LEGEND_PARTS}
                reason="A proportional track divides by the sum of all values — with every segment at zero, that sum is zero, so the component has to special-case an empty track instead of dividing by it."
                states={[
                    {
                        name: "every segment value = 0",
                        why: "The track renders as an empty, uncoloured strip instead of attempting a division by zero. The legend still lists every segment name below it, so the reader knows what is being measured even though nothing has a share yet.",
                        code: "<SegmentBar ariaLabel=\"No assessment data yet\" segments={[{ key: \"easy\", label: \"Easy\", value: 0 }]} />",
                        render: (
                            <SegmentBar
                                ariaLabel="No assessment data yet"
                                anatPart="SegmentBar"
                                showAnatomy
                                segments={[
                                    { key: "easy", label: "Easy", value: 0 },
                                    { key: "medium", label: "Medium", value: 0 },
                                    { key: "hard", label: "Hard", value: 0 },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; a flat track shimmer stands in for the coloured proportion strip while data loads. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SegmentBar"
                tier="composite"
                leaf="Prop `isSkeleton`"
                renderClassName="w-80"
                parts={BAR_SKELETON_PARTS}
                reason="`segments` is only required when `isSkeleton` is falsy (the discriminated union above), so a caller mid-fetch can render the bar before it has a single real slice to measure."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The flat track bar mirrors the real strip's shape, but the legend row underneath is not redrawn by hand — it delegates straight to `Legend`'s own `isSkeleton`, so the two composites can never drift out of sync (§12g.0's priority rule: the composite that already owns a loading state is the source of truth for its own shimmer, not a shape guessed by its caller).",
                        code: "<SegmentBar isSkeleton ariaLabel=\"Distribution of answers by difficulty\" />",
                        render: <SegmentBar isSkeleton ariaLabel="Distribution of answers by difficulty" anatPart="SegmentBar" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
