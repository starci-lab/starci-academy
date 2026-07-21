import type { Meta, StoryObj } from "@storybook/nextjs"
import { SchedulePicker } from "@/components/blocks/form/SchedulePicker"
import { Gallery, Variant } from "../../../../story-kit"
import { Controlled } from "./components"

const meta: Meta<typeof SchedulePicker> = {
    title: "Legacy/Blocks/Form/SchedulePicker",
    component: SchedulePicker,
}
export default meta
type Story = StoryObj<typeof SchedulePicker>

/**
 * Toàn bộ trạng thái của SchedulePicker: đặt lịch phỏng vấn giả lập — chọn ngày trên
 * lịch rồi chọn một khung giờ còn trống trong lưới. Khung giờ đã đầy hiện mờ và
 * không bấm được; ngày trước minDate cũng bị khoá. Dùng để tra cách khoá ngày quá
 * khứ và cách disable từng khung giờ cụ thể.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Đặt lịch phỏng vấn"
                hint="Chọn ngày, rồi chọn khung giờ. Hai khung giờ đã đầy hiện mờ và không bấm được; các ngày trước 16/07/2026 bị khoá. Component ngoài giữ cả ngày đã chọn và khung giờ đã chọn."
            >
                <div className="max-w-md">
                    <Controlled initialSlotId="1030" />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Dùng khi cần lên lịch phỏng vấn giả lập — nửa trên chọn ngày qua HeroUI DatePicker, " +
            "nửa dưới là lưới khung giờ single-select. Khung giờ đã đầy hiện mờ; ngày trước minDate " +
            "không chọn được. Component bên ngoài giữ cả ngày đã chọn và khung giờ đã chọn.",
    },
}
