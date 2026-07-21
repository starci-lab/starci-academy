import type { Meta, StoryObj } from "@storybook/nextjs"
import { SegmentBar } from "./SegmentBar"

const meta: Meta<typeof SegmentBar> = {
    title: "Primitives/Stats/SegmentBar",
    component: SegmentBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SegmentBar>

/** No shared total — slices always fill 100% as shares of each other. */
export const Proportional: Story = {
    render: () => (
        <div className="p-8">
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

/** `max` set → widths are `value / max`, leaving an empty remainder for true progress. */
export const WithMax: Story = {
    render: () => (
        <div className="p-8">
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

/** `hideLegend` — the bar is a quick summary inside a block that already has its own legend. */
export const HideLegend: Story = {
    render: () => (
        <div className="p-8">
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

/** Many groups — the legend wraps neatly instead of overflowing. */
export const ManyGroups: Story = {
    render: () => (
        <div className="p-8">
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

/** `inlineLabels` — a thick ladder strip; each band prints its own label + %, plus a closing caption. */
export const InlineLabels: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <SegmentBar
                    inlineLabels
                    ariaLabel="Card maturity breakdown"
                    caption="Only 8% of cards have matured (retained over a long gap) — that's the real progress, not the raw card count seen."
                    segments={[
                        { key: "non", label: "Non", value: 52, color: "var(--default)" },
                        { key: "maturing", label: "Maturing", value: 40, color: "var(--warning)" },
                        { key: "mature", label: "Mature", value: 8, color: "var(--success)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** No data yet (all zero) — the bar shows an empty track instead of dividing by zero. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
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
