import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { MetricCard } from "@/components/blocks/stats/MetricCard"

const meta: Meta<typeof MetricCard> = {
    title: "Blocks/Stats/MetricCard",
    component: MetricCard,
}
export default meta
type Story = StoryObj<typeof MetricCard>

/** Use when a single metric deserves its own framed card — a large value, a body-sm foreground label describing the number, and a body-xs muted note as a faint small footnote. When combining several small numbers side by side, use StatPair. */
export const Default: Story = {
    parameters: { usage: "Use when a single metric deserves its own framed card — dashboard, KPI grid, profile sidebar. When combining several small numbers on one row, use StatPair (bare numbers, no frame)." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    A single metric standing alone as a framed card: a body-sm foreground label describes the prominent number, with a body-xs muted note as a stepped-down footnote below.
                </Typography>
            </div>
            <MetricCard
                value="1,204"
                label="Total enrolled students"
                hint="Updated daily"
            />
        </div>
    ),
}

/** Use when you need to compare a card with a note and one without side by side — hint is the only optional slot; add it when you need one line of supporting context, drop it when the value and label are enough. */
export const OptionalSlots: Story = {
    parameters: { usage: "Use when you need to compare a card with a note and one without side by side — hint is the only optional slot; add it when you need one line of supporting context, drop it when the value and label are already clear." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With note</Label>
                    <Typography type="body-sm" color="muted">Add a hint when the number needs one line of supporting context, e.g. a comparison baseline or the scope of the calculation.</Typography>
                </div>
                <MetricCard
                    value="98%"
                    label="Course completion rate"
                    hint="Vs. last week"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Without note</Label>
                    <Typography type="body-sm" color="muted">Drop the hint when the value and label are self-explanatory and no supporting context line is needed below.</Typography>
                </div>
                <MetricCard
                    value="42"
                    label="Certificates issued"
                />
            </div>
        </div>
    ),
}

/** Use to check the layout when the label and note are long, ensuring the text wraps sensibly instead of overflowing the frame. */
export const LongLabelAndHint: Story = {
    parameters: { usage: "Use to check the layout when the label and note are long, ensuring the text wraps neatly instead of overflowing the frame." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long label and note</Label>
                <Typography type="body-sm" color="muted">
                    When the label or note is longer than usual, check that the text wraps neatly instead of overflowing the frame.
                </Typography>
            </div>
            <MetricCard
                value="3,750"
                label="Total assignment submissions graded this month"
                hint="Includes submissions from both trial and paid students"
            />
        </div>
    ),
}
