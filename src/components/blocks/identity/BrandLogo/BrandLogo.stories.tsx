import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLogo } from "./index"

const meta: Meta<typeof BrandLogo> = {
    title: "Blocks/BrandLogo",
    component: BrandLogo,
}
export default meta
type Story = StoryObj<typeof BrandLogo>

/** Dùng ở kích thước mặc định 36px khi cần điểm neo nhận diện thương hiệu, ví dụ navbar hoặc splash screen. */
export const Default: Story = {
    parameters: { usage: "Dùng ở kích thước mặc định 36px khi cần điểm neo nhận diện thương hiệu, ví dụ navbar hoặc splash screen." },
    render: () => <BrandLogo />,
}

/** Phóng to logo cho các màn hình cần nhấn mạnh thương hiệu, như trang đăng nhập hoặc màn chờ. */
export const Large: Story = {
    parameters: { usage: "Phóng to logo cho các màn hình cần nhấn mạnh thương hiệu, như trang đăng nhập hoặc màn chờ." },
    render: () => <BrandLogo className="h-20" />,
}

/** Thu nhỏ logo cho các khu vực chật hẹp như footer hoặc thanh điều hướng di động. */
export const Small: Story = {
    parameters: { usage: "Thu nhỏ logo cho các khu vực chật hẹp như footer hoặc thanh điều hướng di động." },
    render: () => <BrandLogo className="h-6" />,
}

/** Đặt trong nền tối để kiểm tra độ tương phản của khối vuông bo góc chứa chữ "S". */
export const OnDarkBackground: Story = {
    parameters: { usage: "Đặt trong nền tối để kiểm tra độ tương phản của khối vuông bo góc chứa chữ \"S\"." },
    render: () => (
        <div className="rounded-medium bg-neutral-900 p-6">
            <BrandLogo />
        </div>
    ),
}
