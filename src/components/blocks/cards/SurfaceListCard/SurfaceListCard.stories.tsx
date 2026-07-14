import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CaretRightIcon,
    CreditCardIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "./index"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Blocks/SurfaceListCard",
    component: SurfaceListCard,
    parameters: {
        layout: "padded",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

/** Default: top-level surface (shadow skin) holding a few interactive rows. */
export const Default: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Nền tảng lập trình"
                    subtitle="12 bài học · 4 giờ"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="Cấu trúc dữ liệu & giải thuật"
                    subtitle="18 bài học · 7 giờ"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="Thiết kế hệ thống"
                    subtitle="9 bài học · 5 giờ"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** `bordered`: nested inside another surface (modal/drawer body) — border instead of shadow. */
export const Bordered: Story = {
    render: () => (
        <div className="max-w-md rounded-3xl bg-surface p-4 shadow-surface">
            <SurfaceListCard bordered>
                <SurfaceListCardRow
                    title="Ví MoMo"
                    subtitle="Liên kết ngày 12/06/2026"
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    title="Thẻ Visa •••• 4242"
                    subtitle="Hết hạn 08/28"
                    onPress={() => {}}
                    selected
                />
            </SurfaceListCard>
        </div>
    ),
}

/** Rows with leading icon, `meta` chip content, and trailing caret. */
export const WithLeadingAndMeta: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                            <CreditCardIcon className="size-5 text-accent" aria-hidden focusable="false" />
                        </div>
                    }
                    title="Thanh toán một lần"
                    subtitle="Thanh toán toàn bộ học phí ngay"
                    meta={<span className="text-body-xs text-muted">Tiết kiệm 10%</span>}
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default">
                            <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                        </div>
                    }
                    title="Trả góp 3 tháng"
                    subtitle="Không lãi suất"
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** `selected`: the tinted active row (`bg-accent/10`), often paired with `titleClassName="text-accent"`. */
export const SelectedRow: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow title="Tiếng Việt" onPress={() => {}} />
                <SurfaceListCardRow
                    title="English"
                    selected
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** `isDisabled`: dimmed, non-interactive row. */
export const DisabledRow: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow title="Xuất hoá đơn PDF" onPress={() => {}} />
                <SurfaceListCardRow
                    title="Xuất báo cáo Excel (sắp ra mắt)"
                    subtitle="Chưa khả dụng cho gói hiện tại"
                    isDisabled
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** `hover="underline"`: link-style row (title underlines, no row fill) — for a nav/most-read list. */
export const UnderlineHover: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Vì sao học viên bỏ dở khoá học?"
                    subtitle="12.4k lượt đọc"
                    hover="underline"
                    href="#"
                />
                <SurfaceListCardRow
                    title="Lộ trình trở thành Senior Backend"
                    subtitle="9.1k lượt đọc"
                    hover="underline"
                    href="#"
                />
                <SurfaceListCardRow
                    title="5 sai lầm khi thiết kế API"
                    subtitle="7.8k lượt đọc"
                    hover="underline"
                    href="#"
                />
            </SurfaceListCard>
        </div>
    ),
}

/** `href`: renders each row as an `<a>` that navigates on click, instead of a `<button>`. */
export const LinkRows: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Điều khoản dịch vụ"
                    href="/legal/terms"
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="Chính sách bảo mật"
                    href="/legal/privacy"
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** {@link SurfaceListCardItem}: free-form row content (not the fixed leading/title/subtitle slots). */
export const FreeFormItems: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-body-sm font-medium">
                                Nhập môn Lập trình Backend
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-2/3 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-body-xs text-muted">65%</span>
                    </div>
                </SurfaceListCardItem>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-body-sm font-medium">
                                Cơ sở dữ liệu quan hệ
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-1/5 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-body-xs text-muted">20%</span>
                    </div>
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}

/** `SurfaceListCardItem` with `hover="underline"`: a static (non-interactive) plain row for comparison. */
export const StaticItem: Story = {
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardItem>
                    <span className="text-body-sm text-muted">
                        Nhật ký thay đổi v2.4.0 — thêm chế độ trả góp
                    </span>
                </SurfaceListCardItem>
                <SurfaceListCardItem>
                    <span className="text-body-sm text-muted">
                        Nhật ký thay đổi v2.3.0 — cải thiện tốc độ tải trang khoá học
                    </span>
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}
