import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input, Label, TextArea, TextField, Typography } from "@heroui/react"

/**
 * `TextField` (HeroUI) — vỏ 1 FIELD: bọc `Label` + `Input`/`TextArea` (+ dòng lỗi)
 * thành một cụm có liên kết a11y (Label `htmlFor` ↔ Input `id`). `variant` chọn theo
 * NGỮ CẢNH SURFACE (giống `Input`, xem `Core/Form/Input`): `primary` = field trên
 * NỀN TRANG (viền/nền riêng), `secondary` = field TRONG card/modal (nhẹ hơn — đa số
 * form). Các story dưới demo `primary` vì render trên canvas NỀN TRẦN; đặt trong
 * card/modal form thì đổi sang `secondary`.
 * Trạng thái lỗi: `isInvalid` trên TextField + một `Typography slot="errorMessage"`
 * (HeroUI tự nối vào field qua aria). Field trong form: cùng cluster dùng `gap-3`.
 */
const meta: Meta<typeof TextField> = {
    title: "Core/Form/TextField",
    component: TextField,
}
export default meta
type Story = StoryObj<typeof TextField>

/** Field 1 dòng cơ bản: Label + Input. Dùng cho hầu hết ô nhập có nhãn (email, tên, tiêu đề). */
export const Default: Story = {
    parameters: {
        usage: "Field cơ bản — `TextField variant=\"primary\"` (render trên nền trần) bọc `Label htmlFor` + `Input id` (khớp id để click nhãn focus vào ô). Trong card/modal thì đổi `secondary`. Dùng cho input 1 dòng có nhãn; nhiều field cùng form xếp `flex flex-col gap-3`.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Label nối vào Input qua htmlFor↔id — bấm nhãn là con trỏ nhảy vào ô.
                </Typography>
            </div>
            <TextField variant="primary">
                <Label htmlFor="tf-email">Email nhận thông báo</Label>
                <Input id="tf-email" type="email" placeholder="ban@email.com" />
            </TextField>
        </div>
    ),
}

/** Field bắt buộc: `isRequired` để Label báo không được bỏ trống khi submit. */
export const Required: Story = {
    parameters: {
        usage: "`isRequired` trên TextField → Label báo bắt buộc và field vào diện validate khi submit. Dùng cho ô không được để trống; đừng gắn required cho ô tuỳ chọn chỉ để 'ép' người dùng.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Bắt buộc</Label>
                <Typography type="body-sm" color="muted">
                    isRequired: field phải có giá trị khi submit — dùng cho ô cốt lõi (email đăng nhập, tên khoá).
                </Typography>
            </div>
            <TextField variant="primary" isRequired>
                <Label htmlFor="tf-name">Tên hiển thị</Label>
                <Input id="tf-name" placeholder="Nguyễn Văn A" />
            </TextField>
        </div>
    ),
}

/** Field lỗi: `isInvalid` + `Typography slot="errorMessage"` — viền đỏ và dòng lỗi dưới field. */
export const Invalid: Story = {
    parameters: {
        usage: "`isInvalid` bật viền lỗi; dòng lỗi là `Typography slot=\"errorMessage\" type=\"body-xs\"` màu `text-danger-soft-foreground` (HeroUI tự nối aria). errorMessage nói CÁCH sửa, không chỉ báo 'sai' — 'Email chưa đúng định dạng', không phải 'Lỗi'.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lỗi validate</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi giá trị không hợp lệ — dòng lỗi mách cách sửa, không chỉ nói sai.
                </Typography>
            </div>
            <TextField variant="primary" isInvalid>
                <Label htmlFor="tf-invalid">Email nhận thông báo</Label>
                <Input id="tf-invalid" type="email" defaultValue="ban@@email" />
                <Typography slot="errorMessage" type="body-xs" className="text-danger-soft-foreground">
                    Email chưa đúng định dạng — kiểm tra lại phần sau dấu @.
                </Typography>
            </TextField>
        </div>
    ),
}

/** Field khoá: `isDisabled` — mờ, không focus/nhập được. Dùng khi giá trị bị khoá theo ngữ cảnh. */
export const Disabled: Story = {
    parameters: {
        usage: "`isDisabled` → field mờ, không focus hay nhập được. Dùng khi giá trị bị khoá theo ngữ cảnh (đang tải, không đủ quyền, phụ thuộc field khác). Khoá tạm vì đang xử lý thì cân nhắc `isReadOnly` để vẫn đọc/copy được.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Vô hiệu hoá</Label>
                <Typography type="body-sm" color="muted">
                    Giá trị bị khoá theo ngữ cảnh — không sửa được cho tới khi điều kiện mở.
                </Typography>
            </div>
            <TextField variant="primary" isDisabled>
                <Label htmlFor="tf-disabled">Mã lớp (cố định)</Label>
                <Input id="tf-disabled" defaultValue="FS-2026-K12" />
            </TextField>
        </div>
    ),
}

/** Nhiều dòng: `TextArea` thay `Input` trong cùng `TextField` — cho mô tả/ghi chú dài. */
export const Multiline: Story = {
    parameters: {
        usage: "Nội dung nhiều dòng → thay `Input` bằng `TextArea` trong cùng `TextField` (giữ nguyên Label + variant + lỗi). Dùng cho mô tả, ghi chú, phản hồi — nội dung 1 dòng thì dùng Input để hàng gọn.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhiều dòng (TextArea)</Label>
                <Typography type="body-sm" color="muted">
                    Cùng vỏ TextField nhưng ô là TextArea — cho nội dung tràn nhiều dòng.
                </Typography>
            </div>
            <TextField variant="primary">
                <Label htmlFor="tf-note">Ghi chú cho học viên</Label>
                <TextArea id="tf-note" placeholder="Nhập nhận xét, mỗi ý một dòng…" rows={4} />
            </TextField>
        </div>
    ),
}
