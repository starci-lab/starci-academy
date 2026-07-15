import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AiCategoryChip } from "./index"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Blocks/Chip/AiCategoryChip",
    component: AiCategoryChip,
}
export default meta
type Story = StoryObj<typeof AiCategoryChip>

/** Bảng tra hạng model → màu chấm, xếp theo đúng thang CATEGORY_ORDER rẻ đến mạnh, kèm điều kiện mở khoá của từng hạng. */
export const AllCategories: Story = {
    parameters: { usage: "Bảng tra hạng model → màu chấm, xếp theo đúng thang `CATEGORY_ORDER` (rẻ → mạnh) mà `GradeModelDropdown` dùng để so \"dưới sàn\". Tra khi thiết kế bảng chọn model: hạng nào cần mở khoá, hạng nào ai cũng chọn được. Hạng là THANG BẬC, không phải trạng thái — màu lấy từ palette Tailwind (`AI_CATEGORY_COLOR`), không mượn accent/success/warning/danger: 5 hạng cần 5 màu phân biệt, còn 4 token semantic sẽ ép 2 hạng trùng màu." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Free</Label>
                    <Typography type="body-sm" color="muted">
                        Bậc rẻ nhất. Ai cũng chọn được, không cần mở khoá.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Free} />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Economy</Label>
                    <Typography type="body-sm" color="muted">
                        Vẫn chọn được mà không cần mở khoá — chỉ Balanced trở lên mới nằm trong PLAN_CATEGORIES.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Economy} />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Balanced</Label>
                    <Typography type="body-sm" color="muted">
                        Bậc ĐẦU TIÊN cần mở khoá: phải trả phí hoặc đã ghi danh khoá học mới chọn được.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Balanced} />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Premium</Label>
                    <Typography type="body-sm" color="muted">
                        Cần mở khoá. Bậc 4 trên thang 5 của CATEGORY_ORDER.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Premium} />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Frontier</Label>
                    <Typography type="body-sm" color="muted">
                        Model mạnh nhất, cần mở khoá. Bậc đỉnh — nay có màu riêng, không còn trùng Premium.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Frontier} />
            </div>
        </div>
    ),
}
