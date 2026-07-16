import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CourseProgressBar } from "@/components/blocks/stats/CourseProgressBar"

const meta: Meta<typeof CourseProgressBar> = {
    title: "Blocks/Stats/CourseProgressBar",
    component: CourseProgressBar,
}
export default meta
type Story = StoryObj<typeof CourseProgressBar>

/**
 * Use when course progress spans MULTIPLE dimensions with wildly different units and scales (lessons in the
 * dozens, challenges in the hundreds, milestones in the tens) — each dimension gets its own EQUALLY WIDE lane
 * that fills by its own ratio. Unlike `SegmentBar` (which slices proportions across ONE shared total): here
 * each dimension has a different total, so a shared split would squeeze the small dimension into a sliver;
 * equal lanes keep every dimension visible.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use when course progress spans multiple dimensions with wildly different units and scales (lessons " +
            "in the dozens, challenges in the hundreds, milestones in the tens) — each dimension gets its own " +
            "equally wide lane that fills by its own ratio. Unlike SegmentBar (which slices proportions across " +
            "one shared total): each dimension has a different total, so a shared split would squeeze the small " +
            "dimension into a sliver; equal lanes keep every dimension visible.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Multiple progress dimensions</Label>
                <Typography type="body-sm" color="muted">
                    Use when a course has multiple progress dimensions at different scales — each dimension gets
                    its own equally wide lane that fills by its own ratio, so the small dimension stays visible.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    ariaLabel="Fullstack course progress by dimension"
                    dims={[
                        { key: "content", label: "Lessons", completed: 87, total: 120, color: "var(--accent)" },
                        { key: "challenge", label: "Challenges", completed: 45, total: 329, color: "var(--success)" },
                        { key: "milestone", label: "Milestones", completed: 6, total: 12, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use `hideLegend` when the bar sits inside a block that already has its own legend elsewhere, to avoid repeating the labels + numbers below. */
export const HiddenLegend: Story = {
    parameters: {
        usage: "Use hideLegend when the bar sits inside a block that already has its own legend elsewhere, to avoid repeating the labels + numbers below.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Hidden legend</Label>
                <Typography type="body-sm" color="muted">
                    Use when the containing block already has its own labeled numbers elsewhere — turn on
                    hideLegend so the bar does not repeat the legend below.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    hideLegend
                    ariaLabel="Fullstack course progress"
                    dims={[
                        { key: "content", label: "Lessons", completed: 87, total: 120, color: "var(--accent)" },
                        { key: "challenge", label: "Challenges", completed: 45, total: 329, color: "var(--success)" },
                        { key: "milestone", label: "Milestones", completed: 6, total: 12, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** A dimension with `total === 0` (the course hasn't opened that part yet) disappears from the bar — no empty lane that could be misread as "nothing done". */
export const DimensionNotApplicable: Story = {
    parameters: {
        usage: "A dimension with total of 0 (the course hasn't opened that part yet) disappears from the bar — no empty lane that could be misread as nothing done.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Dimension not applicable</Label>
                <Typography type="body-sm" color="muted">
                    When a dimension has a total of 0 (the course hasn't opened that part yet), its lane
                    disappears instead of drawing an empty lane that could be misread as nothing done.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    ariaLabel="Progress for a course without milestones yet"
                    dims={[
                        { key: "content", label: "Lessons", completed: 40, total: 60, color: "var(--accent)" },
                        { key: "challenge", label: "Challenges", completed: 12, total: 80, color: "var(--success)" },
                        { key: "milestone", label: "Milestones", completed: 0, total: 0, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}
