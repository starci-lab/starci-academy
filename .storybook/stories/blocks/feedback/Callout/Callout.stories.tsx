import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Callout } from "./Callout"

const meta: Meta<typeof Callout> = {
    title: "Primitives/Feedback/Callout",
    component: Callout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Callout>

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Callout title="Bản nháp đã lưu" description="Thay đổi của bạn được giữ tự động." />
        </div>
    ),
}

export const Success: Story = {
    render: () => (
        <div className="p-8">
            <Callout status="success" title="Nộp bài thành công" description="Kết quả sẽ có sau ít phút." />
        </div>
    ),
}

export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <Callout status="warning" title="Sắp hết hạn" description="Còn 2 ngày để hoàn thành milestone." />
        </div>
    ),
}

export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <Callout status="danger" title="Không kết nối được máy chủ" description="Kiểm tra mạng rồi thử lại." />
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <Callout
                status="accent"
                title="Nâng cấp để mở khoá AI"
                description="Gói trả phí cho phép chấm nâng cao."
                action={<Button variant="secondary" size="sm">Nâng cấp</Button>}
            />
        </div>
    ),
}

/**
 * GithubTeamGate's persistent learn-page banner — REUSE of `Callout`, not a new
 * block (see `src/components/features/auth/GithubTeamGate/index.tsx`): custom
 * `icon` (Phosphor `GithubLogoIcon`, swapping the hand-rolled SVG) + `action`
 * (the "Vào team" CTA that opens the guided join modal).
 */
export const GithubTeamGateWarning: Story = {
    render: () => (
        <div className="p-8">
            <Callout
                status="warning"
                icon={<GithubLogoIcon />}
                title="Bạn chưa vào team GitHub của khóa"
                description="Nội dung premium nằm trong repo GitHub của khóa, nên bạn cần vào team mới mở được."
                action={<Button variant="secondary" size="sm">Vào team</Button>}
            />
        </div>
    ),
}

export const Dismissible: Story = {
    render: () => (
        <div className="p-8">
            <Callout status="accent" title="Mẹo: bôi đen để hỏi AI" onClose={() => {}} />
        </div>
    ),
}
