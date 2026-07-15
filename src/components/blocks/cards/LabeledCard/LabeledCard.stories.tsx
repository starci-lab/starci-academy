import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Label, Link, Typography } from "@heroui/react"
import { PencilIcon } from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "./index"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/Card/LabeledCard",
    component: LabeledCard,
}
export default meta
type Story = StoryObj<typeof LabeledCard>

const SampleBody = () => (
    // p-0: the Card this sits inside already bakes p-4 (card.md — root `.card`
    // insets every child) — a padding class here would double-pad.
    <div className="flex flex-col gap-2 p-0">
        <p className="text-sm text-foreground">
            Khóa học Fullstack Mastery — Module 3: React nâng cao
        </p>
        <p className="text-sm text-muted">
            Tiến độ 68% · 12/18 bài học hoàn thành
        </p>
    </div>
)

/**
 * Dùng cho MỌI khối có tiêu đề — đây là block mặc định, kể cả khi nhãn chỉ là một eyebrow nhỏ
 * ("Hôm nay", "7 ngày qua"): đừng với tay Card trần rồi tự đặt Typography lên trên. Label nằm
 * NGOÀI card, card chỉ chứa nội dung. Mỗi metric khác NGHĨA là một LabeledCard riêng — đừng nhồi
 * hai ba thứ khác nghĩa chung một card; ngược lại một con số lẻ cũng không đáng một card, gom
 * cùng nghĩa lại. Khối KHÔNG có tiêu đề → Card thường. Ngoại lệ hẹp DUY NHẤT của "mặc định" này:
 * khối nằm trong RAIL/PANEL và list chỉ vài hàng → LabeledList (nhãn + list, không khung card).
 */
export const Default: Story = {
    args: {
        label: "Khóa học của tôi",
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Slot bên phải label để trống — trạng thái xuất phát. Chỉ điền labelEnd, onSeeMore hoặc action
                    khi khối thật sự có thứ để gắn vào đó, vì cả ba tranh cùng một chỗ.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: {
        usage:
            "Dùng cho MỌI khối có tiêu đề — đây là block mặc định, kể cả khi nhãn chỉ là một eyebrow nhỏ (\"Hôm " +
            "nay\", \"7 ngày qua\"): đừng với tay Card trần rồi tự đặt Typography lên trên. Label nằm NGOÀI card, " +
            "card chỉ chứa nội dung. Mỗi metric khác NGHĨA là một LabeledCard riêng — đừng nhồi hai ba thứ khác " +
            "nghĩa chung một card; ngược lại một con số lẻ cũng không đáng một card, gom cùng nghĩa lại. Khối " +
            "KHÔNG có tiêu đề → Card thường. Ngoại lệ hẹp DUY NHẤT của \"mặc định\" này: khối nằm trong RAIL/PANEL " +
            "và list chỉ vài hàng → LabeledList (nhãn + list, không khung card).",
    },
}

/** Dùng khi cần gắn đơn vị/ghi chú ngắn ngay cạnh label (VND, đơn vị đo, trạng thái tóm tắt). */
export const WithLabelEnd: Story = {
    args: {
        label: "Học phí còn lại",
        labelEnd: "VND",
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có nhãn phụ bên phải</Label>
                <Typography type="body-sm" color="muted">
                    Slot phải mang một tag CÂM, không bấm được. Ưu tiên thấp nhất trong ba thứ tranh slot đó:
                    truyền kèm onSeeMore hay action thì labelEnd không render nữa.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Dùng khi cần gắn đơn vị/ghi chú ngắn ngay cạnh label (VND, đơn vị đo, trạng thái tóm tắt)." },
}

/** Dùng khi card chỉ là BẢN RÚT GỌN của một danh sách dài, cần lối dẫn sang trang đầy đủ — `onSeeMore` gắn lối đó ngay cạnh label, không chiếm chỗ trong thân card. Card đã hiện trọn dữ liệu thì đừng gắn, vì "xem thêm" mà không còn gì thêm là hứa suông. Chỉnh `seeMoreLabel` khi "Xem thêm" không hợp ngữ cảnh (vd "Xem tất cả"). Cần hành động QUẢN TRỊ (thêm/sửa) thay vì dẫn đi → dùng `action`. */
export const WithSeeMore: Story = {
    args: {
        label: "Khóa học nổi bật",
        onSeeMore: () => {},
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có lối xem thêm</Label>
                <Typography type="body-sm" color="muted">
                    Slot phải mang một lối ĐIỀU HƯỚNG rời khỏi card. Ưu tiên giữa: nó đè labelEnd khi truyền cùng,
                    nhưng lại bị action đè.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Dùng khi card chỉ là BẢN RÚT GỌN của một danh sách dài, cần lối dẫn sang trang đầy đủ — onSeeMore gắn lối đó ngay cạnh label, không chiếm chỗ trong thân card. Card đã hiện trọn dữ liệu thì đừng gắn, vì \"xem thêm\" mà không còn gì thêm là hứa suông. Chỉnh seeMoreLabel khi \"Xem thêm\" không hợp ngữ cảnh (vd \"Xem tất cả\"). Cần hành động QUẢN TRỊ (thêm/sửa) thay vì dẫn đi thì dùng action." },
}

/**
 * Dùng khi khối cần một hành động quản trị đi kèm label (thêm/sửa/quản lý) thay vì dẫn sang trang
 * khác như "xem thêm". `action` LUÔN là `Link` (không phải Button/Chip đặc) — cùng công thức hover
 * với `onSeeMore`: `no-underline` + `transition-opacity hover:opacity-60` (KHÔNG underline khi hover).
 * Icon tuỳ chọn đặt đầu hoặc cuối chữ; chỉ riêng `CaretRightIcon` của `onSeeMore` mới có hiệu ứng
 * trượt nhẹ (`group-hover:translate-x-1`), icon khác thì không cần.
 */
export const WithAction: Story = {
    args: {
        label: "Người quản lý",
        action: (
            <Link className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm text-accent-soft-foreground no-underline transition-opacity hover:opacity-60">
                <PencilIcon aria-hidden focusable="false" className="size-4" />
                Thêm / quản lý
            </Link>
        ),
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có hành động quản trị</Label>
                <Typography type="body-sm" color="muted">
                    Slot phải mang một hành động TẠI CHỖ (thêm/sửa/quản lý) chứ không dẫn đi. Ưu tiên cao nhất
                    trong ba thứ tranh slot: có action thì labelEnd và onSeeMore đều bị bỏ qua.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Dùng khi khối cần một hành động quản trị đi kèm label (thêm/sửa/quản lý) thay vì dẫn sang trang khác như \"xem thêm\". `action` luôn là Link, hover = opacity (không underline), icon tuỳ chọn đầu/cuối chữ." },
}

/**
 * Surface-in-surface: một list surface NẰM LỒNG trong một surface CHA nhìn thấy được (thân
 * modal/drawer/panel). Panel cha là một `Card` THẬT (không hand-roll `<div>` mô phỏng lại đúng
 * class của Card — Card đã là component sẵn có, mặc định `p-4 rounded-3xl shadow-surface` đúng
 * y da "surface top-level" cần); bên trong lồng `SurfaceListCard bordered` — dùng VIỀN thay
 * shadow vì shadow-surface gần như vô hình khi đặt trên một `bg-surface` khác. Đây mới là
 * "surface trong surface" thật (KHÁC list card đứng riêng ở `CategorizedList`). Pattern thật:
 * `PaymentModal` (list cổng thanh toán lồng trong thân modal).
 */
export const SurfaceInSurface: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lồng trong surface cha</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi list nằm bên trong một surface CHA nhìn thấy được (thân modal/panel). Bật frameless
                    và cho inner một SurfaceListCard bordered.
                </Typography>
            </div>
            {/* panel cha = thân modal/drawer (surface CHA) — có label + nội dung của chính nó */}
            <Card>
                <CardContent>
                    <LabeledCard label="Phương thức thanh toán" frameless>
                        <SurfaceListCard bordered>
                            <SurfaceListCardItem>
                                <span className="text-sm">Ví Momo</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">VNPay QR</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">Thẻ tín dụng / ghi nợ</span>
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </LabeledCard>
                </CardContent>
            </Card>
        </div>
    ),
    parameters: { usage: "Surface-in-surface THẬT: 1 list surface lồng trong surface CHA nhìn thấy được (thân modal/panel: `Card` THẬT, không hand-roll div). Inner dùng `SurfaceListCard bordered` (viền thay shadow vì shadow vô hình trên bg-surface). Khác list card đứng riêng. Pattern thật: PaymentModal." },
}

