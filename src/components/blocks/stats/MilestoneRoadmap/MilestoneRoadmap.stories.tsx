import type { Meta, StoryObj } from "@storybook/nextjs"
import { MilestoneRoadmap } from "./index"

const meta: Meta<typeof MilestoneRoadmap> = {
    title: "Blocks/Stat/MilestoneRoadmap",
    component: MilestoneRoadmap,
}
export default meta
type Story = StoryObj<typeof MilestoneRoadmap>

/** Dùng khi lộ trình có milestone đã hoàn thành, milestone đang làm dở và milestone chưa bắt đầu, để học viên thấy tiến độ tổng thể trong khóa học. */
export const Default: Story = {
    parameters: { usage: "Dùng khi lộ trình có milestone đã hoàn thành, milestone đang làm dở và milestone chưa bắt đầu, để học viên thấy tiến độ tổng thể trong khóa học." },
    render: () => (
        <MilestoneRoadmap
            milestones={[
                { title: "Nhập môn lập trình", passedTasks: 5, totalTasks: 5 },
                { title: "Xây dựng API cơ bản", passedTasks: 5, totalTasks: 5 },
                { title: "Cơ sở dữ liệu quan hệ", passedTasks: 2, totalTasks: 4 },
                { title: "Xác thực & phân quyền", passedTasks: 0, totalTasks: 3 },
                { title: "Triển khai sản phẩm", passedTasks: 0, totalTasks: 4 },
            ]}
        />
    ),
}

/** Dùng khi khóa học có rất nhiều milestone để kiểm tra roadmap cuộn ngang mượt mà thay vì bị bóp méo. */
export const LongRoadmap: Story = {
    parameters: { usage: "Dùng khi khóa học có rất nhiều milestone để kiểm tra roadmap cuộn ngang mượt mà thay vì bị bóp méo." },
    render: () => (
        <div className="w-80">
            <MilestoneRoadmap
                milestones={Array.from({ length: 16 }, (_, index) => ({
                    title: `Milestone ${index + 1}`,
                    passedTasks: index < 6 ? 3 : index === 6 ? 1 : 0,
                    totalTasks: 3,
                }))}
            />
        </div>
    ),
}
