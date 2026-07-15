import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { EmptyState } from "./index"

/**
 * `EmptyState` — a presentational, props-only empty-state placeholder.
 * All copy is passed in as `ReactNode`; the block never calls a translation
 * hook itself, so every story below uses static Vietnamese copy.
 */
const meta = {
    title: "Blocks/Feedback/EmptyState",
    component: EmptyState,
    // default title satisfies the required prop for render-only stories (they render their own).
    args: {
        title: "Không có dữ liệu",
    },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Dùng khi chỉ cần báo "không có gì ở đây" nhanh gọn — chưa cần icon/mô tả/hành động, ví dụ ô kết quả phụ chưa có dữ liệu.
 */
export const Default: Story = {
    args: {
        title: "Không có dữ liệu",
    },
    parameters: {
        usage: "Dùng khi chỉ cần báo \"không có gì ở đây\" nhanh gọn — chưa cần icon/mô tả/hành động, ví dụ ô kết quả phụ chưa có dữ liệu.",
    },
}

/**
 * Chọn mức đầy đủ theo tình huống thật: danh sách khoá học rỗng (chỉ icon), tìm kiếm không ra kết quả (icon+mô tả gợi ý), hoặc trang danh sách trống có nút hành động để tạo mục mới.
 */
export const Compositions: Story = {
    parameters: {
        usage: "Chọn mức đầy đủ theo tình huống thật: danh sách khoá học rỗng (chỉ icon), tìm kiếm không ra kết quả (icon+mô tả gợi ý), hoặc trang danh sách trống có nút hành động để tạo mục mới.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <EmptyState
                icon={<TrayIcon weight="duotone" />}
                title="Chưa có khoá học nào"
            />
            <EmptyState
                icon={<MagnifyingGlassIcon weight="duotone" />}
                title="Không tìm thấy kết quả"
                description="Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm để xem thêm kết quả."
            />
            <EmptyState
                icon={<TrayIcon weight="duotone" />}
                title="Danh sách trống"
                description="Bạn chưa lưu mục nào vào danh sách này."
                action={<Button variant="primary">Thêm mục mới</Button>}
            />
        </div>
    ),
}

/**
 * Dùng khi tải dữ liệu thất bại (lỗi mạng, API lỗi) — icon cảnh báo + nút "Thử lại" để người dùng tự khôi phục, không phải trạng thái rỗng thông thường.
 */
export const ErrorTone: Story = {
    args: {
        icon: <WarningCircleIcon weight="duotone" />,
        title: "Không thể tải dữ liệu",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        action: <Button variant="danger">Thử lại</Button>,
    },
    parameters: {
        usage: "Dùng khi tải dữ liệu thất bại (lỗi mạng, API lỗi) — icon cảnh báo + nút \"Thử lại\" để người dùng tự khôi phục, không phải trạng thái rỗng thông thường.",
    },
}
