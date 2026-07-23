import React, { useId } from "react"
import { Radio, RadioGroup as HeroRadioGroupField } from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — a mutually-exclusive single-select field, cloned
 * from {@link TextField}. Authored in Storybook (not `src`); synced to `src`
 * later. No `@/components` import — self-contained.
 *
 * RadioGroupField composes {@link FieldShell} (GROUP label / hint / error /
 * skeleton column, canon §4/§8) with HeroUI's `<RadioGroup><Radio/></RadioGroup>`.
 * Unlike TextField, each option's own label sits BESIDE its radio dot (HeroUI's
 * `Radio.Content` owns that inline row) — FieldShell's `label` is only the
 * optional GROUP heading above the whole row stack. The consumer passes a bare
 * `value` + `onValueChange` (canon §4 Ownership) — never structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable option in a {@link RadioGroupField}. */
export interface RadioGroupFieldOption {
    /** The value reported to `onValueChange` when this option is picked. */
    value: string
    /** Label rendered beside the radio dot. */
    label: React.ReactNode
}

/** Props for {@link RadioGroupField}. */
export interface RadioGroupFieldProps {
    /** Optional GROUP heading rendered above the option rows (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the group (`text-sm text-danger-soft-foreground`). When
     * present the group is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** The selectable options, each rendered as its own radio row. */
    options: Array<RadioGroupFieldOption>
    /** Currently selected value (controlled). */
    value: string
    /** Fires with the newly selected option's value. */
    onValueChange: (value: string) => void
    /** Disables every radio in the group. */
    isDisabled?: boolean
    /** Renders the loading mirror — group label bar + stacked radio-row skeletons (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * RadioGroupField is a controlled single-select group wrapped in
 * {@link FieldShell} so its optional group label, hint, error, and loading
 * skeleton all come for free. It threads `value`/`onValueChange` straight into
 * HeroUI's `RadioGroup`, marks the group invalid whenever
 * {@link RadioGroupFieldProps.errorMessage} is set, and renders one `Radio` per
 * {@link RadioGroupFieldProps.options} entry — label beside the dot, owned by
 * HeroUI's `Radio.Content`.
 *
 * @param props - {@link RadioGroupFieldProps}
 */
export const RadioGroupField = ({
    label,
    description,
    errorMessage,
    options,
    value,
    onValueChange,
    isDisabled,
    isSkeleton,
    className,
}: RadioGroupFieldProps) => {
    // one id shared by the FieldShell group label (htmlFor) and the RadioGroup
    const id = useId()
    const isInvalid = errorMessage != null

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.RadioGroup items={options.length} />}
            id={id}
            className={className}
        >
            {/* HeroUI RadioGroup owns invalid/disabled state; Radio is each option row. */}
            <HeroRadioGroupField
                id={id}
                aria-label={typeof label === "string" ? label : undefined}
                value={value}
                onChange={onValueChange}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                className="flex flex-col gap-2"
            >
                {options.map((option) => (
                    <Radio key={option.value} value={option.value}>
                        <Radio.Content>
                            <Radio.Control>
                                <Radio.Indicator />
                            </Radio.Control>
                            <span className="min-w-0">{option.label}</span>
                        </Radio.Content>
                    </Radio>
                ))}
            </HeroRadioGroupField>
        </FieldShell>
    )
}
