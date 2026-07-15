import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { HouseIcon } from "@phosphor-icons/react"

/**
 * SURFACE & FILL — khi nào `bg-surface`, khi nào `bg-accent` SOLID, khi nào `bg-accent-soft` TINT.
 * Nguồn: canon `foundations/elevation.md` + `foundations/color.md` §2-3 + `principles/accent-system.md`.
 * Token semantic ONLY (CẤM hex / slate-* / cyan-500). Giữ demo màu/tầng THẬT — không ép thành bảng chữ.
 */
const meta: Meta = {
    title: "Foundations/Surfaces & Fills",
}
export default meta
type Story = StoryObj

/** 1 hàng demo — token · ví dụ THẬT · ghi chú. Divider nhẹ (đồng bộ style bảng, bỏ box viền phèn). */
const DemoRow = ({ token, note, children }: { token: string; note: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-3 border-b border-default/50 py-4 first:pt-0 last:border-b-0">
        <code className="w-fit text-xs font-semibold text-foreground">{token}</code>
        <div>{children}</div>
        <p className="text-sm text-muted">{note}</p>
    </div>
)

/** Nhãn nên/đừng — nghĩa nằm ở CHỮ (accessible, không chỉ dựa màu), màu chỉ tô đậm thêm. */
const Do = ({ children }: { children: ReactNode }) => (
    <span className="font-medium text-success-soft-foreground">Nên: {children}</span>
)
const Dont = ({ children }: { children: ReactNode }) => (
    <span className="font-medium text-danger-soft-foreground">Đừng: {children}</span>
)

/** Nền theo TẦNG — bàn (background) → giấy (surface) → lồng thì border, không shadow. */
export const Elevation: Story = {
    render: () => (
        <div className="max-w-2xl rounded-3xl bg-background p-6">
            <p className="mb-3 text-xs text-muted"><code className="rounded bg-default px-1 text-foreground">bg-background</code> — nền TRANG (cái bàn)</p>
            <div className="rounded-3xl bg-surface p-5 shadow-surface">
                <p className="mb-3 text-sm text-foreground"><code className="rounded bg-default px-1">bg-surface</code> + <code className="rounded bg-default px-1">shadow-surface</code> — card top-level (tờ giấy nghỉ trên bàn)</p>
                <div className="rounded-2xl border border-default bg-transparent p-4">
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
        <div className="max-w-2xl">
            <DemoRow
                token="bg-accent (SOLID)"
                note={<>CTA CHÍNH — 1 primary/màn. Chữ &amp; icon TRẮNG (<code className="rounded bg-default px-1 text-foreground">--accent-foreground</code>). <Do>Tiếp tục học · Đăng ký · Thanh toán</Do></>}
            >
                <button type="button" className="inline-flex items-center gap-2 rounded-field bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Tiếp tục học
                </button>
            </DemoRow>
            <DemoRow
                token="bg-accent-soft (TINT / tonal)"
                note={<>ĐANG CHỌN — nav/tab/sidebar/chip/radio-card đang mở. Nền tint + label &amp; icon CÙNG <code className="rounded bg-default px-1 text-foreground">accent</code>. <Do>chỉ cho khối bounded NHỎ</Do></>}
            >
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-2 text-sm font-medium text-accent-soft-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4" />
                    Trang chủ (đang chọn)
                </div>
            </DemoRow>
            <DemoRow
                token={"\"của tôi\" trong list"}
                note={<>Card/row của tôi = <code className="rounded bg-default px-1 text-foreground">ring-accent</code>/<code className="rounded bg-default px-1 text-foreground">border-accent</code> + 1 chi tiết accent · nền vẫn <code className="rounded bg-default px-1 text-foreground">bg-surface</code>. KHÔNG tô nền cả khối.</>}
            >
                <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-accent bg-surface px-4 py-3 shadow-surface">
                    <span className="text-sm text-foreground">Hạng của tôi</span>
                    <span className="text-sm font-semibold text-accent-soft-foreground">#12</span>
                </div>
            </DemoRow>
        </div>
    ),
    parameters: {
        usage: "PRIMARY = SOLID `bg-accent` + chữ/icon trắng (`--accent-foreground`) — CTA chính, 1/màn. TINT `bg-accent-soft` + label&icon accent = ĐANG CHỌN (nav/tab/chip/radio-card), CHỈ khối bounded NHỎ. 'Của tôi' = ring/border-accent + 1 value accent, nền bg-surface. Mỗi element CHỈ 1 KÊNH accent (nền HOẶC chữ HOẶC icon HOẶC border — không gộp).",
    },
}

/** Anti-pattern — accent là GIA VỊ, vài điểm/màn. Đừng tô mảng nền lớn. */
export const AccentAntiPatterns: Story = {
    render: () => (
        <div className="max-w-2xl">
            <DemoRow
                token="ACCENT-FLOOD (CẤM)"
                note={<><Dont>Tô <code className="rounded bg-default px-1 text-foreground">bg-accent/5..15</code> lên card/section/thumbnail LỚN</Dont> — nền khối phải <code className="rounded bg-default px-1 text-foreground">bg-surface</code>/<code className="rounded bg-default px-1 text-foreground">bg-default</code>. Accent là chi tiết nhỏ.</>}
            >
                <div className="flex gap-3">
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl bg-accent-soft text-xs text-accent-soft-foreground line-through opacity-70">
                        cả card bg-accent-soft
                    </div>
                    <div className="flex h-20 w-40 items-center justify-center rounded-2xl border border-default bg-surface text-xs text-muted shadow-surface">
                        đúng: bg-surface + accent ở chi tiết
                    </div>
                </div>
            </DemoRow>
            <DemoRow
                token="STATUS-TINT (CẤM)"
                note={<><Dont>Tô <code className="rounded bg-default px-1 text-foreground">bg-accent-soft</code> lên row TRẠNG THÁI (current/in-progress)</Dont> — nó giả dạng 'selected'. Status = ICON gánh màu, text foreground, nền trong suốt.</>}
            >
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground">
                    <HouseIcon aria-hidden focusable="false" className="size-4 text-accent-soft-foreground" weight="fill" />
                    Bài đang học (đúng: chỉ icon accent, không tint)
                </div>
            </DemoRow>
        </div>
    ),
    parameters: {
        usage: "Accent = TÍN HIỆU, không trang trí — 1 màn vài điểm (60-30-10). CẤM: ACCENT-FLOOD (tint mảng nền lớn) · STATUS-TINT (tô nền row trạng thái → giả selected; status để icon gánh màu) · ACCENT-FOR-DONE (done phải `text-success-soft-foreground` xanh, không accent) · 3-KÊNH cho 1 nghĩa. Accent CHỈ cho 4 vai: CTA chính · đang chọn · brand · của tôi.",
    },
}
