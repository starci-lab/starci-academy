import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { StickyBottomBar } from "./index"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Blocks/Layout/StickyBottomBar",
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
const IN_BOX = "absolute"

/** Preview shell standing in for a phone screen — the bar only ever ships `md:hidden`. */
const Screen = ({ children }: { children: React.ReactNode }) => (
    <div className="relative h-48 w-96 overflow-hidden rounded-2xl border border-separator bg-background">
        {children}
    </div>
)

/** Dùng khi một hành động phải luôn nằm trong tầm ngón tay dù người dùng cuộn tới đâu trên mobile — thay vì để CTA trôi theo nội dung rồi cuộn mất. Block chỉ là chrome: nền, đường kẻ trên, padding an toàn là của nó, còn bày gì bên trong thì caller quyết. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một hành động phải luôn nằm trong tầm ngón tay dù người dùng cuộn tới đâu trên mobile — thay vì để CTA trôi theo nội dung rồi cuộn mất. Block chỉ là chrome: nền, đường kẻ trên, padding an toàn là của nó, còn bày gì bên trong thì caller quyết." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Giá kèm hành động chính</Label>
                <Typography type="body-sm" color="muted">
                    bố cục của thanh ghi danh khoá có phí: giá trái, nút phải, mắt đọc giá trước rồi mới tới nút. Giá đi qua PriceTag chứ không tự dựng chữ, để cùng một con số ở thanh đáy, ở rail và ở catalog không bao giờ lệch nhau.
                </Typography>
            </div>
            <Screen>
                <StickyBottomBar className={IN_BOX}>
                    <div className="flex items-center justify-between gap-3">
                        <PriceTag discounted={599000} original={899000} size="sm" />
                        <Button variant="primary" onPress={() => {}}>Đăng ký ngay</Button>
                    </div>
                </StickyBottomBar>
            </Screen>
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
                    bố cục khi khoá miễn phí: nửa trái không có giá nên sẽ trống, cho nút tràn hết chiều rộng để vùng bấm rộng nhất có thể trên mobile.
                </Typography>
            </div>
            <Screen>
                <StickyBottomBar className={IN_BOX}>
                    <Button variant="primary" className="w-full" onPress={() => {}}>Học miễn phí ngay</Button>
                </StickyBottomBar>
            </Screen>
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
                    bố cục của thanh đồng ý cookie: hai lối đi ngang cấp nên cùng nằm trên thanh, nút phụ để secondary để mắt vẫn phân được đâu là lối mặc định.
                </Typography>
            </div>
            <Screen>
                <StickyBottomBar className={IN_BOX}>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="flex-1" onPress={() => {}}>Từ chối</Button>
                        <Button variant="primary" className="flex-1" onPress={() => {}}>Đồng ý tất cả</Button>
                    </div>
                </StickyBottomBar>
            </Screen>
        </div>
    ),
}
