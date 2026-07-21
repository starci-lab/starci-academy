import type { Meta, StoryObj } from "@storybook/nextjs"
import { TopicMasteryGrid } from "./TopicMasteryGrid"

const meta: Meta<typeof TopicMasteryGrid> = {
    title: "Primitives/Stats/TopicMasteryGrid",
    component: TopicMasteryGrid,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TopicMasteryGrid>

/** Chips tint darker toward the strongest topic; the printed count carries the magnitude. */
export const MasteryMap: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-[520px]">
                <TopicMasteryGrid
                    ariaLabel="Mastery level by algorithm topic"
                    topics={[
                        { key: "array", label: "Arrays & strings", solved: 142 },
                        { key: "dp", label: "Dynamic programming", solved: 98 },
                        { key: "graph", label: "Graphs", solved: 61 },
                        { key: "tree", label: "Binary trees", solved: 44 },
                        { key: "twopointer", label: "Two pointers", solved: 33 },
                        { key: "greedy", label: "Greedy", solved: 21 },
                        { key: "backtrack", label: "Backtracking", solved: 12 },
                        { key: "math", label: "Math", solved: 6 },
                    ]}
                />
            </div>
        </div>
    ),
}
