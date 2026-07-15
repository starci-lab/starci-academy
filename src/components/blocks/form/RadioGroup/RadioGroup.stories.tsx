import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Radio, RadioGroup, Typography } from "@heroui/react"

/**
 * `RadioGroup` + `Radio` (HeroUI) — chọn ĐÚNG MỘT trong vài lựa chọn loại trừ nhau
 * (khác Checkbox: chọn nhiều). Cấu trúc đúng: `Radio > Radio.Content` (hàng ngang
 * `inline-flex items-center gap-3`) chứa `Radio.Control > Radio.Indicator` + nhãn
 * text thường (không bọc `Typography` — react-aria coi `Typography` là `Text` và
 * đòi `slot`). Group xếp dọc `gap-2`. Ít lựa chọn (2–5) → RadioGroup; nhiều → Select.
 * Luôn có 1 mặc định.
 */
const meta: Meta<typeof RadioGroup> = {
    title: "Core/Form/RadioGroup",
    component: RadioGroup,
}
export default meta
type Story = StoryObj<typeof RadioGroup>

const OPTIONS = [
    { value: "instant", label: "Ngay lập tức" },
    { value: "daily", label: "Tóm tắt hằng ngày" },
    { value: "weekly", label: "Tóm tắt hằng tuần" },
]

/** Danh sách dọc gap-2; mỗi hàng = vòng tròn + nhãn ngang (Control nằm trong Content). */
export const Vertical: Story = {
    parameters: {
        usage: "Chọn đúng một trong vài lựa chọn loại trừ nhau. Group xếp dọc `gap-2`; mỗi `Radio.Content` là hàng ngang (control + nhãn). Đúng cấu trúc HeroUI: `Control` nằm TRONG `Content` — để Control/Content là anh em dưới `Radio` thì `.radio` (`flex-col`) xếp chúng dọc. Luôn đặt `defaultValue`.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chọn một (dọc)</Label>
                <Typography type="body-sm" color="muted">
                    Group xếp dọc gap-2; mỗi lựa chọn là nút + chữ nằm ngang.
                </Typography>
            </div>
            <RadioGroup aria-label="Tần suất nhận thông báo" defaultValue="daily" className="flex flex-col gap-2">
                {OPTIONS.map((opt) => (
                    <Radio key={opt.value} value={opt.value}>
                        <Radio.Content>
                            <Radio.Control>
                                <Radio.Indicator />
                            </Radio.Control>
                            {opt.label}
                        </Radio.Content>
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    ),
}

/** Có item khoá: `isDisabled` trên một `Radio` — vẫn thấy nhưng không chọn được. */
export const WithDisabledOption: Story = {
    parameters: {
        usage: "Một lựa chọn tồn tại nhưng chưa mở cho người dùng này → `isDisabled` trên `Radio` đó (mờ, không chọn được) thay vì ẩn đi — để họ biết có lựa chọn đó.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có lựa chọn bị khoá</Label>
                <Typography type="body-sm" color="muted">
                    Lựa chọn khoá vẫn hiện (mờ) để người dùng biết nó tồn tại.
                </Typography>
            </div>
            <RadioGroup aria-label="Gói nhận thông báo" defaultValue="free" className="flex flex-col gap-2">
                <Radio value="free">
                    <Radio.Content>
                        <Radio.Control>
                            <Radio.Indicator />
                        </Radio.Control>
                        Cơ bản (miễn phí)
                    </Radio.Content>
                </Radio>
                <Radio value="pro" isDisabled>
                    <Radio.Content>
                        <Radio.Control>
                            <Radio.Indicator />
                        </Radio.Control>
                        Nâng cao (chỉ gói Pro)
                    </Radio.Content>
                </Radio>
            </RadioGroup>
        </div>
    ),
}
