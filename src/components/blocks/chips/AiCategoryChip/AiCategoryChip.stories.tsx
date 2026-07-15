import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiCategoryChip } from "./index"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Blocks/Chip/AiCategoryChip",
    component: AiCategoryChip,
}
export default meta
type Story = StoryObj<typeof AiCategoryChip>

/** Dùng khi model AI thuộc hạng miễn phí, cần huy hiệu trung tính không gợi ý chi phí. */
export const Default: Story = {
    parameters: { usage: "Dùng khi model AI thuộc hạng miễn phí, cần huy hiệu trung tính không gợi ý chi phí." },
    render: () => <AiCategoryChip category={AiModelCategory.Free} />,
}

/** Đặt cạnh nhau tất cả các hạng để so sánh màu sắc và nhãn khi thiết kế bảng chọn model. */
export const AllCategories: Story = {
    parameters: { usage: "Đặt cạnh nhau tất cả các hạng để so sánh màu sắc và nhãn khi thiết kế bảng chọn model." },
    render: () => (
        <div className="flex flex-wrap gap-2">
            <AiCategoryChip category={AiModelCategory.Free} />
            <AiCategoryChip category={AiModelCategory.Economy} />
            <AiCategoryChip category={AiModelCategory.Balanced} />
            <AiCategoryChip category={AiModelCategory.Premium} />
            <AiCategoryChip category={AiModelCategory.Frontier} />
        </div>
    ),
}
