import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Button } from "@/components/atoms/buttons/Button"
import {
    ButtonGroupRoot,
    ButtonGroupSeparator,
} from "@/components/atoms/buttons/ButtonGroup"

/**
 * `Button.RadioGroup` — a flex-wrap row of selectable buttons, single- or multi-select.
 * Leaves: `items` builds N child buttons (`Default`, with per-item `isDisabled`); `multiple`
 * allows ≥2 selected at once; `trailing` appends a non-option button (e.g. "+N"); `itemAction`
 * turns each item into a fused `ButtonGroup` [select | delete | more].
 */

interface CloneableActionElementProps {
    children?: ReactNode
}

/** One selectable button in a {@link ButtonRadioGroup}. */
export interface ButtonRadioGroupItem<T extends string> {
    /** Value selected when this button is chosen. */
    value: T
    /** Button content (icon + label + meta — caller-defined inline row). */
    content: ReactNode
    /** When true the button is dimmed and not selectable. */
    isDisabled?: boolean
}

/** Props shared by both the single- and multi-select modes of {@link ButtonRadioGroup}. */
interface ButtonRadioGroupBaseProps<T extends string> {
    /** The selectable buttons. */
    items: Array<ButtonRadioGroupItem<T>>
    /** Accessible label for the group. */
    ariaLabel: string
    /**
     * Optional trailing node placed after the buttons in the SAME row (e.g. a
     * "+N" overflow button). Not part of the group's value — it's an action.
     */
    trailing?: ReactNode
    /**
     * Optional per-item trailing action(s) — e.g. a delete button and/or a "⋮"
     * (kebab) menu trigger. When provided, the item's select button and these
     * action buttons render as ONE connected `ButtonGroup` per item
     * (`[select | delete | ⋮]`). Return the action `<Button>`s as an ARRAY (with
     * `key`s) so each is an individual segment. Omit for a plain single-select row.
     */
    itemAction?: (item: ButtonRadioGroupItem<T>) => ReactNode
}

/** Single-select mode (default) — exactly one value selected at a time. */
interface ButtonRadioGroupSingleProps<T extends string> extends ButtonRadioGroupBaseProps<T> {
    /** Single-select — omit or pass `false`. */
    multiple?: false
    /** Currently selected value. */
    value: T
    /** Fired with the chosen value when a button is selected. */
    onChange: (value: T) => void
}

/**
 * Multi-select mode — a SET of values, each button an independent toggle. The
 * caller owns the set + the toggle logic (e.g. enforcing "at least one selected");
 * this component only reports which button was pressed via {@link onToggle}.
 */
interface ButtonRadioGroupMultiProps<T extends string> extends ButtonRadioGroupBaseProps<T> {
    /** Multi-select — pass `true`. */
    multiple: true
    /** Currently selected values. */
    values: Array<T>
    /** Fired with the pressed value (the caller adds/removes it from its own set). */
    onToggle: (value: T) => void
}

/** Props for {@link ButtonRadioGroup} — a discriminated union on `multiple`. */
export type ButtonRadioGroupProps<T extends string> =
    | ButtonRadioGroupSingleProps<T>
    | ButtonRadioGroupMultiProps<T>

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ButtonRadioGroup" } as const

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap
 * to the next line, never scroll). Every option is a house `<Button>`:
 * standalone, selected = filled `tertiary` (NEUTRAL, not accent — a facet/config
 * toggle isn't a CTA), unselected = hollow `ghost`. NEVER `primary` here — a config
 * row commonly sits on the SAME surface as the page's one accent CTA.
 *
 * When `itemAction` is supplied, each item instead renders as one connected
 * `ButtonGroup` — the select button + its action button(s) touching, only the
 * two outer ends rounded (`[select | delete | ⋮]`). The seam is the house
 * `ButtonGroupSeparator`, baked to the `--border` token and full-height.
 *
 * `role="group"` + `aria-pressed` per option — works for BOTH the default
 * single-select toggle group and the multi-select mode. House `Button` does not
 * accept `aria-pressed`, so the standalone path wraps the control in a span;
 * the fused `ButtonGroupRoot` path cannot wrap (segments must be buttons), so
 * pressed state is carried only on the standalone span.
 *
 * @param props - {@link ButtonRadioGroupProps}
 */
export const ButtonRadioGroup = <T extends string>(props: ButtonRadioGroupProps<T>) => {
    const { items, ariaLabel, trailing, itemAction } = props
    // narrow the discriminated union once — selection state + the press handler are
    // the only things that differ between single- and multi-select.
    const isSelected = (candidate: T): boolean =>
        (props.multiple ? props.values.includes(candidate) : props.value === candidate)
    const onPress = (candidate: T): void => {
        if (props.multiple) {
            props.onToggle(candidate)
        } else {
            props.onChange(candidate)
        }
    }
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn("flex flex-wrap items-center gap-2")}
            data-tier="composite"
            data-component="ButtonRadioGroup"
            data-principle="flex-action"
        >
            {items.map((item) => {
                const selected = isSelected(item.value)
                if (!itemAction) {
                    // standalone: selected = filled `tertiary`, unselected = hollow `ghost`.
                    return (
                        <span key={item.value} aria-pressed={selected}>
                            <Button
                                size="sm"
                                variant={selected ? "tertiary" : "ghost"}
                                isDisabled={item.isDisabled}
                                onPress={() => onPress(item.value)}
                                label={item.content}
                            />
                        </span>
                    )
                }
                // select button + its action(s) = one connected ButtonGroup per item.
                // Each action button gets a `ButtonGroupSeparator` injected at the head
                // of its children — the separator must sit inside the following button.
                return (
                    <ButtonGroupRoot key={item.value} size="sm">
                        <Button
                            size="sm"
                            variant={selected ? "secondary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            onPress={() => onPress(item.value)}
                            label={item.content}
                        />
                        {React.Children.map(itemAction(item), (action) =>
                            React.isValidElement<CloneableActionElementProps>(action)
                                ? React.cloneElement(
                                    action,
                                    undefined,
                                    <ButtonGroupSeparator />,
                                    action.props.children,
                                )
                                : action,
                        )}
                    </ButtonGroupRoot>
                )
            })}
            {trailing}
        </div>
    )
}
