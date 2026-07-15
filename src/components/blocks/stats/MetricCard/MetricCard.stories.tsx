import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChartLineUpIcon } from "@phosphor-icons/react"
import { MetricCard } from "./index"

const meta: Meta<typeof MetricCard> = {
    title: "Blocks/MetricCard",
    component: MetricCard,
}
export default meta
type Story = StoryObj<typeof MetricCard>

/** Dùng khi cần hiển thị một chỉ số nổi bật kèm icon và ghi chú ngữ cảnh, ví dụ trong dashboard hoặc sidebar hồ sơ. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần hiển thị một chỉ số nổi bật kèm icon và ghi chú ngữ cảnh, ví dụ trong dashboard hoặc sidebar hồ sơ." },
    render: () => (
        <MetricCard
            icon={<ChartLineUpIcon size={24} />}
            value="1.204"
            label="Tổng số học viên đã ghi danh"
            hint="Cập nhật hàng ngày"
        />
    ),
}

/** Dùng khi chỉ số không cần icon minh hoạ, tập trung sự chú ý vào giá trị và nhãn mô tả. */
export const WithoutIcon: Story = {
    parameters: { usage: "Dùng khi chỉ số không cần icon minh hoạ, tập trung sự chú ý vào giá trị và nhãn mô tả." },
    render: () => (
        <MetricCard
            value="98%"
            label="Tỷ lệ hoàn thành khoá học"
            hint="So với tuần trước"
        />
    ),
}

/** Dùng khi chỉ số chỉ cần giá trị và nhãn, không có ghi chú bổ sung nào khác. */
export const MinimalNoHint: Story = {
    parameters: { usage: "Dùng khi chỉ số chỉ cần giá trị và nhãn, không có ghi chú bổ sung nào khác." },
    render: () => (
        <MetricCard
            icon={<ChartLineUpIcon size={24} />}
            value="42"
            label="Chứng chỉ đã cấp"
        />
    ),
}

/** Dùng để kiểm tra bố cục khi nhãn và ghi chú dài, đảm bảo văn bản xuống dòng hợp lý thay vì tràn khung. */
export const LongLabelAndHint: Story = {
    parameters: { usage: "Dùng để kiểm tra bố cục khi nhãn và ghi chú dài, đảm bảo văn bản xuống dòng hợp lý thay vì tràn khung." },
    render: () => (
        <MetricCard
            icon={<ChartLineUpIcon size={24} />}
            value="3.750"
            label="Tổng số lượt nộp bài tập đã được chấm điểm trong tháng này"
            hint="Bao gồm cả bài nộp từ học viên dùng thử và học viên đã trả phí"
        />
    ),
}
