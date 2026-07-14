import type { Meta, StoryObj } from "@storybook/nextjs"
import { Badge, Button } from "@heroui/react"
import { BookOpenIcon, ClockIcon } from "@phosphor-icons/react"
import { LabeledCard } from "./index"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/LabeledCard",
    component: LabeledCard,
    parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof LabeledCard>

const SampleBody = () => (
    <div className="flex flex-col gap-2 p-4">
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

/** Thêm icon khi label cần gợi ý nhanh về LOẠI nội dung (tài liệu, lịch, thông báo…) mà chữ không đủ rõ. */
export const WithIcon: Story = {
    args: {
        label: "Tài liệu tham khảo",
        icon: <BookOpenIcon className="size-4 text-accent" aria-hidden focusable="false" />,
        children: <SampleBody />,
    },
    parameters: { usage: "Thêm icon khi label cần gợi ý nhanh về LOẠI nội dung (tài liệu, lịch, thông báo…) mà chữ không đủ rõ." },
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

/** Dùng khi khối cần một hành động quản trị đi kèm label (thêm/sửa/quản lý) thay vì dẫn sang trang khác như "xem thêm". */
export const WithAction: Story = {
    args: {
        label: "Người quản lý",
        action: (
            <Button variant="secondary" size="sm">
                Thêm / quản lý
            </Button>
        ),
        children: <SampleBody />,
    },
    parameters: { usage: "Dùng khi khối cần một hành động quản trị đi kèm label (thêm/sửa/quản lý) thay vì dẫn sang trang khác như \"xem thêm\"." },
}

/**
 * Chọn biến thể layout theo bối cảnh đặt card: `frameless` khi card nằm trong khối đã có viền
 * (tránh viền lồng viền), `flushContent` cho danh sách/table sát mép, `fillHeight` khi card phải
 * lấp đầy một vùng cao cố định (grid đều hàng), `subtleLabel` khi label chỉ là eyebrow phụ, không phải tiêu đề chính.
 */
export const LayoutVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <LabeledCard label="Khóa học đề xuất" frameless>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-default p-3 text-sm">System Design Mastery</div>
                    <div className="rounded-lg border border-default p-3 text-sm">DevOps Mastery</div>
                </div>
            </LabeledCard>
            <LabeledCard label="Danh sách bài học" flushContent>
                <ul className="divide-y divide-default">
                    <li className="p-4 text-sm">Bài 1: Giới thiệu React Hooks</li>
                    <li className="p-4 text-sm">Bài 2: useState và useEffect</li>
                    <li className="p-4 text-sm">Bài 3: Custom Hooks</li>
                </ul>
            </LabeledCard>
            <div className="h-64">
                <LabeledCard label="Trạng thái" fillHeight>
                    <div className="flex h-full items-center justify-center p-6">
                        <Badge color="success">Đang hoạt động</Badge>
                    </div>
                </LabeledCard>
            </div>
            <LabeledCard
                label="Hôm nay"
                icon={<ClockIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                subtleLabel
                labelEnd="3 phiên"
            >
                <SampleBody />
            </LabeledCard>
        </div>
    ),
    parameters: { usage: "Chọn biến thể layout theo bối cảnh đặt card: `frameless` khi card nằm trong khối đã có viền (tránh viền lồng viền), `flushContent` cho danh sách/table sát mép, `fillHeight` khi card phải lấp đầy một vùng cao cố định (grid đều hàng), `subtleLabel` khi label chỉ là eyebrow phụ, không phải tiêu đề chính." },
}
