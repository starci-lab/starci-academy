import type { Meta, StoryObj } from "@storybook/nextjs"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof RatingBar> = {
    title: "Blocks/Button/RatingBar",
    component: RatingBar,
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
 * Toàn bộ state của RatingBar trong một gallery: mặc định có hint khoảng lặp,
 * thẻ mới chưa có hint, đang gửi điểm (disabled), và cách bar co về 2 cột khi
 * container hẹp.
 */
export const AllVariants: Story = {
    parameters: { usage: "Xem RatingBar ở mọi trạng thái trước khi ghép vào màn ôn flashcard hoặc quiz — trạng thái nào cần disable khi đang lưu điểm, khi nào hint khoảng lặp biến mất." },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định — có hint khoảng lặp"
                hint="Dùng khi thẻ đã có lịch sử ôn tập: mỗi mức hiện luôn số ngày tới lần ôn kế tiếp để người học cân nhắc trước khi chọn."
            >
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                />
            </Variant>
            <Variant
                label="Không có hint — thẻ mới"
                hint="Thẻ chưa từng được ôn nên chưa tính được khoảng lặp kế tiếp; bar vẫn hoạt động đầy đủ, chỉ ẩn dòng hint."
            >
                <RatingBar
                    options={gradesWithoutInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                />
            </Variant>
            <Variant
                label="Đang gửi điểm (isPending)"
                hint="Bật khi request chấm điểm đang chạy — khoá cả bốn ô để người học không bấm chồng lệnh trong lúc chờ."
            >
                <RatingBar
                    options={gradesWithInterval}
                    onRate={() => {}}
                    ariaLabel="Chọn mức độ nhớ"
                    isPending
                />
            </Variant>
            <Variant
                label="Container hẹp — co về 2 cột"
                hint="Dưới 384px container tự co về lưới 2x2 thay vì 4 ô dẹt một hàng, tránh dòng hint bị bể chữ."
            >
                <div className="w-72">
                    <RatingBar
                        options={gradesWithInterval}
                        onRate={() => {}}
                        ariaLabel="Chọn mức độ nhớ"
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
