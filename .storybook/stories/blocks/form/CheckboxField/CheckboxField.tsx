import React, { useId } from "react"
import { Checkbox, CheckboxGroup, cn } from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — boolean / multi-pick checkbox field. Authored in
 * Storybook (not `src`); synced to `src` later. No `@/components` import —
 * self-contained.
 *
 * CheckboxField composes {@link FieldShell} (hint / error / skeleton column,
 * canon §4/§8) with HeroUI's `Checkbox` compound (`Checkbox.Control` +
 * `Checkbox.Indicator` + `Checkbox.Content`) and, for the group mode, HeroUI's
 * `CheckboxGroup`. No alias needed — this wrapper is named `CheckboxField`,
 * which does not collide with any `@heroui/react` export (`Checkbox` /
 * `CheckboxGroup` are the real names).
 *
 * Checkbox is an INLINE/BOOLEAN input (canon FieldShell JSDoc): its label sits
 * BESIDE the control (HeroUI's `Checkbox.Content` already carries that label
 * slot), so FieldShell is composed WITHOUT its `label` prop — the labelled
 * control(s) are passed as `children` instead. FieldShell's `label` prop is
 * reused here ONLY as an optional GROUP heading above the row(s), per its own
 * documented convention.
 *
 * TWO modes, one file, picked by the presence of `options`:
 * - SINGLE — one boolean checkbox with an inline `checkboxLabel` beside it.
 *   `value: boolean` / `onValueChange: (value: boolean) => void`.
 * - GROUP — a HeroUI `CheckboxGroup` rendering one row per `options` entry.
 *   `value: string[]` / `onValueChange: (value: string[]) => void`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable row in the GROUP mode of {@link CheckboxField}. */
export interface CheckboxFieldOption {
    /** Stable id — the value stored in the controlled `value` array. */
    value: string
    /** Label rendered beside this option's checkbox. */
    label: React.ReactNode
    /** Disables just this row, independent of the group-level `isDisabled`. */
    isDisabled?: boolean
}

/** Props shared by both {@link CheckboxField} modes. */
interface CheckboxFieldSharedProps {
    /**
     * Optional heading ABOVE the control (a GROUP label). Omit for a bare
     * single checkbox — its own {@link SingleCheckboxFieldProps.checkboxLabel}
     * already sits beside it.
     */
    label?: React.ReactNode
    /** Hint under the label / above the control (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the control (`text-sm text-danger-soft-foreground`).
     * When present the control is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Disables every checkbox in this field. */
    isDisabled?: boolean
    /** Renders the loading mirror — one {@link Skeleton.Checkbox} row per option (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/** SINGLE mode: one boolean checkbox with an inline label. */
export interface SingleCheckboxFieldProps extends CheckboxFieldSharedProps {
    /** Discriminant — omit entirely for the single boolean checkbox. */
    options?: undefined
    /** Label rendered BESIDE the checkbox control. */
    checkboxLabel: React.ReactNode
    /** Checked state (controlled). */
    value: boolean
    /** Fires with the new checked state. */
    onValueChange: (value: boolean) => void
}

/** GROUP mode: a `CheckboxGroup` rendering one row per option. */
export interface GroupCheckboxFieldProps extends CheckboxFieldSharedProps {
    /** The rows to render — presence of this prop selects GROUP mode. */
    options: Array<CheckboxFieldOption>
    /** Currently selected option values (controlled). */
    value: Array<string>
    /** Fires with the new selected-value array on every toggle. */
    onValueChange: (value: Array<string>) => void
}

/** Props for {@link CheckboxField} — SINGLE boolean or GROUP multi-pick, picked by `options`. */
export type CheckboxFieldProps = SingleCheckboxFieldProps | GroupCheckboxFieldProps

/**
 * CheckboxField is the boolean / multi-pick checkbox input. In SINGLE mode it
 * is one controlled boolean checkbox with an inline label; in GROUP mode
 * (when `options` is passed) it is a HeroUI `CheckboxGroup` of rows, wrapped in
 * {@link FieldShell} for the optional group heading, hint, error, and loading
 * skeleton — all owned by the field, never by the consumer (canon §4).
 *
 * @param props - {@link CheckboxFieldProps}
 */
export const CheckboxField = (props: CheckboxFieldProps) => {
    // stable id — kept for the GROUP heading's htmlFor; SINGLE mode's label is
    // native (Checkbox.Content IS the <label>), so no extra wiring is needed there
    const id = useId()
    const isInvalid = props.errorMessage != null
    const isGroup = props.options != null

    if (props.isSkeleton) {
        const rows = isGroup ? Math.max(1, props.options.length) : 1
        return (
            <FieldShell
                label={props.label}
                description={props.description}
                errorMessage={props.errorMessage}
                isSkeleton
                id={id}
                className={props.className}
                skeletonControl={
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: rows }).map((_, index) => (
                            <Skeleton.Checkbox key={index} />
                        ))}
                    </div>
                }
            />
        )
    }

    if (isGroup) {
        const { label, description, errorMessage, isDisabled, options, value, onValueChange, className } = props
        return (
            <FieldShell
                label={label}
                description={description}
                errorMessage={errorMessage}
                isDisabled={isDisabled}
                id={id}
                className={className}
            >
                <CheckboxGroup
                    aria-label={typeof label === "string" ? label : "Nhóm lựa chọn"}
                    value={value}
                    onChange={onValueChange}
                    isInvalid={isInvalid}
                    isDisabled={isDisabled}
                    className="flex flex-col gap-2"
                >
                    {options.map((option) => (
                        <Checkbox
                            key={option.value}
                            value={option.value}
                            isDisabled={isDisabled || option.isDisabled}
                        >
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content className={cn("w-full")}>{option.label}</Checkbox.Content>
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </FieldShell>
        )
    }

    const { description, errorMessage, isDisabled, checkboxLabel, value, onValueChange, className } = props
    return (
        <FieldShell description={description} errorMessage={errorMessage} isDisabled={isDisabled} className={className}>
            <Checkbox isSelected={value} onChange={onValueChange} isInvalid={isInvalid} isDisabled={isDisabled}>
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content className={cn("w-full")}>{checkboxLabel}</Checkbox.Content>
            </Checkbox>
        </FieldShell>
    )
}
