import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Switch, Typography } from "@heroui/react"

/**
 * `Switch` (HeroUI) — công tắc BẬT/TẮT tức thời (khác Checkbox: đổi là áp ngay, không
 * chờ submit). Cấu trúc compound: `Switch.Content > Switch.Control > Switch.Thumb`
 * (thêm `Switch.Icon` trong Thumb nếu cần icon, như DarkLightModeSwitch). Trong form
 * thường đặt thành HÀNG cài đặt: nhãn mô tả bên trái, Switch canh phải.
 */
const meta: Meta<typeof Switch> = {
    title: "Core/Form/Switch",
    component: Switch,
}
export default meta
type Story = StoryObj<typeof Switch>

/** Hàng cài đặt bật/tắt: nhãn trái + Switch phải. Bật = đang áp, tắt = đang tắt. */
export const OnOff: Story = {
    parameters: {
        usage: "Dùng cho tuỳ chọn áp NGAY khi gạt (bật thông báo, chế độ tối) — khác Checkbox chờ submit. Đặt thành hàng: nhãn mô tả bên trái, Switch canh phải (`justify-between`). Nhãn phải nói rõ BẬT nghĩa là gì.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Đang bật</Label>
                    <Typography type="body-sm" color="muted">
                        Trạng thái on — tuỳ chọn đang được áp.
                    </Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-sm">Nhận email thông báo</Typography>
                    <Switch defaultSelected aria-label="Nhận email thông báo">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Đang tắt</Label>
                    <Typography type="body-sm" color="muted">
                        Trạng thái off — tuỳ chọn không áp.
                    </Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-sm">Thông báo đẩy trên trình duyệt</Typography>
                    <Switch aria-label="Thông báo đẩy trên trình duyệt">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>
        </div>
    ),
}

/** Khoá theo ngữ cảnh: `isDisabled` — không gạt được cho tới khi điều kiện mở. */
export const Disabled: Story = {
    parameters: {
        usage: "`isDisabled` khi tuỳ chọn chưa gạt được (phụ thuộc gói/quyền/điều kiện khác) — công tắc mờ, không tương tác. Nhãn nên gợi ý VÌ SAO đang khoá nếu không hiển nhiên.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Vô hiệu hoá</Label>
                <Typography type="body-sm" color="muted">
                    Không gạt được — ví dụ tính năng chỉ mở cho gói trả phí.
                </Typography>
            </div>
            <div className="flex items-center justify-between gap-4">
                <Typography type="body-sm" color="muted">Tóm tắt tuần qua email (gói Pro)</Typography>
                <Switch isDisabled aria-label="Tóm tắt tuần qua email">
                    <Switch.Content>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch.Content>
                </Switch>
            </div>
        </div>
    ),
}
