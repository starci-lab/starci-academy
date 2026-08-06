import {
    Select as HeroSelect,
    ListBox as HeroListBox,
    cn,
} from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { FieldFrame, fieldName } from "@sb-components/composites/form/_field/FieldFrame"
import type { BaseSelectProps, SelectOption } from "../_select/types"
import { TriggerSkeleton } from "@sb-components/atoms/forms/_select/TriggerSkeleton"

/**
 * `SelectMulti` — multi-select dropdown (HeroUI Select `selectionMode="multiple"`).
 * The trigger summarizes the count/label of selected options; each list row
 * toggles on and off.
 */
export const SelectMulti = ({
    value,
    onValueChange,
    options,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: BaseSelectProps & {
    /** Selected values (controlled). */
    value: Array<string>
    /** Fires with the new value array on every toggle. */
    onValueChange: (value: Array<string>) => void
}) => {
    const invalid = isInvalid || errorMessage != null
    const chosen = options.filter((option) => value.includes(option.value))
    // Trigger label: "n selected" when 2 or more are chosen, the single label
    // when exactly 1, the placeholder when empty. This default string is
    // hardcoded in English — call sites that don't override it show it verbatim.
    const summary =
        chosen.length === 0 ? null : chosen.length === 1 ? chosen[0].label : `${chosen.length} selected`
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}

            skeletonControl={<TriggerSkeleton classNames={classNames} />}
        >
            <HeroSelect.Root<SelectOption, "multiple">
                data-tier="atom"
                data-component="SelectMulti"
                selectionMode="multiple"
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                placeholder={placeholder}
                value={value}
                onChange={(keys) => onValueChange(keys.map(String))}
                fullWidth
                className={cn(classNames)}
            >
                <HeroSelect.Trigger>
                    <span className={cn("text-sm", summary == null && "text-field-placeholder")}>
                        {summary ?? placeholder}
                    </span>
                    <HeroSelect.Indicator>
                        <CaretDownIcon className="text-muted size-4" weight="bold" />
                    </HeroSelect.Indicator>
                </HeroSelect.Trigger>
                <HeroSelect.Popover>
                    <HeroListBox.Root aria-label={ariaLabel ?? placeholder} selectionMode="multiple">
                        {options.map((option) => (
                            <HeroListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={typeof option.label === "string" ? option.label : option.value}
                            >
                                {option.label}
                            </HeroListBox.Item>
                        ))}
                    </HeroListBox.Root>
                </HeroSelect.Popover>
            </HeroSelect.Root>
        </FieldFrame>
    )
}

/** Tier metadata for `SelectMulti`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "SelectMulti" } as const
