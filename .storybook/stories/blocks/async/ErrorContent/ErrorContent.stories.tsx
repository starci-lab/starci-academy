import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { WifiSlashIcon } from "@phosphor-icons/react"
import { ErrorContent } from "./ErrorContent"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ErrorContent> = {
    title: "Block/Async/ErrorContent",
    component: ErrorContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ErrorContent>

const ANATOMY = {
    primitives: [{ name: "ErrorState", role: "khung icon cảnh báo + tiêu đề + mô tả + nút thử lại, canh giữa" }],
    reason:
        "Trạng thái lỗi của một vùng dữ liệu async cần đúng anatomy của ErrorState (icon cảnh báo + tiêu đề + mô tả + nút thử lại canh giữa). ErrorContent chỉ thêm icon WarningOctagon mặc định và truyền onRetry/retryLabel xuống nút — nên nó là một lớp mỏng trên ErrorState, không nên tự vẽ lại.",
}

export const Basic: Story = {
    render: () => blockShell(<ErrorContent title="Đã có lỗi xảy ra" />, ANATOMY),
}

export const WithDescription: Story = {
    render: () =>
        blockShell(
            <ErrorContent
                title="Không tải được dữ liệu"
                description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
            />,
            ANATOMY,
        ),
}

export const WithRetry: Story = {
    render: () =>
        blockShell(
            <ErrorContent
                title="Không tải được dữ liệu"
                description="Đã có lỗi xảy ra khi tải nội dung."
                onRetry={() => {}}
                retryLabel="Thử lại"
            />,
            ANATOMY,
        ),
}

export const CustomIcon: Story = {
    render: () =>
        blockShell(
            <ErrorContent
                icon={<WifiSlashIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                title="Mất kết nối mạng"
                description="Kiểm tra kết nối rồi thử lại."
                onRetry={() => {}}
                retryLabel="Thử lại"
            />,
            ANATOMY,
        ),
}
