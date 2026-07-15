import type { Meta, StoryObj } from "@storybook/nextjs"
import { RatingBar } from "./index"

const meta: Meta<typeof RatingBar> = {
    title: "Blocks/Button/RatingBar",
    component: RatingBar,
}
export default meta
type Story = StoryObj<typeof RatingBar>

const gradeOptions = [
    { grade: 0, label: "Quên" },
    { grade: 1, label: "Khó" },
    { grade: 2, label: "Tốt" },
    { grade: 3, label: "Dễ" },
]

const gradeOptionsWithHints = [
    { grade: 0, label: "Quên", hint: "Ôn lại ngay" },
    { grade: 1, label: "Khó", hint: "10 phút nữa" },
    { grade: 2, label: "Tốt", hint: "1 ngày" },
    { grade: 3, label: "Dễ", hint: "4 ngày" },
]

/** Dùng khi người học vừa lật mặt sau thẻ và cần chọn nhanh mức độ nhớ bằng 4 nút bấm hoặc phím tắt 1–4. */
export const Default: Story = {
    parameters: { usage: "Dùng khi người học vừa lật mặt sau thẻ và cần chọn nhanh mức độ nhớ bằng 4 nút bấm hoặc phím tắt 1–4." },
    render: () => <RatingBar options={gradeOptions} onRate={() => {}} />,
}

/** Dùng khi muốn hiển thị thêm khoảng lặp tiếp theo (SM-2) dưới mỗi nhãn để người học thấy hệ quả của lựa chọn. */
export const WithIntervalHints: Story = {
    parameters: { usage: "Dùng khi muốn hiển thị thêm khoảng lặp tiếp theo (SM-2) dưới mỗi nhãn để người học thấy hệ quả của lựa chọn." },
    render: () => <RatingBar options={gradeOptionsWithHints} onRate={() => {}} />,
}

/** Dùng khi lượt chấm đang được gửi lên server, để khoá tạm 4 nút và tránh người học bấm chọn thêm lần nữa. */
export const Pending: Story = {
    parameters: { usage: "Dùng khi lượt chấm đang được gửi lên server, để khoá tạm 4 nút và tránh người học bấm chọn thêm lần nữa." },
    render: () => <RatingBar options={gradeOptionsWithHints} onRate={() => {}} isPending />,
}

/** Dùng khi bộ đếm layout co hẹp (ví dụ khung xem trước hẹp) để kiểm tra 4 ô vẫn co về lưới 2 cột mà không vỡ nội dung. */
export const NarrowContainer: Story = {
    parameters: { usage: "Dùng khi bộ đếm layout co hẹp (ví dụ khung xem trước hẹp) để kiểm tra 4 ô vẫn co về lưới 2 cột mà không vỡ nội dung." },
    render: () => (
        <div className="w-64">
            <RatingBar options={gradeOptionsWithHints} onRate={() => {}} />
        </div>
    ),
}
