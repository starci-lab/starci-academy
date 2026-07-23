import type { Meta, StoryObj } from "@storybook/nextjs"
import { RatingBar } from "./RatingBar"

const meta: Meta<typeof RatingBar> = {
    title: "Block/Cards/RatingBar",
    component: RatingBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RatingBar>

/** Bốn mức nhớ SM-2 kèm số ngày ôn lại tiếp theo, dùng ngay dưới mặt sau thẻ flashcard. */
const gradesWithInterval = [
    { grade: 0, label: "Quên", hint: "10 phút" },
    { grade: 1, label: "Khó", hint: "1 ngày" },
    { grade: 2, label: "Tốt", hint: "3 ngày" },
    { grade: 3, label: "Dễ", hint: "7 ngày" },
]

/** Cùng bốn mức nhưng chưa có lịch sử ôn tập của thẻ nên chưa tính được ngày kế tiếp. */
const gradesWithoutInterval = [
    { grade: 0, label: "Quên" },
    { grade: 1, label: "Khó" },
    { grade: 2, label: "Tốt" },
    { grade: 3, label: "Dễ" },
]

/**
 * Mặc định — có hint khoảng lặp. Dùng khi thẻ đã có lịch sử ôn tập: mỗi mức hiện
 * luôn số ngày tới lần ôn kế tiếp để người học cân nhắc trước khi chọn.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <RatingBar
                options={gradesWithInterval}
                onRate={() => {}}
                ariaLabel="Chọn mức độ nhớ"
            />
        </div>
    ),
}

/**
 * Không có hint — thẻ mới. Thẻ chưa từng được ôn nên chưa tính được khoảng lặp kế
 * tiếp; bar vẫn hoạt động đầy đủ, chỉ ẩn dòng hint.
 */
export const NoHint: Story = {
    render: () => (
        <div className="p-8">
            <RatingBar
                options={gradesWithoutInterval}
                onRate={() => {}}
                ariaLabel="Chọn mức độ nhớ"
            />
        </div>
    ),
}

/**
 * Đang gửi điểm (isPending). Bật khi request chấm điểm đang chạy — khoá cả bốn ô để
 * người học không bấm chồng lệnh trong lúc chờ.
 */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <RatingBar
                options={gradesWithInterval}
                onRate={() => {}}
                ariaLabel="Chọn mức độ nhớ"
                isPending
            />
        </div>
    ),
}

/**
 * Skeleton mirror (isSkeleton). Bật khi dữ liệu thẻ/khoảng lặp chưa sẵn sàng — giữ
 * đúng lưới + khung ô, chỉ thay nhãn/chip/hint bằng bar chờ.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <RatingBar
                options={gradesWithInterval}
                onRate={() => {}}
                ariaLabel="Chọn mức độ nhớ"
                isSkeleton
            />
        </div>
    ),
}

/**
 * Container hẹp — co về 2 cột. Dưới 384px container tự co về lưới 2x2 thay vì 4 ô dẹt
 * một hàng, tránh dòng hint bị bể chữ.
 */
export const NarrowContainer: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-72">
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                />
            </div>
        </div>
    ),
}
