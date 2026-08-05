import { NumberField as HeroNumberField, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { FrameProps } from "../_input/types"
import { FieldSkeleton } from "../_input/FieldSkeleton"

/** `InputCurrency` — money amount (HeroUI NumberField + `formatOptions` currency). */
export const InputCurrency = ({
    value,
    onValueChange,
    currency = "VND",
    minValue = 0,
    maxValue,
    step,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: number
    onValueChange: (value: number) => void
    /** ISO-4217 code fed to `formatOptions.currency`. Default `VND`. */
    currency?: string
    minValue?: number
    maxValue?: number
    step?: number
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
            <HeroNumberField
                data-tier="atom"
                data-component="InputCurrency"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                // The atom owns the currency formatting — the consumer passes a raw number,
                // never a formatted string; the field renders the currency symbol and grouping itself.
                formatOptions={{ style: "currency", currency, currencyDisplay: "narrowSymbol" }}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                className={cn(classNames)}
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

/** Tier metadata for `InputCurrency`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputCurrency" } as const
