import { NumberField as HeroNumberField } from "@heroui/react"
import { FieldFrame, fieldName } from "@sb-components/composites/form/_field/FieldFrame"
import type { FrameProps } from "../_input/types"
import { FieldSkeleton } from "@sb-components/atoms/forms/_input/FieldSkeleton"

/** `InputNumber` — numeric with stepper (HeroUI NumberField). */
export const InputNumber = ({
    value,
    onValueChange,
    minValue,
    maxValue,
    step,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: number
    onValueChange: (value: number) => void
    minValue?: number
    maxValue?: number
    step?: number
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
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

            skeletonControl={<FieldSkeleton />}
        >
            <HeroNumberField
                data-tier="atom"
                data-component="InputNumber"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                
            >
                {/* There's no wrapping div here since it had no styling of its own. */}
                <HeroNumberField.Group>
                    <HeroNumberField.DecrementButton />
                    <HeroNumberField.Input />
                    <HeroNumberField.IncrementButton />
                </HeroNumberField.Group>
            </HeroNumberField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputNumber`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputNumber" } as const
