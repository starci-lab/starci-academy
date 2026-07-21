import React from "react"
import type { ReactNode } from "react"
import { Button, ButtonGroup, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/FlexWrapButtonRadio`.
 * Authored in Storybook (not `src`); synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable button in a {@link FlexWrapButtonRadio}. */
export interface FlexWrapButtonRadioItem<T extends string> {
    /** Value selected when this button is chosen. */
    value: T
    /** Button content (icon + label + meta — caller-defined inline row). */
    content: ReactNode
    /** When true the button is dimmed and not selectable. */
    isDisabled?: boolean
}

/** Props shared by both the single- and multi-select modes of {@link FlexWrapButtonRadio}. */
interface FlexWrapButtonRadioBaseProps<T extends string> {
    /** The selectable buttons. */
    items: Array<FlexWrapButtonRadioItem<T>>
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
     * action buttons render as ONE connected {@link ButtonGroup} per item
     * (`[select | 🗑 | ⋮]`). Return the action `<Button>`s as an ARRAY (with
     * `key`s) so each is an individual segment. Omit for a plain single-select row.
     */
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => ReactNode
    /** Extra classes on the row. */
    className?: string
}

/** Single-select mode (default) — exactly one value selected at a time. */
interface FlexWrapButtonRadioSingleProps<T extends string> extends FlexWrapButtonRadioBaseProps<T> {
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
interface FlexWrapButtonRadioMultiProps<T extends string> extends FlexWrapButtonRadioBaseProps<T> {
    /** Multi-select — pass `true`. */
    multiple: true
    /** Currently selected values. */
    values: Array<T>
    /** Fired with the pressed value (the caller adds/removes it from its own set). */
    onToggle: (value: T) => void
}

/** Props for the {@link FlexWrapButtonRadio} block — a discriminated union on `multiple`. */
export type FlexWrapButtonRadioProps<T extends string> =
    | FlexWrapButtonRadioSingleProps<T>
    | FlexWrapButtonRadioMultiProps<T>

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap
 * to the next line, never scroll). Every option is a real HeroUI `<Button>`:
 * standalone, selected = filled `tertiary` (NEUTRAL, not accent — a facet/config
 * toggle isn't a CTA), unselected = hollow `ghost`. NEVER `primary` here — a config
 * row commonly sits on the SAME surface as the page's one accent CTA.
 *
 * When `itemAction` is supplied, each item instead renders as one connected
 * {@link ButtonGroup} — the select button + its action button(s) touching, only
 * the two outer ends rounded (`[select | 🗑 | ⋮]`). The seam is HeroUI's own
 * `ButtonGroup.Separator`, recoloured to the `--border` token and forced full-height.
 *
 * `role="group"` + `aria-pressed` per button — works for BOTH the default
 * single-select toggle group and the multi-select mode.
 *
 * @param props - {@link FlexWrapButtonRadioProps}
 */
export const FlexWrapButtonRadio = <T extends string>(props: FlexWrapButtonRadioProps<T>) => {
    const { items, ariaLabel, trailing, itemAction, className } = props
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
        <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className)}>
            {items.map((item) => {
                const selected = isSelected(item.value)
                if (!itemAction) {
                    // standalone: selected = filled `tertiary` (neutral, NOT accent —
                    // a facet toggle isn't a CTA), unselected = hollow `ghost` (no
                    // surface of its own — the page/card is the surface).
                    return (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={selected ? "tertiary" : "ghost"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                        >
                            {item.content}
                        </Button>
                    )
                }
                // select button + its action(s) = ONE connected ButtonGroup per
                // item. No border frame — the button variants carry the look; here
                // the unselected select is `tertiary` (filled `--default`), NOT
                // `ghost`, so it matches the filled action buttons instead of
                // floating hollow. Each action button gets a `ButtonGroup.Separator`
                // injected at the head of its children (HeroUI's separator must sit
                // INSIDE the following button), full-height.
                return (
                    <ButtonGroup key={item.value} size="sm" className="w-fit">
                        <Button
                            size="sm"
                            variant={selected ? "secondary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                        >
                            {item.content}
                        </Button>
                        {React.Children.map(itemAction(item), (action) =>
                            React.isValidElement<{ children?: ReactNode }>(action)
                                ? React.cloneElement(
                                    action,
                                    undefined,
                                    <ButtonGroup.Separator className="!top-0 !h-full !bg-border !opacity-100" />,
                                    action.props.children,
                                )
                                : action,
                        )}
                    </ButtonGroup>
                )
            })}
            {trailing}
        </div>
    )
}
