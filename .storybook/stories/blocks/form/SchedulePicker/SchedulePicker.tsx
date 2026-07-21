import React from "react"
import {
    Button,
    Calendar,
    cn,
    DateField,
    DatePicker,
    Label,
} from "@heroui/react"
import type { DateValue } from "@internationalized/date"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/form/SchedulePicker`.
 * Authored in Storybook (not `src`); synced to `src` later. Faithful port of the
 * whole prop API + every legacy state; no `@/components` import.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable time slot in a {@link SchedulePicker}. */
export interface SchedulePickerSlot {
    /** Stable id — the select payload passed to `onSlotChange` and the React key. */
    id: string
    /** Human-readable label shown on the slot button (e.g. "09:00 - 10:00"). */
    label: string
    /** When true the slot is dimmed and cannot be chosen (e.g. already booked). */
    isDisabled?: boolean
}

/**
 * Props for the {@link SchedulePicker} block.
 *
 * Tier-3 presentational — controlled, props-only, no store/SWR/fetch. Both the
 * selected date and the selected slot are owned by the parent; every callback is
 * safe to leave as a no-op.
 */
export interface SchedulePickerProps {
    /**
     * The currently selected date, as an `@internationalized/date` value (the
     * REAL HeroUI `DatePicker` value type — a `CalendarDate`/`DateValue`, not a
     * native `Date`). `null` when nothing is picked yet.
     */
    dateValue: DateValue | null
    /**
     * Fired with the newly picked date (or `null` when cleared). The value is a
     * `DateValue`; call `.toString()` on it to persist an ISO `YYYY-MM-DD` string.
     */
    onDateChange: (value: DateValue | null) => void
    /**
     * The bookable time slots for the chosen date. Rendered as a single-select
     * grid of buttons; disabled slots are dimmed and non-interactive.
     */
    availableSlots: Array<SchedulePickerSlot>
    /** Id of the currently selected slot, or `undefined` when none is chosen. */
    selectedSlotId?: string
    /** Fired with the chosen slot id when a slot button is pressed. */
    onSlotChange: (id: string) => void
    /**
     * Optional lower bound — dates before this are dimmed and unselectable in the
     * calendar. Use it to forbid booking in the past (e.g. `today(getLocalTimeZone())`).
     */
    minDate?: DateValue
    /** Heading rendered above the time-slot grid. Defaults to "Chọn khung giờ". */
    slotsLabel?: string
    /** Extra classes on the outer wrapper. */
    className?: string
}

/**
 * SchedulePicker pairs a HeroUI {@link DatePicker} (with an inline
 * {@link Calendar} popover — the real `DateField` + `Calendar` composition) with a
 * single-select grid of time-slot buttons. It is the booking control for a
 * mock-interview: pick the day, then pick a free slot on that day.
 *
 * @param props - {@link SchedulePickerProps}
 */
export const SchedulePicker = ({
    dateValue,
    onDateChange,
    availableSlots,
    selectedSlotId,
    onSlotChange,
    minDate,
    slotsLabel = "Chọn khung giờ",
    className,
}: SchedulePickerProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* DATE half — canonical HeroUI DatePicker + DateField + Calendar popover */}
            <DatePicker
                aria-label="Chọn ngày phỏng vấn"
                minValue={minDate}
                value={dateValue}
                onChange={onDateChange}
            >
                <Label>Chọn ngày</Label>
                <DateField.Group fullWidth variant="secondary">
                    <DateField.Input>
                        {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                        <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                    <Calendar aria-label="Lịch chọn ngày phỏng vấn">
                        <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                                <Calendar.YearPickerTriggerHeading />
                                <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                            <Calendar.GridHeader>
                                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                                {(date) => <Calendar.Cell date={date} />}
                            </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                                {({ year }) => <Calendar.YearPickerCell year={year} />}
                            </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                    </Calendar>
                </DatePicker.Popover>
            </DatePicker>

            {/* TIME-SLOT half — single-select grid of toggle buttons */}
            <div className="flex flex-col gap-2">
                <Label>{slotsLabel}</Label>
                <div
                    role="group"
                    aria-label={slotsLabel}
                    className="grid grid-cols-2 gap-2 @app-sm:grid-cols-3"
                >
                    {availableSlots.map((slot) => {
                        const selected = slot.id === selectedSlotId
                        return (
                            <Button
                                key={slot.id}
                                size="sm"
                                className="w-full justify-center"
                                variant={selected ? "secondary" : "ghost"}
                                isDisabled={slot.isDisabled}
                                aria-pressed={selected}
                                onPress={() => onSlotChange(slot.id)}
                            >
                                {slot.label}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
