import type { ReactNode } from "react"
import {
    Select as HeroSelect,
    ComboBox as HeroComboBox,
    ListBox as HeroListBox,
    ListBoxItem as HeroListBoxItem,
    Input as HeroInput,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { FieldFrame, fieldName } from "@/components/atoms/forms/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `Select.*` — the choose-from-a-list field-control atom namespace (wraps
 * HeroUI `Select` + `ComboBox`).
 *
 * Members are grouped by selection mode — `SelectSingle` (one) · `SelectMulti`
 * (many) · `SelectCombobox` (type-to-filter autocomplete). Each carries its own
 * label, hint, error, and required mark via `FieldFrame`.
 *
 * `isSkeleton` renders a trigger-box skeleton co-located on the atom, without
 * importing the `Skeleton.*` compound.
 *
 * Icons use Phosphor (`@phosphor-icons/react`). The caret here is `size-4`
 * (below `size-5`), so it needs `weight="bold"` to keep its stroke from
 * looking thinner than the standard icon size.
 */

/**
 * Field-frame props every form atom accepts to carry its own label, hint,
 * error, and required mark. Omit them all and the atom renders as a bare
 * control (FieldFrame renders the control straight through).
 */
interface FrameProps {
    /** Label above the control. */
    label?: ReactNode
    /** Description below the label (always visible). */
    hint?: ReactNode
    /** Error line below the control (set it to show an error border). */
    errorMessage?: ReactNode
    /** Adds a required `*` mark. */
    isRequired?: boolean
}

/** One selectable option — `value` is the payload, `label` is the rendered text. */
export interface SelectOption {
    /** Option value — what `onValueChange` fires and the React key. */
    value: string
    /** Displayed label (in the trigger when selected, and in the list row). */
    label: ReactNode
}

/** Props for the {@link TriggerSkeleton} mirror — a trigger-box skeleton owned by the atom. */
interface TriggerSkeletonProps {
    /** Where this sits inside its parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
}

const TriggerSkeleton = ({ classNames }: TriggerSkeletonProps) => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl", classNames)} />
)

/** Shared props across the members. */
interface BaseSelectProps extends FrameProps {
    /** Flat list of options to choose from. */
    options: Array<SelectOption>
    /** Placeholder shown when nothing is selected. */
    placeholder?: string
    /** Disables the control. */
    isDisabled?: boolean
    /** Field invalid (error border) — `errorMessage` also triggers the border via FieldFrame. */
    isInvalid?: boolean
    /** Accessible name used when there's no `label` (otherwise the label handles it). */
    ariaLabel?: string
    /** Renders the trigger-box skeleton instead of the control. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
}

/**
 * `SelectSingle` — single-select dropdown (HeroUI Select single). The trigger
 * shows the selected option's label (or the placeholder); the popover is a
 * ListBox of rows.
 */
const SelectSingle = ({
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

/**
 * `SelectMulti` — multi-select dropdown (HeroUI Select `selectionMode="multiple"`).
 * The trigger summarizes the count/label of selected options; each list row
 * toggles on and off.
 */
const SelectMulti = ({
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

/**
 * `SelectCombobox` — type-to-filter single-select (HeroUI ComboBox). Typing in
 * the input lets react-aria filter `defaultItems` by text; the caret opens the
 * full list.
 */
const SelectCombobox = ({
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

/**
 * `Select.*` — the choose-from-a-list field-control atom namespace. Single/
 * Multi wrap HeroUI `Select`, Combobox wraps HeroUI `ComboBox`.
 */
export { SelectSingle, SelectMulti, SelectCombobox }

/** `Select.*` namespace — folder-matching handle grouping the select-control atom members. */
export const Select = { Single: SelectSingle, Multi: SelectMulti, Combobox: SelectCombobox }

/** Tier metadata for each `Select.*` member, used by the component registry/Storybook lookup. */
export const meta = [
    { tier: "atom", name: "SelectSingle" },
    { tier: "atom", name: "SelectMulti" },
    { tier: "atom", name: "SelectCombobox" },
] as const
