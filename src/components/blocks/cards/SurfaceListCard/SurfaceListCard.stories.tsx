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

/** Dùng làm khối danh sách điều hướng nổi trên nền trang (chọn khoá học, chọn mục cài đặt…). */
export const Default: Story = {
    parameters: {
        usage: "Dùng làm khối danh sách điều hướng nổi trên nền trang (chọn khoá học, chọn mục cài đặt…).",
    },
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

/**
 * Gallery các trạng thái hàng: `bordered` khi card nằm LỒNG trong 1 surface khác (ví dụ
 * trong modal), `selected` để đánh dấu mục đang chọn (ngôn ngữ, phương thức thanh toán),
 * `isDisabled` cho tuỳ chọn chưa mở, `hover="underline"` cho hàng dẫn tới bài viết/nội dung.
 */
export const RowVariants: Story = {
    parameters: {
        usage: "Gallery các trạng thái hàng: `bordered` khi card nằm LỒNG trong 1 surface khác (ví dụ trong modal), `selected` để đánh dấu mục đang chọn (ngôn ngữ, phương thức thanh toán), `isDisabled` cho tuỳ chọn chưa mở, `hover=\"underline\"` cho hàng dẫn tới bài viết/nội dung.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="max-w-md rounded-3xl bg-surface p-4 shadow-surface">
                <p className="mb-2 text-body-xs text-muted">bordered (nested surface)</p>
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
            <div className="max-w-md">
                <p className="mb-2 text-body-xs text-muted">selected</p>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Tiếng Việt" onPress={() => {}} />
                    <SurfaceListCardRow title="English" selected onPress={() => {}} />
                </SurfaceListCard>
            </div>
            <div className="max-w-md">
                <p className="mb-2 text-body-xs text-muted">isDisabled</p>
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
            <div className="max-w-md">
                <p className="mb-2 text-body-xs text-muted">hover=&quot;underline&quot;</p>
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
                </SurfaceListCard>
            </div>
        </div>
    ),
}

/** Dùng khi mỗi hàng cần icon minh hoạ + nhãn phụ (ưu đãi, ghi chú) — ví dụ chọn phương thức thanh toán. */
export const WithLeadingAndMeta: Story = {
    parameters: {
        usage: "Dùng khi mỗi hàng cần icon minh hoạ + nhãn phụ (ưu đãi, ghi chú) — ví dụ chọn phương thức thanh toán.",
    },
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

/** Dùng cho hàng ĐIỀU HƯỚNG (điều khoản, chính sách) — mỗi hàng là 1 link `<a>`, không phải nút hành động. */
export const LinkRows: Story = {
    parameters: {
        usage: "Dùng cho hàng ĐIỀU HƯỚNG (điều khoản, chính sách) — mỗi hàng là 1 link `<a>`, không phải nút hành động.",
    },
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

/** Dùng khi nội dung hàng không khớp khuôn title/subtitle/leading — ví dụ hàng có thanh tiến độ riêng. */
export const FreeFormItems: Story = {
    parameters: {
        usage: "Dùng khi nội dung hàng không khớp khuôn title/subtitle/leading — ví dụ hàng có thanh tiến độ riêng.",
    },
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

/** Dùng cho hàng CHỈ ĐỌC không bấm được — ví dụ liệt kê nhật ký thay đổi (changelog). */
export const StaticItem: Story = {
    parameters: {
        usage: "Dùng cho hàng CHỈ ĐỌC không bấm được — ví dụ liệt kê nhật ký thay đổi (changelog).",
    },
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
