import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { ModelByline, VerdictIcon } from "./index"

const meta: Meta<typeof ModelByline> = {
    title: "Blocks/Grading/GradingByline",
    component: ModelByline,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ModelByline>

/** Dùng trong thẻ kết quả chấm bài để nêu rõ model đã chấm, có nhãn "Chấm bởi" đứng trước tên model. */
export const WithLabel: Story = {
    parameters: { usage: "Dùng trong thẻ kết quả chấm bài để nêu rõ model đã chấm, có nhãn \"Chấm bởi\" đứng trước tên model." },
    render: () => <ModelByline model="gpt-4o-mini" category={AiModelCategory.Balanced} withLabel />,
}

/** Dùng khi hạng model chưa được ghi nhận (dữ liệu cũ) — vẫn hiện tên model nhưng không kèm chip hạng. */
export const WithoutCategory: Story = {
    parameters: { usage: "Dùng khi hạng model chưa được ghi nhận (dữ liệu cũ) — vẫn hiện tên model nhưng không kèm chip hạng." },
    render: () => <ModelByline model="claude-3-5-sonnet" withLabel />,
}

/** Dùng khi bài chưa từng được chấm bởi model nào — component tự ẩn hoàn toàn, không chiếm chỗ trên layout. */
export const NoModel: Story = {
    parameters: { usage: "Dùng khi bài chưa từng được chấm bởi model nào — component tự ẩn hoàn toàn, không chiếm chỗ trên layout." },
    render: () => <ModelByline model={null} withLabel />,
}

/** Dùng cặp glyph đậu/rớt để đánh dấu nhanh kết quả từng lần nộp trong danh sách hoặc chip chọn kết quả. */
export const VerdictIcons: Story = {
    parameters: { usage: "Dùng cặp glyph đậu/rớt để đánh dấu nhanh kết quả từng lần nộp trong danh sách hoặc chip chọn kết quả." },
    render: () => (
        <div className="flex items-center gap-4">
            <VerdictIcon pass />
            <VerdictIcon pass={false} />
        </div>
    ),
}
