import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ProgressRing } from "./index"

const meta: Meta<typeof ProgressRing> = {
    title: "Core/Stat/ProgressRing",
    component: ProgressRing,
}
export default meta
type Story = StoryObj<typeof ProgressRing>

/** Dùng khi cần chọn đường kính vòng theo vị trí đặt — sm cho chỗ hẹp cạnh dòng chữ, md cho thẻ, lg cho một chỉ số nổi bật ở đầu trang. */
export const Sizes: Story = {
    parameters: { usage: "Dùng khi cần chọn đường kính vòng theo vị trí đặt: sm (64px) cho chỗ hẹp/inline, md (96px) cho thẻ thường, lg (128px) cho một chỉ số hero ở đầu trang. Nhãn ở giữa tự co giãn theo kích thước." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Nhỏ</Label>
                    <Typography type="body-sm" color="muted">Dùng ở chỗ hẹp, cạnh một dòng chữ hoặc trong danh sách gọn, khi vòng chỉ là chi tiết phụ.</Typography>
                </div>
                <ProgressRing value={68} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Vừa</Label>
                    <Typography type="body-sm" color="muted">Dùng trong một thẻ thống kê thông thường, khi vòng là nội dung chính của thẻ.</Typography>
                </div>
                <ProgressRing value={68} size="md" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Lớn</Label>
                    <Typography type="body-sm" color="muted">Dùng làm một chỉ số nổi bật ở đầu trang hoặc bảng điều khiển, khi muốn con số đập vào mắt trước tiên.</Typography>
                </div>
                <ProgressRing value={68} size="lg" />
            </div>
        </div>
    ),
}

/** Dùng khi bản thân giá trị mang ý nghĩa và cần đổi màu theo ngưỡng — accent cho tiến độ trung tính, success/warning/danger khi con số nói lên tốt hay xấu. */
export const Tones: Story = {
    parameters: { usage: "Dùng khi màu vòng cần phản ánh Ý NGHĨA của con số: accent cho tiến độ trung tính, success khi đạt tốt, warning khi cần chú ý, danger khi dưới ngưỡng. Đừng đổi màu chỉ để trang trí." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">Dùng cho tiến độ trung tính, khi con số chỉ cho biết đã đi được bao xa chứ không nói tốt hay xấu.</Typography>
                </div>
                <ProgressRing value={68} tone="accent" caption="Tiến độ khoá học" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số đã đạt mức tốt, ví dụ điểm kiểm tra vượt ngưỡng đậu.</Typography>
                </div>
                <ProgressRing value={92} tone="success" caption="Điểm bài kiểm tra" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số ở mức cần chú ý, chưa đạt nhưng cũng chưa đáng lo.</Typography>
                </div>
                <ProgressRing value={45} tone="warning" caption="Tiến độ tuần này" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số dưới ngưỡng và cần cảnh báo, ví dụ tỷ lệ hoàn thành quá thấp.</Typography>
                </div>
                <ProgressRing value={18} tone="danger" caption="Tỷ lệ hoàn thành" />
            </div>
        </div>
    ),
}

/** Dùng khi cần một dòng ngữ cảnh dưới vòng để nói vòng đang đo cái gì — caption là slot tuỳ chọn, bỏ đi khi ngữ cảnh xung quanh đã đủ rõ. */
export const WithCaption: Story = {
    parameters: { usage: "Dùng khi cần một dòng ngữ cảnh dưới vòng để nói rõ vòng đang đo cái gì; caption là slot tuỳ chọn, bỏ đi khi ngữ cảnh xung quanh (tiêu đề thẻ, nhãn cột) đã đủ rõ. Nhãn giữa vòng có thể là số phần trăm mặc định hoặc một phân số tự đặt." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có ghi chú</Label>
                    <Typography type="body-sm" color="muted">Thêm caption khi vòng đứng một mình và cần nói rõ nó đo cái gì.</Typography>
                </div>
                <ProgressRing value={68} size="lg" caption="Tiến độ khoá học" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Nhãn tự đặt</Label>
                    <Typography type="body-sm" color="muted">Đặt lại nhãn giữa vòng thành một phân số khi con số dạng số lượng dễ hiểu hơn phần trăm.</Typography>
                </div>
                <ProgressRing value={90} size="lg" tone="success" label="9/10" caption="Số bài đã hoàn thành" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Không ghi chú</Label>
                    <Typography type="body-sm" color="muted">Bỏ caption khi ngữ cảnh xung quanh đã đủ, chỉ cần vòng và con số.</Typography>
                </div>
                <ProgressRing value={68} size="lg" />
            </div>
        </div>
    ),
}
