import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { ChartLineUpIcon } from "@phosphor-icons/react"
import { MetricCard } from "./index"

const meta: Meta<typeof MetricCard> = {
    title: "Blocks/Stat/MetricCard",
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

/** Dùng khi cần so sánh các thẻ khi bật/tắt từng slot tuỳ chọn (icon, hint) cạnh nhau để chọn biến thể phù hợp cho từng bối cảnh dashboard. */
export const OptionalSlots: Story = {
    parameters: { usage: "Dùng khi cần so sánh các thẻ khi bật/tắt từng slot tuỳ chọn (icon, hint) cạnh nhau để chọn biến thể phù hợp cho từng bối cảnh dashboard." },
    render: () => (
        <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">Không icon (chỉ giá trị và nhãn)</Typography>
                <MetricCard
                    value="98%"
                    label="Tỷ lệ hoàn thành khoá học"
                    hint="So với tuần trước"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">Không hint (giá trị và nhãn kèm icon)</Typography>
                <MetricCard
                    icon={<ChartLineUpIcon size={24} />}
                    value="42"
                    label="Chứng chỉ đã cấp"
                />
            </div>
        </div>
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
