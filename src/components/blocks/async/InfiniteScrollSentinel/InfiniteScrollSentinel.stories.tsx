import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfiniteScrollSentinel } from "./index"

const meta: Meta<typeof InfiniteScrollSentinel> = {
    title: "Blocks/Async/InfiniteScrollSentinel",
    component: InfiniteScrollSentinel,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof InfiniteScrollSentinel>

/** Đặt sentinel ẩn cuối danh sách để tự động tải thêm dữ liệu khi người dùng cuộn tới đáy. */
export const Default: Story = {
    parameters: { usage: "Đặt sentinel ẩn cuối danh sách để tự động tải thêm dữ liệu khi người dùng cuộn tới đáy." },
    render: () => (
        <div className="w-64 border border-dashed border-default-300 p-4">
            <p className="mb-2 text-sm text-default-500">Danh sách khóa học...</p>
            <InfiniteScrollSentinel onReach={() => {}} />
        </div>
    ),
}
