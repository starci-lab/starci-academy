import type { Meta, StoryObj } from "@storybook/nextjs"
import { Legend } from "./index"

const meta: Meta<typeof Legend> = {
    title: "Blocks/Legend",
    component: Legend,
}
export default meta
type Story = StoryObj<typeof Legend>

/** Dùng khi cần chú giải các mức độ khó của bài học đi kèm một thanh phân đoạn màu. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần chú giải các mức độ khó của bài học đi kèm một thanh phân đoạn màu." },
    render: () => (
        <Legend
            items={[
                { key: "easy", label: "Dễ", color: "var(--success)" },
                { key: "medium", label: "Trung bình", color: "var(--warning)" },
                { key: "hard", label: "Khó", color: "var(--danger)" },
            ]}
        />
    ),
}

/** Dùng khi legend cần thể hiện nhiều nhóm cùng lúc và nên tự xuống dòng khi tràn hàng. */
export const NhieuMuc: Story = {
    parameters: { usage: "Dùng khi legend cần thể hiện nhiều nhóm cùng lúc và nên tự xuống dòng khi tràn hàng." },
    render: () => (
        <div className="max-w-[220px]">
            <Legend
                items={[
                    { key: "javascript", label: "JavaScript", color: "var(--warning)" },
                    { key: "typescript", label: "TypeScript", color: "var(--primary)" },
                    { key: "python", label: "Python", color: "var(--success)" },
                    { key: "go", label: "Go", color: "var(--info)" },
                    { key: "java", label: "Java", color: "var(--danger)" },
                ]}
            />
        </div>
    ),
}

/** Dùng khi chỉ cần phân biệt hai trạng thái đối lập, ví dụ đã học và chưa học. */
export const HaiMuc: Story = {
    parameters: { usage: "Dùng khi chỉ cần phân biệt hai trạng thái đối lập, ví dụ đã học và chưa học." },
    render: () => (
        <Legend
            items={[
                { key: "done", label: "Đã hoàn thành", color: "var(--success)" },
                { key: "pending", label: "Chưa hoàn thành", color: "var(--muted)" },
            ]}
        />
    ),
}

/** Dùng khi nhãn legend dài hơn bình thường, để kiểm tra chấm màu không bị co lại theo chữ. */
export const NhanDai: Story = {
    parameters: { usage: "Dùng khi nhãn legend dài hơn bình thường, để kiểm tra chấm màu không bị co lại theo chữ." },
    render: () => (
        <div className="max-w-[260px]">
            <Legend
                items={[
                    { key: "senior", label: "Senior/Staff — câu hỏi hệ thống hoá kiến trúc", color: "var(--primary)" },
                    { key: "junior", label: "Junior — câu hỏi nền tảng cơ bản", color: "var(--secondary)" },
                ]}
            />
        </div>
    ),
}
