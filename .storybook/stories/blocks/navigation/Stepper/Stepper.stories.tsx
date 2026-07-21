import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stepper } from "@/components/blocks/navigation/Stepper"
import { Gallery, Variant } from "../../../../story-kit"
import { CHECKOUT_STEPS } from "./components"

const meta: Meta<typeof Stepper> = {
    title: "Blocks/Navigation/Stepper",
    component: Stepper,
}
export default meta
type Story = StoryObj<typeof Stepper>

/**
 * Toàn bộ ma trận trạng thái của Stepper: ngang giữa luồng, dọc (có thể bấm lại
 * bước đã xong), và hoàn tất toàn bộ. Dùng để tra khi nào chọn orientation nào
 * và currentIndex nên đặt bao nhiêu cho từng tình huống.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Ngang, giữa luồng"
                hint="Dùng cho luồng nhiều bước theo hàng ngang trên màn rộng (onboarding, nộp CV, thanh toán): bước đã hoàn thành hiện dấu tick, bước hiện tại nổi bật viền nhấn, bước sắp tới mờ đi; đặt currentIndex là bước đang làm."
            >
                <Stepper steps={CHECKOUT_STEPS} currentIndex={1} />
            </Variant>
            <Variant
                label="Dọc"
                hint="Dùng cho màn hẹp/di động hoặc danh sách bước dài — xếp dọc để mỗi bước có chỗ cho nhãn và mô tả; ví dụ này truyền onStepPress nên các bước đã hoàn thành có thể bấm để quay lại sửa."
            >
                <Stepper
                    steps={CHECKOUT_STEPS}
                    currentIndex={1}
                    orientation="vertical"
                    onStepPress={() => {}}
                />
            </Variant>
            <Variant
                label="Hoàn tất toàn bộ"
                hint="Dùng để kiểm trạng thái kết thúc: khi currentIndex vượt qua bước cuối, mọi bước chuyển thành dấu tick và mọi đường nối được lấp màu success; truyền currentIndex bằng đúng số bước để đánh dấu hoàn tất hết."
            >
                <Stepper steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của Stepper: ngang giữa luồng (checkmark cho bước xong, " +
            "viền nhấn cho bước hiện tại, mờ cho bước sắp tới), dọc kèm onStepPress để bấm lại bước " +
            "đã xong, và hoàn tất toàn bộ khi currentIndex vượt bước cuối. Dùng khi cần tra chọn " +
            "orientation nào cho không gian màn hình và currentIndex nên đặt ra sao cho từng bước tiến độ.",
    },
}
