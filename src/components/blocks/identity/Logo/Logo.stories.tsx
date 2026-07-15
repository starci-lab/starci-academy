import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "./index"

const meta: Meta<typeof Logo> = {
    title: "Blocks/Logo",
    component: Logo,
}
export default meta
type Story = StoryObj<typeof Logo>

/** Kích thước mặc định (h-8), dùng cho hầu hết thanh điều hướng và header. */
export const Default: Story = {
    parameters: { usage: "Kích thước mặc định (h-8), dùng cho hầu hết thanh điều hướng và header." },
    render: () => <Logo />,
}

/** Thu nhỏ logo (h-5) cho các khu vực chật như thanh điều hướng di động hoặc favicon-like badge. */
export const Small: Story = {
    parameters: { usage: "Thu nhỏ logo (h-5) cho các khu vực chật như thanh điều hướng di động hoặc favicon-like badge." },
    render: () => <Logo className="h-5" />,
}

/** Phóng to logo (h-20) cho màn hình splash, trang đăng nhập hoặc trạng thái trống nổi bật thương hiệu. */
export const Large: Story = {
    parameters: { usage: "Phóng to logo (h-20) cho màn hình splash, trang đăng nhập hoặc trạng thái trống nổi bật thương hiệu." },
    render: () => <Logo className="h-20" />,
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
