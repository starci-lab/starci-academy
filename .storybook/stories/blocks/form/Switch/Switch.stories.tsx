import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Switch, Typography } from "@heroui/react"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `Switch` (HeroUI) — an instant ON/OFF toggle (unlike Checkbox: flipping applies right
 * away, no submit needed). Compound structure: `Switch.Content > Switch.Control >
 * Switch.Thumb` (add `Switch.Icon` inside Thumb if an icon is needed, like
 * DarkLightModeSwitch). In forms it's usually laid out as a settings ROW: descriptive
 * label on the left, Switch aligned right.
 */
const meta: Meta<typeof Switch> = {
    title: "Primitives/Form/Switch",
    component: Switch,
}
export default meta
type Story = StoryObj<typeof Switch>

/**
 * Toàn bộ ma trận trạng thái của Switch: on, off, disabled, và pattern nhóm hàng
 * settings-row chuẩn khi xếp nhiều switch liên tiếp trên một trang cài đặt.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="On"
                hint="Dùng cho lựa chọn ÁP DỤNG NGAY khi bật (nhận email, dark mode) — khác Checkbox phải chờ submit. Xếp thành hàng: nhãn mô tả bên trái, Switch bên phải (`justify-between`). Nhãn phải nói rõ ON nghĩa là gì."
            >
                <div className="flex w-80 items-center justify-between gap-4">
                    <Typography type="body-sm">Receive email notifications</Typography>
                    <Switch defaultSelected aria-label="Receive email notifications">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </Variant>
            <Variant
                label="Off"
                hint="Trạng thái tắt — lựa chọn hiện chưa được áp dụng."
            >
                <div className="flex w-80 items-center justify-between gap-4">
                    <Typography type="body-sm">Browser push notifications</Typography>
                    <Switch aria-label="Browser push notifications">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </Variant>
            <Variant
                label="Disabled"
                hint="`isDisabled` khi lựa chọn chưa thể bật/tắt (phụ thuộc plan/quyền/điều kiện khác) — switch mờ đi và không tương tác được. Nhãn nên gợi ý LÝ DO bị khoá nếu không rõ ràng."
            >
                <div className="flex w-80 items-center justify-between gap-4">
                    <Typography type="body-sm" color="muted">Weekly summary email (Pro plan)</Typography>
                    <Switch isDisabled aria-label="Weekly summary email">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </Variant>
            <Variant
                label="Nhóm hàng settings (SettingsRows)"
                hint="Layout chuẩn cho một chuỗi lựa chọn switch trên trang settings (privacy, preferences): mỗi hàng là nhãn + mô tả body-xs muted ↔ Switch, bọc `flex items-start justify-between gap-3 my-2`; cột ngoài `flex flex-col gap-3`. Nhịp dọc = gap-3 (container) + my-2 (mỗi hàng). Nhãn là SIBLING của Switch, không nằm trong `Switch.Content` (react-aria slot). Ca thật: `/profile/settings/privacy`."
            >
                <div className="flex w-96 flex-col gap-3">
                    {[
                        { label: "Dự án", desc: "Dự án cá nhân & capstone bạn ghim — cho nhà tuyển dụng xem sản phẩm thật." },
                        { label: "Thử thách", desc: "Bài nộp coding-challenge đã chấm điểm (theo khóa, độ khó, ngôn ngữ)." },
                        { label: "Kỹ năng", desc: "Chỉ số coding, phân bố độ khó/chủ đề/ngôn ngữ & lịch sử giải bài." },
                        { label: "Hoạt động", desc: "Dòng thời gian đóng góp — bạn học đều đặn tới đâu." },
                    ].map((row) => (
                        <div key={row.label} className="my-2 flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-col gap-0">
                                <Label>{row.label}</Label>
                                <Typography type="body-xs" color="muted">{row.desc}</Typography>
                            </div>
                            <Switch defaultSelected className="shrink-0" aria-label={row.label}>
                                <Switch.Content>
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Content>
                            </Switch>
                        </div>
                    ))}
                </div>
            </Variant>
        </Gallery>
    ),
}
