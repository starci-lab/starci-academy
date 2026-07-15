import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"
import { EmptyContent } from "./index"

const meta: Meta<typeof EmptyContent> = {
    title: "Blocks/Async/EmptyContent",
    component: EmptyContent,
}
export default meta
type Story = StoryObj<typeof EmptyContent>

/** Dùng khi một danh sách/khối dữ liệu không có gì để hiển thị, chỉ cần báo cho người dùng biết. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một danh sách/khối dữ liệu không có gì để hiển thị, chỉ cần báo cho người dùng biết." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Chỉ báo trống, không có hành động nào để đề xuất — danh sách chưa có gì và đó là chuyện bình thường.
                </Typography>
            </div>
            <EmptyContent title="Chưa có nội dung nào" />
        </div>
    ),
}

/** Dùng khi lỗi tải dữ liệu có thể khắc phục bằng cách thử lại, cần nút hành động rõ ràng. */
export const WithRetry: Story = {
    parameters: { usage: "Dùng khi lỗi tải dữ liệu có thể khắc phục bằng cách thử lại, cần nút hành động rõ ràng." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có nút thử lại</Label>
                <Typography type="body-sm" color="muted">
                    Trống vì tải hỏng và người dùng bấm thử lại được. Cần CẢ onRetry LẪN retryLabel — thiếu một cái là nút không render.
                </Typography>
            </div>
            <EmptyContent
                title="Không thể tải dữ liệu"
                description="Đã có lỗi xảy ra trong lúc tải nội dung. Vui lòng thử lại."
                onRetry={() => {}}
                retryLabel="Thử lại"
            />
        </div>
    ),
}

/** Dùng khi ngữ cảnh trống cụ thể (ví dụ lịch, giỏ hàng) cần icon riêng thay cho icon khay mặc định. */
export const WithCustomIcon: Story = {
    parameters: { usage: "Dùng khi ngữ cảnh trống cụ thể (ví dụ lịch, giỏ hàng) cần icon riêng thay cho icon khay mặc định." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Icon riêng</Label>
                <Typography type="body-sm" color="muted">
                    Ngữ cảnh trống cụ thể (lịch, giỏ hàng) mà icon khay mặc định nói chung chung quá.
                </Typography>
            </div>
            <EmptyContent
                icon={<CalendarBlankIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="Chưa có lịch học nào"
                description="Lịch học của bạn hiện đang trống."
            />
        </div>
    ),
}
