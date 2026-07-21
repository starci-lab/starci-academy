import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { ErrorPageState } from "./ErrorPageState"

const meta: Meta<typeof ErrorPageState> = {
    title: "Primitives/Feedback/ErrorPageState",
    component: ErrorPageState,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ErrorPageState>

/** 404 — an unmatched route / not-found, with a single button back home. */
export const NotFound404: Story = {
    render: () => (
        <div className="p-8">
            <ErrorPageState
                code="404"
                title="Không tìm thấy trang"
                description="Trang bạn tìm không tồn tại hoặc đã được chuyển đi."
                actions={<Button variant="primary">Trang chủ</Button>}
            />
        </div>
    ),
}

/** 500 — a runtime error boundary, offering a retry plus a way home. */
export const ServerError500: Story = {
    render: () => (
        <div className="p-8">
            <ErrorPageState
                code="500"
                title="Đã có lỗi xảy ra"
                description="Máy chủ gặp sự cố khi xử lý yêu cầu. Thử lại sau giây lát nhé."
                actions={(
                    <>
                        <Button variant="primary">Thử lại</Button>
                        <Button variant="tertiary">Trang chủ</Button>
                    </>
                )}
            />
        </div>
    ),
}
