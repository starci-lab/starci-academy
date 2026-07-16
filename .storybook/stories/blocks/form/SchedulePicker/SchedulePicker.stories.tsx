import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import type { DateValue } from "@internationalized/date"
import { SchedulePicker } from "@/components/blocks/form/SchedulePicker"
import { INITIAL_DATE, MIN_DATE, SLOTS } from "./components"

const meta: Meta<typeof SchedulePicker> = {
    title: "Blocks/Form/SchedulePicker",
    component: SchedulePicker,
}
export default meta
type Story = StoryObj<typeof SchedulePicker>

/** Use when you need to schedule a mock interview session — pick a day on the calendar, then pick an available time slot in the grid. Fully booked slots show dimmed and can't be clicked. The parent holds the day and slot state. */
export const Default: Story = {
    parameters: {
        usage: "Use when you need to schedule a mock interview session — the top half picks a day via HeroUI DatePicker, the bottom half is a single-select time-slot grid. Fully booked slots show dimmed; days before minDate can't be selected. The parent holds both the selected day and slot.",
    },
    render: () => {
        const [dateValue, setDateValue] = useState<DateValue | null>(INITIAL_DATE)
        const [slotId, setSlotId] = useState<string | undefined>("1030")
        return (
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Default</Label>
                    <Typography type="body-sm" color="muted">
                        Pick a day, then pick a time slot. Two fully booked slots show dimmed and can't be selected; days before 16/07/2026 are blocked.
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
