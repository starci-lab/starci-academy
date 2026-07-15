import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiCategoryChip } from "./index"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Blocks/AiCategoryChip",
    component: AiCategoryChip,
}
export default meta
type Story = StoryObj<typeof AiCategoryChip>

/** Dùng khi model AI thuộc hạng miễn phí, cần huy hiệu trung tính không gợi ý chi phí. */
export const Default: Story = {
    parameters: { usage: "Dùng khi model AI thuộc hạng miễn phí, cần huy hiệu trung tính không gợi ý chi phí." },
    render: () => <AiCategoryChip category={AiModelCategory.Free} />,
}

/** Dùng khi model AI thuộc hạng tiết kiệm, cần huy hiệu xanh báo hiệu chi phí thấp. */
export const Economy: Story = {
    parameters: { usage: "Dùng khi model AI thuộc hạng tiết kiệm, cần huy hiệu xanh báo hiệu chi phí thấp." },
    render: () => <AiCategoryChip category={AiModelCategory.Economy} />,
}

/** Dùng khi model AI thuộc hạng cân bằng, cần huy hiệu vàng báo hiệu chi phí trung bình. */
export const Balanced: Story = {
    parameters: { usage: "Dùng khi model AI thuộc hạng cân bằng, cần huy hiệu vàng báo hiệu chi phí trung bình." },
    render: () => <AiCategoryChip category={AiModelCategory.Balanced} />,
}

/** Dùng khi model AI thuộc hạng cao cấp hoặc tiên phong, cần huy hiệu đỏ cảnh báo chi phí cao nhất. */
export const Premium: Story = {
    parameters: { usage: "Dùng khi model AI thuộc hạng cao cấp hoặc tiên phong, cần huy hiệu đỏ cảnh báo chi phí cao nhất." },
    render: () => <AiCategoryChip category={AiModelCategory.Premium} />,
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
