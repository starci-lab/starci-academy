import { useState } from "react"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { SchedulePicker } from "@/components/blocks/form/SchedulePicker"
import type { SchedulePickerSlot } from "@/components/blocks/form/SchedulePicker"

// Fixed literals so stories are deterministic — never `new Date()`.
export const MIN_DATE = new CalendarDate(2026, 7, 16)
export const INITIAL_DATE = new CalendarDate(2026, 7, 20)

export const SLOTS = [
    { id: "0900", label: "09:00 - 10:00" },
    { id: "1030", label: "10:30 - 11:30" },
    { id: "1330", label: "13:30 - 14:30", isDisabled: true },
    { id: "1500", label: "15:00 - 16:00" },
    { id: "1630", label: "16:30 - 17:30", isDisabled: true },
    { id: "1900", label: "19:00 - 20:00" },
]

/** Controlled wrapper for the demo — holds date + slot with useState so the calendar and slot grid are clickable for real. */
export const Controlled = ({
    initialDate = INITIAL_DATE,
    initialSlotId,
    availableSlots = SLOTS,
    minDate = MIN_DATE,
}: {
    initialDate?: DateValue | null
    initialSlotId?: string
    availableSlots?: Array<SchedulePickerSlot>
    minDate?: DateValue
}) => {
    const [dateValue, setDateValue] = useState<DateValue | null>(initialDate)
    const [slotId, setSlotId] = useState<string | undefined>(initialSlotId)
    return (
        <SchedulePicker
            dateValue={dateValue}
            onDateChange={setDateValue}
            minDate={minDate}
            availableSlots={availableSlots}
            selectedSlotId={slotId}
            onSlotChange={setSlotId}
        />
    )
}
