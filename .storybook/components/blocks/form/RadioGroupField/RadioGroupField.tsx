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
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     * `FieldShell` itself can't be tagged from the inside (its own file), so this
     * wraps it in an anatomy-only marker `<div>` — rendered ONLY in this mode,
     * never in production.
     */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: RadioGroupFieldProps) => {
    // one id shared by the FieldShell group label (htmlFor) and the RadioGroup
    const id = useId()
    const isInvalid = errorMessage != null

    const field = (
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
                    <Radio key={option.value} value={option.value} data-anat-part={showAnatomy ? "Radio" : undefined}>
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

    // FieldShell (label/hint/error/skeleton column) lives in its own sibling file and
    // doesn't forward a `data-anat-part` — wrap it in an anatomy-only marker `<div>`
    // so a BlockAnatomy panel can still badge it as ONE opaque composed part. This
    // wrapper renders ONLY in `showAnatomy` mode; production keeps FieldShell as the root.
    return showAnatomy ? <div data-anat-part="FieldShell">{field}</div> : field
}
