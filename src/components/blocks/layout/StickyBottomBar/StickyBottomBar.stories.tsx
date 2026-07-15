import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Button, Label, Typography } from "@heroui/react"
import { StickyBottomBar } from "./index"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Core/Layout/StickyBottomBar",
    component: StickyBottomBar,
}
export default meta
type Story = StoryObj<typeof StickyBottomBar>

/**
 * The block ships `fixed inset-x-0 bottom-0` because in the app it pins to the
 * VIEWPORT edge. `fixed` ignores a `relative` ancestor, so inside a preview box it
 * escapes to the bottom of the canvas and leaves the box empty. Re-anchoring it to
 * the box (`absolute`, merged over `fixed` by tailwind-merge) is what makes the demo
 * show the bar where the story claims it is; the chrome it actually owns — top
 * divider, surface fill, safe padding — stays untouched.
 */
const IN_BOX = "absolute inset-x-0 bottom-0"

/**
 * Phone-screen shell: outer frame is fixed height (not the scroller). Inner
 * pane scrolls; the bar is `absolute` on the OUTER frame so it stays pinned to
 * the bottom of the phone while content scrolls underneath. No outer border —
 * the bar's own `border-t` is the only divider.
 */
const Screen = ({
    bar,
}: {
    bar: ReactNode
}) => (
    <div className="relative h-[28rem] w-96 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4">
            <div className="flex flex-col gap-4">
                <Typography type="h3">Fullstack Mastery</Typography>
                <Typography type="body-sm" color="muted">
                    Lộ trình từ nền tảng tới triển khai sản phẩm thật. Cuộn xuống để thấy thanh đáy vẫn neo — đúng hành vi trên mobile khi ghi danh / đồng ý cookie.
                </Typography>
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <Typography type="body-sm" weight="semibold">
                            {`Module ${index + 1}`}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            Nội dung mẫu để đủ chiều cao cuộn — thanh StickyBottomBar phải luôn trong tầm tay dù đang ở đâu trên trang.
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
        {bar}
    </div>
)

/** Dùng khi một hành động phải luôn nằm trong tầm ngón tay dù người dùng cuộn tới đâu trên mobile — thay vì để CTA trôi theo nội dung rồi cuộn mất. Block chỉ là chrome: nền, đường kẻ trên, padding an toàn là của nó, còn bày gì bên trong thì caller quyết. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một hành động phải luôn nằm trong tầm ngón tay dù người dùng cuộn tới đâu trên mobile — thay vì để CTA trôi theo nội dung rồi cuộn mất. Block chỉ là chrome: nền, đường kẻ trên, padding an toàn là của nó, còn bày gì bên trong thì caller quyết. Story: cuộn nội dung phía trên — bar neo đáy." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Giá kèm hành động chính</Label>
                <Typography type="body-sm" color="muted">
                    Bố cục của thanh ghi danh khoá có phí: giá trái, nút phải. Cuộn nội dung phía trên — bar vẫn neo đáy.
                </Typography>
            </div>
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <div className="flex items-center justify-between gap-3">
                            <PriceTag discounted={599000} original={899000} size="sm" />
                            <Button variant="primary" onPress={() => {}}>Đăng ký ngay</Button>
                        </div>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}

/** Dùng khi không còn gì để cân nhắc trước khi bấm — khoá miễn phí, không có giá để đọc, nên nút chiếm trọn chiều rộng thay vì bỏ trống nửa thanh. */
export const SingleAction: Story = {
    parameters: { usage: "Dùng khi không còn gì để cân nhắc trước khi bấm — khoá miễn phí, không có giá để đọc, nên nút chiếm trọn chiều rộng thay vì bỏ trống nửa thanh." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Một hành động, tràn chiều rộng</Label>
                <Typography type="body-sm" color="muted">
                    Bố cục khi khoá miễn phí: nút tràn hết chiều rộng. Cuộn nội dung — bar vẫn neo đáy.
                </Typography>
            </div>
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <Button variant="primary" className="w-full" onPress={() => {}}>Học miễn phí ngay</Button>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}

/** Dùng khi thanh là một quyết định CHẶN — người dùng phải trả lời ngay tại đây mới đi tiếp được (đồng ý cookie), nên lối từ chối buộc phải nằm cạnh lối đồng ý chứ không giấu đi chỗ khác. Thanh mời gọi bình thường thì giữ đúng một CTA chính như story Default. */
export const WithSecondaryAction: Story = {
    parameters: { usage: "Dùng khi thanh là một quyết định CHẶN — người dùng phải trả lời ngay tại đây mới đi tiếp được (đồng ý cookie), nên lối từ chối buộc phải nằm cạnh lối đồng ý chứ không giấu đi chỗ khác. Thanh mời gọi bình thường thì giữ đúng một CTA chính như story Default." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Hành động chính kèm lối từ chối</Label>
                <Typography type="body-sm" color="muted">
                    Bố cục của thanh đồng ý cookie: hai lối đi ngang cấp trên thanh. Cuộn nội dung — bar vẫn neo đáy.
                </Typography>
            </div>
            <Screen
                bar={(
                    <StickyBottomBar className={IN_BOX}>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" className="flex-1" onPress={() => {}}>Từ chối</Button>
                            <Button variant="primary" className="flex-1" onPress={() => {}}>Đồng ý tất cả</Button>
                        </div>
                    </StickyBottomBar>
                )}
            />
        </div>
    ),
}
