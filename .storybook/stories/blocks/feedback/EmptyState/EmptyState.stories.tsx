import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { EmptyState } from "./EmptyState"

const meta: Meta<typeof EmptyState> = {
    title: "Primitives/Feedback/EmptyState",
    component: EmptyState,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState title="Chưa có dữ liệu" />
        </div>
    ),
}

export const IconAndTitle: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState icon={<TrayIcon weight="duotone" />} title="Chưa có khoá học" />
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState
                icon={<MagnifyingGlassIcon weight="duotone" />}
                title="Không tìm thấy kết quả"
                description="Thử đổi bộ lọc hoặc từ khoá để thấy nhiều kết quả hơn."
            />
        </div>
    ),
}

export const Action: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState
                icon={<TrayIcon weight="duotone" />}
                title="Danh sách trống"
                description="Bạn chưa lưu mục nào vào danh sách này."
                action={<Button variant="primary">Thêm mục mới</Button>}
            />
        </div>
    ),
}

/** Error tone: a failed load (network / API), a `tone="danger"` warning icon + a "Thử lại" action — not an ordinary empty. */
export const ErrorTone: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState
                tone="danger"
                icon={<WarningCircleIcon weight="duotone" />}
                title="Không tải được dữ liệu"
                description="Đã có lỗi xảy ra. Vui lòng thử lại sau."
                action={<Button variant="danger">Thử lại</Button>}
            />
        </div>
    ),
}
