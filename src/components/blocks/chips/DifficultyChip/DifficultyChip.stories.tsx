import type { Meta, StoryObj } from "@storybook/nextjs"
import { DifficultyChip } from "./index"

const meta: Meta<typeof DifficultyChip> = {
    title: "Blocks/Chip/DifficultyChip",
    component: DifficultyChip,
}
export default meta
type Story = StoryObj<typeof DifficultyChip>

/** Dùng khi cần so sánh toàn bộ thang độ khó cạnh nhau để thấy màu tăng dần từ beginner đến insane. */
export const AllDifficulties: Story = {
    parameters: { usage: "Dùng khi cần so sánh toàn bộ thang độ khó cạnh nhau để thấy màu tăng dần từ beginner (success) đến insane (accent)." },
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            {(["beginner", "intermediate", "advanced", "insane"] as const).map((difficulty) => (
                <div key={difficulty} className="flex flex-col items-start gap-1">
                    <span className="text-tiny text-default-500">{difficulty}</span>
                    <DifficultyChip difficulty={difficulty} />
                </div>
            ))}
        </div>
    ),
}

/** Dùng khi muốn hiển thị nhãn tuỳ chỉnh thay vì tên độ khó mặc định, ví dụ ghi rõ ngôn ngữ hiển thị. */
export const CustomLabel: Story = {
    parameters: { usage: "Dùng khi muốn hiển thị nhãn tuỳ chỉnh thay vì tên độ khó mặc định, ví dụ ghi rõ ngôn ngữ hiển thị." },
    render: () => <DifficultyChip difficulty="advanced" label="Nâng cao" />,
}
