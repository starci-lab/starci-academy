import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import { ModelByline, VerdictIcon } from "@/components/blocks/grading/GradingByline"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof ModelByline> = {
    title: "Blocks/Grading/GradingByline",
    component: ModelByline,
}
export default meta
type Story = StoryObj<typeof ModelByline>

/**
 * Toàn bộ variant + state của hai mảnh trong GradingByline: `VerdictIcon` (glyph
 * đạt/không đạt dùng lại ở chip kết quả, dòng lịch sử, drawer) và `ModelByline`
 * (đính kèm model đã chấm + tier chip, có hoặc không nhãn "graded by").
 */
export const AllVariants: Story = {
    args: {
        model: null,
    },
    parameters: {
        usage: "Xem tổng quan mọi trạng thái của VerdictIcon và ModelByline trước khi ghép vào result card, drawer lịch sử hay dòng attempt — chọn đúng biến thể theo bối cảnh hiển thị.",
    },
    render: () => (
        <Gallery>
            <VariantRow
                label="VerdictIcon — đạt / không đạt"
                hint="Glyph dùng trong chip kết quả, dòng lịch sử và bộ chọn attempt; màu xanh khi đạt, đỏ khi không đạt."
            >
                <span className="flex items-center gap-2">
                    <VerdictIcon pass />
                    <Typography type="body-sm">Đạt</Typography>
                </span>
                <span className="flex items-center gap-2">
                    <VerdictIcon pass={false} />
                    <Typography type="body-sm">Không đạt</Typography>
                </span>
            </VariantRow>

            <VariantRow
                label="VerdictIcon trong Chip kết quả"
                hint="Cách VerdictIcon thực tế ghép vào Chip màu success/danger ở đầu result card — mỗi cụm chỉ giữ 1 chip."
            >
                <Chip color="success" variant="soft" size="sm">
                    <VerdictIcon pass />
                    <Chip.Label>Đạt</Chip.Label>
                </Chip>
            </VariantRow>

            <VariantRow
                label="VerdictIcon trong Chip kết quả — không đạt"
                hint="Cùng mẫu Chip nhưng màu danger khi attempt không đạt."
            >
                <Chip color="danger" variant="soft" size="sm">
                    <VerdictIcon pass={false} />
                    <Chip.Label>Không đạt</Chip.Label>
                </Chip>
            </VariantRow>

            <Variant
                label="ModelByline có nhãn + tier chip"
                hint={"Dùng ở result card: có prefix \"Đã chấm bởi\" đứng trước tên model, kèm tier chip phía sau."}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="qwen2.5-coder-32b" category={AiModelCategory.Balanced} withLabel />
                </div>
            </Variant>

            <Variant
                label="ModelByline không nhãn"
                hint={"Dùng ở drawer lịch sử và dòng attempt — chỉ tên model + tier chip, không lặp lại chữ \"đã chấm bởi\"."}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="claude-sonnet-4-5" category={AiModelCategory.Frontier} />
                </div>
            </Variant>

            <Variant
                label="ModelByline không có tier chip"
                hint="Khi chưa resolve được category của model đã chấm — chỉ hiện sparkle + tên model, không có chip đứng sau."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <ModelByline model="llama-3.1-8b-instruct" />
                </div>
            </Variant>

            <Variant
                label="ModelByline rỗng — model chưa ghi nhận"
                hint="Khi attempt không lưu servedModel (dữ liệu cũ trước khi tính năng này ra mắt) — block trả về null, không render gì cả."
            >
                <div className="flex min-h-6 items-center gap-2 rounded-lg border border-dashed border-default px-3">
                    <Typography type="body-xs" color="muted">
                        (không render gì — model=null)
                    </Typography>
                    <ModelByline model={null} category={AiModelCategory.Economy} withLabel />
                </div>
            </Variant>
        </Gallery>
    ),
}
