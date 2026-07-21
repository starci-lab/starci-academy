import type { Meta, StoryObj } from "@storybook/nextjs"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof DifficultyChip> = {
    title: "Features/Chips/DifficultyChip",
    component: DifficultyChip,
}
export default meta
type Story = StoryObj<typeof DifficultyChip>

/**
 * Toàn bộ 4 mức độ khó → màu dot, đọc từ DIFFICULTY_COLOR — nguồn DUY NHẤT của
 * dải màu này; import hằng số đó thay vì khai lại map ở mỗi surface.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Beginner"
                hint="Bài học mở đầu, hầu như không cần kiến thức nền. Xanh lá vì đây là điểm bắt đầu an toàn."
            >
                <DifficultyChip difficulty="beginner" />
            </Variant>
            <Variant
                label="Intermediate"
                hint="Cần nắm các khái niệm cốt lõi trước. Vàng = cần cân nhắc kỹ, chưa phải mức cảnh báo."
            >
                <DifficultyChip difficulty="intermediate" />
            </Variant>
            <Variant
                label="Advanced"
                hint="Cần đưa ra các quyết định thiết kế không tầm thường. Cam, một bậc sâu hơn Intermediate — không còn mượn màu lỗi (danger) để báo hiệu KHÓ."
            >
                <DifficultyChip difficulty="advanced" />
            </Variant>
            <Variant
                label="Insane"
                hint="Mức cao nhất. Có màu riêng thay vì mượn accent — bốn mức, bốn màu, không trùng lặp."
            >
                <DifficultyChip difficulty="insane" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage: "Bảng tham chiếu mapping 4 mức độ khó → màu dot, đọc từ `DIFFICULTY_COLOR` (`DifficultyChip/index.tsx`) — nguồn DUY NHẤT của dải màu này. Cần màu difficulty ở surface khác? IMPORT hằng số này, đừng khai lại map riêng (khai lại là cách các surface lệch nhau — `FlashcardDeckList` từng mắc bug này). Difficulty là một THỨ HẠNG, không phải trạng thái — màu lấy từ bảng màu Tailwind, không mượn accent/success/warning/danger: 4 mức cần 4 màu riêng biệt, trong khi 4 token semantic sẽ khiến `advanced` đọc thành LỖI thay vì KHÓ.",
    },
}
