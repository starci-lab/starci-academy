import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { HouseIcon } from "@phosphor-icons/react"

/**
 * SURFACE & FILL — khi nào `bg-surface`, khi nào `bg-accent` SOLID, khi nào `bg-accent-soft` TINT.
 * Nguồn: canon `foundations/elevation.md` + `foundations/color.md` §2-3 + `principles/accent-system.md`.
 * Token semantic ONLY (CẤM hex / slate-* / cyan-500). Giữ demo màu/tầng THẬT — không ép thành bảng chữ.
 */
const meta: Meta = {
    title: "Core/Foundations/Surfaces & Fills",
}
export default meta
type Story = StoryObj

/** Nền theo TẦNG — bàn (background) → giấy (surface) → lồng thì border, không shadow. */
export const Elevation: Story = {
    render: () => (
        <div className="max-w-2xl rounded-3xl bg-background p-6">
            <p className="mb-3 text-xs text-muted"><code className="rounded bg-default px-1 text-foreground">bg-background</code> — nền TRANG (cái bàn)</p>
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <p className="mb-3 text-sm text-foreground"><code className="rounded bg-default px-1">bg-surface</code> + <code className="rounded bg-default px-1">shadow-surface</code> — card top-level (tờ giấy nghỉ trên bàn)</p>
                <div className="rounded-2xl border border-default bg-transparent p-3">
                    <p className="text-sm text-muted">Block LỒNG trong card → <code className="rounded bg-default px-1 text-foreground">border border-default</code> + <code className="rounded bg-default px-1 text-foreground">bg-transparent</code> — KHÔNG shadow, KHÔNG fill chồng fill (shadow chết ở dark mode).</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "Nền theo tầng: `bg-background` (bàn) → `bg-surface` (giấy). Elevation top-level = `shadow-surface` (bỏ border, `.card{border:none}`). Nested/surface-in-surface = `border border-default` (vì `--surface-shadow` = vô hình ở dark). Quy tắc: top-level = shadow · nested = border · KHÔNG BAO GIỜ 2 lớp fill chồng.",
    },
}

/** ACCENT SOLID vs TINT — 2 vai khác nhau, đừng lẫn. */
export const AccentSolidVsTint: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent solid</Label>
                    <Typography type="body-sm" color="muted">
                        CTA chính, tối đa một mỗi màn; chữ và icon trắng theo accent-foreground. Dùng cho Tiếp tục học, Đăng ký, Thanh toán.
                    </Typography>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-field bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Tiếp tục học
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent soft (tint)</Label>
                    <Typography type="body-sm" color="muted">
                        Đánh dấu mục đang chọn ở nav, tab, sidebar, chip hay radio-card; nền tint với label và icon cùng màu accent, chỉ cho khối bounded nhỏ.
                    </Typography>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-2 text-sm font-medium text-accent-soft-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Trang chủ (đang chọn)
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Của tôi trong list</Label>
                    <Typography type="body-sm" color="muted">
                        Làm nổi card hay hàng của người dùng bằng ring hoặc border accent cộng một chi tiết accent; nền vẫn giữ bg-surface, không tô nền cả khối.
                    </Typography>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-accent bg-surface p-3 shadow-surface">
                    <span className="text-sm text-foreground">Hạng của tôi</span>
                    <span className="text-sm font-semibold text-accent-soft-foreground">#12</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "PRIMARY = SOLID `bg-accent` + chữ/icon trắng (`--accent-foreground`) — CTA chính, 1/màn. TINT `bg-accent-soft` + label&icon accent = ĐANG CHỌN (nav/tab/chip/radio-card), CHỈ khối bounded NHỎ. 'Của tôi' = ring/border-accent + 1 value accent, nền bg-surface. Mỗi element CHỈ 1 KÊNH accent (nền HOẶC chữ HOẶC icon HOẶC border — không gộp).",
    },
}

/** Anti-pattern — accent là GIA VỊ, vài điểm/màn. Đừng tô mảng nền lớn. */
export const AccentAntiPatterns: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent-flood (cấm)</Label>
                    <Typography type="body-sm" color="muted">
                        Đừng tô bg-accent-soft lên card, section hay thumbnail lớn; nền khối phải là bg-surface hoặc bg-default, accent chỉ là chi tiết nhỏ.
                    </Typography>
                </div>
                <div className="flex gap-3">
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl bg-accent-soft text-xs text-accent-soft-foreground line-through opacity-70">
                        cả card bg-accent-soft
                    </div>
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-default bg-surface text-xs text-muted shadow-surface">
                        đúng: bg-surface + accent ở chi tiết
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Status-tint (cấm)</Label>
                    <Typography type="body-sm" color="muted">
                        Đừng tô bg-accent-soft lên hàng trạng thái đang học vì nó trông như đang chọn; để icon gánh màu, chữ giữ foreground, nền trong suốt.
                    </Typography>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4 text-accent-soft-foreground" weight="fill" />
                    Bài đang học (đúng: chỉ icon accent, không tint)
                </div>
            </div>
        </div>
    ),
    parameters: {
        usage: "Accent = TÍN HIỆU, không trang trí — 1 màn vài điểm (60-30-10). CẤM: ACCENT-FLOOD (tint mảng nền lớn) · STATUS-TINT (tô nền row trạng thái → giả selected; status để icon gánh màu) · ACCENT-FOR-DONE (done phải `text-success-soft-foreground` xanh, không accent) · 3-KÊNH cho 1 nghĩa. Accent CHỈ cho 4 vai: CTA chính · đang chọn · brand · của tôi.",
    },
}
