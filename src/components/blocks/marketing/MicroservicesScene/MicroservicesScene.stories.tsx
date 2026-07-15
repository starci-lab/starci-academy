import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesScene } from "./index"

const meta: Meta<typeof MicroservicesScene> = {
    title: "Blocks/Marketing/MicroservicesScene",
    component: MicroservicesScene,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof MicroservicesScene>

/** Dùng ở hero System Design / DevOps khi cần minh hoạ kèm chú thích ngắn giải thích điểm nghẽn hạ tầng. */
export const Default: Story = {
    parameters: { usage: "Dùng ở hero System Design / DevOps khi cần minh hoạ kèm chú thích ngắn giải thích điểm nghẽn hạ tầng." },
    render: () => (
        <div className="w-[680px] max-w-full">
            <MicroservicesScene caption="Một database duy nhất cho cả cụm dịch vụ — điểm nghẽn kinh điển khi hệ thống scale." />
        </div>
    ),
}

/** Dùng khi minh hoạ chỉ đóng vai trò trang trí thuần tuý và ngữ cảnh xung quanh đã tự giải thích, không cần chú thích lặp lại. */
export const WithoutCaption: Story = {
    parameters: { usage: "Dùng khi minh hoạ chỉ đóng vai trò trang trí thuần tuý và ngữ cảnh xung quanh đã tự giải thích, không cần chú thích lặp lại." },
    render: () => (
        <div className="w-[680px] max-w-full">
            <MicroservicesScene />
        </div>
    ),
}
