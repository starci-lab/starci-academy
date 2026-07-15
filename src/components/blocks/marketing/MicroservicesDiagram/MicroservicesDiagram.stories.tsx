import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesDiagram } from "./index"

const meta: Meta<typeof MicroservicesDiagram> = {
    title: "Blocks/Marketing/MicroservicesDiagram",
    component: MicroservicesDiagram,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof MicroservicesDiagram>

/** Dùng làm minh hoạ hero cho trang marketing System Design, có caption giải thích sơ đồ bên dưới. */
export const Default: Story = {
    parameters: { usage: "Dùng làm minh hoạ hero cho trang marketing System Design, có caption giải thích sơ đồ bên dưới." },
    render: () => (
        <div className="w-[560px]">
            <MicroservicesDiagram caption="order-service.v2 — một kiến trúc microservices ngây thơ với 3 điểm lỗi kinh điển." />
        </div>
    ),
}

/** Dùng khi sơ đồ đã có ngữ cảnh từ tiêu đề/đoạn văn xung quanh nên không cần lặp lại caption. */
export const WithoutCaption: Story = {
    parameters: { usage: "Dùng khi sơ đồ đã có ngữ cảnh từ tiêu đề/đoạn văn xung quanh nên không cần lặp lại caption." },
    render: () => (
        <div className="w-[560px]">
            <MicroservicesDiagram />
        </div>
    ),
}