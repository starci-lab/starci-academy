"use client"

import React from "react"
import type { CSSProperties, ReactNode } from "react"
import { Button, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Selected-state colour token. */
export type FlexWrapButtonRadioColor = "accent" | "success" | "danger" | "warning"

/** Selected border class per colour (card-styled mode, `insideCard={false}`). */
const SELECTED_BORDER: Record<FlexWrapButtonRadioColor, string> = {
    accent: "border-accent",
    success: "border-success",
    danger: "border-danger",
    warning: "border-warning",
}

/** CSS colour variable per colour token (for the selected `--button-bg` tint). */
const COLOR_VAR: Record<FlexWrapButtonRadioColor, string> = {
    accent: "--accent",
    success: "--success",
    danger: "--danger",
    warning: "--warning",
}

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
    /** Selected-state colour. Defaults to `accent`. */
    color?: FlexWrapButtonRadioColor
    /**
     * Whether this selector sits INSIDE a card already:
     * - `true` — native HeroUI variants (selected = `primary`, else `tertiary`).
     *   Clean buttons, no surface of their own (the parent card is the surface).
     * - `false` (default) — standalone: each option is a card-styled `<Button>`
     *   (`bg-surface` + border); the selected one is `bg-<color>/10` + `border-<color>`.
     *   Still a real `<Button>` (consistent height), just given its own surface.
     */
    insideCard?: boolean
    /**
     * Optional trailing node placed after the buttons in the SAME wrap row (e.g. a
     * "+N" overflow button). Not part of the group's value — it's an action.
     */
    trailing?: ReactNode
    /**
     * Optional per-item trailing action rendered as a SIBLING of the item's button
     * (not nested inside it — a `<Button>` can't contain another interactive
     * element). When provided, each item renders as `[button][action]`. Use for a
     * per-item menu trigger (e.g. edit/delete). Omit for a plain single-select row
     * (default — matches every existing caller's output exactly).
     */
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => ReactNode
}

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap to
 * the next line, never scroll). Every option is a real HeroUI `<Button>` (fixed
 * height, so a text-only `trailing` lines up with icon-bearing options). Two looks
 * via `insideCard`:
 *
 * - `insideCard={true}` — native `primary`/`tertiary` variants (use when the group
 *   already sits inside a card).
 * - `insideCard={false}` (default) — card-styled buttons (`bg-surface` + border,
 *   selected `bg-<color>/10` + `border-<color>`). HeroUI buttons drive their fill
 *   via the `--button-bg` CSS var, so the surface/tint is set through inline style
 *   (a `border` utility adds the outline; the base button has none).
 *
 * `role="group"` + `aria-pressed` per button (single-select toggle group). Sibling
 * of `FlexWrapCardRadio` (a true `RadioGroup` of boxed cards). For a grid with
 * description/badge use `SelectableCardGroup`.
 *
 * @param props - {@link FlexWrapButtonRadioProps}
 */
export const FlexWrapButtonRadio = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    color = "accent",
    insideCard = false,
    trailing,
    itemAction,
    className,
}: FlexWrapButtonRadioProps<T>) => {
    const colorVar = COLOR_VAR[color]
    return (
        <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className)}>
            {items.map((item) => {
                const selected = item.value === value
                let button: ReactNode
                if (insideCard) {
                    button = (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={selected ? "primary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => onChange(item.value)}
                        >
                            {item.content}
                        </Button>
                    )
                } else {
                    // card-styled <Button>: bg-surface lifted by a SHADOW (matches the global
                    // card flip — shadow instead of an unselected border; shadow-surface is
                    // transparent in dark mode, same as cards). Selected = bg-<color>/10 + a
                    // colored border as the selection signal. HeroUI fill = var(--button-bg) →
                    // override it via inline style (utility bg loses to it).
                    const style = (selected
                        ? {
                            "--button-bg": `color-mix(in oklab, var(${colorVar}) 10%, transparent)`,
                            "--button-bg-hover": `color-mix(in oklab, var(${colorVar}) 14%, transparent)`,
                        }
                        : {
                            "--button-bg": "var(--surface)",
                            "--button-bg-hover": "var(--default)",
                        }) as CSSProperties
                    button = (
                        <Button
                            key={item.value}
                            size="sm"
                            variant="ghost"
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => onChange(item.value)}
                            style={style}
                            className={cn("shadow-surface", selected && cn("border", SELECTED_BORDER[color], "font-medium"))}
                        >
                            {item.content}
                        </Button>
                    )
                }
                if (!itemAction) {
                    return button
                }
                // per-item action is a SIBLING of the button (not nested inside it —
                // a <Button> can't contain another interactive element).
                return (
                    <div key={item.value} className="flex items-center gap-1">
                        {button}
                        {itemAction(item)}
                    </div>
                )
            })}
            {trailing}
        </div>
    )
}
