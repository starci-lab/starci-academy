import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetricCard } from "./MetricCard"

const meta: Meta<typeof MetricCard> = {
    title: "Primitives/Stats/MetricCard",
    component: MetricCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <MetricCard
                value="1,204"
                label="Total enrolled students"
                hint="Updated daily"
            />
        </div>
    ),
}

export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <MetricCard
                value="98%"
                label="Course completion rate"
                hint="Vs. last week"
            />
        </div>
    ),
}

/** `hint` is the only optional slot — omit it when value + label already explain themselves. */
export const WithoutHint: Story = {
    render: () => (
        <div className="p-8">
            <MetricCard
                value="42"
                label="Certificates issued"
            />
        </div>
    ),
}

/** Long label + hint — the text wraps cleanly inside the frame. */
export const LongText: Story = {
    render: () => (
        <div className="p-8">
            <MetricCard
                value="3,750"
                label="Total assignment submissions graded this month"
                hint="Includes submissions from both trial and paid students"
            />
        </div>
    ),
}
