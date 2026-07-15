import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label } from "@heroui/react"

/**
 * Bảng tra HeroUI `Chip` — primitive nền của mọi chip/pill/tag/badge (các block trong
 * họ `Blocks/Chip` đều dựng trên nó). Ở đây để tra "màu nào trông thế nào" cạnh các
 * block anh em, thay vì tách ra một nhánh riêng.
 */
const meta: Meta<typeof Chip> = {
    title: "Blocks/Chip/Chip",
    component: Chip,
}
export default meta
type Story = StoryObj<typeof Chip>

/** Chip = NHÃN trạng thái, không phải nút bấm; chọn màu theo Ý NGHĨA (accent = đang chọn/đi-tiếp, success = xong, warning = cần chú ý, danger = lỗi, default = trung tính). */
export const AllColors: Story = {
    parameters: {
        usage:
            "Chip là NHÃN trạng thái, KHÔNG phải nút bấm. Chọn màu theo Ý NGHĨA: accent = đang chọn / đi-tiếp · " +
            "success = xong · warning = cần chú ý · danger = lỗi · default = trung tính. Luôn dùng " +
            "variant=\"soft\" cho tint semantic (cặp native bg-<status>-soft + text-<status>-soft-foreground đạt " +
            "contrast cả light lẫn dark — hue gốc trên nền tint sáng thì hụt 4.5:1). Ngoài gallery này, một cụm " +
            "meta chỉ được MỘT chip mang MỘT trục phân loại; phần còn lại để text thuần + icon.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
                <Label>Accent</Label>
                <Chip color="accent" variant="soft"><Chip.Label>Đang học</Chip.Label></Chip>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Success</Label>
                <Chip color="success" variant="soft"><Chip.Label>Hoàn thành</Chip.Label></Chip>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Warning</Label>
                <Chip color="warning" variant="soft"><Chip.Label>Sắp hết hạn</Chip.Label></Chip>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Danger</Label>
                <Chip color="danger" variant="soft"><Chip.Label>Chưa đạt</Chip.Label></Chip>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Label>Default</Label>
                <Chip color="default" variant="soft"><Chip.Label>Nháp</Chip.Label></Chip>
            </div>
        </div>
    ),
}
