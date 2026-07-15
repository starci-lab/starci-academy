import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CreditCardIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "./index"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Blocks/Card/SurfaceListCard",
    component: SurfaceListCard,
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

/**
 * Dùng khi mỗi item ĐƠN GIẢN (nhãn + phụ đề + leading) và nhiều item: gộp HẾT vào MỘT card này,
 * các hàng ngăn nhau bằng separator — KHÔNG rải N thẻ Card rời. Nếu mỗi item GIÀU (ảnh cover,
 * nhiều hành động riêng) tới mức tự nó xứng một khối độc lập → mới tách N card riêng cách gap-3.
 * Nếu danh sách cần gập/mở theo nhóm → Accordion. Story này là card nổi trên nền trang.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng khi mỗi item ĐƠN GIẢN (nhãn + phụ đề + leading) và nhiều item: gộp HẾT vào MỘT card này, các " +
            "hàng ngăn nhau bằng separator — KHÔNG rải N thẻ Card rời. Nếu mỗi item GIÀU (ảnh cover, nhiều hành " +
            "động riêng) tới mức tự nó xứng một khối độc lập → mới tách N card riêng cách gap-3. Nếu danh sách cần " +
            "gập/mở theo nhóm → Accordion. Story này là card nổi trên nền trang (chọn khoá học, chọn mục cài đặt).",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Khuôn hàng chỉ-chữ: title là dòng bắt buộc, subtitle là dòng phụ thêm khi cần một mẩu bối cảnh ngắn để người đọc chọn đúng hàng. Đặt caret ở trailing khi bấm hàng là ĐI sang một màn khác, bỏ caret nếu hàng chạy một hành động tại chỗ.
                </Typography>
            </div>
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
        <div className="flex flex-col gap-6">
            <div className="flex max-w-md flex-col gap-3 rounded-3xl bg-surface p-4 shadow-surface">
                <div className="flex flex-col gap-2">
                    <Label>Bordered</Label>
                    <Typography type="body-sm" color="muted">
                        Bật khi card nằm LỒNG trong một surface khác đã nhìn thấy được — thân modal, drawer, panel. Ở đó shadow gần như vô hình vì đặt trên nền surface, nên phải đọc bằng viền. Card đứng riêng trên nền trang thì để mặc định (shadow).
                    </Typography>
                </div>
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
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Selected</Label>
                    <Typography type="body-sm" color="muted">
                        Bật cho hàng mà lựa chọn Ở LẠI và đọc được là "cái tôi đang dùng" — ngôn ngữ, phương thức thanh toán. Hàng bấm-là-đi-luôn thì không có trạng thái này.
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Tiếng Việt" onPress={() => {}} />
                    <SurfaceListCardRow title="English" selected onPress={() => {}} />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Disabled</Label>
                    <Typography type="body-sm" color="muted">
                        Bật khi tuỳ chọn tồn tại nhưng chưa mở cho người dùng này — giữ hàng lại chứ đừng ẩn đi, vì ẩn thì họ không biết là có, còn thấy mà không bấm được thì hiểu ngay là cần nâng cấp hoặc chờ.
                    </Typography>
                </div>
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
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Hover underline</Label>
                    <Typography type="body-sm" color="muted">
                        Đổi sang underline khi hàng dẫn TỚI một bài đọc — hover gạch chân vì bản chất nó là một liên kết. Hàng chạy một hành động tại chỗ, hoặc mở một mục trong app, thì để mặc định (tô nền).
                    </Typography>
                </div>
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
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có leading và meta</Label>
                <Typography type="body-sm" color="muted">
                    Thêm leading khi các hàng nhận ra nhau bằng HÌNH nhanh hơn bằng chữ — phương thức thanh toán, khoá học; danh sách chữ thuần thì bỏ. Thêm meta cho mẩu thông tin ngắn thuộc riêng một hàng và đáng đem so giữa các hàng, ví dụ ưu đãi; hàng nào không có thì để trống, đừng lấp cho đều.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                            <CreditCardIcon className="size-5 text-accent-soft-foreground" aria-hidden focusable="false" />
                        </div>
                    }
                    title="Thanh toán một lần"
                    subtitle="Thanh toán toàn bộ học phí ngay"
                    meta={<span className="text-xs text-muted">Tiết kiệm 10%</span>}
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

/** Dùng khi nội dung hàng không khớp khuôn title/subtitle/leading — ví dụ hàng có thanh tiến độ riêng. */
export const FreeFormItems: Story = {
    parameters: {
        usage: "Dùng khi nội dung hàng không khớp khuôn title/subtitle/leading — ví dụ hàng có thanh tiến độ riêng.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nội dung tự do</Label>
                <Typography type="body-sm" color="muted">
                    SurfaceListCardItem mặc định là hàng TĨNH — chỉ thêm onPress hoặc href khi cả hàng thực sự bấm được, như demo này. Đổi lại việc bố cục giao hết cho người gọi: phải tự lo truncate và giữ các hàng cùng chiều cao, hai thứ mà khuôn SurfaceListCardRow đã khoá sẵn.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Nhập môn Lập trình Backend
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-2/3 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">65%</span>
                    </div>
                </SurfaceListCardItem>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Cơ sở dữ liệu quan hệ
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-1/5 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">20%</span>
                    </div>
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}
