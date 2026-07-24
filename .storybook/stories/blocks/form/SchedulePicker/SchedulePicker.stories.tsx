import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { SchedulePicker } from "./SchedulePicker"
import type { SchedulePickerSlot } from "./SchedulePicker"

const meta: Meta<typeof SchedulePicker> = {
    title: "Primitives/Forms/SchedulePicker",
    component: SchedulePicker,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SchedulePicker>

// Fixed literals so stories are deterministic — never `new Date()`.
const MIN_DATE = new CalendarDate(2026, 7, 16)
const INITIAL_DATE = new CalendarDate(2026, 7, 20)

const SLOTS: Array<SchedulePickerSlot> = [
    { id: "0900", label: "09:00 - 10:00" },
    { id: "1030", label: "10:30 - 11:30" },
    { id: "1330", label: "13:30 - 14:30", isDisabled: true },
    { id: "1500", label: "15:00 - 16:00" },
    { id: "1630", label: "16:30 - 17:30", isDisabled: true },
    { id: "1900", label: "19:00 - 20:00" },
]

/** Local controlled wrapper — holds date + slot so the calendar and slot grid are clickable for real. */
const Controlled = ({
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

/**
 * Booking: pick a day on the calendar, then a free slot in the grid. Two full
 * slots are dimmed and unclickable; dates before 16/07/2026 are locked (minDate).
 */
export const Booking: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <Controlled initialSlotId="1030" />
            </div>
        </div>
    ),
}

/** NoSelection: the field starts empty (`dateValue = null`), no slot chosen yet. */
export const NoSelection: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <Controlled initialDate={null} />
            </div>
        </div>
    ),
}

/** Skeleton: loading mirror — label bar + date-field skeleton, then label bar + slot-grid skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <SchedulePicker
                isSkeleton
                dateValue={null}
                onDateChange={() => {}}
                availableSlots={[]}
                onSlotChange={() => {}}
            />
        </div>
    ),
}
