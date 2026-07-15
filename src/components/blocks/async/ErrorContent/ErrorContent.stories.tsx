import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudWarningIcon } from "@phosphor-icons/react"
import { ErrorContent } from "./index"

const meta: Meta<typeof ErrorContent> = {
    title: "Blocks/Async/ErrorContent",
    component: ErrorContent,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ErrorContent>

/** Dùng làm errorContent mặc định của AsyncContent khi một request tải dữ liệu thất bại và người dùng có thể thử lại. */
export const Default: Story = {
    parameters: { usage: "Dùng làm errorContent mặc định của AsyncContent khi một request tải dữ liệu thất bại và người dùng có thể thử lại." },
    render: () => (
        <ErrorContent
            title="Không thể tải dữ liệu"
            description="Đã có lỗi xảy ra, vui lòng thử lại sau."
            onRetry={() => {}}
            retryLabel="Thử lại"
        />
    ),
}

/** Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào để đề xuất cho người dùng. */
export const WithoutRetry: Story = {
    parameters: { usage: "Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào để đề xuất cho người dùng." },
    render: () => <ErrorContent title="Không tìm thấy nội dung" />,
}

/** Dùng khi muốn thay icon cảnh báo mặc định bằng một icon phù hợp hơn với ngữ cảnh lỗi cụ thể. */
export const CustomIcon: Story = {
    parameters: { usage: "Dùng khi muốn thay icon cảnh báo mặc định bằng một icon phù hợp hơn với ngữ cảnh lỗi cụ thể." },
    render: () => (
        <ErrorContent
            icon={<CloudWarningIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
            title="Máy chủ đang bảo trì"
            description="Vui lòng quay lại sau ít phút nữa."
            onRetry={() => {}}
            retryLabel="Kiểm tra lại"
        />
    ),
}
