import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubPageHeader } from "./SubPageHeader"

const meta: Meta<typeof SubPageHeader> = {
    title: "Primitives/Layout/SubPageHeader",
    component: SubPageHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SubPageHeader>

/** Title only (`description = undefined`) → the description block does not render. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader title="Đổi mật khẩu" onBack={() => {}} />
            </div>
        </div>
    ),
}

/** Title + a short one-line description — the most common case, well below the 3-line clamp. */
export const WithDescription: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader
                    title="Thông tin thanh toán"
                    description="Quản lý thẻ và phương thức thanh toán đã lưu."
                    onBack={() => {}}
                />
            </div>
        </div>
    ),
}

/** Edge case: `description=""` (empty string ≠ undefined) → the block still renders and reserves space, no text. */
export const EmptyDescription: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader title="Lịch sử giao dịch" description="" onBack={() => {}} />
            </div>
        </div>
    ),
}

/** Long description clamps at 3 lines — the narrow frame exposes the exact `line-clamp-3` cut. */
export const DescriptionClamped: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader
                    title="Cấu hình cổng thanh toán"
                    description="Thiết lập SePay và PayOS, chọn cổng thanh toán mặc định cho học viên mới, cấu hình các gói trả góp áp dụng theo từng khóa học, và theo dõi trạng thái giao dịch theo thời gian thực ngay tại đây."
                    onBack={() => {}}
                />
            </div>
        </div>
    ),
}

/** Long title wraps naturally (not clamped) — check multi-line titles don't collide with the back button. */
export const LongTitleWraps: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader
                    title="Cài đặt thông báo và quyền riêng tư tài khoản"
                    description="Bật hoặc tắt từng loại thông báo."
                    onBack={() => {}}
                />
            </div>
        </div>
    ),
}

/** `backAriaLabel` overrides the default accessibility label when the context needs to name where "back" goes. */
export const CustomBackAriaLabel: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <SubPageHeader
                    title="Xác nhận huỷ đăng ký"
                    description="Quay lại trang danh sách khóa học đã đăng ký."
                    backAriaLabel="Quay lại danh sách khóa học"
                    onBack={() => {}}
                />
            </div>
        </div>
    ),
}
