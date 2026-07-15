import type { Meta, StoryObj } from "@storybook/nextjs"
import { HighlightChip } from "./index"

const meta: Meta<typeof HighlightChip> = {
    title: "Blocks/HighlightChip",
    component: HighlightChip,
}
export default meta
type Story = StoryObj<typeof HighlightChip>

/** Dùng ở hàng meta của PageHeader để nêu bật một con số/figure trung tính của khóa học, ví dụ tổng số module. */
export const Default: Story = {
    parameters: { usage: "Dùng ở hàng meta của PageHeader để nêu bật một con số/figure trung tính của khóa học, ví dụ tổng số module." },
    render: () => <HighlightChip value={24} label="Module" />,
}

/** Thêm icon dẫn đầu khi con số gắn với một khái niệm cụ thể (thời lượng, tốc độ...) để người dùng nhận diện nhanh hơn qua hình ảnh. */
export const VoiIcon: Story = {
    parameters: { usage: "Thêm icon dẫn đầu khi con số gắn với một khái niệm cụ thể (thời lượng, tốc độ...) để người dùng nhận diện nhanh hơn qua hình ảnh." },
    render: () => <HighlightChip tone="accent" value="42h" label="Giờ học" />,
}

/** Tông success khi con số thể hiện một thành tích tích cực đã đạt được, ví dụ số bài đã hoàn thành. */
export const ThanhTich: Story = {
    parameters: { usage: "Tông success khi con số thể hiện một thành tích tích cực đã đạt được, ví dụ số bài đã hoàn thành." },
    render: () => <HighlightChip tone="success" value={276} label="Bài đã hoàn thành" />,
}

/** Tông warning khi con số cần người dùng chú ý nhưng chưa đến mức nghiêm trọng, ví dụ số bài sắp hết hạn. */
export const CanChuY: Story = {
    parameters: { usage: "Tông warning khi con số cần người dùng chú ý nhưng chưa đến mức nghiêm trọng, ví dụ số bài sắp hết hạn." },
    render: () => <HighlightChip tone="warning" value={3} label="Bài sắp hết hạn" />,
}

/** Tông danger khi con số cảnh báo một tình trạng cần xử lý ngay, ví dụ số bài quá hạn nộp. */
export const CanhBao: Story = {
    parameters: { usage: "Tông danger khi con số cảnh báo một tình trạng cần xử lý ngay, ví dụ số bài quá hạn nộp." },
    render: () => <HighlightChip tone="danger" value={5} label="Bài quá hạn" />,
}
