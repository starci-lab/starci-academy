import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressMeter } from "./ProgressMeter"

const meta: Meta<typeof ProgressMeter> = {
    title: "Primitives/Stats/ProgressMeter",
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
