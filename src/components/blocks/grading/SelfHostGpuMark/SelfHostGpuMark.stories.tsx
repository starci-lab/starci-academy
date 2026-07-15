import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelfHostGpuMark } from "./index"

const meta: Meta<typeof SelfHostGpuMark> = {
    title: "Blocks/Grading/SelfHostGpuMark",
    component: SelfHostGpuMark,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SelfHostGpuMark>

/** Dùng để đánh dấu một model AI đang chạy trên GPU tự host của StarCi (ví dụ RTX 5060) thay vì gọi API ngoài. */
export const Default: Story = {
    parameters: { usage: "Dùng để đánh dấu một model AI đang chạy trên GPU tự host của StarCi (ví dụ RTX 5060) thay vì gọi API ngoài." },
    render: () => <SelfHostGpuMark />,
}
