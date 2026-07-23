import React, { useId } from "react"
import { ListBox, Select as HeroSelect, Typography, cn } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the single-select dropdown field, cloned from the
 * golden {@link ../TextField/TextField.tsx | TextField}. Authored in Storybook
 * (not `src`); synced to `src` later. No `@/components` import — self-contained.
 *
 * Select composes {@link FieldShell} (label / hint / error / skeleton column,
 * canon §4/§8) with HeroUI's real `<Select.Root><Select.Trigger>…` compound
 * (built on react-aria-components `Select` + `ListBox`). The consumer passes a
 * bare `value` + `onValueChange` (canon §4 Ownership) plus flat `options` — never
 * structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable option. */
export interface SelectOption {
    /** The option's value — what `onValueChange` fires with. */
    value: string
    /** Rendered label (in the trigger once selected, and in the list row). */
    label: React.ReactNode
}

/** Props for {@link Select}. */
export interface SelectProps {
    /** Label rendered above the field (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the field (`text-sm text-danger-soft-foreground`). When
     * present the field is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Selectable options. */
    options: Array<SelectOption>
    /** Placeholder shown when nothing is selected. */
    placeholder?: string
    /** Current value (controlled), or `null` when nothing is selected. */
    value: string | null
    /** Fires with the new value when the user picks an option. */
    onValueChange: (value: string) => void
    /** Disables the field. */
    isDisabled?: boolean
    /** Renders the loading mirror — label bar + field-box skeleton (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * Select is the single-select dropdown field: a controlled field wrapped in
 * {@link FieldShell} so its label, hint, error, and loading skeleton all come for
 * free. It threads `value`/`onValueChange` into HeroUI's real `Select` compound
 * (`Select.Root` → `Select.Trigger` → `Select.Value` + `Select.Indicator` →
 * `Select.Popover` → `ListBox.Root` → `ListBox.Item`), marking the field invalid
 * whenever {@link SelectProps.errorMessage} is set.
 *
 * @param props - {@link SelectProps}
 */
export const Select = ({
    label,
    description,
    errorMessage,
    options,
    placeholder,
    value,
    onValueChange,
    isDisabled,
    isSkeleton,
    className,
}: SelectProps) => {
    // one id shared by the FieldShell label (htmlFor) and the trigger (focus wiring)
    const id = useId()
    const isInvalid = errorMessage != null
    const selected = options.find((option) => option.value === value)

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.Select />}
            id={id}
            className={className}
        >
            {/* HeroUI Select.Root owns invalid/disabled/open state. */}
            <HeroSelect.Root<SelectOption, "single">
                id={id}
                aria-label={typeof label === "string" ? label : placeholder}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                placeholder={placeholder}
                selectedKey={value}
                onSelectionChange={(key) => onValueChange(String(key))}
                fullWidth
            >
                <HeroSelect.Trigger>
                    <HeroSelect.Value>
                        {() => (
                            <Typography type="body-sm" className={cn(!selected && "text-field-placeholder")}>
                                {selected ? selected.label : placeholder}
                            </Typography>
                        )}
                    </HeroSelect.Value>
                    <HeroSelect.Indicator>
                        <CaretDownIcon className="text-muted size-4" />
                    </HeroSelect.Indicator>
                </HeroSelect.Trigger>
                <HeroSelect.Popover>
                    <ListBox.Root aria-label={typeof label === "string" ? label : placeholder}>
                        {options.map((option) => (
                            <ListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={typeof option.label === "string" ? option.label : option.value}
                            >
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox.Root>
                </HeroSelect.Popover>
            </HeroSelect.Root>
        </FieldShell>
    )
}
