import type { Meta, StoryObj } from "@storybook/nextjs"
import { CodeIcon } from "@phosphor-icons/react"
import { TopicLane } from "./index"

const meta: Meta<typeof TopicLane> = {
    title: "Blocks/Marketing/TopicLane",
    component: TopicLane,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof TopicLane>

/** Dùng để show một lane chủ đề với các dòng có thể bấm để điều hướng đến khoá/bài học tương ứng. */
export const Default: Story = {
    parameters: { usage: "Dùng để show một lane chủ đề với các dòng có thể bấm để điều hướng đến khoá/bài học tương ứng." },
    render: () => (
        <div className="w-80">
            <TopicLane
                icon={<CodeIcon weight="bold" />}
                title="Chủ đề mã nguồn"
                items={[
                    { label: "Thiết kế REST API chuẩn RESTful", tag: "FS", onPress: () => {} },
                    { label: "Tối ưu truy vấn N+1 trong ORM", tag: "FS", onPress: () => {} },
                    { label: "Chiến lược cache đa tầng", tag: "SD", onPress: () => {} },
                ]}
            />
        </div>
    ),
}

/** Dùng để kiểm tra tiêu đề dòng dài bị cắt gọn (truncate) mà không phá vỡ bố cục lane. */
export const LongTitleTruncation: Story = {
    parameters: { usage: "Dùng để kiểm tra tiêu đề dòng dài bị cắt gọn (truncate) mà không phá vỡ bố cục lane." },
    render: () => (
        <div className="w-80">
            <TopicLane
                icon={<CodeIcon weight="bold" />}
                title="Chủ đề mã nguồn"
                items={[
                    {
                        label: "Thiết kế hệ thống phân tán chịu lỗi cao với chiến lược retry, circuit breaker và idempotency key cho các dịch vụ thanh toán",
                        tag: "SD",
                        onPress: () => {},
                    },
                ]}
            />
        </div>
    ),
}

/** Dùng khi lane chưa có chủ đề nào để kiểm tra bố cục chỉ còn tiêu đề và icon. */
export const EmptyItems: Story = {
    parameters: { usage: "Dùng khi lane chưa có chủ đề nào để kiểm tra bố cục chỉ còn tiêu đề và icon." },
    render: () => (
        <div className="w-80">
            <TopicLane icon={<CodeIcon weight="bold" />} title="Chủ đề mã nguồn" items={[]} />
        </div>
    ),
}
