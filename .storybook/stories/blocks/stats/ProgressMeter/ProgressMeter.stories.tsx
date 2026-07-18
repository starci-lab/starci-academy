import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"

const meta: Meta<typeof ProgressMeter> = {
    title: "Primitives/DataDisplay/ProgressMeter",
    component: ProgressMeter,
}

export default meta

type Story = StoryObj<typeof ProgressMeter>

/**
 * Use when you only need a bare progress bar, no label and no number — e.g. embedded compactly in a list row.
 */
export const Default: Story = {
    args: {
        value: 45,
    },
    parameters: {
        usage: "Use when you only need a bare progress bar, no label and no number — e.g. embedded compactly in a list row.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Bare bar</Label>
                <Typography type="body-sm" color="muted">
                    Use when you only need a progress bar, no label and no number — embedded compactly in a list row.
                </Typography>
            </div>
            <div className="w-80">
                <ProgressMeter {...args} />
            </div>
        </div>
    ),
}

/**
 * Choose the label/number combination by the level of detail the user needs: add a label when they need to know WHAT the progress is, add showValue when they need to know HOW MUCH is left (%).
 */
export const LabelAndValueVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Label only</Label>
                    <Typography type="body-sm" color="muted">Use when the user needs to know what the progress is, but the percentage matters less.</Typography>
                </div>
                <ProgressMeter value={62} label="Course progress" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Label and number</Label>
                    <Typography type="body-sm" color="muted">Use when the user needs both the progress name and the remaining percentage, e.g. a course detail page.</Typography>
                </div>
                <ProgressMeter value={78} label="Module completion" showValue />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Number only</Label>
                    <Typography type="body-sm" color="muted">Use when the surrounding context already makes clear what the progress is, and you only need to add the percentage.</Typography>
                </div>
                <ProgressMeter value={33} showValue />
            </div>
        </div>
    ),
    parameters: {
        usage: "Choose the label/number combination by the level of detail the user needs: add a label when they need to know WHAT the progress is, add showValue when they need to know HOW MUCH is left (%).",
    },
}

/**
 * Change color by the MEANING of the number (neutral by default, success when passing/achieved, warning when a deadline is near, danger when the score is low) — not a color picked at will.
 */
export const Tones: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">The default, used when the number is just neutral progress that carries no good-or-bad meaning.</Typography>
                </div>
                <ProgressMeter value={45} label="Default" showValue color="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Use when the number signals passing or achievement, e.g. full completion or a score above the threshold.</Typography>
                </div>
                <ProgressMeter value={100} label="Quiz" showValue color="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Use when the number warns that a deadline is near, e.g. the remaining time is running out.</Typography>
                </div>
                <ProgressMeter value={55} label="Time remaining" showValue color="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Use when the number signals a danger level, e.g. a low score below the passing threshold.</Typography>
                </div>
                <ProgressMeter value={12} label="Current score" showValue color="danger" />
            </div>
        </div>
    ),
    parameters: {
        usage: "Change color by the MEANING of the number (neutral by default, success when passing/achieved, warning when a deadline is near, danger when the score is low) — not a color picked at will.",
    },
}

/**
 * Use when the fill should be read AGAINST a goal — pass `target` to drop the `ProgressMeterTargetMark` at that value: a rounded `bg-accent` pill (`w-1 h-5`) that overshoots the thin bar so it reads as a "notch" at the goal. Add a short `targetLabel` to float a caption above it; the meter then auto-reserves top room (`mt-5`) so that label never overlaps the text above. The bar's own color still carries the value's meaning; the marker just shows "where healthy is". Built for the memory-health hero ("39% vs an 85% goal"), reused across all 3 stats heroes.
 */
export const WithTarget: Story = {
    tags: ["news"],
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Below the goal (danger)</Label>
                    <Typography type="body-sm" color="muted">Fill far short of the 85% goal. The marker is a rounded accent pill that overshoots the bar; the meter reserves its own top room so the floating "85%" clears the text above — no manual padding needed at the call-site.</Typography>
                </div>
                <div className="w-80">
                    <ProgressMeter value={39} color="danger" target={85} targetLabel="85%" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>At/above the goal (success)</Label>
                    <Typography type="body-sm" color="muted">The fill has cleared the goal marker — value reads success.</Typography>
                </div>
                <div className="w-80">
                    <ProgressMeter value={88} color="success" target={85} targetLabel="85%" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Marker without a label</Label>
                    <Typography type="body-sm" color="muted">Pass `target` without `targetLabel` for just the pill notch — no floating caption, so no extra top room is reserved.</Typography>
                </div>
                <div className="w-80">
                    <ProgressMeter value={55} color="warning" target={70} />
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "Pass `target` to drop the ProgressMeterTargetMark — a rounded accent pill (w-1 h-5) — at a goal value; add a short `targetLabel` to float a caption above it (the meter auto-reserves mt-5 so it clears the text above, no call-site padding). The bar color still carries the value's meaning; the marker shows where healthy is. Reused across all 3 stats heroes.",
    },
}

/**
 * Use when the counting unit is not %, e.g. counting completed lessons/questions out of a total (7/10) instead of a percentage.
 */
export const CustomMax: Story = {
    args: {
        value: 7,
        max: 10,
        label: "7 / 10 lessons",
        showValue: true,
    },
    parameters: {
        usage: "Use when the counting unit is not %, e.g. counting completed lessons/questions out of a total (7/10) instead of a percentage.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Counting unit</Label>
                <Typography type="body-sm" color="muted">
                    When the unit is not % — count by the real total (7/10 lessons) instead of a percentage.
                </Typography>
            </div>
            <div className="w-80">
                <ProgressMeter {...args} />
            </div>
        </div>
    ),
}
