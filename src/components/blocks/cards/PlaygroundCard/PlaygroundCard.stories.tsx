import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundCard } from "./index"

const meta: Meta<typeof PlaygroundCard> = {
    title: "Blocks/Card/PlaygroundCard",
    component: PlaygroundCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof PlaygroundCard>

/** Dùng cho lưới hub Playground khi hiển thị một bài luyện tập có số bước hướng dẫn cụ thể. */
export const Default: Story = {
    parameters: { usage: "Dùng cho lưới hub Playground khi hiển thị một bài luyện tập có số bước hướng dẫn cụ thể." },
    render: () => (
        <div className="w-72">
            <PlaygroundCard
                title="Triển khai REST API với Docker"
                stepCount={6}
                onOpen={() => {}}
            />
        </div>
    ),
}

/** Dùng khi tiêu đề bài luyện tập quá dài, cần kiểm tra hành vi cắt bớt (truncate) một dòng của tiêu đề. */
export const LongTitle: Story = {
    parameters: { usage: "Dùng khi tiêu đề bài luyện tập quá dài, cần kiểm tra hành vi cắt bớt (truncate) một dòng của tiêu đề." },
    render: () => (
        <div className="w-72">
            <PlaygroundCard
                title="Thiết kế hệ thống microservices có khả năng mở rộng cao cho nền tảng thương mại điện tử"
                stepCount={12}
                onOpen={() => {}}
            />
        </div>
    ),
}
