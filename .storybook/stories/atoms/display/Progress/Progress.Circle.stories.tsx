import type { Meta, StoryObj } from "@storybook/nextjs"
import { Progress, type ProgressColor, type ProgressSize } from "@sb-components/atoms/display/Progress/Progress"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Progress.Circle> = {
    title: "Atoms/Display/Progress/Progress.Circle",
    component: Progress.Circle,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Progress.Circle>

/**
 * NO `annotate` (teacher confirmed 2026-07-26): a leaf atom wrapping react-aria's
 * ProgressBar directly (circle variant). `Track`/`Fill` are internal spans (slots), not
 * components with their own story to jump to, so they are not real deps.
 */

/** Value — a determinate ring (value/max). */
export const Value: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Value"
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

/** One row of the color demo table below. */
interface CircleColorRow {
    /** color token applied to the ring's fill arc */
    color: ProgressColor
    /** aria-label describing what the ring measures */
    label: string
    /** progress value (0-100) shown by this row */
    value: number
}

/** The FULL `ProgressColor` union — missing a value means that value sprouts as a stray leaf elsewhere. */
const CIRCLE_COLORS: Array<CircleColorRow> = [
    { color: "accent", label: "Course progress", value: 55 },
    { color: "success", label: "Upload complete", value: 100 },
    { color: "warning", label: "Sync needs attention", value: 40 },
    { color: "danger", label: "Deploy failed", value: 20 },
    { color: "default", label: "Idle queue", value: 65 },
]

/** Leaf prop `color` — 5 tones, render the FULL union. */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `color`"
                reason="Same tone semantics as Bar: the arc's colour carries the meaning of the number inside its ring, from a plain accent run to an explicit success, warning, or danger outcome."
                states={[
                    {
                        name: "color = accent | success | warning | danger | default",
                        why: "All five tones render side by side, and only the FillCircle arc takes each tone while the TrackCircle stays neutral in every one of them. Keeping the track neutral across every colour is what makes the five rings still read as one family instead of five unrelated widgets.",
                        code: "<Progress.Circle color=\"accent\" value={55} />\n<Progress.Circle color=\"success\" value={100} />\n<Progress.Circle color=\"warning\" value={40} />\n<Progress.Circle color=\"danger\" value={20} />\n<Progress.Circle color=\"default\" value={65} />",
                        render: (
                            <div className="flex flex-wrap items-center gap-6">
                                {CIRCLE_COLORS.map(({ color, label, value }, index) => (
                                    <Progress.Circle
                                        key={color}
                                        color={color}
                                        value={value}
                                        ariaLabel={label}
                                        showAnatomy={index === 0}
                                    />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** One row of the size demo table below. */
interface CircleSizeRow {
    /** diameter step applied to the ring */
    size: ProgressSize
    /** aria-label describing what the ring measures */
    label: string
}

/** The FULL `ProgressSize` union. */
const CIRCLE_SIZES: Array<CircleSizeRow> = [
    { size: "sm", label: "Compact ring" },
    { size: "md", label: "Default ring" },
    { size: "lg", label: "Prominent ring" },
]

/** Leaf prop `size` — 3 diameters, render the FULL union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Progress.Circle"
                tier="atom"
                leaf="Prop `size`"
                reason="Diameter signals weight: a compact ring fits inside a stat row, while a prominent ring can anchor a dashboard tile on its own."
                states={[
                    {
                        name: "size = sm | md | lg",
                        why: "Three diameters render side by side at the same 68% value, so only the ring's size changes across the row. Each skeleton box matches its diameter 1:1, so a loading ring never resizes once the real value lands.",
                        code: "<Progress.Circle size=\"sm\" value={68} />\n<Progress.Circle size=\"md\" value={68} />\n<Progress.Circle size=\"lg\" value={68} />",
                        render: (
                            <div className="flex flex-wrap items-end gap-6">
                                {CIRCLE_SIZES.map(({ size, label }, index) => (
                                    <Progress.Circle
                                        key={size}
                                        size={size}
                                        value={68}
                                        ariaLabel={label}
                                        showAnatomy={index === 0}
                                    />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
