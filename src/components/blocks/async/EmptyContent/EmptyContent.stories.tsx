import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { EmptyContent } from "./index"

const meta: Meta<typeof EmptyContent> = {
    title: "Blocks/Async/EmptyContent",
    component: EmptyContent,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof EmptyContent>

/** Dùng khi một danh sách/khối dữ liệu không có gì để hiển thị, chỉ cần báo cho người dùng biết. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một danh sách/khối dữ liệu không có gì để hiển thị, chỉ cần báo cho người dùng biết." },
    render: () => <EmptyContent title="Chưa có nội dung nào" />,
}

/** Dùng khi lỗi tải dữ liệu có thể khắc phục bằng cách thử lại, cần nút hành động rõ ràng. */
export const WithRetry: Story = {
    parameters: { usage: "Dùng khi lỗi tải dữ liệu có thể khắc phục bằng cách thử lại, cần nút hành động rõ ràng." },
    render: () => (
        <EmptyContent
            title="Không thể tải dữ liệu"
            description="Đã có lỗi xảy ra trong lúc tải nội dung. Vui lòng thử lại."
            onRetry={() => {}}
            retryLabel="Thử lại"
        />
    ),
}

/** Dùng khi ngữ cảnh trống cụ thể (ví dụ lịch, giỏ hàng) cần icon riêng thay cho icon khay mặc định. */
export const WithCustomIcon: Story = {
    parameters: { usage: "Dùng khi ngữ cảnh trống cụ thể (ví dụ lịch, giỏ hàng) cần icon riêng thay cho icon khay mặc định." },
    render: () => (
        <EmptyContent
            icon={<CalendarBlankIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
            title="Chưa có lịch học nào"
            description="Lịch học của bạn hiện đang trống."
        />
    ),
}
