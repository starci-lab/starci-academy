import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input, Label, TextArea, TextField, Typography } from "@heroui/react"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `TextField` (HeroUI) — a single FIELD wrapper: wraps `Label` + `Input`/`TextArea`
 * (+ error line) into one a11y-linked cluster (Label `htmlFor` ↔ Input `id`). Pick
 * `variant` by SURFACE CONTEXT (same as `Input`, see `Core/Form/Input`): `primary` =
 * field on the PAGE BACKGROUND (its own border/fill), `secondary` = field INSIDE a
 * card/modal (lighter — most forms). The stories below demo `primary` because they render
 * on a bare page-background canvas; inside a card/modal form, switch to `secondary`.
 * Error state: `isInvalid` on TextField + a `Typography slot="errorMessage"` (HeroUI wires
 * it to the field via aria). Fields in a form: the same cluster uses `gap-3`.
 */
const meta: Meta<typeof TextField> = {
    title: "Primitives/Form/TextField",
    component: TextField,
}
export default meta
type Story = StoryObj<typeof TextField>

/**
 * Toàn bộ ma trận trạng thái của TextField: cơ bản, bắt buộc, lỗi hợp lệ, khoá,
 * nhiều dòng. Dùng để tra khi nào chọn state nào và cách viết errorMessage/chọn
 * isDisabled hay isReadOnly cho đúng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Cơ bản"
                hint="Label liên kết Input qua htmlFor↔id — bấm vào label sẽ đưa con trỏ vào field. Dùng cho hầu hết input có nhãn (email, tên, tiêu đề)."
            >
                <TextField variant="primary">
                    <Label htmlFor="tf-email">Notification email</Label>
                    <Input id="tf-email" type="email" placeholder="you@email.com" />
                </TextField>
            </Variant>
            <Variant
                label="Bắt buộc"
                hint="isRequired: field phải có giá trị lúc submit — dùng cho field cốt lõi (email đăng nhập, tên khoá học); đừng thêm required cho field tuỳ chọn chỉ để 'ép' người dùng."
            >
                <TextField variant="primary" isRequired>
                    <Label htmlFor="tf-name">Display name</Label>
                    <Input id="tf-name" placeholder="Jane Doe" />
                </TextField>
            </Variant>
            <Variant
                label="Lỗi hợp lệ"
                hint={"isInvalid bật viền lỗi; dòng lỗi là Typography slot=\"errorMessage\" type=\"body-xs\" màu text-danger-soft-foreground (HeroUI tự nối aria). errorMessage nói CÁCH sửa, không chỉ báo 'sai' — ví dụ 'Email format looks off' thay vì 'Error'."}
            >
                <TextField variant="primary" isInvalid>
                    <Label htmlFor="tf-invalid">Notification email</Label>
                    <Input id="tf-invalid" type="email" defaultValue="you@@email" />
                    <Typography slot="errorMessage" type="body-xs" className="text-danger-soft-foreground">
                        Email format looks off — check the part after the @.
                    </Typography>
                </TextField>
            </Variant>
            <Variant
                label="Khoá"
                hint="isDisabled → field bị làm mờ, không focus/gõ được. Dùng khi giá trị bị khoá bởi ngữ cảnh (đang tải, thiếu quyền, phụ thuộc field khác); nếu chỉ khoá tạm trong lúc xử lý, xét isReadOnly để vẫn đọc/copy được."
            >
                <TextField variant="primary" isDisabled>
                    <Label htmlFor="tf-disabled">Class code (fixed)</Label>
                    <Input id="tf-disabled" defaultValue="FS-2026-K12" />
                </TextField>
            </Variant>
            <Variant
                label="Nhiều dòng (TextArea)"
                hint="Nội dung nhiều dòng → thay Input bằng TextArea trong cùng TextField (vẫn giữ Label + variant + lỗi). Dùng cho mô tả, ghi chú, phản hồi — nội dung một dòng nên dùng Input để hàng gọn hơn."
            >
                <TextField variant="primary">
                    <Label htmlFor="tf-note">Note for the student</Label>
                    <TextArea id="tf-note" placeholder="Enter feedback, one point per line…" rows={4} />
                </TextField>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của TextField: cơ bản (Label+Input, htmlFor↔id), bắt buộc " +
            "(isRequired), lỗi hợp lệ (isInvalid + Typography slot=\"errorMessage\" nói cách sửa), khoá " +
            "(isDisabled, xét isReadOnly nếu chỉ khoá tạm), nhiều dòng (TextArea thay Input). " +
            "variant=\"primary\" cho field trên nền trang; đổi sang \"secondary\" khi field nằm trong card/modal.",
    },
}
