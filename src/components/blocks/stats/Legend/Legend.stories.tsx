import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Legend } from "./index"

const meta: Meta<typeof Legend> = {
    title: "Core/Stat/Legend",
    component: Legend,
}
export default meta
type Story = StoryObj<typeof Legend>

/** Dùng khi cần chú giải các mức độ khó của bài học đi kèm một thanh phân đoạn màu. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần chú giải các mức độ khó của bài học đi kèm một thanh phân đoạn màu." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chú giải cơ bản</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi cần chú giải vài mức đi kèm một thanh phân đoạn màu — chấm màu + nhãn nằm gọn một hàng.
                </Typography>
            </div>
            <Legend
                items={[
                    { key: "easy", label: "Dễ", color: "var(--success)" },
                    { key: "medium", label: "Trung bình", color: "var(--warning)" },
                    { key: "hard", label: "Khó", color: "var(--danger)" },
                ]}
            />
        </div>
    ),
}

/** Dùng khi legend cần thể hiện nhiều nhóm cùng lúc và nên tự xuống dòng khi tràn hàng. */
export const NhieuMuc: Story = {
    parameters: { usage: "Dùng khi legend cần thể hiện nhiều nhóm cùng lúc và nên tự xuống dòng khi tràn hàng." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhiều mục</Label>
                <Typography type="body-sm" color="muted">
                    Khi số nhóm nhiều và khối hẹp, legend tự xuống dòng khi tràn hàng thay vì tràn khỏi khối.
                </Typography>
            </div>
            <div className="max-w-[220px]">
                <Legend
                    items={[
                        { key: "javascript", label: "JavaScript", color: "var(--warning)" },
                        { key: "typescript", label: "TypeScript", color: "var(--accent)" },
                        { key: "python", label: "Python", color: "var(--success)" },
                        { key: "go", label: "Go", color: "var(--heat-3)" },
                        { key: "java", label: "Java", color: "var(--danger)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Dùng khi nhãn legend dài hơn bình thường, để kiểm tra chấm màu không bị co lại theo chữ. */
export const NhanDai: Story = {
    parameters: { usage: "Dùng khi nhãn legend dài hơn bình thường, để kiểm tra chấm màu không bị co lại theo chữ." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhãn dài</Label>
                <Typography type="body-sm" color="muted">
                    Khi nhãn dài hơn bình thường, kiểm tra chấm màu giữ nguyên kích thước thay vì co lại theo chữ.
                </Typography>
            </div>
            <div className="max-w-[260px]">
                <Legend
                    items={[
                        { key: "senior", label: "Senior/Staff — câu hỏi hệ thống hoá kiến trúc", color: "var(--accent)" },
                        { key: "junior", label: "Junior — câu hỏi nền tảng cơ bản", color: "var(--success)" },
                    ]}
                />
            </div>
        </div>
    ),
}
