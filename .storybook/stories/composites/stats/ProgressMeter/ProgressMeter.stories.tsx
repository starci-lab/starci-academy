import type { Meta, StoryObj } from "@storybook/nextjs"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
const meta: Meta<typeof ProgressMeter> = {
    title: "Composites/Stats/ProgressMeter",
    component: ProgressMeter,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof ProgressMeter>
export const BareBar: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={45} />
            </div>
        </div>
    ),
}
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={0} label="Not started" showValue />
            </div>
        </div>
    ),
}
export const Half: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={50} label="Halfway" showValue />
            </div>
        </div>
    ),
}
export const Complete: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={100} label="Done" showValue color="success" />
            </div>
        </div>
    ),
}
export const LabelOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={62} label="Course progress" />
            </div>
        </div>
    ),
}
export const LabelAndValue: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={78} label="Module completion" showValue />
            </div>
        </div>
    ),
}
export const ValueOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={33} showValue />
            </div>
        </div>
    ),
}
export const ToneAccent: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={45} label="Default" showValue color="accent" />
            </div>
        </div>
    ),
}
export const ToneSuccess: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={100} label="Quiz" showValue color="success" />
            </div>
        </div>
    ),
}
export const ToneWarning: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={55} label="Time remaining" showValue color="warning" />
            </div>
        </div>
    ),
}
export const ToneDanger: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={12} label="Current score" showValue color="danger" />
            </div>
        </div>
    ),
}
/** Fill still far from the 85% target — the accent notch pill overshoots the thin bar; `mt-5` reserves room for the floating "85%" label. */
export const TargetBelow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={39} color="danger" target={85} targetLabel="85%" />
            </div>
        </div>
    ),
}
/** Fill has passed the target marker — the value reads as success. */
export const TargetReached: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={88} color="success" target={85} targetLabel="85%" />
            </div>
        </div>
    ),
}
/** `target` without `targetLabel` → just the notch pill, no floating caption (no reserved top room). */
export const TargetNoLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={55} color="warning" target={70} />
            </div>
        </div>
    ),
}
/** Count unit other than % — `max` is an integer total (7/10 lessons) instead of a percentage. */
export const CountUnit: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-80">
                <ProgressMeter value={7} max={10} label="7 / 10 lessons" showValue />
            </div>
        </div>
    ),
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ProgressMeter": { tier: "composite", role: "the meter itself — label row + track", storyId: "composites-stats-progressmeter--bare-bar" },
}

/** `leading` slot fixture (COMPOSITE-8): the meter calls this itself and forwards `isSkeleton`. */
const SprintLabel = ({ isSkeleton }: SkeletonProps) => (
    <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Sprint 4" />
)
/** `trailing` slot fixture (COMPOSITE-8): the meter calls this itself and forwards `isSkeleton`. */
const OnTrackChip = ({ isSkeleton }: SkeletonProps) => (
    <Chip tone="success" text="On track" isSkeleton={isSkeleton} />
)

const SLOT_ROW_ANNOTATE: Record<string, AnatomyAnnotation> = {
    ...ANNOTATE,
    "Typography": { role: "the `leading` slot's own content — here a Sprint label, not part of ProgressMeter's fixed vocabulary", tier: "atom", storyId: "atoms-text-typography-typography--overview" },
    "Chip": { role: "the `trailing` slot's own content — here a status chip, not part of ProgressMeter's fixed vocabulary", tier: "atom", storyId: "atoms-chips-chip-chip--default" },
}

/**
 * Leaf props `leading`/`trailing` — a second row, independent of `label`/`showValue`,
 * for callers that need a COMPONENT instead of plain text above the track. Omitted
 * (default), no such row renders and every other leaf on this page is unaffected.
 */
export const SlotRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="composite"
                leaf="Props `leading`/`trailing`"
                annotate={SLOT_ROW_ANNOTATE}
                renderClassName="w-80"
                states={[
                    {
                        name: "leading = undefined, trailing = undefined (default)",
                        why: "Only the `label`/`showValue` row (when set) and the track render — this leaf's row is entirely absent, exactly like every other leaf on this page.",
                        code: "<ProgressMeter value={62} label=\"Sprint burndown\" showValue />",
                        render: <ProgressMeter value={62} label="Sprint burndown" showValue />,
                    },
                    {
                        name: "leading = SprintLabel, trailing = OnTrackChip",
                        why: "A second row mounts just above the track, independent of the `label`/`showValue` row above it — a left region and a right region, each a component the meter calls itself and forwards `isSkeleton` to. Useful when the row needs more than plain text: a status chip, an icon, a custom-formatted unit.",
                        code: `const SprintLabel = ({ isSkeleton }: SkeletonProps) => (
    <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Sprint 4" />
)
const OnTrackChip = ({ isSkeleton }: SkeletonProps) => (
    <Chip tone="success" text="On track" isSkeleton={isSkeleton} />
)

<ProgressMeter
    value={62}
    label="Sprint burndown"
    showValue
    leading={SprintLabel}
    trailing={OnTrackChip}
/>`,
                        render: (
                            <ProgressMeter
                                value={62}
                                label="Sprint burndown"
                                showValue
                                leading={SprintLabel}
                                trailing={OnTrackChip}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; a two-bar shimmer (label width + full-width track) stands in for the real label row + `ProgressBar` while the ratio isn't known yet. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressMeter"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                renderClassName="w-80"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "`value` has no honest ratio to show before data loads, so the meter mirrors its own shape instead of borrowing an unrelated skeleton: a short label-width bar sits above a full-width track bar sized to match the real `ProgressBar`'s `h-1` track.",
                        code: "<ProgressMeter isSkeleton />",
                        render: <ProgressMeter isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}