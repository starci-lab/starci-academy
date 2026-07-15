import type { Meta, StoryObj } from "@storybook/nextjs"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { EmptyContent } from "./index"

const meta: Meta<typeof EmptyContent> = {
    title: "Blocks/EmptyContent",
    component: EmptyContent,
}

export default meta

type Story = StoryObj<typeof EmptyContent>

/** Empty state chuẩn cho `AsyncContent`: tray icon + title (+ mô tả), canh giữa. Text đến từ caller (đã dịch). */
export const Default: Story = {
    parameters: { usage: "Empty state chuẩn cho AsyncContent: tray icon + title (+ mô tả), canh giữa." },
    args: { title: "Chưa có mục nào", description: "Hoàn thành 1 thử thách để thấy nó ở đây." },
}

/** Có retry: `onRetry` + `retryLabel` (cả hai) → hiện nút thử lại. Dùng khi trống VÌ lỗi tải nhẹ, có thể refetch. */
export const WithRetry: Story = {
    parameters: { usage: "onRetry + retryLabel → nút thử lại. Cho trạng thái trống có thể refetch." },
    args: { title: "Chưa tải được nội dung", onRetry: () => {}, retryLabel: "Thử lại" },
}

/** `icon` override — thay tray mặc định bằng icon hợp ngữ cảnh (VD tìm kiếm không ra kết quả). */
export const CustomIcon: Story = {
    parameters: { usage: "icon override — hợp ngữ cảnh (VD tìm kiếm không ra kết quả)." },
    args: {
        title: "Không tìm thấy kết quả",
        description: "Thử từ khoá khác hoặc bớt bộ lọc.",
        icon: <MagnifyingGlassIcon className="size-8 text-muted" aria-hidden focusable="false" />,
    },
}
