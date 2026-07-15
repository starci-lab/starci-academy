import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Link } from "@heroui/react"
import { PencilIcon } from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "./index"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/LabeledCard",
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

/** Dùng làm khối nội dung mặc định trong dashboard/trang chi tiết — label ngoài, card chỉ chứa nội dung. */
export const Default: Story = {
    args: {
        label: "Khóa học của tôi",
        children: <SampleBody />,
    },
    parameters: { usage: "Dùng làm khối nội dung mặc định trong dashboard/trang chi tiết — label ngoài, card chỉ chứa nội dung." },
}

/** Dùng khi cần gắn đơn vị/ghi chú ngắn ngay cạnh label (VND, đơn vị đo, trạng thái tóm tắt). */
export const WithLabelEnd: Story = {
    args: {
        label: "Học phí còn lại",
        labelEnd: "VND",
        children: <SampleBody />,
    },
    parameters: { usage: "Dùng khi cần gắn đơn vị/ghi chú ngắn ngay cạnh label (VND, đơn vị đo, trạng thái tóm tắt)." },
}

/** Dùng khi card là một DANH SÁCH rút gọn cần lối "xem thêm" dẫn sang trang đầy đủ — chỉnh `seeMoreLabel` khi "Xem thêm" mặc định không hợp ngữ cảnh (vd "Xem tất cả"). */
export const SeeMoreVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <LabeledCard label="Khóa học nổi bật" onSeeMore={() => {}}>
                <SampleBody />
            </LabeledCard>
            <LabeledCard label="Bài viết mới" onSeeMore={() => {}} seeMoreLabel="Xem tất cả">
                <SampleBody />
            </LabeledCard>
        </div>
    ),
    parameters: { usage: "Dùng khi card là một DANH SÁCH rút gọn cần lối \"xem thêm\" dẫn sang trang đầy đủ — chỉnh `seeMoreLabel` khi \"Xem thêm\" mặc định không hợp ngữ cảnh (vd \"Xem tất cả\")." },
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
        // panel cha = thân modal/drawer (surface CHA) — có label + nội dung của chính nó
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
    ),
    parameters: { usage: "Sub-label theo category: chia danh sách dài thành nhóm. 1 `LabeledCard frameless` (label chính) bọc nhiều cụm `LabeledCard subtleLabel frameless` + `SurfaceListCard` — mỗi nhóm 1 sub-label eyebrow trên 1 LIST CARD đứng riêng (shadow, KHÔNG bordered — không lồng surface). Khoảng giữa nhóm gap-3 (cùng 1 danh mục). Khác surface-in-surface." },
}
