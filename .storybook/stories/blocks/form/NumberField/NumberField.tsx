import React, { useId } from "react"
import { NumberField as HeroNumberField } from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the numeric input with +/- steppers. Authored in
 * Storybook (not `src`); synced to `src` later. No `@/components` import —
 * self-contained.
 *
 * NumberField composes {@link FieldShell} (label / hint / error / skeleton
 * column, canon §4/§8) with HeroUI's compound
 * `<NumberField><NumberField.Group><NumberField.DecrementButton/>
 * <NumberField.Input/><NumberField.IncrementButton/></NumberField.Group>
 * </NumberField>`. The consumer passes a bare `value` + `onValueChange` (canon
 * §4 Ownership) — never structure. The stepper buttons already ship their own
 * +/- icons from HeroUI, so no icon import is needed here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link NumberField}. */
export interface NumberFieldProps {
    /** Label rendered above the field (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the field (`text-sm text-danger-soft-foreground`). When
     * present the field is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Current value (controlled). */
    value: number
    /** Fires with the new value on every keystroke, increment, or decrement. */
    onValueChange: (value: number) => void
    /** Smallest value the field accepts. */
    minValue?: number
    /** Largest value the field accepts. */
    maxValue?: number
    /** Amount the value changes per increment/decrement tick. */
    step?: number
    /** Disables the field. */
    isDisabled?: boolean
    /** Renders the loading mirror — label bar + field-box skeleton (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * NumberField is the numeric input with +/- stepper buttons: a controlled field
 * wrapped in {@link FieldShell} so its label, hint, error, and loading skeleton
 * all come for free. It threads `value`/`onValueChange` straight into HeroUI's
 * `NumberField` compound and marks the field invalid whenever
 * {@link NumberFieldProps.errorMessage} is set.
 *
 * @param props - {@link NumberFieldProps}
 */
export const NumberField = ({
    label,
    description,
    errorMessage,
    value,
    onValueChange,
    minValue,
    maxValue,
    step,
    isDisabled,
    isSkeleton,
    className,
}: NumberFieldProps) => {
    // one id shared by the FieldShell label (htmlFor) and the Input (focus wiring)
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
            {/* HeroUI NumberField owns invalid/disabled state; Group is the box. */}
            <HeroNumberField
                aria-label={typeof label === "string" ? label : undefined}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                fullWidth
            >
                <HeroNumberField.Group>
                    <HeroNumberField.DecrementButton />
                    <HeroNumberField.Input id={id} />
                    <HeroNumberField.IncrementButton />
                </HeroNumberField.Group>
            </HeroNumberField>
        </FieldShell>
    )
}
