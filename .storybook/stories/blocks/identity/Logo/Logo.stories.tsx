import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "@/components/blocks/identity/Logo"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Logo> = {
    title: "Features/Brand/Logo",
    component: Logo,
}
export default meta
type Story = StoryObj<typeof Logo>

/**
 * Toàn bộ ma trận kích thước của Logo — không có prop `size`, chiều cao truyền qua
 * className và chiều rộng tự theo tỉ lệ — cùng kiểm tra trên nền tối để chắc mark
 * vẫn nổi rõ, vì hồng thương hiệu là màu cố định trong SVG, không đọc theo theme.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="h-9 — mặc định của BrandLogo"
                hint="Kích thước khi gọi BrandLogo mà không truyền gì. Cần một mark đứng riêng ở mật độ bình thường thì dùng size này — đừng tự chọn số khác."
            >
                <Logo className="h-9" />
            </Variant>
            <Variant
                label="h-10 — trong BrandLockup"
                hint="Kích thước dùng trong lockup, để mark cân với wordmark StarCi Academy đứng cạnh. Chỉ đúng khi có chữ đi kèm; mark đứng riêng ở size này sẽ lấn nhịp của navbar."
            >
                <Logo className="h-10" />
            </Variant>
            <Variant
                label="h-14 — splash screen"
                hint="Kích thước cho màn hình chỉ có một mình mark: splash lúc app mở. Đừng mang size này vào trang nội dung — nó sẽ lấn tiêu đề."
            >
                <Logo className="h-14" />
            </Variant>
            <Variant
                label="Trên nền tối"
                hint="Đặt trên nền tối để xác nhận mark vẫn nổi rõ, vì hồng thương hiệu là màu cố định, không đổi theo theme — hồng không đọc token nên không tự lật theo theme; phải tự kiểm độ tương phản trên mọi nền, kể cả nền sáng ngả hồng."
            >
                <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                    <Logo className="h-10" />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Dùng `Logo` khi cần bare brand mark và tự set chiều cao — thay vì `BrandLogo` (entry point " +
            "chung, cố định `h-9`) hoặc `BrandLockup` (mark cộng wordmark \"StarCi Academy\", dùng cho " +
            "navbar và footer). Trong app hiện tại chỉ `BrandLogo` gọi `Logo` trực tiếp; surface sản phẩm " +
            "nên đi qua hai block đó để cả app đọc một mark từ một nguồn. Không có prop `size`: truyền " +
            "chiều cao qua className, chiều rộng tự theo tỉ lệ. Placed on a dark surface to verify the " +
            "mark still stands out, since the brand pink is a fixed color that doesn't change with the theme.",
    },
}
