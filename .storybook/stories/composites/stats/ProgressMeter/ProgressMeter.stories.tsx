import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
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
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={45} />
            </div>
        </div>
    ),
}
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={0} label="Not started" showValue />
            </div>
        </div>
    ),
}
export const Half: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={50} label="Halfway" showValue />
            </div>
        </div>
    ),
}
export const Complete: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={100} label="Done" showValue color="success" />
            </div>
        </div>
    ),
}
export const LabelOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={62} label="Course progress" />
            </div>
        </div>
    ),
}
export const LabelAndValue: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={78} label="Module completion" showValue />
            </div>
        </div>
    ),
}
export const ValueOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={33} showValue />
            </div>
        </div>
    ),
}
export const ToneAccent: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={45} label="Default" showValue color="accent" />
            </div>
        </div>
    ),
}
export const ToneSuccess: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={100} label="Quiz" showValue color="success" />
            </div>
        </div>
    ),
}
export const ToneWarning: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={55} label="Time remaining" showValue color="warning" />
            </div>
        </div>
    ),
}
export const ToneDanger: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={12} label="Current score" showValue color="danger" />
            </div>
        </div>
    ),
}
/** Fill still far from the 85% target — the accent notch pill overshoots the thin bar; `mt-5` reserves room for the floating "85%" label. */
export const TargetBelow: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={39} color="danger" target={85} targetLabel="85%" />
            </div>
        </div>
    ),
}
/** Fill has passed the target marker — the value reads as success. */
export const TargetReached: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={88} color="success" target={85} targetLabel="85%" />
            </div>
        </div>
    ),
}
/** `target` without `targetLabel` → just the notch pill, no floating caption (no reserved top room). */
export const TargetNoLabel: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={55} color="warning" target={70} />
            </div>
        </div>
    ),
}
/** Count unit other than % — `max` is an integer total (7/10 lessons) instead of a percentage. */
export const CountUnit: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <ProgressMeter value={7} max={10} label="7 / 10 lessons" showValue />
            </div>
        </div>
    ),
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ProgressMeter": { tier: "composite", role: "the meter itself — label row + track", storyId: "composites-stats-progressmeter--bare-bar" },
}

/** LEAF — the caller flips `isSkeleton`; a two-bar shimmer (label width + full-width track) stands in for the real label row + `ProgressBar` while the ratio isn't known yet. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
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
                        render: <ProgressMeter isSkeleton anatPart="ProgressMeter" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}