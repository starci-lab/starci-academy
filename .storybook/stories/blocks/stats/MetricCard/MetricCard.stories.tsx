import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetricCard } from "@/components/blocks/stats/MetricCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof MetricCard> = {
    title: "Blocks/Stats/MetricCard",
    component: MetricCard,
}
export default meta
type Story = StoryObj<typeof MetricCard>

/**
 * Toàn bộ trạng thái của MetricCard: mặc định, có hint, không có hint (hint là
 * slot tuỳ chọn duy nhất), và trường hợp label/hint dài để kiểm layout xuống dòng.
 * Dùng khi một số liệu đáng có card khung riêng — dashboard, KPI grid, profile
 * sidebar; khi ghép nhiều số nhỏ trên một dòng, dùng StatPair (số liệu trần,
 * không khung).
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Một số liệu duy nhất đứng riêng trong card có khung: label chữ thường mô tả số nổi bật, kèm hint chữ nhỏ mờ làm chú thích phụ bên dưới."
            >
                <MetricCard
                    value="1,204"
                    label="Total enrolled students"
                    hint="Updated daily"
                />
            </Variant>
            <Variant
                label="Có hint"
                hint="Thêm hint khi số cần một dòng ngữ cảnh bổ sung, ví dụ mốc so sánh hoặc phạm vi tính toán."
            >
                <MetricCard
                    value="98%"
                    label="Course completion rate"
                    hint="Vs. last week"
                />
            </Variant>
            <Variant
                label="Không có hint"
                hint="Bỏ hint khi giá trị và label đã tự giải thích đủ, không cần thêm dòng ngữ cảnh nào bên dưới."
            >
                <MetricCard
                    value="42"
                    label="Certificates issued"
                />
            </Variant>
            <Variant
                label="Label và hint dài"
                hint="Dùng để kiểm layout khi label hoặc hint dài hơn bình thường, đảm bảo chữ xuống dòng gọn gàng thay vì tràn ra ngoài khung."
            >
                <MetricCard
                    value="3,750"
                    label="Total assignment submissions graded this month"
                    hint="Includes submissions from both trial and paid students"
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của MetricCard: mặc định, có hint, không có hint " +
            "(hint là slot tuỳ chọn duy nhất), và trường hợp label/hint dài để kiểm " +
            "layout xuống dòng. Dùng khi một số liệu đáng có card khung riêng — " +
            "dashboard, KPI grid, profile sidebar; khi ghép nhiều số nhỏ trên một " +
            "dòng, dùng StatPair (số liệu trần, không khung).",
    },
}
