import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuotaBar } from "@sb-components/starci/blocks/ai/QuotaBar/QuotaBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `QuotaBar`: one labelled used/limit AI-credit row whose fill colour
 * steps through a 3-tier ramp (accent ≤75% · warning >75% · danger >90%) as the
 * window fills up, with an optional reset-time caption underneath.
 *
 * Two of these stack inside `QuotaLane` (a 5-hour window, a 7-day window), which
 * itself sits inside the `AiQuotaModal` overlay.
 *
 * LEAF by STRUCTURE: the fill tone, the unit suffix, and the reset caption are all
 * DATA ⇒ states of one leaf. The caller flipping `isSkeleton` is its own leaf, same
 * convention as `RatingBar`/`PriceTag`.
 */
const meta: Meta<typeof QuotaBar> = {
    title: "StarCi/Blocks/Ai/QuotaBar/QuotaBar",
    component: QuotaBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuotaBar>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the outer column stacking the label row on top, the bar in the middle, and the reset caption underneath", storyId: "frames-stack-stackv--default" },
    "LabelRow": { tier: "frame", role: "the window label on the left, the \"used / limit\" count on the right — a `StackH` with `justify=\"between\"`, two fixed slots rather than a repeating row", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the window label, the used/limit count, or the optional unit suffix after it", storyId: "atoms-text-typography-typography--plain" },
    "Bar": { tier: "atom", role: "the fill bar itself, coloured by the 3-tier consumption ramp", storyId: "atoms-display-progress-progressbar--overview" },
    "ResetCaption": { tier: "atom", role: "the reset time note under the bar, only present once there is a reset time to show", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the live bar: label, count, ramp-coloured fill, optional reset caption. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuotaBar"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "used = 12, limit = 50 (≤75%)",
                        why: "Comfortably under the warning threshold, so the fill stays accent — the neutral \"in progress\" tone. This is the everyday reading a learner sees for most of a quota window's life.",
                        code: `<QuotaBar
    label="Next 5 hours"
    used={12}
    limit={50}
    resetLabel="Resets at 6:50 PM on Jun 1"
/>`,
                        render: (
                            <QuotaBar

                               
                                label="Next 5 hours"
                                used={12}
                                limit={50}
                                resetLabel="Resets at 6:50 PM on Jun 1"
                            />
                        ),
                    },
                    {
                        name: "used = 40, limit = 50 (>75%)",
                        why: "Crossing 75% consumed is DOMAIN knowledge this block owns, not a generic threshold the caller passes in — the fill turns warning-amber so the learner notices the window is getting close before it runs out.",
                        code: `<QuotaBar
    label="Next 5 hours"
    used={40}
    limit={50}
    resetLabel="Resets at 6:50 PM on Jun 1"
/>`,
                        render: (
                            <QuotaBar
                                label="Next 5 hours"
                                used={40}
                                limit={50}
                                resetLabel="Resets at 6:50 PM on Jun 1"
                            />
                        ),
                    },
                    {
                        name: "used = 48, limit = 50 (>90%)",
                        why: "Past 90% consumed the fill turns danger-red — the last, loudest step of the ramp, reserved for \"about to run out\" rather than an error state.",
                        code: `<QuotaBar
    label="Next 5 hours"
    used={48}
    limit={50}
    resetLabel="Resets at 6:50 PM on Jun 1"
/>`,
                        render: (
                            <QuotaBar
                                label="Next 5 hours"
                                used={48}
                                limit={50}
                                resetLabel="Resets at 6:50 PM on Jun 1"
                            />
                        ),
                    },
                    {
                        name: "unit = \"credit\", showUnit = true",
                        why: "The count gains a muted unit suffix after the raw numbers, for a lane whose cap is a named resource (AI credits) rather than a bare count everyone already understands from context.",
                        code: `<QuotaBar
    label="Auto (7 days)"
    used={320}
    limit={1000}
    unit="credit"
    showUnit
    resetLabel="Resets midnight Monday"
/>`,
                        render: (
                            <QuotaBar
                                label="Auto (7 days)"
                                used={320}
                                limit={1000}
                                unit="credit"
                                showUnit
                                resetLabel="Resets midnight Monday"
                            />
                        ),
                    },
                    {
                        name: "resetLabel = null",
                        why: "Without a reset time to show — a lane whose window doesn't recur on a schedule — the caption row drops out of the tree entirely rather than leaving an empty line.",
                        code: "<QuotaBar label=\"Auto\" used={12} limit={50} resetLabel={null} />",
                        render: <QuotaBar label="Auto" used={12} limit={50} resetLabel={null} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the row mirrors its own label, bar, and caption. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuotaBar"
                tier="block"
                leaf={"Prop `isSkeleton`"}
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Label, count, bar, and reset caption all shimmer in the same boxes the live row will fill, including the caption line — every real lane this block is used in ends up with a reset time once data lands, so that line is reserved up front instead of popping in later (§8).",
                        code: "<QuotaBar label=\"Next 5 hours\" used={0} limit={0} isSkeleton />",
                        render: (
                            <QuotaBar

                               
                                label="Next 5 hours"
                                used={0}
                                limit={0}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
