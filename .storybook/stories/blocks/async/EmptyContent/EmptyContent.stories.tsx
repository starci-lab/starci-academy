import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { EmptyContent } from "./EmptyContent"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof EmptyContent> = {
    title: "Block/Async/EmptyContent",
    component: EmptyContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EmptyContent>

const ANATOMY = {
    primitives: [{ name: "EmptyState", role: "khung icon + tiêu đề + mô tả + action, canh giữa" }],
    reason:
        "Trạng thái rỗng của một vùng dữ liệu async cần đúng anatomy của EmptyState (icon + tiêu đề + mô tả + action canh giữa). EmptyContent chỉ thêm icon TrayIcon mặc định và gói onRetry/retryLabel thành nút trong slot action — nên nó là một lớp mỏng trên EmptyState, không nên tự vẽ lại.",
}

export const Basic: Story = {
    render: () => blockShell(<EmptyContent title="Chưa có dữ liệu" />, ANATOMY),
}

export const WithDescription: Story = {
    render: () =>
        blockShell(
            <EmptyContent
                title="Danh sách trống"
                description="Bạn chưa lưu mục nào vào danh sách này."
            />,
            ANATOMY,
        ),
}

export const WithRetry: Story = {
    render: () =>
        blockShell(
            <EmptyContent
                title="Không tìm thấy kết quả"
                description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
                onRetry={() => {}}
                retryLabel="Tải lại"
            />,
            ANATOMY,
        ),
}

export const CustomIcon: Story = {
    render: () =>
        blockShell(
            <EmptyContent
                icon={<MagnifyingGlassIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="Không có kết quả khớp"
                description="Không có mục nào khớp với từ khoá bạn nhập."
            />,
            ANATOMY,
        ),
}
