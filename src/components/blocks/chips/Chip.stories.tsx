import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label, Typography } from "@heroui/react"

/**
 * Bảng tra HeroUI `Chip` — primitive nền của mọi chip/pill/tag/badge (các block trong
 * họ `Core/Chip` đều dựng trên nó). Ở đây để tra "màu nào trông thế nào" cạnh các
 * block anh em, thay vì tách ra một nhánh riêng.
 */
const meta: Meta<typeof Chip> = {
    title: "Core/Chip/Chip",
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
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">Dùng khi mục đang được chọn hoặc là bước đi-tiếp đang diễn ra, thứ muốn kéo mắt người dùng về.</Typography>
                </div>
                <Chip color="accent" variant="soft"><Chip.Label>Đang học</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Dùng khi một việc đã hoàn tất và đạt yêu cầu, không còn cần thao tác thêm.</Typography>
                </div>
                <Chip color="success" variant="soft"><Chip.Label>Hoàn thành</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Dùng khi cần người dùng chú ý nhưng chưa phải lỗi, ví dụ sắp tới hạn hay còn dở dang.</Typography>
                </div>
                <Chip color="warning" variant="soft"><Chip.Label>Sắp hết hạn</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Dùng khi kết quả là lỗi hoặc không đạt, trạng thái người dùng cần khắc phục.</Typography>
                </div>
                <Chip color="danger" variant="soft"><Chip.Label>Chưa đạt</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Default</Label>
                    <Typography type="body-sm" color="muted">Dùng cho nhãn trung tính không mang ý nghĩa trạng thái, ví dụ bản nháp hay phân loại thường.</Typography>
                </div>
                <Chip color="default" variant="soft"><Chip.Label>Nháp</Chip.Label></Chip>
            </div>
        </div>
    ),
}
