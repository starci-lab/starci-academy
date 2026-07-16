import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"

const meta: Meta<typeof TopicMasteryGrid> = {
    title: "Core/Stat/TopicMasteryGrid",
    component: TopicMasteryGrid,
}
export default meta
type Story = StoryObj<typeof TopicMasteryGrid>

/**
 * Use to answer "which CS areas is this dev strong in" LeetCode-heatmap-style — each topic is a neutral chip,
 * shaded progressively darker by the number of problems solved (relative to the strongest topic), with the
 * number printed alongside so the signal doesn't depend on color. Neutral (no accent) so it doesn't compete
 * with the app's accent. Pass topics pre-sorted strongest-first for the best read.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use to answer which CS areas this dev is strong in LeetCode-heatmap-style — each topic is a " +
            "neutral chip, shaded progressively darker by the number of problems solved (relative to the " +
            "strongest topic), with the number printed alongside so the signal doesn't depend on color. Pass " +
            "topics pre-sorted strongest-first for the best read.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mastery map</Label>
                <Typography type="body-sm" color="muted">
                    Use to show which CS areas a dev is strong in — chips shaded progressively darker by the
                    number of problems solved relative to the strongest topic, with the number printed alongside
                    so it doesn't depend on color.
                </Typography>
            </div>
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
