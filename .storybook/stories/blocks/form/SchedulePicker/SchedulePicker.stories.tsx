import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { SchedulePicker } from "@sb-components/_blocks/form/SchedulePicker/SchedulePicker"
import type { SchedulePickerSlot } from "@sb-components/_blocks/form/SchedulePicker/SchedulePicker"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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

// The Booking/NoSelection leaves both compose the same two direct parts — the
// DatePicker half and the time-slot grid half; the Skeleton leaf mirrors the
// same two halves with placeholder rows (same part names, per §11a).
const DATE_PICKER: AnatomyNode = { name: "DatePicker", tier: "primitive", role: "FieldShell label + DateField/Calendar — chọn ngày" }
const SLOT_GRID: AnatomyNode = { name: "SlotGrid", tier: "primitive", role: "Label + lưới nút chọn khung giờ (single-select)" }
const PARTS: Array<AnatomyNode> = [DATE_PICKER, SLOT_GRID]

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
            showAnatomy
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
                <BlockAnatomy name="SchedulePicker" tier="primitive" leaf="Booking" parts={PARTS} note="2 nửa trực tiếp: DatePicker (chọn ngày) + SlotGrid (chọn khung giờ, single-select).">
                    <Controlled initialSlotId="1030" />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** NoSelection: the field starts empty (`dateValue = null`), no slot chosen yet. */
export const NoSelection: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy name="SchedulePicker" tier="primitive" leaf="NoSelection" parts={PARTS} note="Composition không đổi khi rỗng — DatePicker chưa có value, SlotGrid chưa có slot chọn.">
                    <Controlled initialDate={null} />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Skeleton: loading mirror — label bar + date-field skeleton, then label bar + slot-grid skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SchedulePicker" tier="primitive" leaf="Skeleton" parts={PARTS} note="Mirror cùng 2 phần DatePicker/SlotGrid bằng Skeleton.Input, không mount control thật.">
                <SchedulePicker
                    isSkeleton
                    dateValue={null}
                    onDateChange={() => {}}
                    availableSlots={[]}
                    onSlotChange={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
