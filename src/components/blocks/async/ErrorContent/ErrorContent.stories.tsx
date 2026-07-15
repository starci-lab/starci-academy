import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudWarningIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { ErrorContent } from "./index"

const meta: Meta<typeof ErrorContent> = {
    title: "Core/Async/ErrorContent",
    component: ErrorContent,
}
export default meta
type Story = StoryObj<typeof ErrorContent>

/** Dùng làm errorContent mặc định của AsyncContent khi một request tải dữ liệu thất bại và người dùng có thể thử lại. */
export const Default: Story = {
    parameters: { usage: "Dùng làm errorContent mặc định của AsyncContent khi một request tải dữ liệu thất bại và người dùng có thể thử lại." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Lỗi tải mà thử lại có thể cứu được — đây là errorContent mặc định của AsyncContent.
                </Typography>
            </div>
            <ErrorContent
                title="Không thể tải dữ liệu"
                description="Đã có lỗi xảy ra, vui lòng thử lại sau."
                onRetry={() => {}}
                retryLabel="Thử lại"
            />
        </div>
    ),
}

/** Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào để đề xuất cho người dùng. */
export const WithoutRetry: Story = {
    parameters: { usage: "Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào để đề xuất cho người dùng." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không có nút thử lại</Label>
                <Typography type="body-sm" color="muted">
                    Lỗi mà thử lại KHÔNG cứu được (không tìm thấy, không có quyền) — đừng mời bấm một nút không giúp được gì.
                </Typography>
            </div>
            <ErrorContent title="Không tìm thấy nội dung" />
        </div>
    ),
}

/** Dùng khi muốn thay icon cảnh báo mặc định bằng một icon phù hợp hơn với ngữ cảnh lỗi cụ thể. */
export const CustomIcon: Story = {
    parameters: { usage: "Dùng khi muốn thay icon cảnh báo mặc định bằng một icon phù hợp hơn với ngữ cảnh lỗi cụ thể." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Icon riêng</Label>
                <Typography type="body-sm" color="muted">
                    Loại lỗi mà một icon nói rõ hơn octagon cảnh báo chung (bảo trì, mất mạng).
                </Typography>
            </div>
            <ErrorContent
                icon={<CloudWarningIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="Máy chủ đang bảo trì"
                description="Vui lòng quay lại sau ít phút nữa."
                onRetry={() => {}}
                retryLabel="Kiểm tra lại"
            />
        </div>
    ),
}
