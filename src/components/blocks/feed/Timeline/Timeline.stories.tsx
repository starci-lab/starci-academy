import type { Meta, StoryObj } from "@storybook/nextjs"
import { Timeline } from "./index"

const meta: Meta<typeof Timeline> = {
    title: "Blocks/Feed/Timeline",
    component: Timeline,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof Timeline>

const TimelineRow = ({ title, time }: { title: string; time: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted">{time}</span>
    </div>
)

/** Dùng khi cần hiển thị chuỗi hoạt động hoặc lần thử theo thứ tự thời gian, nối bằng một đường kẻ dọc bên trái. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần hiển thị chuỗi hoạt động hoặc lần thử theo thứ tự thời gian, nối bằng một đường kẻ dọc bên trái." },
    render: () => (
        <div className="w-[360px]">
            <Timeline>
                <TimelineRow title="Nộp bài tập Module 3" time="2 giờ trước" />
                <TimelineRow title="Hoàn thành bài kiểm tra" time="Hôm qua, 14:20" />
                <TimelineRow title="Bắt đầu khoá học" time="3 ngày trước" />
            </Timeline>
        </div>
    ),
}

/** Dùng khi timeline chỉ có một mốc duy nhất, ví dụ vừa mới bắt đầu một hoạt động. */
export const SingleItem: Story = {
    parameters: { usage: "Dùng khi timeline chỉ có một mốc duy nhất, ví dụ vừa mới bắt đầu một hoạt động." },
    render: () => (
        <div className="w-[360px]">
            <Timeline>
                <TimelineRow title="Đăng ký khoá học Fullstack Mastery" time="Vừa xong" />
            </Timeline>
        </div>
    ),
}
