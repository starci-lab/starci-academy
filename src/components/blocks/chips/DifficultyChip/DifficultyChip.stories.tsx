import type { Meta, StoryObj } from "@storybook/nextjs"
import { DifficultyChip } from "./index"

const meta: Meta<typeof DifficultyChip> = {
    title: "Blocks/DifficultyChip",
    component: DifficultyChip,
}
export default meta
type Story = StoryObj<typeof DifficultyChip>

/** Dùng khi thẻ nội dung dành cho người mới bắt đầu, để người học nhận diện độ khó thấp nhất. */
export const Beginner: Story = {
    parameters: { usage: "Dùng khi thẻ nội dung dành cho người mới bắt đầu, để người học nhận diện độ khó thấp nhất." },
    render: () => <DifficultyChip difficulty="beginner" />,
}

/** Dùng khi thẻ nội dung ở mức trung cấp, cần màu cảnh báo nhẹ để phân biệt với beginner. */
export const Intermediate: Story = {
    parameters: { usage: "Dùng khi thẻ nội dung ở mức trung cấp, cần màu cảnh báo nhẹ để phân biệt với beginner." },
    render: () => <DifficultyChip difficulty="intermediate" />,
}

/** Dùng khi thẻ nội dung nâng cao, cần nhấn mạnh mức độ thử thách bằng màu danger. */
export const Advanced: Story = {
    parameters: { usage: "Dùng khi thẻ nội dung nâng cao, cần nhấn mạnh mức độ thử thách bằng màu danger." },
    render: () => <DifficultyChip difficulty="advanced" />,
}

/** Dùng khi thẻ nội dung ở mức khó nhất (insane), cần màu accent nổi bật để cảnh báo độ khó cực cao. */
export const Insane: Story = {
    parameters: { usage: "Dùng khi thẻ nội dung ở mức khó nhất (insane), cần màu accent nổi bật để cảnh báo độ khó cực cao." },
    render: () => <DifficultyChip difficulty="insane" />,
}

/** Dùng khi muốn hiển thị nhãn tuỳ chỉnh thay vì tên độ khó mặc định, ví dụ ghi rõ ngôn ngữ hiển thị. */
export const CustomLabel: Story = {
    parameters: { usage: "Dùng khi muốn hiển thị nhãn tuỳ chỉnh thay vì tên độ khó mặc định, ví dụ ghi rõ ngôn ngữ hiển thị." },
    render: () => <DifficultyChip difficulty="advanced" label="Nâng cao" />,
}
