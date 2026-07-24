import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { DatePicker } from "./DatePicker"

/**
 * The date-selection field input — a controlled `DatePicker` composing
 * {@link FieldShell} (label / hint / error / skeleton, canon §4/§8) with
 * HeroUI's canonical `DateField.Group` segments + `Calendar` popover compound.
 */
const meta: Meta<typeof DatePicker> = {
    title: "Primitives/Forms/DatePicker",
    component: DatePicker,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DatePicker>

// Fixed literal so stories are deterministic — never `new Date()`.
const INITIAL_DATE = new CalendarDate(2026, 7, 20)
const MIN_DATE = new CalendarDate(2026, 7, 1)

/** Local controlled wrapper — holds the picked date so the field/calendar are clickable for real. */
const Controlled = ({
    initialValue = null,
    label = "Ngày sinh",
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: DateValue | null
    label?: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState<DateValue | null>(initialValue)
    return (
        <DatePicker
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            value={value}
            onValueChange={setValue}
            minValue={MIN_DATE}
        />
    )
}

/** Default: empty field, ready to pick a date. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled />
        </div>
    ),
}

/** WithHint: a hint under the label explaining the field. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled description="Dùng để xác nhận độ tuổi tối thiểu" />
        </div>
    ),
}

/** WithError: an invalid field with an error line below it. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled initialValue={INITIAL_DATE} errorMessage="Ngày sinh không hợp lệ" />
        </div>
    ),
}

/** Disabled: the field cannot be opened or edited. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled initialValue={INITIAL_DATE} isDisabled />
        </div>
    ),
}

/** Skeleton: loading mirror — label bar + field-box skeleton (canon §8). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <DatePicker
                label="Ngày sinh"
                isSkeleton
                value={null}
                onValueChange={() => {}}
            />
        </div>
    ),
}
