import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { StickyBottomBar } from "./index"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Blocks/Layout/StickyBottomBar",
    component: StickyBottomBar,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof StickyBottomBar>

/** Dùng cho thanh CTA cố định ở đáy màn hình mobile khi khoá học có giá — hiển thị giá kèm nút đăng ký chính. */
export const Default: Story = {
    parameters: { usage: "Dùng cho thanh CTA cố định ở đáy màn hình mobile khi khoá học có giá — hiển thị giá kèm nút đăng ký chính." },
    render: () => (
        <div className="relative h-48 w-96 overflow-hidden rounded-medium border border-separator">
            <StickyBottomBar>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold text-foreground">599.000₫</span>
                    <Button variant="primary" onPress={() => {}}>Đăng ký ngay</Button>
                </div>
            </StickyBottomBar>
        </div>
    ),
}

/** Dùng khi khoá học miễn phí — chỉ còn một nút hành động chiếm toàn bộ chiều rộng, không có giá đi kèm. */
export const SingleAction: Story = {
    parameters: { usage: "Dùng khi khoá học miễn phí — chỉ còn một nút hành động chiếm toàn bộ chiều rộng, không có giá đi kèm." },
    render: () => (
        <div className="relative h-48 w-96 overflow-hidden rounded-medium border border-separator">
            <StickyBottomBar>
                <Button variant="primary" className="w-full" onPress={() => {}}>Học miễn phí ngay</Button>
            </StickyBottomBar>
        </div>
    ),
}

/** Dùng khi cần thêm hành động phụ (ví dụ xem chi tiết) bên cạnh CTA chính, cả hai chia sẻ không gian thanh đáy. */
export const WithSecondaryAction: Story = {
    parameters: { usage: "Dùng khi cần thêm hành động phụ (ví dụ xem chi tiết) bên cạnh CTA chính, cả hai chia sẻ không gian thanh đáy." },
    render: () => (
        <div className="relative h-48 w-96 overflow-hidden rounded-medium border border-separator">
            <StickyBottomBar>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex-1" onPress={() => {}}>Xem chi tiết</Button>
                    <Button variant="primary" className="flex-1" onPress={() => {}}>Đăng ký ngay</Button>
                </div>
            </StickyBottomBar>
        </div>
    ),
}
