import type { Meta, StoryObj } from "@storybook/nextjs"
import { Legend } from "./Legend"

const meta: Meta<typeof Legend> = {
    title: "Primitives/Stats/Legend",
    component: Legend,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Legend>

export const Basic: Story = {
    render: () => (
        <div className="p-8">
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

/** Many items in a narrow block wrap to a new line instead of overflowing. */
export const WrapMany: Story = {
    render: () => (
        <div className="p-8">
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

/** Each entry carries a trailing `suffix` (a `· count` here) printed in the same muted line. */
export const WithSuffix: Story = {
    render: () => (
        <div className="p-8">
            <Legend
                items={[
                    { key: "content", label: "Content", color: "var(--accent)", suffix: <>&nbsp;·&nbsp;12</> },
                    { key: "challenge", label: "Challenge", color: "var(--success)", suffix: <>&nbsp;·&nbsp;8</> },
                    { key: "milestone", label: "Milestone", color: "var(--warning)", suffix: <>&nbsp;·&nbsp;3</> },
                ]}
            />
        </div>
    ),
}

/** `direction="col"` stacks entries vertically instead of wrapping in a row. */
export const Vertical: Story = {
    render: () => (
        <div className="p-8">
            <Legend
                direction="col"
                items={[
                    { key: "easy", label: "Easy", color: "var(--success)", suffix: <>&nbsp;·&nbsp;24</> },
                    { key: "medium", label: "Medium", color: "var(--warning)", suffix: <>&nbsp;·&nbsp;11</> },
                    { key: "hard", label: "Hard", color: "var(--danger)", suffix: <>&nbsp;·&nbsp;5</> },
                ]}
            />
        </div>
    ),
}

/** `color` also accepts a Tailwind `bg-*` utility class (not only a raw value). */
export const TailwindClassColors: Story = {
    render: () => (
        <div className="p-8">
            <Legend
                items={[
                    { key: "accent", label: "Accent", color: "bg-accent" },
                    { key: "success", label: "Success", color: "bg-success" },
                    { key: "danger", label: "Danger", color: "bg-danger" },
                ]}
            />
        </div>
    ),
}

/** Long labels — the colour dot keeps its fixed size, never shrinking with the text. */
export const LongLabels: Story = {
    render: () => (
        <div className="p-8">
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
