import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseProgressBar } from "./index"

const meta: Meta<typeof CourseProgressBar> = {
    title: "Blocks/CourseProgressBar",
    component: CourseProgressBar,
}
export default meta
type Story = StoryObj<typeof CourseProgressBar>

/** Dùng khi cần hiển thị tiến độ khóa học theo 3 chiều nội dung/thử thách/dự án cùng lúc, mỗi chiều một làn riêng để không bị lệch tỉ lệ. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần hiển thị tiến độ khóa học theo 3 chiều nội dung/thử thách/dự án cùng lúc, mỗi chiều một làn riêng để không bị lệch tỉ lệ." },
    render: () => (
        <div className="w-80">
            <CourseProgressBar
                ariaLabel="Tiến độ khóa học Fullstack Mastery"
                dims={[
                    { key: "content", label: "Nội dung", completed: 62, total: 87 },
                    { key: "challenge", label: "Thử thách", completed: 140, total: 329 },
                    { key: "milestone", label: "Dự án", completed: 3, total: 5 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi muốn nhấn mạnh tỉ lệ hoàn thành ở gần mức tối đa để học viên thấy sắp cán đích. */
export const GanHoanThanh: Story = {
    parameters: { usage: "Dùng khi muốn nhấn mạnh tỉ lệ hoàn thành ở gần mức tối đa để học viên thấy sắp cán đích." },
    render: () => (
        <div className="w-80">
            <CourseProgressBar
                ariaLabel="Tiến độ khóa học sắp hoàn thành"
                dims={[
                    { key: "content", label: "Nội dung", completed: 85, total: 87 },
                    { key: "challenge", label: "Thử thách", completed: 320, total: 329 },
                    { key: "milestone", label: "Dự án", completed: 5, total: 5 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi một chiều tiến độ chưa có dữ liệu (total = 0) — làn đó tự ẩn thay vì hiển thị vạch rỗng gây hiểu lầm. */
export const ThieuMotChieu: Story = {
    parameters: { usage: "Dùng khi một chiều tiến độ chưa có dữ liệu (total = 0) — làn đó tự ẩn thay vì hiển thị vạch rỗng gây hiểu lầm." },
    render: () => (
        <div className="w-80">
            <CourseProgressBar
                ariaLabel="Tiến độ khóa học chưa có dự án"
                dims={[
                    { key: "content", label: "Nội dung", completed: 40, total: 87 },
                    { key: "challenge", label: "Thử thách", completed: 90, total: 329 },
                    { key: "milestone", label: "Dự án", completed: 0, total: 0 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi cần đặt bar cạnh nội dung khác đã có chú thích riêng, ẩn legend để tiết kiệm chiều cao. */
export const AnLegend: Story = {
    parameters: { usage: "Dùng khi cần đặt bar cạnh nội dung khác đã có chú thích riêng, ẩn legend để tiết kiệm chiều cao." },
    render: () => (
        <div className="w-80">
            <CourseProgressBar
                ariaLabel="Tiến độ khóa học không kèm chú thích"
                hideLegend
                dims={[
                    { key: "content", label: "Nội dung", completed: 62, total: 87 },
                    { key: "challenge", label: "Thử thách", completed: 140, total: 329 },
                    { key: "milestone", label: "Dự án", completed: 3, total: 5 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi muốn dùng màu tùy chỉnh cho từng chiều thay vì bảng màu mặc định, ví dụ để khớp thương hiệu khóa học. */
export const MauTuyChinh: Story = {
    parameters: { usage: "Dùng khi muốn dùng màu tùy chỉnh cho từng chiều thay vì bảng màu mặc định, ví dụ để khớp thương hiệu khóa học." },
    render: () => (
        <div className="w-80">
            <CourseProgressBar
                ariaLabel="Tiến độ khóa học với màu tùy chỉnh"
                dims={[
                    { key: "content", label: "Nội dung", completed: 62, total: 87, color: "#6366f1" },
                    { key: "challenge", label: "Thử thách", completed: 140, total: 329, color: "#ec4899" },
                    { key: "milestone", label: "Dự án", completed: 3, total: 5, color: "#f59e0b" },
                ]}
            />
        </div>
    ),
}
