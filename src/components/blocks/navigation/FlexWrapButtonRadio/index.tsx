"use client"

import React from "react"
import type { ReactNode } from "react"
import { Button, ButtonGroup, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One selectable button in a {@link FlexWrapButtonRadio}. */
export interface FlexWrapButtonRadioItem<T extends string> {
    /** Value selected when this button is chosen. */
    value: T
    /** Button content (icon + label + meta — caller-defined inline row). */
    content: ReactNode
    /** When true the button is dimmed and not selectable. */
    isDisabled?: boolean
}

/** Props for the {@link FlexWrapButtonRadio} block. */
export interface FlexWrapButtonRadioProps<T extends string> extends WithClassNames<undefined> {
    /** The selectable buttons. */
    items: Array<FlexWrapButtonRadioItem<T>>
    /** Currently selected value. */
    value: T
    /** Fired with the chosen value when a button is selected. */
    onChange: (value: T) => void
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
     * (`[select | 🗑 | ⋮]`) — touching, a full-height separator at every seam,
     * rounded only at the two outer ends — instead of a detached button floating
     * beside the pill. Return the action `<Button>`s as an ARRAY (with `key`s) so
     * each is an individual segment the group can rounded/separate — NOT wrapped in
     * a fragment (a fragment counts as one child and the per-button separator
     * injection would misfire). Omit for a plain single-select row (default —
     * matches every existing caller's output). The actions are SIBLINGS of the
     * select button (a `<Button>` can't nest another interactive element), so a
     * click on one never changes the selection.
     */
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => ReactNode
}

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap
 * to the next line, never scroll). Every option is a real HeroUI `<Button>`:
 * standalone, selected = filled `tertiary` (NEUTRAL, not accent — a facet/config
 * toggle isn't a CTA), unselected = hollow `ghost` — clean, no own surface (the
 * parent card, or the bare page, is the surface). NEVER `primary` here — a config row commonly
 * sits on the SAME surface as the page's one accent CTA, and a solid-primary
 * selected pill would compete with it (1 accent-solid / surface, Von Restorff —
 * `accent-system`).
 *
 * When `itemAction` is supplied, each item instead renders as one connected
 * {@link ButtonGroup} — the select button + its action button(s) touching, only
 * the two outer ends rounded (`[select | 🗑 | ⋮]`). No bordered frame: the button
 * VARIANTS carry the look — EVERY segment is filled `--default` so the cluster
 * reads as one solid control (the select pill is `secondary` = default fill +
 * accent text when chosen, else `tertiary` = default fill + neutral text — NOT a
 * hollow `ghost`, which would leave the unselected label floating on the page; the
 * action buttons are `tertiary` too). The seam is HeroUI's own
 * `ButtonGroup.Separator`, recoloured to the `--border` token (`!bg-border
 * !opacity-100`, overriding its default muddy `bg-current opacity-15`) so it
 * matches every other divider in the app. Because `.button` is
 * `position: relative`, the separator MUST live INSIDE the button that follows the
 * seam (its `left: -1px` then bites that button's left edge); so the component
 * injects one at the head of each action button's children — callers just return
 * plain `<Button>`s. Overridden to FULL height (`!top-0 !h-full`) from HeroUI's
 * default 50%.
 *
 * `role="group"` + `aria-pressed` per button (single-select toggle group). For a
 * grid with description/badge use `SelectableCardGroup`.
 *
 * @param props - {@link FlexWrapButtonRadioProps}
 * @see Story: .storybook/stories/blocks/navigation/FlexWrapButtonRadio/FlexWrapButtonRadio.stories
 */
export const FlexWrapButtonRadio = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    trailing,
    itemAction,
    className,
}: FlexWrapButtonRadioProps<T>) => {
    return (
        <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className)}>
            {items.map((item) => {
                const selected = item.value === value
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
                            onPress={() => onChange(item.value)}
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
                // INSIDE the following button — see the class doc), full-height.
                return (
                    <ButtonGroup key={item.value} size="sm" className="w-fit">
                        <Button
                            size="sm"
                            variant={selected ? "secondary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => onChange(item.value)}
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
