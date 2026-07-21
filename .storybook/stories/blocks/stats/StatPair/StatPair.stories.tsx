import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card } from "@heroui/react"
import { StatPair } from "./StatPair"

const meta: Meta<typeof StatPair> = {
    title: "Primitives/Stats/StatPair",
    component: StatPair,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** The four stats reused across the layout stories below. */
const STATS = [
    { value: "1,204", label: "Followers" },
    { value: "87%", label: "Completion rate" },
    { value: "12", label: "Enrolled courses" },
    { value: "4.9", label: "Average rating" },
]

export const Single: Story = {
    render: () => (
        <div className="p-8">
            <StatPair value="1,204" label="Followers" />
        </div>
    ),
}

export const Row: Story = {
    render: () => (
        <div className="p-8">
            {/* Parent owns the card + full-height vertical dividers; StatPair is frameless. */}
            <Card variant="default" className="w-fit">
                <div className="flex items-stretch divide-x divide-default">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                            <StatPair value={stat.value} label={stat.label} />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ),
}

export const Grid: Story = {
    render: () => (
        <div className="p-8">
            {/* Narrow width (sidebar/widget): the same stats fall into a 2-col grid. */}
            <Card variant="default" className="w-[420px]">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {STATS.map((stat) => (
                        <StatPair key={stat.label} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </Card>
        </div>
    ),
}
