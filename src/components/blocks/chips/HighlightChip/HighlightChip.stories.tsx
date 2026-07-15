import type { Meta, StoryObj } from "@storybook/nextjs"
import { ClockIcon } from "@phosphor-icons/react"
import { HighlightChip } from "./index"

const meta: Meta<typeof HighlightChip> = {
    title: "Blocks/Chip/HighlightChip",
    component: HighlightChip,
}
export default meta
type Story = StoryObj<typeof HighlightChip>

/** Dùng ở hàng meta của PageHeader để nêu bật một con số/figure trung tính của khóa học, ví dụ tổng số module. */
export const Default: Story = {
    parameters: { usage: "Dùng ở hàng meta của PageHeader để nêu bật một con số/figure trung tính của khóa học, ví dụ tổng số module." },
    render: () => <HighlightChip value={24} label="Module" />,
}

/** So sánh cả bốn tông ngữ nghĩa cạnh nhau để chọn đúng màu cho từng loại chỉ số: accent nhấn khái niệm, success cho thành tích, warning khi cần chú ý, danger khi cần xử lý ngay. */
export const AllTones: Story = {
    parameters: { usage: "So sánh cả bốn tông ngữ nghĩa cạnh nhau để chọn đúng màu cho từng loại chỉ số: accent nhấn khái niệm, success cho thành tích, warning khi cần chú ý, danger khi cần xử lý ngay." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-default-500">accent</span>
                <HighlightChip tone="accent" value="42h" label="Giờ học" />
            </div>
            <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-default-500">success</span>
                <HighlightChip tone="success" value={276} label="Bài đã hoàn thành" />
            </div>
            <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-default-500">warning</span>
                <HighlightChip tone="warning" value={3} label="Bài sắp hết hạn" />
            </div>
            <div className="flex items-center gap-3">
                <span className="w-24 text-sm text-default-500">danger</span>
                <HighlightChip tone="danger" value={5} label="Bài quá hạn" />
            </div>
        </div>
    ),
}

/** Truyền icon dẫn đầu khi con số gắn với một khái niệm cụ thể (thời lượng, tốc độ...) để người dùng nhận diện nhanh hơn qua hình ảnh trước khi đọc số. */
export const WithIcon: Story = {
    parameters: { usage: "Truyền icon dẫn đầu khi con số gắn với một khái niệm cụ thể (thời lượng, tốc độ...) để người dùng nhận diện nhanh hơn qua hình ảnh trước khi đọc số." },
    render: () => <HighlightChip tone="accent" icon={<ClockIcon />} value="42h" label="Giờ học" />,
}
