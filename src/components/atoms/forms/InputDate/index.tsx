import { DatePicker as HeroDatePicker, DateField, Calendar, cn } from "@heroui/react"
import type { DateValue } from "@internationalized/date"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { FrameProps } from "../_input/types"
import { FieldSkeleton } from "@/components/atoms/forms/_input/FieldSkeleton"

/** `InputDate` — date picker (HeroUI DatePicker + DateField segments + Calendar popover). */
export const InputDate = ({
    value,
    onValueChange,
    minValue,
    maxValue,
    isDisabled,
    isInvalid,
    ariaLabel = "Pick a date",
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: DateValue | null
    onValueChange: (value: DateValue | null) => void
    minValue?: DateValue
    maxValue?: DateValue
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}

            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroDatePicker
                data-tier="atom"
                data-component="InputDate"
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                className={cn("w-full", classNames)}
            >
                <DateField.Group fullWidth variant="secondary">
                    <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                    <DateField.Suffix>
                        <HeroDatePicker.Trigger>
                            <HeroDatePicker.TriggerIndicator />
                        </HeroDatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>
                <HeroDatePicker.Popover>
                    <Calendar aria-label={ariaLabel} />
                </HeroDatePicker.Popover>
            </HeroDatePicker>
        </FieldFrame>
    )
}

/** Tier metadata for `InputDate`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputDate" } as const
