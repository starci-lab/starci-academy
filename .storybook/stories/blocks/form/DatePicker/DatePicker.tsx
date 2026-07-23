import React, { useId } from "react"
import {
    Calendar,
    DateField,
    DatePicker as HeroDatePicker,
} from "@heroui/react"
import type { DateValue } from "@internationalized/date"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the date-selection field input. Authored in
 * Storybook (not `src`); synced to `src` later. No `@/components` import —
 * self-contained.
 *
 * DatePicker composes {@link FieldShell} (label / hint / error / skeleton
 * column, canon §4/§8) with HeroUI's canonical `DatePicker` compound — a
 * `DateField.Group` of segments plus a `Calendar` popover, exactly as ported in
 * `.storybook/stories/blocks/form/SchedulePicker/SchedulePicker.tsx` (the
 * existing, grounded usage of this compound in this repo). The consumer passes
 * a bare `value` + `onValueChange` (canon §4 Ownership) — never structure.
 *
 * NOTE (value type): the real HeroUI/react-aria value is a `DateValue` from
 * `@internationalized/date` (e.g. a `CalendarDate`), NOT a native JS `Date`.
 * This keeps the API minimal and matches `SchedulePicker`'s established
 * contract — callers already on `@internationalized/date` (calendars, date
 * math) can pass it straight through; callers on native `Date` convert at the
 * call site (`parseDate(isoString)` / `date.toString()`).
 *
 * NOTE (label wiring): unlike `TextField`, there is no single focusable input
 * to hand the label an `htmlFor` target — HeroUI's `DateField.Group` is a
 * segmented field (day/month/year each its own focusable segment). The
 * generated `id` is still passed to the root `HeroDatePicker` (rendered on its
 * outer element) for a best-effort `htmlFor` association, AND an `aria-label`
 * fallback is set from a string `label` (mirroring `TextField`'s pattern) so
 * the field always has an accessible name even when that association doesn't
 * resolve to a single control.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link DatePicker}. */
export interface DatePickerProps {
    /** Label rendered above the field (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the field (`text-sm text-danger-soft-foreground`). When
     * present the field is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Current value (controlled), or `null` when nothing is picked yet. */
    value: DateValue | null
    /** Fires with the newly picked date (or `null` when cleared). */
    onValueChange: (value: DateValue | null) => void
    /** Lower bound — dates before this are dimmed and unselectable. */
    minValue?: DateValue
    /** Upper bound — dates after this are dimmed and unselectable. */
    maxValue?: DateValue
    /** Disables the field. */
    isDisabled?: boolean
    /** Renders the loading mirror — label bar + field-box skeleton (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * DatePicker is the date-selection field input: a controlled segmented date
 * field wrapped in {@link FieldShell} so its label, hint, error, and loading
 * skeleton all come for free. It threads `value`/`onValueChange` straight into
 * HeroUI's canonical `DatePicker` compound (`DateField.Group` segments + a
 * `Calendar` popover), marking the field invalid whenever
 * {@link DatePickerProps.errorMessage} is set.
 *
 * @param props - {@link DatePickerProps}
 */
export const DatePicker = ({
    label,
    description,
    errorMessage,
    value,
    onValueChange,
    minValue,
    maxValue,
    isDisabled,
    isSkeleton,
    className,
}: DatePickerProps) => {
    // one id shared by the FieldShell label (htmlFor) and the DatePicker root
    const id = useId()
    const isInvalid = errorMessage != null

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.Input />}
            id={id}
            className={className}
        >
            {/* HeroUI DatePicker owns invalid/disabled state; DateField.Group + Calendar are the box. */}
            <HeroDatePicker
                id={id}
                aria-label={typeof label === "string" ? label : undefined}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                className="w-full"
            >
                <DateField.Group fullWidth variant="secondary">
                    <DateField.Input>
                        {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                        <HeroDatePicker.Trigger>
                            <HeroDatePicker.TriggerIndicator>
                                <CalendarBlankIcon className="size-4" />
                            </HeroDatePicker.TriggerIndicator>
                        </HeroDatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>
                <HeroDatePicker.Popover>
                    <Calendar aria-label={typeof label === "string" ? label : "Chọn ngày"}>
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
                </HeroDatePicker.Popover>
            </HeroDatePicker>
        </FieldShell>
    )
}
