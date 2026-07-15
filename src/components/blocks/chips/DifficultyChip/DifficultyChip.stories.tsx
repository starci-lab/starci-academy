import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { DifficultyChip } from "./index"

const meta: Meta<typeof DifficultyChip> = {
    title: "Blocks/Chip/DifficultyChip",
    component: DifficultyChip,
}
export default meta
type Story = StoryObj<typeof DifficultyChip>

/** Thang độ khó 4 bậc → màu chấm, lấy từ DIFFICULTY_COLOR — nguồn DUY NHẤT của ramp này; import nó thay vì tự khai lại map ở từng bề mặt. */
export const AllDifficulties: Story = {
    parameters: { usage: "Bảng tra 4 bậc độ khó → màu chấm, đọc từ `DIFFICULTY_COLOR` (`DifficultyChip/index.tsx`) — nguồn DUY NHẤT của ramp. Cần màu độ khó ở bề mặt khác thì IMPORT hằng này, đừng khai lại map riêng (khai lại là cách các bề mặt phân kỳ — `FlashcardDeckList` đang mắc lỗi này). Độ khó là THANG BẬC, không phải trạng thái — màu lấy từ palette Tailwind, không mượn accent/success/warning/danger: 4 bậc cần 4 màu phân biệt, còn 4 token semantic sẽ đọc `advanced` như LỖI thay vì KHÓ." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Beginner</Label>
                    <Typography type="body-sm" color="muted">
                        Bài mở đầu, gần như không cần kiến thức nền. Xanh vì đây là chỗ an toàn để bắt đầu.
                    </Typography>
                </div>
                <DifficultyChip difficulty="beginner" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Intermediate</Label>
                    <Typography type="body-sm" color="muted">
                        Cần nắm khái niệm cốt lõi trước. Vàng = hãy cân nhắc, chưa phải cảnh báo.
                    </Typography>
                </div>
                <DifficultyChip difficulty="intermediate" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Advanced</Label>
                    <Typography type="body-sm" color="muted">
                        Cần quyết định thiết kế không tầm thường. Cam đậm hơn Intermediate một bậc — không còn mượn màu lỗi (danger) để nói KHÓ.
                    </Typography>
                </div>
                <DifficultyChip difficulty="advanced" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Insane</Label>
                    <Typography type="body-sm" color="muted">
                        Bậc cao nhất. Nay có màu riêng thay vì mượn accent — bốn bậc, bốn màu, không chỗ nào trùng.
                    </Typography>
                </div>
                <DifficultyChip difficulty="insane" />
            </div>
        </div>
    ),
}
