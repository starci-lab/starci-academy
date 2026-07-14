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
    title: "Blocks/EmptyState",
    component: EmptyState,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Minimal usage — only the required `title` prop.
 */
export const Default: Story = {
    args: {
        title: "Không có dữ liệu",
    },
}

/**
 * With a decorative icon above the title.
 */
export const WithIcon: Story = {
    args: {
        icon: <TrayIcon weight="duotone" />,
        title: "Chưa có khoá học nào",
    },
}

/**
 * With a supporting description below the title.
 */
export const WithDescription: Story = {
    args: {
        icon: <MagnifyingGlassIcon weight="duotone" />,
        title: "Không tìm thấy kết quả",
        description: "Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm để xem thêm kết quả.",
    },
}

/**
 * With a call-to-action rendered below the description — typically a Button.
 */
export const WithAction: Story = {
    args: {
        icon: <TrayIcon weight="duotone" />,
        title: "Chưa có bài nộp nào",
        description: "Hoàn thành thử thách đầu tiên để bắt đầu theo dõi tiến độ của bạn.",
        action: <Button variant="primary">Bắt đầu thử thách</Button>,
    },
}

/**
 * Error-flavored usage — this block has no built-in "error" variant, so the
 * error tone comes entirely from the caller-supplied icon/copy/action.
 */
export const ErrorTone: Story = {
    args: {
        icon: <WarningCircleIcon weight="duotone" />,
        title: "Không thể tải dữ liệu",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        action: <Button variant="danger">Thử lại</Button>,
    },
}

/**
 * Fully populated — icon, title, description, and action together, the
 * densest real-world composition of this block.
 */
export const FullyComposed: Story = {
    args: {
        icon: <TrayIcon weight="duotone" />,
        title: "Danh sách trống",
        description: "Bạn chưa lưu mục nào vào danh sách này.",
        action: <Button variant="primary">Thêm mục mới</Button>,
    },
}
