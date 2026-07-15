import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { SchedulePicker } from "./index"

const meta: Meta<typeof SchedulePicker> = {
    title: "Core/Form/SchedulePicker",
    component: SchedulePicker,
}
export default meta
type Story = StoryObj<typeof SchedulePicker>

// Fixed literals so stories are deterministic — never `new Date()`.
const MIN_DATE = new CalendarDate(2026, 7, 16)
const INITIAL_DATE = new CalendarDate(2026, 7, 20)

const SLOTS = [
    { id: "0900", label: "09:00 - 10:00" },
    { id: "1030", label: "10:30 - 11:30" },
    { id: "1330", label: "13:30 - 14:30", isDisabled: true },
    { id: "1500", label: "15:00 - 16:00" },
    { id: "1630", label: "16:30 - 17:30", isDisabled: true },
    { id: "1900", label: "19:00 - 20:00" },
]

/** Dùng khi cần đặt lịch một buổi phỏng vấn thử — chọn ngày ở lịch, rồi chọn một khung giờ còn trống trong lưới. Khung giờ đã kín hiển thị mờ và không bấm được. Trạng thái ngày và khung giờ do component cha giữ. */
export const Default: Story = {
    parameters: {
        usage: "Dùng khi cần đặt lịch một buổi phỏng vấn thử — nửa trên chọn ngày qua HeroUI DatePicker, nửa dưới là lưới khung giờ đơn chọn. Khung giờ đã kín hiển thị mờ; ngày trước minDate không chọn được. Component cha giữ cả ngày lẫn khung giờ đã chọn.",
    },
    render: () => {
        const [dateValue, setDateValue] = useState<DateValue | null>(INITIAL_DATE)
        const [slotId, setSlotId] = useState<string | undefined>("1030")
        return (
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Mặc định</Label>
                    <Typography type="body-sm" color="muted">
                        Chọn ngày rồi chọn khung giờ. Hai khung giờ đã kín hiển thị mờ và không thể chọn; các ngày trước 16/07/2026 bị chặn.
                    </Typography>
                </div>
                <SchedulePicker
                    dateValue={dateValue}
                    onDateChange={setDateValue}
                    minDate={MIN_DATE}
                    availableSlots={SLOTS}
                    selectedSlotId={slotId}
                    onSlotChange={setSlotId}
                />
            </div>
        )
    },
}
