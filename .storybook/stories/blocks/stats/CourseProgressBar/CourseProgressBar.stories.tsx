import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseProgressBar } from "./CourseProgressBar"

const meta: Meta<typeof CourseProgressBar> = {
    title: "Primitives/Stats/CourseProgressBar",
    component: CourseProgressBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseProgressBar>

/** Multiple dimensions at wildly different scales — each lane fills to its OWN ratio. */
export const MultiDimension: Story = {
    render: () => (
        <div className="p-8">
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

/** `hideLegend` — used when the parent block already renders its own legend. */
export const HideLegend: Story = {
    render: () => (
        <div className="p-8">
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

/** A dimension with `total === 0` (not yet unlocked) disappears — no empty lane to misread. */
export const DimensionNotApplicable: Story = {
    render: () => (
        <div className="p-8">
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
