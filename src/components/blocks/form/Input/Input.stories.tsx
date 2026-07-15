import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Input, Label, Typography } from "@heroui/react"

/**
 * `Input` (HeroUI) — ô nhập 1 dòng TRẦN (styled `<input>`): nhận native props
 * (`type`, `placeholder`, `disabled`, `readOnly`, `defaultValue`). `variant` chọn theo
 * NGỮ CẢNH SURFACE ô đang nằm, KHÔNG phải mức nhấn mạnh:
 * - `primary` = ô nằm TRÊN NỀN TRANG (background) — có viền/nền riêng để tách khỏi nền
 *   (composer bình luận, ô chat, form ngay trên trang).
 * - `secondary` = ô nằm TRONG surface/card/modal — card đã tách nền nên ô nhẹ hơn
 *   (nền mờ); đa số field trong form dùng cái này.
 * Trong form thật hầu như luôn bọc trong `TextField` (Label + a11y + dòng lỗi); dùng
 * `Input` trần chỉ khi ô KHÔNG cần nhãn/nhóm (tìm kiếm inline, cell chỉnh nhanh).
 */
const meta: Meta<typeof Input> = {
    title: "Core/Form/Input",
    component: Input,
}
export default meta
type Story = StoryObj<typeof Input>

/** Hai variant theo NGỮ CẢNH surface: `primary` ô trên nền trang; `secondary` ô trong card. */
export const Variants: Story = {
    parameters: {
        usage: "`variant` chọn theo SURFACE ô đang nằm, không phải mức nhấn mạnh. `primary` = ô trên NỀN TRANG (viền/nền riêng để nổi khỏi background — composer, chat, form ngay trên trang). `secondary` = ô TRONG card/modal (card đã tách nền nên ô nhẹ hơn — đa số field trong form). Giữ nhất quán theo surface, đừng trộn hai variant trong cùng một khối.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Primary — trên nền trang</Label>
                    <Typography type="body-sm" color="muted">
                        Ô đứng thẳng trên background: viền/nền riêng để tách khỏi nền. Dùng cho composer bình luận, ô chat, form ngay trên trang.
                    </Typography>
                </div>
                <div className="w-80">
                    <Input variant="primary" placeholder="Viết bình luận…" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Secondary — trong surface (card)</Label>
                    <Typography type="body-sm" color="muted">
                        Ô nằm TRONG card/modal: card đã tách nền nên ô nhẹ hơn (nền mờ). Đa số field trong form dùng cái này.
                    </Typography>
                </div>
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" placeholder="ban@email.com" />
                    </CardContent>
                </Card>
            </div>
        </div>
    ),
}

/** Các trạng thái native (demo trong card = ngữ cảnh secondary thường gặp): mặc định, disabled, readOnly. */
export const States: Story = {
    parameters: {
        usage: "Trạng thái qua native props: mặc định (nhập được), `disabled` (mờ, không focus/nhập), `readOnly` (không sửa nhưng vẫn focus/bôi-copy — cho xem/sao chép giá trị khoá). Demo trong `Card` vì đây là ngữ cảnh `secondary` (field trong surface) thường gặp nhất. Trạng thái lỗi bật ở `TextField isInvalid`, không đặt trên Input trần.",
    },
    render: () => (
        <Card className="w-80">
            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Mặc định</Label>
                        <Typography type="body-sm" color="muted">
                            Ô nhập bình thường, focus và gõ được.
                        </Typography>
                    </div>
                    <Input variant="secondary" placeholder="Nhập nội dung…" />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Disabled</Label>
                        <Typography type="body-sm" color="muted">
                            Khoá theo ngữ cảnh — mờ, không focus hay nhập được.
                        </Typography>
                    </div>
                    <Input variant="secondary" defaultValue="FS-2026-K12" disabled />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Read-only</Label>
                        <Typography type="body-sm" color="muted">
                            Không sửa được nhưng vẫn focus và bôi-copy — cho xem/sao chép giá trị khoá.
                        </Typography>
                    </div>
                    <Input variant="secondary" defaultValue="sk_live_a1b2c3d4" readOnly />
                </div>
            </CardContent>
        </Card>
    ),
}
