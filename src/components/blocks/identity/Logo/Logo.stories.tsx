import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "./index"

const meta: Meta<typeof Logo> = {
    title: "Blocks/Identity/Logo",
    component: Logo,
}
export default meta
type Story = StoryObj<typeof Logo>

/** So sánh ba cỡ logo cạnh nhau — dùng khi cần chọn chiều cao phù hợp cho một khu vực (kích thước chỉ do className height quyết định). */
export const Sizes: Story = {
    parameters: { usage: "So sánh ba cỡ logo cạnh nhau — dùng khi cần chọn chiều cao phù hợp cho một khu vực (kích thước chỉ do className height quyết định)." },
    render: () => (
        <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-2">
                <Logo className="h-5" />
                <span className="text-xs text-default-500">Nhỏ (h-5)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Logo />
                <span className="text-xs text-default-500">Mặc định (h-8)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Logo className="h-20" />
                <span className="text-xs text-default-500">Lớn (h-20)</span>
            </div>
        </div>
    ),
}

/** Đặt trên nền tối để kiểm chứng logo vẫn nổi rõ vì màu hồng thương hiệu là màu cố định, không đổi theo theme. */
export const OnDarkSurface: Story = {
    parameters: { usage: "Đặt trên nền tối để kiểm chứng logo vẫn nổi rõ vì màu hồng thương hiệu là màu cố định, không đổi theo theme." },
    render: () => (
        <div className="flex items-center justify-center rounded-lg bg-neutral-950 p-8">
            <Logo className="h-10" />
        </div>
    ),
}
