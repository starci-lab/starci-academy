import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { HighlightChip } from "./index"

const meta: Meta<typeof HighlightChip> = {
    title: "Blocks/Chip/HighlightChip",
    component: HighlightChip,
}
export default meta
type Story = StoryObj<typeof HighlightChip>

/** So sánh cả năm tông cạnh nhau để chọn màu theo Ý NGHĨA của con số, không theo cảm giác đẹp — mỗi tông ứng một loại chỉ số khác nhau. */
export const AllTones: Story = {
    parameters: { usage: "So sánh cả năm tông cạnh nhau để chọn màu theo Ý NGHĨA của con số chứ không theo cảm giác. Dùng ở hàng meta của `PageHeader`; một cụm meta chỉ nên có MỘT chip mang một trục phân loại (axis-1 §Chip), phần còn lại để text thuần + icon." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        Mặc định khi bỏ trống prop tone. Dùng cho figure thuần mô tả, không khen cũng không cảnh báo.
                    </Typography>
                </div>
                <HighlightChip value={24} label="Module" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        Khi con số là khái niệm cần nhấn, chưa phải thành tích cũng chưa phải việc phải xử lý.
                    </Typography>
                </div>
                <HighlightChip tone="accent" value="42h" label="Giờ học" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        Khi con số là thành tích đã đạt. Không dùng cho số đang chờ hay số trung tính.
                    </Typography>
                </div>
                <HighlightChip tone="success" value={276} label="Bài đã hoàn thành" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        Khi cần chú ý nhưng CHƯA trễ — còn kịp xử lý.
                    </Typography>
                </div>
                <HighlightChip tone="warning" value={3} label="Bài sắp hết hạn" />
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        Khi đã quá hạn hoặc hỏng, cần xử lý ngay. Đừng mượn danger chỉ để cho nổi.
                    </Typography>
                </div>
                <HighlightChip tone="danger" value={5} label="Bài quá hạn" />
            </div>
        </div>
    ),
}
