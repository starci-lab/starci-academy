import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { MetricCard } from "./index"

const meta: Meta<typeof MetricCard> = {
    title: "Block/Stat/MetricCard",
    component: MetricCard,
}
export default meta
type Story = StoryObj<typeof MetricCard>

/** Dùng khi một chỉ số tự nó xứng thành một thẻ riêng có khung — giá trị lớn, nhãn body-sm foreground mô tả số, ghi chú body-xs muted làm footnote mờ nhỏ. Nhiều số nhỏ ghép cạnh nhau thì dùng StatPair. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một chỉ số tự nó xứng thành một thẻ riêng có khung — dashboard, KPI grid, sidebar hồ sơ. Nhiều số nhỏ ghép chung một hàng thì dùng StatPair (số trần, không khung)." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Một chỉ số đứng riêng thành thẻ có khung: nhãn body-sm foreground mô tả số nổi rõ, ghi chú body-xs muted làm footnote tách bậc bên dưới.
                </Typography>
            </div>
            <MetricCard
                value="1.204"
                label="Tổng số học viên đã ghi danh"
                hint="Cập nhật hàng ngày"
            />
        </div>
    ),
}

/** Dùng khi cần so sánh có ghi chú và không có ghi chú cạnh nhau — hint là slot tuỳ chọn duy nhất, thêm khi cần một dòng ngữ cảnh phụ, bỏ khi giá trị và nhãn đã đủ. */
export const OptionalSlots: Story = {
    parameters: { usage: "Dùng khi cần so sánh thẻ có ghi chú và không ghi chú cạnh nhau — hint là slot tuỳ chọn duy nhất; thêm khi cần một dòng ngữ cảnh phụ, bỏ đi khi giá trị và nhãn đã đủ rõ." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có ghi chú</Label>
                    <Typography type="body-sm" color="muted">Thêm hint khi cần một dòng ngữ cảnh phụ cho số, ví dụ mốc so sánh hay phạm vi tính.</Typography>
                </div>
                <MetricCard
                    value="98%"
                    label="Tỷ lệ hoàn thành khoá học"
                    hint="So với tuần trước"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Không ghi chú</Label>
                    <Typography type="body-sm" color="muted">Bỏ hint khi giá trị và nhãn đã tự đủ nghĩa, không cần dòng ngữ cảnh phụ bên dưới.</Typography>
                </div>
                <MetricCard
                    value="42"
                    label="Chứng chỉ đã cấp"
                />
            </div>
        </div>
    ),
}

/** Dùng để kiểm tra bố cục khi nhãn và ghi chú dài, đảm bảo văn bản xuống dòng hợp lý thay vì tràn khung. */
export const LongLabelAndHint: Story = {
    parameters: { usage: "Dùng để kiểm tra bố cục khi nhãn và ghi chú dài, đảm bảo văn bản xuống dòng gọn thay vì tràn khung." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nhãn và ghi chú dài</Label>
                <Typography type="body-sm" color="muted">
                    Khi nhãn hoặc ghi chú dài hơn bình thường, kiểm tra văn bản xuống dòng gọn thay vì tràn khung.
                </Typography>
            </div>
            <MetricCard
                value="3.750"
                label="Tổng số lượt nộp bài tập đã được chấm điểm trong tháng này"
                hint="Bao gồm cả bài nộp từ học viên dùng thử và học viên đã trả phí"
            />
        </div>
    ),
}
