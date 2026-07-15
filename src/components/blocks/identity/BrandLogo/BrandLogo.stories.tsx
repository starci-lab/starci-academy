import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLogo } from "./index"

const meta: Meta<typeof BrandLogo> = {
    title: "Blocks/Identity/BrandLogo",
    component: BrandLogo,
}
export default meta
type Story = StoryObj<typeof BrandLogo>

/** So sánh ba cỡ logo cạnh nhau (nhỏ 24px cho footer, mặc định 36px cho navbar, lớn 80px cho splash) để chọn đúng cỡ cho từng khu vực. */
export const Sizes: Story = {
    parameters: { usage: "So sánh ba cỡ logo cạnh nhau (nhỏ 24px cho footer, mặc định 36px cho navbar, lớn 80px cho splash) để chọn đúng cỡ cho từng khu vực." },
    render: () => (
        <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-2">
                <BrandLogo className="h-6" />
                <span className="text-tiny text-default-500">Nhỏ (h-6)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <BrandLogo />
                <span className="text-tiny text-default-500">Mặc định (h-9)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <BrandLogo className="h-20" />
                <span className="text-tiny text-default-500">Lớn (h-20)</span>
            </div>
        </div>
    ),
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
