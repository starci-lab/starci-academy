import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { TopicMasteryGrid } from "./index"

const meta: Meta<typeof TopicMasteryGrid> = {
    title: "Core/Stat/TopicMasteryGrid",
    component: TopicMasteryGrid,
}
export default meta
type Story = StoryObj<typeof TopicMasteryGrid>

/**
 * Dùng để trả lời "dev này mạnh mảng CS nào" kiểu heatmap LeetCode — mỗi chủ đề là một chip trung tính, tô
 * đậm dần theo số bài đã giải (so với chủ đề mạnh nhất), có in kèm con số nên tín hiệu không phụ thuộc màu.
 * Trung tính (không dùng accent) để không giành nhìn với accent của app. Truyền topics đã sắp mạnh-trước
 * đọc đẹp nhất.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng để trả lời dev này mạnh mảng CS nào kiểu heatmap LeetCode — mỗi chủ đề là một chip trung " +
            "tính, tô đậm dần theo số bài đã giải (so với chủ đề mạnh nhất), có in kèm con số nên tín hiệu " +
            "không phụ thuộc màu. Truyền topics đã sắp mạnh-trước đọc đẹp nhất.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Bản đồ thành thạo</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi cần cho thấy dev mạnh mảng CS nào — chip tô đậm dần theo số bài giải so với chủ đề
                    mạnh nhất, con số in kèm nên không phụ thuộc màu.
                </Typography>
            </div>
            <div className="w-[520px]">
                <TopicMasteryGrid
                    ariaLabel="Mức thành thạo theo chủ đề thuật toán"
                    topics={[
                        { key: "array", label: "Mảng & chuỗi", solved: 142 },
                        { key: "dp", label: "Quy hoạch động", solved: 98 },
                        { key: "graph", label: "Đồ thị", solved: 61 },
                        { key: "tree", label: "Cây nhị phân", solved: 44 },
                        { key: "twopointer", label: "Hai con trỏ", solved: 33 },
                        { key: "greedy", label: "Tham lam", solved: 21 },
                        { key: "backtrack", label: "Quay lui", solved: 12 },
                        { key: "math", label: "Toán", solved: 6 },
                    ]}
                />
            </div>
        </div>
    ),
}
