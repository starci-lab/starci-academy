import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseProgressBar } from "@/components/blocks/stats/CourseProgressBar"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CourseProgressBar> = {
    title: "Blocks/Stats/CourseProgressBar",
    component: CourseProgressBar,
}
export default meta
type Story = StoryObj<typeof CourseProgressBar>

/**
 * Toàn bộ ma trận trạng thái của CourseProgressBar: nhiều chiều tiến độ khác đơn
 * vị/thang đo (mặc định), ẩn legend khi khối cha đã có legend riêng, và một chiều
 * có total = 0 (chưa mở phần đó của khoá học) tự biến mất khỏi thanh. Dùng để tra
 * khi nào ẩn legend và khi nào một chiều nên rời khỏi thanh thay vì hiện lane rỗng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Nhiều chiều tiến độ"
                hint="Dùng khi tiến độ khoá học trải trên NHIỀU chiều với đơn vị và thang đo khác xa nhau (lesson chục, challenge trăm, milestone chục) — mỗi chiều có lane rộng bằng nhau tự lấp theo tỉ lệ riêng. Khác SegmentBar (chia tỉ lệ trên MỘT tổng chung): ở đây mỗi chiều có tổng khác nhau, chia chung sẽ bóp chiều nhỏ thành một lát mỏng; lane bằng nhau giữ mọi chiều đều thấy được."
            >
                <div className="w-96">
                    <CourseProgressBar
                        ariaLabel="Fullstack course progress by dimension"
                        dims={[
                            { key: "content", label: "Lessons", completed: 87, total: 120, color: "var(--accent)" },
                            { key: "challenge", label: "Challenges", completed: 45, total: 329, color: "var(--success)" },
                            { key: "milestone", label: "Milestones", completed: 6, total: 12, color: "var(--warning)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Ẩn legend"
                hint="Dùng hideLegend khi thanh nằm trong một khối đã có legend riêng ở chỗ khác, để không lặp lại nhãn + số bên dưới."
            >
                <div className="w-96">
                    <CourseProgressBar
                        hideLegend
                        ariaLabel="Fullstack course progress"
                        dims={[
                            { key: "content", label: "Lessons", completed: 87, total: 120, color: "var(--accent)" },
                            { key: "challenge", label: "Challenges", completed: 45, total: 329, color: "var(--success)" },
                            { key: "milestone", label: "Milestones", completed: 6, total: 12, color: "var(--warning)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Chiều chưa áp dụng"
                hint="Một chiều có total = 0 (khoá học chưa mở phần đó) biến mất khỏi thanh — không có lane rỗng để bị hiểu nhầm là chưa làm gì."
            >
                <div className="w-96">
                    <CourseProgressBar
                        ariaLabel="Progress for a course without milestones yet"
                        dims={[
                            { key: "content", label: "Lessons", completed: 40, total: 60, color: "var(--accent)" },
                            { key: "challenge", label: "Challenges", completed: 12, total: 80, color: "var(--success)" },
                            { key: "milestone", label: "Milestones", completed: 0, total: 0, color: "var(--warning)" },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của CourseProgressBar: nhiều chiều tiến độ khác đơn vị/thang đo " +
            "(mặc định), ẩn legend khi khối cha đã có legend riêng, và một chiều có total = 0 (chưa mở phần " +
            "đó của khoá học) tự biến mất khỏi thanh. Dùng để tra khi nào ẩn legend và khi nào một chiều nên " +
            "rời khỏi thanh thay vì hiện lane rỗng.",
    },
}
