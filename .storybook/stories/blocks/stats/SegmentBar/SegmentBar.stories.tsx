import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"

const meta: Meta<typeof SegmentBar> = {
    title: "Core/Stat/SegmentBar",
    component: SegmentBar,
}
export default meta
type Story = StoryObj<typeof SegmentBar>

/** Use when you want to show the proportions between data groups (e.g. correct answers by difficulty level) without comparing against a separate reference total — the slices always fill 100% of the bar. */
export const Default: Story = {
    parameters: { usage: "Use when you want to show the proportions between data groups (e.g. correct answers by difficulty level) without comparing against a separate reference total — the slices always fill 100% of the bar." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Group distribution</Label>
                <Typography type="body-sm" color="muted">
                    Use when showing the proportions between groups without a separate reference total — the slices always fill 100% of the bar.
                </Typography>
            </div>
            <div className="w-80">
                <SegmentBar
                    ariaLabel="Distribution of answers by difficulty"
                    segments={[
                        { key: "easy", label: "Easy", value: 12 },
                        { key: "medium", label: "Medium", value: 20 },
                        { key: "hard", label: "Hard", value: 8 },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when you need to show real progress against a fixed total (e.g. lessons completed out of the course's total), so the empty space accurately reflects what hasn't been reached yet. */
export const ProgressToTotal: Story = {
    parameters: { usage: "Use when you need to show real progress against a fixed total (e.g. lessons completed out of the course's total), so the empty space accurately reflects what hasn't been reached yet." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Progress to total</Label>
                <Typography type="body-sm" color="muted">
                    When you need real progress against a fixed total (max) — the empty space accurately reflects what hasn't been reached.
                </Typography>
            </div>
            <div className="w-80">
                <SegmentBar
                    ariaLabel="Lesson completion progress"
                    max={50}
                    segments={[
                        { key: "done", label: "Completed", value: 18, color: "var(--success)" },
                        { key: "in-progress", label: "In progress", value: 5, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when the bar only serves as a decoration/quick summary inside another block that already has its own legend, so there's no need to repeat the labels + counts below. */
export const HiddenLegend: Story = {
    parameters: { usage: "Use when the bar only serves as a decoration/quick summary inside another block that already has its own legend, so there's no need to repeat the labels + counts below." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Hidden legend</Label>
                <Typography type="body-sm" color="muted">
                    When the bar is only a quick summary inside a block that already has its own legend — turn on hideLegend so it doesn't repeat the labels + counts below.
                </Typography>
            </div>
            <div className="w-80">
                <SegmentBar
                    hideLegend
                    ariaLabel="Ratio of correct and incorrect answers"
                    segments={[
                        { key: "correct", label: "Correct", value: 34, color: "var(--success)" },
                        { key: "incorrect", label: "Incorrect", value: 6, color: "var(--danger)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when there are many data groups (e.g. scores per skill), to check that the legend wraps neatly onto a new line instead of overflowing the block. */
export const ManyGroups: Story = {
    parameters: { usage: "Use when there are many data groups (e.g. scores per skill), to check that the legend wraps neatly onto a new line instead of overflowing the block." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Many groups</Label>
                <Typography type="body-sm" color="muted">
                    When there are many data groups, check that the legend wraps neatly onto a new line instead of overflowing the block.
                </Typography>
            </div>
            <div className="w-80">
                <SegmentBar
                    ariaLabel="Distribution of assessed skills"
                    segments={[
                        { key: "frontend", label: "Frontend", value: 9 },
                        { key: "backend", label: "Backend", value: 14 },
                        { key: "database", label: "Database", value: 6 },
                        { key: "devops", label: "DevOps", value: 4 },
                        { key: "testing", label: "Testing", value: 7 },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when there's no real data yet (all groups are 0), to confirm the bar doesn't break the layout and shows an empty track instead of a divide-by-zero error. */
export const NoData: Story = {
    parameters: { usage: "Use when there's no real data yet (all groups are 0), to confirm the bar doesn't break the layout and shows an empty track instead of a divide-by-zero error." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No data</Label>
                <Typography type="body-sm" color="muted">
                    When all groups are 0, the bar shows an empty track instead of a divide-by-zero error — check that the layout doesn't break.
                </Typography>
            </div>
            <div className="w-80">
                <SegmentBar
                    ariaLabel="No assessment data yet"
                    segments={[
                        { key: "easy", label: "Easy", value: 0 },
                        { key: "medium", label: "Medium", value: 0 },
                        { key: "hard", label: "Hard", value: 0 },
                    ]}
                />
            </div>
        </div>
    ),
}
