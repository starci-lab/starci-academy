import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"

/**
 * Bảng tra HeroUI `Button` — primitive nền của mọi nút trong app (các block trong họ
 * `Blocks/Button` đều dựng trên nó). Ở đây để tra "variant nào trông thế nào" cạnh
 * các block anh em, thay vì tách ra một nhánh riêng.
 */
const meta: Meta<typeof Button> = {
    title: "Blocks/Button/Button",
    component: Button,
}
export default meta
type Story = StoryObj<typeof Button>

/** Chọn variant theo VAI, không theo màu muốn nhìn: primary = CTA chính (tối đa 1/bề mặt), secondary = nút phụ đi CẶP với primary, tertiary = nút phụ đứng MỘT MÌNH, ghost = trong suốt, outline = viền, danger = hành động phá huỷ đứng lẻ, danger-soft = nút xoá LẶP trong từng item. */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Chọn variant theo VAI, không theo màu muốn nhìn: primary = CTA chính (tối đa 1 mỗi bề mặt) · " +
            "secondary = nút phụ đi CẶP với primary · tertiary = nút phụ đứng MỘT MÌNH (quiet) · ghost = trong " +
            "suốt · outline = viền · danger = hành động phá huỷ đứng lẻ · danger-soft = nút xoá LẶP trong từng " +
            "item (danger đặc lặp nhiều dòng sẽ chói). Không tô nút bằng className bg-*/text-* — màu là tín hiệu " +
            "vai, do variant lo.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
                <Label>Primary</Label>
                <Typography type="body-sm" color="muted">
                    CTA chính. Tối đa MỘT mỗi bề mặt — hai primary là mất thứ bậc, mắt không biết đi đâu.
                </Typography>
                <Button variant="primary">Đăng ký học</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Secondary</Label>
                <Typography type="body-sm" color="muted">
                    Nút phụ đi CẶP với một primary — hai nút đứng cạnh nhau.
                </Typography>
                <Button variant="secondary">Xem thử</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Tertiary</Label>
                <Typography type="body-sm" color="muted">
                    Nút phụ đứng MỘT MÌNH, không có primary bên cạnh (quiet).
                </Typography>
                <Button variant="tertiary">Bỏ qua</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Ghost</Label>
                <Typography type="body-sm" color="muted">
                    Trong suốt, không nền không viền — hành động mờ nhất trên bề mặt.
                </Typography>
                <Button variant="ghost">Huỷ</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Outline</Label>
                <Typography type="body-sm" color="muted">
                    Viền, nền trong suốt. Áp đầu ở nút cần đọc như một ô nhập (SearchButton, InputButtonLike) và CTA phụ full-width.
                </Typography>
                <Button variant="outline">Chi tiết</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Danger</Label>
                <Typography type="body-sm" color="muted">
                    Hành động phá huỷ ĐỨNG LẺ, cần nổi bật (xoá tài khoản).
                </Typography>
                <Button variant="danger">Xoá tài khoản</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Danger soft</Label>
                <Typography type="body-sm" color="muted">
                    Nút xoá LẶP trong từng item — danger đặc lặp lại nhiều dòng thì chói cả trang.
                </Typography>
                <Button variant="danger-soft">Xoá</Button>
            </div>
        </div>
    ),
}

/** Ba size + trạng thái disabled: CTA chính dùng size lg, nút phụ md; sm cho control lặp trong item. */
export const SizesAndStates: Story = {
    parameters: {
        usage:
            "Ba size + trạng thái disabled. CTA chính = primary size lg (kèm ArrowRightIcon trailing ở call-site " +
            "thật) · nút phụ = md · sm cho control lặp trong từng item. Nút async thì dùng prop isPending, KHÔNG " +
            "tự chế isDisabled + ternary.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
                <Label>Small</Label>
                <Typography type="body-sm" color="muted">
                    Control lặp trong từng item của một danh sách.
                </Typography>
                <Button variant="primary" size="sm">Nộp bài</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Medium</Label>
                <Typography type="body-sm" color="muted">
                    Mặc định cho nút phụ / sub-CTA (không icon).
                </Typography>
                <Button variant="primary" size="md">Nộp bài</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Large</Label>
                <Typography type="body-sm" color="muted">
                    CTA chính — ở call-site thật đi kèm ArrowRightIcon trailing.
                </Typography>
                <Button variant="primary" size="lg">Nộp bài</Button>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Disabled</Label>
                <Typography type="body-sm" color="muted">
                    Không bấm được vì điều kiện chưa đủ. Đang chờ mạng thì dùng prop isPending, đừng tự chế isDisabled + ternary.
                </Typography>
                <Button variant="primary" isDisabled>Nộp bài</Button>
            </div>
        </div>
    ),
}
