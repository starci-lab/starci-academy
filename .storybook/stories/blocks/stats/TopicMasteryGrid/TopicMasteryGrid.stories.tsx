import type { Meta, StoryObj } from "@storybook/nextjs"
import { TopicMasteryGrid } from "@/components/blocks/stats/TopicMasteryGrid"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof TopicMasteryGrid> = {
    title: "Features/Progress/TopicMasteryGrid",
    component: TopicMasteryGrid,
}
export default meta
type Story = StoryObj<typeof TopicMasteryGrid>

/**
 * Bản đồ mastery theo topic — trả lời "dev mạnh mảng CS nào" kiểu heatmap LeetCode,
 * mỗi topic là một chip trung tính, đậm dần theo số bài đã giải (so với topic mạnh
 * nhất), kèm số in bên cạnh để tín hiệu không phụ thuộc màu. Truyền topics đã sắp
 * mạnh nhất trước để đọc dễ nhất.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Bản đồ mastery"
                hint="Dùng để trả lời dev mạnh mảng CS nào kiểu heatmap LeetCode — mỗi topic là chip trung tính, đậm dần theo số bài đã giải (so với topic mạnh nhất), kèm số in bên cạnh để tín hiệu không phụ thuộc màu. Truyền topics đã sắp mạnh nhất trước để đọc dễ nhất."
            >
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
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Use to answer which CS areas this dev is strong in LeetCode-heatmap-style — each topic is a " +
            "neutral chip, shaded progressively darker by the number of problems solved (relative to the " +
            "strongest topic), with the number printed alongside so the signal doesn't depend on color. Pass " +
            "topics pre-sorted strongest-first for the best read.",
    },
}
