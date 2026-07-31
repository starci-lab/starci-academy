import React from "react"
import type { ReactNode } from "react"
import { Button, ButtonGroup as HeroButtonGroup, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Button.RadioGroup` — a row of select buttons (single or multi), flex-wrap.
 *
 * A stateful control (`value`/`onChange` for single-select, `values`/`onToggle` for
 * multi-select) with `role="group"` + `aria-pressed` per button, distinct from
 * `ButtonGroup`'s stateless row of independent action buttons. Each item can also
 * expand into its own connected `ButtonGroup` via `itemAction`.
 *
 * Renders raw HeroUI `Button`/`ButtonGroup` directly rather than through this
 * namespace's own `ButtonBase`/`ButtonGroup`: `ButtonBase` does not forward arbitrary
 * attributes (no `...rest`), so using it here would drop `aria-pressed` from
 * assistive tech.
 */

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
     * (`[select | 🗑 | ⋮]`). Return the action `<Button>`s as an ARRAY (with
     * `key`s) so each is an individual segment. Omit for a plain single-select row.
     */
    itemAction?: (item: ButtonRadioGroupItem<T>) => ReactNode
    /** `true` → tag this row's own HeroUI renders (`Button`/`ButtonGroup`/`ButtonGroup.Separator`) with `data-anat-part` so a BlockAnatomy panel can badge them. */
    showAnatomy?: boolean
    /**
     * Extra classes on the row.
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap
 * to the next line, never scroll). Every option is a real HeroUI `<Button>`:
 * standalone, selected = filled `tertiary` (NEUTRAL, not accent — a facet/config
 * toggle isn't a CTA), unselected = hollow `ghost`. NEVER `primary` here — a config
 * row commonly sits on the SAME surface as the page's one accent CTA.
 *
 * When `itemAction` is supplied, each item instead renders as one connected
 * `ButtonGroup` — the select button + its action button(s) touching, only the
 * two outer ends rounded (`[select | 🗑 | ⋮]`). The seam is HeroUI's own
 * `ButtonGroup.Separator`, recoloured to the `--border` token and forced full-height.
 *
 * `role="group"` + `aria-pressed` per button — works for BOTH the default
 * single-select toggle group and the multi-select mode.
 *
 * @param props - {@link ButtonRadioGroupProps}
 */
export const ButtonRadioGroup = <T extends string>(props: ButtonRadioGroupProps<T>) => {
    const { items, ariaLabel, trailing, itemAction, showAnatomy = false, className, classNames } = props
    // narrow the discriminated union once — selection state + the press handler are
    // the only things that differ between single- and multi-select.
    const isSelected = (candidate: T): boolean =>
        (props.multiple ? props.values.includes(candidate) : props.value === candidate)
    const handlePress = (candidate: T): void => {
        if (props.multiple) {
            props.onToggle(candidate)
        } else {
            props.onChange(candidate)
        }
    }
    return (
        <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className, classNames)}>
            {items.map((item) => {
                const selected = isSelected(item.value)
                if (!itemAction) {
                    // standalone: selected = filled `tertiary`, unselected = hollow `ghost`.
                    return (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={selected ? "tertiary" : "ghost"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                            data-anat-part={showAnatomy ? "Button" : undefined}
                        >
                            {item.content}
                        </Button>
                    )
                }
                // select button + its action(s) = one connected ButtonGroup per item.
                // Each action button gets a `ButtonGroup.Separator` injected at the head
                // of its children — HeroUI's separator must sit inside the following button.
                return (
                    <HeroButtonGroup
                        key={item.value}
                        size="sm"
                        className="w-fit"
                        data-anat-part={showAnatomy ? "ButtonGroup" : undefined}
                    >
                        <Button
                            size="sm"
                            variant={selected ? "secondary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                            data-anat-part={showAnatomy ? "Button" : undefined}
                        >
                            {item.content}
                        </Button>
                        {React.Children.map(itemAction(item), (action) =>
                            React.isValidElement<{ children?: ReactNode }>(action)
                                ? React.cloneElement(
                                    action,
                                    undefined,
                                    <HeroButtonGroup.Separator
                                        className="!top-0 !h-full !bg-border !opacity-100"
                                        data-anat-part={showAnatomy ? "ButtonGroup.Separator" : undefined}
                                    />,
                                    action.props.children,
                                )
                                : action,
                        )}
                    </HeroButtonGroup>
                )
            })}
            {trailing}
        </div>
    )
}
