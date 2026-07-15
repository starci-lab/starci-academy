import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { EmptyState } from "./index"

/**
 * `EmptyState` — a presentational, props-only empty-state placeholder.
 * All copy is passed in as `ReactNode`; the block never calls a translation
 * hook itself, so every story below uses static Vietnamese copy.
 */
const meta = {
    title: "Core/Feedback/EmptyState",
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
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Chỉ icon và tiêu đề</Label>
                    <Typography type="body-sm" color="muted">Dùng khi danh sách rỗng bình thường, chỉ cần báo trống mà không cần hướng dẫn hay hành động tiếp theo.</Typography>
                </div>
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Chưa có khoá học nào"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Thêm mô tả</Label>
                    <Typography type="body-sm" color="muted">Dùng khi cần gợi ý người dùng làm gì tiếp, ví dụ tìm kiếm không ra kết quả nên khuyên đổi bộ lọc hoặc từ khoá.</Typography>
                </div>
                <EmptyState
                    icon={<MagnifyingGlassIcon weight="duotone" />}
                    title="Không tìm thấy kết quả"
                    description="Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm để xem thêm kết quả."
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Kèm hành động</Label>
                    <Typography type="body-sm" color="muted">Dùng khi có thao tác tạo mục mới rõ ràng để người dùng thoát khỏi trạng thái rỗng ngay tại chỗ.</Typography>
                </div>
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Danh sách trống"
                    description="Bạn chưa lưu mục nào vào danh sách này."
                    action={<Button variant="primary">Thêm mục mới</Button>}
                />
            </div>
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
