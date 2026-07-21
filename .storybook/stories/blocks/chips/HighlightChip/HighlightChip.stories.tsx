import type { Meta, StoryObj } from "@storybook/nextjs"
import { HighlightChip } from "@/components/blocks/chips/HighlightChip"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof HighlightChip> = {
    title: "Blocks/Chips/HighlightChip",
    component: HighlightChip,
}
export default meta
type Story = StoryObj<typeof HighlightChip>

/**
 * So sánh cả năm tone cạnh nhau để chọn màu theo Ý NGHĨA của con số, không theo
 * cảm quan — mỗi tone gắn với một loại chỉ số khác nhau. Dùng trong meta row của
 * `PageHeader`; một cụm meta chỉ nên mang MỘT chip trên một trục phân loại
 * (axis-1 §Chip), còn lại để text + icon thường.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Neutral"
                hint="Mặc định khi bỏ trống prop tone. Dùng cho một số liệu thuần mô tả — không khen, không cảnh báo."
            >
                <HighlightChip value={24} label="Modules" />
            </Variant>
            <Variant
                label="Accent"
                hint="Khi con số là một khái niệm cần nhấn — chưa phải thành tích, chưa cần hành động."
            >
                <HighlightChip tone="accent" value="42h" label="Study hours" />
            </Variant>
            <Variant
                label="Success"
                hint="Khi con số là một thành tích đã đạt được. Không dùng cho số liệu đang chờ hoặc trung tính."
            >
                <HighlightChip tone="success" value={276} label="Lessons completed" />
            </Variant>
            <Variant
                label="Warning"
                hint="Khi cần chú ý nhưng CHƯA trễ — vẫn còn thời gian để hành động."
            >
                <HighlightChip tone="warning" value={3} label="Lessons due soon" />
            </Variant>
            <Variant
                label="Danger"
                hint="Khi có việc quá hạn hoặc hỏng, cần hành động ngay. Không mượn danger chỉ để nổi bật."
            >
                <HighlightChip tone="danger" value={5} label="Lessons overdue" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "So sánh cả năm tone cạnh nhau để chọn màu theo Ý NGHĨA của con số, không theo cảm quan. " +
            "Dùng trong meta row của `PageHeader`; một cụm meta chỉ nên mang MỘT chip trên một trục " +
            "phân loại (axis-1 §Chip), còn lại để text + icon thường.",
    },
}
