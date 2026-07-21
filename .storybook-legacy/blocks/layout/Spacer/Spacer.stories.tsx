import type { Meta, StoryObj } from "@storybook/nextjs"
import { Spacer } from "@/components/blocks/layout/Spacer"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `Spacer` — một div `aria-hidden` chiếm khoảng trống cố định theo trục ngang
 * (`x`) và/hoặc dọc (`y`), dùng thay cho `gap` của flex khi các phần tử là
 * children TRỰC TIẾP của một container không phải flex/grid (ví dụ ghép động
 * theo điều kiện render). Giá trị khớp bậc `spacingScale` (0.5 → 48) đổi ra
 * rem đúng thang Tailwind; giá trị lẻ ngoài bậc rơi về công thức `n * 0.25rem`.
 */
const meta: Meta<typeof Spacer> = {
    title: "Legacy/Blocks/Layout/Spacer",
    component: Spacer,
}
export default meta
type Story = StoryObj<typeof Spacer>

const DemoBlock = ({ label }: { label: string }) => (
    <div className="flex h-10 w-20 items-center justify-center rounded-md bg-accent-soft text-xs font-medium text-accent-soft-foreground">
        {label}
    </div>
)

/**
 * Toàn bộ trạng thái của Spacer trong một gallery: không set trục nào (giữ
 * chỗ nhưng không chiếm diện tích), khoảng ngang/dọc trong bậc spacing
 * chuẩn, giá trị lẻ ngoài bậc, spacer hai chiều, và className tùy biến để
 * debug trực quan lúc dựng layout.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng Spacer khi hai phần tử là children trực tiếp của một container KHÔNG có `gap` (ví dụ nội dung ghép động theo điều kiện, không bọc được trong `flex flex-col gap-*`) — ví dụ thật: SubmissionAttemptCard đặt `Spacer y={3}` giữa header/feedback/actions. Nếu container đã là flex/grid có `gap`, dùng `gap` thay vì Spacer để tránh khoảng cách đôi.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Không set x/y — không chiếm diện tích"
                hint="x và y đều undefined: width/height không được set nên div co về 0 — dùng khi giữ chỗ một node trong lúc chưa biết cần khoảng cách bao nhiêu, không làm lệch layout xung quanh."
            >
                <div className="flex items-center rounded-md border border-dashed border-default p-2">
                    <DemoBlock label="A" />
                    <Spacer />
                    <DemoBlock label="B" />
                </div>
            </Variant>
            <Variant
                label="Khoảng ngang trong bậc spacing chuẩn (x=6)"
                hint="x=6 khớp bậc spacingScale ra 1.5rem — dùng giữa hai phần tử nằm ngang khi container cha không có gap của flex."
            >
                <div className="flex items-center rounded-md border border-dashed border-default p-2">
                    <DemoBlock label="A" />
                    <Spacer x={6} className="self-stretch border-x border-dashed border-default" />
                    <DemoBlock label="B" />
                </div>
            </Variant>
            <Variant
                label="Khoảng dọc trong bậc spacing chuẩn (y=3)"
                hint="Đúng cách SubmissionAttemptCard dùng thật: y=3 (0.75rem) chèn giữa dòng feedback và hàng nút hành động, vì hai phần tử này là children trực tiếp, không bọc trong flex-col gap."
            >
                <div className="flex flex-col rounded-md border border-dashed border-default p-2">
                    <DemoBlock label="Feedback" />
                    <Spacer y={3} className="self-stretch border-y border-dashed border-default" />
                    <DemoBlock label="Actions" />
                </div>
            </Variant>
            <Variant
                label="Giá trị lẻ ngoài bậc (x=7) — rơi về công thức n × 0.25rem"
                hint="7 không nằm trong spacingScale (bậc gần nhất là 6 và 8) nên Spacer tự tính 7 * 0.25rem = 1.75rem thay vì báo lỗi hoặc bỏ qua."
            >
                <div className="flex items-center rounded-md border border-dashed border-default p-2">
                    <DemoBlock label="A" />
                    <Spacer x={7} className="self-stretch border-x border-dashed border-default" />
                    <DemoBlock label="B" />
                </div>
            </Variant>
            <Variant
                label="Spacer hai chiều (x và y cùng lúc)"
                hint="Truyền cả x và y khi cần một khối đệm hình chữ nhật cố định, ví dụ giữ chỗ placeholder trong lưới trước khi nội dung thật load xong."
            >
                <Spacer x={16} y={10} className="rounded-md border border-dashed border-default" />
            </Variant>
            <Variant
                label="className tùy biến — tô màu để debug lúc dựng layout"
                hint="className truyền thẳng vào div nền, hữu ích lúc dựng layout để nhìn thấy Spacer chiếm bao nhiêu diện tích rồi bỏ màu debug khi xong."
            >
                <Spacer x={20} y={8} className="rounded-md bg-accent-soft" />
            </Variant>
        </Gallery>
    ),
}
