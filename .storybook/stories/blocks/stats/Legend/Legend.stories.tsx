import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Legend } from "@/components/blocks/stats/Legend"

const meta: Meta<typeof Legend> = {
    title: "Core/Stat/Legend",
    component: Legend,
}
export default meta
type Story = StoryObj<typeof Legend>

/** Use when you need to annotate the difficulty levels of a lesson alongside a colored segment bar. */
export const Default: Story = {
    parameters: { usage: "Use when you need to annotate the difficulty levels of a lesson alongside a colored segment bar." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Basic legend</Label>
                <Typography type="body-sm" color="muted">
                    Use when you need to annotate a few levels alongside a colored segment bar — color dot + label sit neatly on one row.
                </Typography>
            </div>
            <Legend
                items={[
                    { key: "easy", label: "Easy", color: "var(--success)" },
                    { key: "medium", label: "Medium", color: "var(--warning)" },
                    { key: "hard", label: "Hard", color: "var(--danger)" },
                ]}
            />
        </div>
    ),
}

/** Use when the legend needs to show many groups at once and should wrap onto a new line when the row overflows. */
export const ManyItems: Story = {
    parameters: { usage: "Use when the legend needs to show many groups at once and should wrap onto a new line when the row overflows." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Many items</Label>
                <Typography type="body-sm" color="muted">
                    When there are many groups and the block is narrow, the legend wraps onto a new line when the row overflows instead of spilling out of the block.
                </Typography>
            </div>
            <div className="max-w-[220px]">
                <Legend
                    items={[
                        { key: "javascript", label: "JavaScript", color: "var(--warning)" },
                        { key: "typescript", label: "TypeScript", color: "var(--accent)" },
                        { key: "python", label: "Python", color: "var(--success)" },
                        { key: "go", label: "Go", color: "var(--heat-3)" },
                        { key: "java", label: "Java", color: "var(--danger)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when legend labels are longer than usual, to check that the color dot does not shrink along with the text. */
export const LongLabel: Story = {
    parameters: { usage: "Use when legend labels are longer than usual, to check that the color dot does not shrink along with the text." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long label</Label>
                <Typography type="body-sm" color="muted">
                    When labels are longer than usual, check that the color dot keeps its size instead of shrinking along with the text.
                </Typography>
            </div>
            <div className="max-w-[260px]">
                <Legend
                    items={[
                        { key: "senior", label: "Senior/Staff — architecture-level system design questions", color: "var(--accent)" },
                        { key: "junior", label: "Junior — fundamental basics questions", color: "var(--success)" },
                    ]}
                />
            </div>
        </div>
    ),
}
