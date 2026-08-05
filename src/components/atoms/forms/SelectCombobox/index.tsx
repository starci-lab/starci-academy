import {
    ComboBox as HeroComboBox,
    ListBox as HeroListBox,
    ListBoxItem as HeroListBoxItem,
    Input as HeroInput,
    cn,
} from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { BaseSelectProps, SelectOption } from "../_select/types"
import { TriggerSkeleton } from "../_select/TriggerSkeleton"

/**
 * `SelectCombobox` — type-to-filter single-select (HeroUI ComboBox). Typing in
 * the input lets react-aria filter `defaultItems` by text; the caret opens the
 * full list.
 */
export const SelectCombobox = ({
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
    /** Fires when the user picks a suggestion. */
    onValueChange: (value: string) => void
}) => {
    const invalid = isInvalid || errorMessage != null
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
            <HeroComboBox
                data-tier="atom"
                data-component="SelectCombobox"
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                variant="secondary"
                fullWidth
                menuTrigger="focus"
                isDisabled={isDisabled}
                isInvalid={invalid}
                defaultItems={options}
                selectedKey={value}
                onSelectionChange={(key) => {
                    if (key !== null) {
                        onValueChange(String(key))
                    }
                }}
                className={cn("w-full", classNames)}
            >
                <HeroComboBox.InputGroup className="relative">
                    <HeroInput placeholder={placeholder} className="w-full pr-9" />
                    <HeroComboBox.Trigger
                        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-lg"
                    >
                        {/* size-4 + text-muted declared directly on the icon, matching the two
                            `Select.Indicator` instances above (SelectSingle/SelectMulti) rather
                            than relying on `[&_svg]:size-4` on the parent Trigger. */}
                        <CaretDownIcon aria-hidden weight="bold" className="text-muted size-4" />
                    </HeroComboBox.Trigger>
                </HeroComboBox.InputGroup>
                <HeroComboBox.Popover>
                    <HeroListBox className="max-h-72 overflow-auto p-1">
                        {(option: SelectOption) => (
                            <HeroListBoxItem id={option.value} textValue={typeof option.label === "string" ? option.label : option.value}>
                                {option.label}
                            </HeroListBoxItem>
                        )}
                    </HeroListBox>
                </HeroComboBox.Popover>
            </HeroComboBox>
        </FieldFrame>
    )
}

/** Tier metadata for `SelectCombobox`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "SelectCombobox" } as const
