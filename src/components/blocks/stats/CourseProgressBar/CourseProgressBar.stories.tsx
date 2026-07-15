import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CourseProgressBar } from "./index"

const meta: Meta<typeof CourseProgressBar> = {
    title: "Core/Stat/CourseProgressBar",
    component: CourseProgressBar,
}
export default meta
type Story = StoryObj<typeof CourseProgressBar>

/**
 * Dùng khi tiến độ khóa gồm NHIỀU chiều ở đơn vị và quy mô KHÁC HẲN nhau (bài học vài chục, thử thách vài
 * trăm, cột mốc chục cái) — mỗi chiều một lane RỘNG BẰNG NHAU, tự lấp theo tỉ lệ riêng của nó. Khác
 * `SegmentBar` (chia lát theo tỉ trọng trên MỘT tổng chung): ở đây tổng mỗi chiều một khác nên chia chung sẽ
 * bóp chiều nhỏ thành sợi chỉ; lane đều đảm bảo chiều nào cũng nhìn thấy.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng khi tiến độ khóa gồm nhiều chiều ở đơn vị và quy mô khác hẳn nhau (bài học vài chục, thử " +
            "thách vài trăm, cột mốc chục cái) — mỗi chiều một lane rộng bằng nhau, tự lấp theo tỉ lệ riêng. " +
            "Khác SegmentBar (chia lát theo tỉ trọng trên một tổng chung): tổng mỗi chiều một khác nên chia " +
            "chung sẽ bóp chiều nhỏ thành sợi chỉ; lane đều đảm bảo chiều nào cũng nhìn thấy.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhiều chiều tiến độ</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi khóa có nhiều chiều tiến độ ở quy mô khác nhau — mỗi chiều một lane rộng bằng nhau,
                    tự lấp theo tỉ lệ riêng nên chiều nhỏ vẫn nhìn thấy.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    ariaLabel="Tiến độ khóa Fullstack theo từng chiều"
                    dims={[
                        { key: "content", label: "Bài học", completed: 87, total: 120, color: "var(--accent)" },
                        { key: "challenge", label: "Thử thách", completed: 45, total: 329, color: "var(--success)" },
                        { key: "milestone", label: "Cột mốc", completed: 6, total: 12, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Dùng `hideLegend` khi thanh nằm trong khối đã có chú thích riêng ở chỗ khác, tránh lặp lại nhãn + số bên dưới. */
export const AnChuThich: Story = {
    parameters: {
        usage: "Dùng hideLegend khi thanh nằm trong khối đã có chú thích riêng ở chỗ khác, tránh lặp lại nhãn + số bên dưới.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Ẩn chú thích</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi khối chứa đã có nhãn số riêng ở chỗ khác — bật hideLegend để thanh không lặp lại
                    legend bên dưới.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    hideLegend
                    ariaLabel="Tiến độ khóa Fullstack"
                    dims={[
                        { key: "content", label: "Bài học", completed: 87, total: 120, color: "var(--accent)" },
                        { key: "challenge", label: "Thử thách", completed: 45, total: 329, color: "var(--success)" },
                        { key: "milestone", label: "Cột mốc", completed: 6, total: 12, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Chiều có `total === 0` (khóa chưa mở phần đó) tự biến mất khỏi thanh — không vẽ lane rỗng gây hiểu nhầm là "chưa làm gì". */
export const ChieuChuaApDung: Story = {
    parameters: {
        usage: "Chiều có total bằng 0 (khóa chưa mở phần đó) tự biến mất khỏi thanh — không vẽ lane rỗng gây hiểu nhầm là chưa làm gì.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chiều chưa áp dụng</Label>
                <Typography type="body-sm" color="muted">
                    Khi một chiều có total bằng 0 (khóa chưa mở phần đó), lane của nó tự biến mất thay vì vẽ một
                    lane rỗng gây hiểu nhầm là chưa làm gì.
                </Typography>
            </div>
            <div className="w-96">
                <CourseProgressBar
                    ariaLabel="Tiến độ khóa chưa có cột mốc"
                    dims={[
                        { key: "content", label: "Bài học", completed: 40, total: 60, color: "var(--accent)" },
                        { key: "challenge", label: "Thử thách", completed: 12, total: 80, color: "var(--success)" },
                        { key: "milestone", label: "Cột mốc", completed: 0, total: 0, color: "var(--warning)" },
                    ]}
                />
            </div>
        </div>
    ),
}
