import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"

import { ErrorPageState } from "@/components/blocks/feedback/ErrorPageState"

const meta: Meta<typeof ErrorPageState> = {
    title: "Legacy/Blocks/Feedback/ErrorPageState",
    component: ErrorPageState,
    tags: ["news"],
    parameters: {
        usage: "Chờ duyệt — full-page state for whole-route failures: the 404 (not-found) and 500 (error boundary) pages, plus the profile's own not-found. Large numeral + title/description + a way back.",
    },
}

export default meta

type Story = StoryObj<typeof ErrorPageState>

/** 404 — an unmatched route / not-found, with a single button back home. */
export const NotFound404: Story = {
    render: () => (
        <ErrorPageState
            code="404"
            title="Không tìm thấy trang"
            description="Trang bạn tìm không tồn tại hoặc đã được chuyển đi."
            actions={<Button variant="primary">Trang chủ</Button>}
        />
    ),
}

/** 500 — a runtime error boundary, offering a retry plus a way home. */
export const ServerError500: Story = {
    render: () => (
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
    ),
}
