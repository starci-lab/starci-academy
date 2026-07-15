import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { MilestoneRoadmap } from "./index"

const meta: Meta<typeof MilestoneRoadmap> = {
    title: "Core/Stat/MilestoneRoadmap",
    component: MilestoneRoadmap,
}
export default meta
type Story = StoryObj<typeof MilestoneRoadmap>

/**
 * Dùng để tóm tắt chặng đường cột mốc của khóa thành một dải chấm nối nhau, tô màu theo mức hoàn thành: xong
 * (chấm đặc), đang dở (chấm viền), chưa bắt đầu (chấm mờ). Đọc lướt là biết đang ở đâu trên lộ trình mà không
 * tốn chỗ. Di chuột lên chấm hiện tên + số task đã qua.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng để tóm tắt chặng đường cột mốc của khóa thành một dải chấm nối nhau, tô màu theo mức hoàn " +
            "thành: xong (chấm đặc), đang dở (chấm viền), chưa bắt đầu (chấm mờ). Đọc lướt là biết đang ở đâu " +
            "trên lộ trình mà không tốn chỗ. Di chuột lên chấm hiện tên + số task đã qua.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lộ trình hỗn hợp</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi các cột mốc đang ở nhiều mức khác nhau — chấm đặc là xong, chấm viền là đang dở,
                    chấm mờ là chưa bắt đầu, đọc lướt biết ngay đang ở đâu.
                </Typography>
            </div>
            <div className="w-96">
                <MilestoneRoadmap
                    milestones={[
                        { title: "Nền tảng web", passedTasks: 5, totalTasks: 5 },
                        { title: "React cơ bản", passedTasks: 4, totalTasks: 4 },
                        { title: "State & data", passedTasks: 2, totalTasks: 5 },
                        { title: "Backend API", passedTasks: 0, totalTasks: 6 },
                        { title: "Triển khai", passedTasks: 0, totalTasks: 3 },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Lộ trình dài tự cuộn ngang trong khối hẹp thay vì nén các chấm dính vào nhau — kiểm tra chấm giữ nguyên cỡ, chỉ tràn ngang. */
export const LoTrinhDai: Story = {
    parameters: {
        usage: "Lộ trình dài tự cuộn ngang trong khối hẹp thay vì nén các chấm dính vào nhau — kiểm tra chấm giữ nguyên cỡ, chỉ tràn ngang.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lộ trình dài</Label>
                <Typography type="body-sm" color="muted">
                    Khi có nhiều cột mốc, dải tự cuộn ngang trong khối hẹp thay vì nén các chấm dính vào nhau —
                    chấm giữ nguyên cỡ, chỉ tràn ngang.
                </Typography>
            </div>
            <div className="w-72">
                <MilestoneRoadmap
                    milestones={[
                        { title: "Cột mốc 1", passedTasks: 4, totalTasks: 4 },
                        { title: "Cột mốc 2", passedTasks: 3, totalTasks: 3 },
                        { title: "Cột mốc 3", passedTasks: 5, totalTasks: 5 },
                        { title: "Cột mốc 4", passedTasks: 2, totalTasks: 4 },
                        { title: "Cột mốc 5", passedTasks: 0, totalTasks: 5 },
                        { title: "Cột mốc 6", passedTasks: 0, totalTasks: 3 },
                        { title: "Cột mốc 7", passedTasks: 0, totalTasks: 6 },
                        { title: "Cột mốc 8", passedTasks: 0, totalTasks: 4 },
                        { title: "Cột mốc 9", passedTasks: 0, totalTasks: 2 },
                    ]}
                />
            </div>
        </div>
    ),
}