/**
 * Sub-label theo category: chia 1 danh sách dài thành các NHÓM. Một `LabeledCard frameless`
 * (label chính) bọc nhiều cụm `LabeledCard subtleLabel frameless` + `SurfaceListCard` — mỗi nhóm
 * một sub-label eyebrow (`text-xs text-muted`) đặt ngay trên một LIST CARD đứng riêng (shadow,
 * KHÔNG `bordered` — nó KHÔNG lồng trong surface nào, khác `SurfaceInSurface`). Khoảng giữa các
 * nhóm là `gap-3` (chúng cùng thuộc 1 danh mục, không phải 2 vùng tách bạch). Dùng khi list cần
 * phân mục (Cơ bản / Nâng cao…) thay vì đổ phẳng một mạch.
 */
export const CategorizedList: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chia nhóm theo sub-label</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi một danh sách dài cần tách thành các nhóm con (Cơ bản / Nâng cao) thay vì đổ phẳng.
                    Mỗi nhóm là một list card đứng riêng, không lồng surface.
                </Typography>
            </div>
            <LabeledCard label="Danh sách bài học" frameless contentClassName="flex flex-col gap-3">
                <LabeledCard label="Cơ bản" subtleLabel frameless>
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            <span className="text-sm">Bài 1: Giới thiệu React Hooks</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Bài 2: useState và useEffect</span>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </LabeledCard>
                <LabeledCard label="Nâng cao" subtleLabel frameless>
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            <span className="text-sm">Bài 3: Custom Hooks</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Bài 4: useReducer &amp; Context</span>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </LabeledCard>
            </LabeledCard>
        </div>
    ),
    parameters: { usage: "Sub-label theo category: chia danh sách dài thành nhóm. 1 `LabeledCard frameless` (label chính) bọc nhiều cụm `LabeledCard subtleLabel frameless` + `SurfaceListCard` — mỗi nhóm 1 sub-label eyebrow trên 1 LIST CARD đứng riêng (shadow, KHÔNG bordered — không lồng surface). Khoảng giữa nhóm gap-3 (cùng 1 danh mục). Khác surface-in-surface." },
}
