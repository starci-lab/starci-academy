import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLockup } from "@/components/blocks/identity/BrandLockup"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof BrandLockup> = {
    title: "Legacy/Blocks/Identity/BrandLockup",
    component: BrandLockup,
}

export default meta
type Story = StoryObj<typeof BrandLockup>

/**
 * Toàn bộ hình hài của BrandLockup: block không có variant/tone/size, không
 * loading/empty/error/disabled/selected, và không stateful (chỉ nhận một
 * `className` tuỳ chọn để đặt vị trí). State thật duy nhất là việc wordmark
 * "StarCi / ACADEMY" tự ẩn khi container hẹp hơn breakpoint `@app-md` (48rem)
 * — đây là container query, đo theo bề rộng thùng chứa gần nhất có
 * `@container`, không phải viewport — nên gallery dựng thêm một `@container`
 * hẹp để tái hiện đúng lúc icon-only xuất hiện. Cuối cùng là ví dụ dùng
 * `className` để neo vị trí như JSDoc của block khuyến nghị.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Dùng BrandLockup ở nơi cần logo StarCi đi kèm chữ StarCi Academy đọc từ một nguồn duy nhất — navbar và footer hiện đang dùng chung block này. Block chỉ trình bày, không tự bọc link/button: muốn bấm được thì bọc nó trong `<a>`/`<button>` tại call-site. Wordmark tự ẩn khi container hẹp hơn `@app-md` (48rem) để nhường chỗ ở header/footer hẹp, không cần prop nào điều khiển việc này.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đủ icon + wordmark (container ≥ 48rem)"
                hint="Trạng thái mặc định khi container đủ rộng — dùng ở navbar/footer trên desktop, nơi có chỗ cho cả icon và chữ StarCi Academy."
            >
                <div className="@container w-full">
                    <BrandLockup />
                </div>
            </Variant>
            <Variant
                label="Chỉ icon (container hẹp dưới @app-md)"
                hint="Khi thùng chứa hẹp hơn 48rem — header/footer trên mobile — wordmark tự ẩn (hidden), chỉ còn icon BrandLogo. Đây là container query đo theo bề rộng khung cha gần nhất có @container, không phải viewport, nên demo phải tự dựng một @container hẹp thay vì resize canvas."
            >
                <div className="@container w-20">
                    <BrandLockup />
                </div>
            </Variant>
            <Variant
                label="Neo self-start trong flex-col cha co giãn"
                hint="Parent flex-col mặc định stretch item theo chiều ngang, kéo span của BrandLockup rộng ra vô nghĩa — truyền className='self-start' để lockup chỉ rộng đúng nội dung của nó, đúng như JSDoc của block khuyến nghị."
            >
                <div className="@container flex w-64 flex-col rounded-lg border border-default bg-default/40 p-4">
                    <BrandLockup className="self-start" />
                </div>
            </Variant>
        </Gallery>
    ),
}
