import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
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

/**
 * Folded from the deleted `ErrorState` port: `tone="danger"` + a duotone warning
 * icon + a small secondary retry button — the exact shape ErrorState delegated to.
 */
export const DangerRetry: Story = {
    render: () => (
        <div className="p-8">
            <EmptyState
                tone="danger"
                icon={<WarningIcon weight="duotone" />}
                title="Mất kết nối"
                description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                action={(
                    <Button variant="secondary" size="sm">Thử lại</Button>
                )}
            />
        </div>
    ),
}

/** Folded from the deleted `ErrorPageState` port: `size="page"` — full-page 404, with a large muted `code` numeral above the title. */
export const FullPage404: Story = {
    render: () => (
        <EmptyState
            size="page"
            code="404"
            title="Không tìm thấy trang"
            description="Trang bạn tìm không tồn tại hoặc đã được chuyển đi."
            action={<Button variant="primary">Trang chủ</Button>}
        />
    ),
}

/** Folded from the deleted `ErrorPageState` port: `size="page"` — full-page 500, with two actions (retry + home) centered in a wrapping row. */
export const FullPage500: Story = {
    render: () => (
        <EmptyState
            size="page"
            code="500"
            title="Đã có lỗi xảy ra"
            description="Máy chủ gặp sự cố khi xử lý yêu cầu. Thử lại sau giây lát nhé."
            action={(
                <>
                    <Button variant="primary">Thử lại</Button>
                    <Button variant="tertiary">Trang chủ</Button>
                </>
            )}
        />
    ),
}

/** Folded from the deleted `SimpleEmptyState` port: `size="compact"` — a single muted title-only line, for a lightweight placeholder inside a tab or panel body. */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-64">
                <EmptyState size="compact" title="No submissions for this exercise yet." />
            </div>
        </div>
    ),
}
