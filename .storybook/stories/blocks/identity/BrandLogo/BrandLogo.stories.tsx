import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { BrandLogo } from "@/components/blocks/identity/BrandLogo"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof BrandLogo> = {
    title: "Blocks/Identity/BrandLogo",
    component: BrandLogo,
}
export default meta
type Story = StoryObj<typeof BrandLogo>

/**
 * BrandLogo là entry point chung của brand mark (icon "S" trên nền vuông bo
 * góc, không có wordmark) — navbar, footer, splash đều gọi thẳng block này
 * thay vì `Logo` để cả app đọc ra một mark từ một nguồn. Không có variant hay
 * state: chỉ có `className` để đặt vị trí, còn kích thước mặc định `h-9` đã
 * được chốt sẵn cho mọi nơi dùng chung.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng BrandLogo ở navbar, footer, splash — bất cứ đâu cần brand mark dùng chung; đừng gọi Logo trực tiếp trừ khi thật sự cần tự chỉnh chiều cao.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định — h-9"
                hint="Kích thước cố định khi gọi BrandLogo mà không truyền className; đây là size chuẩn cho navbar và các vị trí đặt mark độc lập."
            >
                <BrandLogo />
            </Variant>

            <Variant
                label="Trên nền tối"
                hint="Kiểm tra mark vẫn nổi trên nền tối, vì màu hồng của brand là màu cố định trong SVG, không đổi theo theme."
            >
                <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                    <BrandLogo />
                </div>
            </Variant>

            <Variant
                label="Đặt trong navbar thật"
                hint="Cách BrandLogo ghép cạnh nội dung khác trong thanh điều hướng — className chỉ dùng để canh vị trí, không đổi kích thước mark."
            >
                <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-default px-4 py-3">
                    <div className="flex items-center gap-2">
                        <BrandLogo />
                        <Typography type="body-sm" weight="medium">
                            StarCi Academy
                        </Typography>
                    </div>
                    <Typography type="body-xs" color="muted">
                        Khoá học
                    </Typography>
                </div>
            </Variant>
        </Gallery>
    ),
}
