import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Circle> = {
    title: "Atoms/Display/Progress/Progress.Circle",
    component: Progress.Circle,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Circle>

/**
 * `ProgressCircle.Track`/`ProgressCircle.FillCircle` are direct HeroUI
 * compound-component renders (`tier: "heroui"`, no `storyId`). `Skeleton` is
 * HeroUI's own `Skeleton`, same reasoning. Renamed from the role-words
 * `Track`/`Fill` (§ naming pass, 2026-07-28) — `Fill` was doubly wrong here since
 * the element it tagged is actually `FillCircle`, not `Fill`.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ProgressCircle.Track": {
        tier: "heroui",
        role: "wraps the neutral track-circle and the coloured fill-arc",
    },
    "ProgressCircle.FillCircle": {
        tier: "heroui",
        role: "the coloured arc — a fixed sweep at a value, or a continuous spin when indeterminate",
    },
    Skeleton: {
        tier: "heroui",
        role: "the resting circle shimmer, drawn in place of the whole ring while isSkeleton is on",
    },
}

/** Value — a determinate ring (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Value"
                annotate={ANNOTATE}
                reason="The circular progress ring wrapping react-aria ProgressBar, same semantics as Bar."
                states={[
                    {
                        name: "value = 68",
                        why: "The ring fills to 68% of its circumference while the track underneath stays visible for the remaining arc. A circular ring reads well in a compact stat tile where a full-width bar would not fit.",
                        code: "<Progress.Circle value={68} size=\"md\" />",
                        render: <Progress.Circle value={68} ariaLabel="Progress" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Indeterminate — duration unknown, so the arc spins on its own (no value). */
export const Indeterminate: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Indeterminate"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isIndeterminate = true",
                        why: "The arc spins continuously on its own instead of resting at a fixed angle, and react-aria ignores `value` entirely while `isIndeterminate` is set. Use it whenever the actual duration or completion percentage is not known yet, so the ring never claims a false level of certainty.",
                        code: "<Progress.Circle isIndeterminate />",
                        render: <Progress.Circle isIndeterminate ariaLabel="Processing" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — the atom draws its own skeleton shape (a circle); it does not use `Skeleton.*`. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Loading"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The ring itself becomes a shimmering circle instead of a track-plus-arc, since `isSkeleton` replaces both with one resting shape (hybrid C). This is the state to reach for before a value is known at all, distinct from `Indeterminate`, which already knows work is happening but not how much.",
                        code: "<Progress.Circle isSkeleton />",
                        render: <Progress.Circle isSkeleton showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — each tone gets its own state, one ring per state. */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="Same tone semantics as Bar: the arc's colour carries the meaning of the number inside its ring, from a plain accent run to an explicit success, warning, or danger outcome."
                states={[
                    {
                        name: "color = accent",
                        why: "The FillCircle arc renders in the accent tone while the TrackCircle stays neutral underneath. This is the default reading for an ordinary run, like course progress, with no outcome to call out yet.",
                        code: "<Progress.Circle color=\"accent\" value={55} />",
                        render: <Progress.Circle color="accent" value={55} ariaLabel="Course progress" showAnatomy />,
                    },
                    {
                        name: "color = success",
                        why: "The arc renders in the success tone to mark a positive outcome, such as an upload that finished cleanly. The track stays neutral so only the arc itself carries the good-news meaning.",
                        code: "<Progress.Circle color=\"success\" value={100} />",
                        render: <Progress.Circle color="success" value={100} ariaLabel="Upload complete" showAnatomy />,
                    },
                    {
                        name: "color = warning",
                        why: "The arc renders in the warning tone to flag a state that needs attention before it becomes a failure, such as a sync falling behind. The neutral track keeps the warning legible without overwhelming the ring.",
                        code: "<Progress.Circle color=\"warning\" value={40} />",
                        render: <Progress.Circle color="warning" value={40} ariaLabel="Sync needs attention" showAnatomy />,
                    },
                    {
                        name: "color = danger",
                        why: "The arc renders in the danger tone to mark an explicit failure, such as a deploy that did not go through. This tone is reserved for outcomes the user must act on, not just numbers that happen to be low.",
                        code: "<Progress.Circle color=\"danger\" value={20} />",
                        render: <Progress.Circle color="danger" value={20} ariaLabel="Deploy failed" showAnatomy />,
                    },
                    {
                        name: "color = default",
                        why: "The arc renders in the default tone for a run that carries no outcome semantics at all, such as an idle queue simply ticking along. Keeping this tone separate from accent avoids implying an active in-progress state when there is none.",
                        code: "<Progress.Circle color=\"default\" value={65} />",
                        render: <Progress.Circle color="default" value={65} ariaLabel="Idle queue" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — each diameter gets its own state, one ring per state. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Diameter signals weight: a compact ring fits inside a stat row, while a prominent ring can anchor a dashboard tile on its own."
                states={[
                    {
                        name: "size = sm",
                        why: "The ring renders at its smallest diameter, sized to sit inline inside a compact stat row without dominating it. Its skeleton box matches this diameter exactly, so a loading ring never resizes once the real value lands.",
                        code: "<Progress.Circle size=\"sm\" value={68} />",
                        render: <Progress.Circle size="sm" value={68} ariaLabel="Compact ring" showAnatomy />,
                    },
                    {
                        name: "size = md",
                        why: "The ring renders at its default diameter, the size most product surfaces reach for first. It is large enough to read the value inside it without demanding its own dedicated tile.",
                        code: "<Progress.Circle size=\"md\" value={68} />",
                        render: <Progress.Circle size="md" value={68} ariaLabel="Default ring" showAnatomy />,
                    },
                    {
                        name: "size = lg",
                        why: "The ring renders at its largest diameter, big enough to anchor a dashboard tile on its own. Reach for this size when the ring is the primary focus of the card rather than one metric among several.",
                        code: "<Progress.Circle size=\"lg\" value={68} />",
                        render: <Progress.Circle size="lg" value={68} ariaLabel="Prominent ring" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
