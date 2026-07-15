import type { Meta, StoryObj } from "@storybook/nextjs"
import { SegmentBar } from "./index"

const meta: Meta<typeof SegmentBar> = {
    title: "Blocks/SegmentBar",
    component: SegmentBar,
}
export default meta
type Story = StoryObj<typeof SegmentBar>

/** Dùng khi muốn thể hiện tỉ trọng giữa các nhóm dữ liệu (ví dụ số câu đúng theo mức độ khó) mà không cần so với một tổng mốc riêng — các lát luôn lấp đầy 100% thanh. */
export const Default: Story = {
    parameters: { usage: "Dùng khi muốn thể hiện tỉ trọng giữa các nhóm dữ liệu (ví dụ số câu đúng theo mức độ khó) mà không cần so với một tổng mốc riêng — các lát luôn lấp đầy 100% thanh." },
    render: () => (
        <div className="w-80">
            <SegmentBar
                ariaLabel="Phân bố câu trả lời theo độ khó"
                segments={[
                    { key: "easy", label: "Dễ", value: 12 },
                    { key: "medium", label: "Trung bình", value: 20 },
                    { key: "hard", label: "Khó", value: 8 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi cần thể hiện tiến độ thật so với một tổng cố định (ví dụ số bài đã hoàn thành trên tổng số bài của khóa học), để phần còn trống phản ánh đúng phần chưa đạt được. */
export const TienDoTheoTong: Story = {
    parameters: { usage: "Dùng khi cần thể hiện tiến độ thật so với một tổng cố định (ví dụ số bài đã hoàn thành trên tổng số bài của khóa học), để phần còn trống phản ánh đúng phần chưa đạt được." },
    render: () => (
        <div className="w-80">
            <SegmentBar
                ariaLabel="Tiến độ hoàn thành bài học"
                max={50}
                segments={[
                    { key: "done", label: "Đã hoàn thành", value: 18, color: "var(--success)" },
                    { key: "in-progress", label: "Đang học", value: 5, color: "var(--warning)" },
                ]}
            />
        </div>
    ),
}

/** Dùng khi thanh chỉ đóng vai trò trang trí/tóm tắt nhanh bên trong một khối khác đã có chú thích riêng, nên không cần lặp lại nhãn + số lượng bên dưới. */
export const AnChuThich: Story = {
    parameters: { usage: "Dùng khi thanh chỉ đóng vai trò trang trí/tóm tắt nhanh bên trong một khối khác đã có chú thích riêng, nên không cần lặp lại nhãn + số lượng bên dưới." },
    render: () => (
        <div className="w-80">
            <SegmentBar
                hideLegend
                ariaLabel="Tỉ lệ câu đúng và sai"
                segments={[
                    { key: "correct", label: "Đúng", value: 34, color: "var(--success)" },
                    { key: "incorrect", label: "Sai", value: 6, color: "var(--danger)" },
                ]}
            />
        </div>
    ),
}

/** Dùng khi số nhóm dữ liệu nhiều (ví dụ điểm theo từng kỹ năng), để kiểm tra chú thích tự xuống dòng gọn gàng thay vì tràn khỏi khối. */
export const NhieuNhom: Story = {
    parameters: { usage: "Dùng khi số nhóm dữ liệu nhiều (ví dụ điểm theo từng kỹ năng), để kiểm tra chú thích tự xuống dòng gọn gàng thay vì tràn khỏi khối." },
    render: () => (
        <div className="w-80">
            <SegmentBar
                ariaLabel="Phân bố kỹ năng được đánh giá"
                segments={[
                    { key: "frontend", label: "Frontend", value: 9 },
                    { key: "backend", label: "Backend", value: 14 },
                    { key: "database", label: "Cơ sở dữ liệu", value: 6 },
                    { key: "devops", label: "DevOps", value: 4 },
                    { key: "testing", label: "Kiểm thử", value: 7 },
                ]}
            />
        </div>
    ),
}

/** Dùng khi chưa có dữ liệu thật (tất cả nhóm bằng 0), để xác nhận thanh không vỡ layout và hiển thị track rỗng thay vì lỗi chia cho 0. */
export const ChuaCoDuLieu: Story = {
    parameters: { usage: "Dùng khi chưa có dữ liệu thật (tất cả nhóm bằng 0), để xác nhận thanh không vỡ layout và hiển thị track rỗng thay vì lỗi chia cho 0." },
    render: () => (
        <div className="w-80">
            <SegmentBar
                ariaLabel="Chưa có dữ liệu đánh giá"
                segments={[
                    { key: "easy", label: "Dễ", value: 0 },
                    { key: "medium", label: "Trung bình", value: 0 },
                    { key: "hard", label: "Khó", value: 0 },
                ]}
            />
        </div>
    ),
}
