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
 * `SelectSingle` — single-select dropdown (HeroUI Select single). The trigger
 * shows the selected option's label (or the placeholder); the popover is a
 * ListBox of rows.
 */
export const SelectSingle = ({
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
    /** Selected value (controlled), `null` when nothing is selected. */
    value: string | null
    /** Fires when the user picks an option. */
    onValueChange: (value: string) => void
}) => {
    const invalid = isInvalid || errorMessage != null
    const selected = options.find((option) => option.value === value)
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
            <HeroSelect.Root<SelectOption, "single">
                data-tier="atom"
                data-component="SelectSingle"
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                placeholder={placeholder}
                selectedKey={value}
                onSelectionChange={(key) => onValueChange(String(key))}
                fullWidth
                className={cn(classNames)}
            >
                <HeroSelect.Trigger>
                    <HeroSelect.Value>
                        {() => (
                            <span className={cn("text-sm", !selected && "text-field-placeholder")}>
                                {selected ? selected.label : placeholder}
                            </span>
                        )}
                    </HeroSelect.Value>
                    <HeroSelect.Indicator>
                        <CaretDownIcon className="text-muted size-4" weight="bold" />
                    </HeroSelect.Indicator>
                </HeroSelect.Trigger>
                <HeroSelect.Popover>
                    <HeroListBox.Root aria-label={ariaLabel ?? placeholder}>
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

/** Tier metadata for `SelectSingle`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "SelectSingle" } as const
