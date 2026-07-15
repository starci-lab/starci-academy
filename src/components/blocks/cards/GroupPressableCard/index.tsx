"use client"

import React, { useEffect } from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PressableCard } from "@/components/blocks/cards/PressableCard"

/**
 * Column count per CONTAINER width — these are container queries, not viewport
 * breakpoints. A block cannot know where it is placed: the same grid may sit in a
 * full page column or in a 256px rail, and a viewport breakpoint gets the rail
 * case wrong every time (wide window + narrow slot = cards crushed to a sliver).
 * Steps mirror Tailwind v4's container sizes, so the key IS the class suffix.
 */
export interface GroupPressableCardColumns {
    /** Columns at the narrowest. Defaults to `1`. */
    base?: 1 | 2
    /** From a 24rem / 384px container. */
    sm?: 2 | 3 | 4
    /** From a 28rem / 448px container. */
    md?: 2 | 3 | 4
    /** From a 32rem / 512px container. */
    lg?: 2 | 3 | 4
    /** From a 36rem / 576px container. */
    xl?: 2 | 3 | 4
    /** From a 48rem / 768px container. */
    xl3?: 2 | 3 | 4
    /** From a 56rem / 896px container. */
    xl4?: 2 | 3 | 4
}

/** One pressable card inside a {@link GroupPressableCard}. */
export interface GroupPressableCardItem {
    /** Stable React key. Also fixes the item's position for the 1–N shortcut. */
    key: string
    /** Card body — composed freely by the caller (icon tiles, text, chips…). */
    content: ReactNode
    /** Press handler. Ignored when {@link GroupPressableCardItem.href} is set. */
    onPress?: () => void
    /** Navigation target — renders this card as an anchor. */
    href?: string
    /** Dims the card and blocks both pressing and the keyboard shortcut. */
    isDisabled?: boolean
    /** Accessible name — needed only when {@link GroupPressableCardItem.content} carries no readable text. */
    label?: string
    /**
     * Forwarded to this card's own `className` — for grid placement (`@lg:col-start-2`
     * to pin a lone card to the right column) and for tile-level tweaks on top of
     * the `PressableCard` surface (a tighter `rounded-xl px-3 py-2` rating tile).
     *
     * Placement classes must use the **container** variant (`@lg:`), NOT the viewport
     * one (`lg:`), and must name the SAME step at which
     * {@link GroupPressableCardProps.columns} actually reaches that column — a
     * `col-start-2` that outruns the column count lands in an implicit,
     * content-sized track and squeezes the card to a sliver.
     */
    className?: string
}

/** Props for the {@link GroupPressableCard} block. */
export interface GroupPressableCardProps extends WithClassNames<undefined> {
    /** The cards, in reading order (also the 1–N shortcut order). */
    items: Array<GroupPressableCardItem>
    /**
     * Accessible name for the whole group — REQUIRED. Without it a screen reader
     * hears N loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /** Responsive column count. Defaults to a single column. */
    columns?: GroupPressableCardColumns
    /** Gap between cards on the spacing scale. Defaults to `3`. */
    gap?: 2 | 3
    /**
     * Binds number keys `1`–`N` to the items in order, so the group can be driven
     * without the mouse. Off by default — only opt in where the group IS the
     * screen's primary action (e.g. a flashcard rating bar), never for an
     * incidental grid of navigation tiles that would hijack digits globally.
     */
    keyboardShortcut?: boolean
}

// Compact grid cell, not a standalone top-level card: one nấc down from
// `PressableCard`'s own `rounded-3xl`/`shadow-surface` default (concentric
// radius: card 24px − 1 step → 16px) and one nấc UP from the flat button /
// `shadow-field` input — `GroupPressableCard` is the ONLY place this chrome
// lives; `PressableCard` used standalone (a real full-size card, e.g.
// `ConsultantCard`) keeps its own bigger default untouched.
const TILE_CHROME = "rounded-2xl shadow-field"

// Tailwind needs LITERAL class strings — `@sm:grid-cols-${n}` interpolation is
// never emitted by the compiler, so each supported count maps to a written-out
// class. The `@` prefix = container query (Tailwind v4 core, no plugin).
/** Grid template per base column count. */
const BASE_COLUMNS_CLASS: Record<1 | 2, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
}
/** Container-step key → its literal class map, applied in ascending width order. */
const STEP_COLUMNS_CLASS: Record<
    Exclude<keyof GroupPressableCardColumns, "base">,
    Record<2 | 3 | 4, string>
> = {
    sm: { 2: "@sm:grid-cols-2", 3: "@sm:grid-cols-3", 4: "@sm:grid-cols-4" },
    md: { 2: "@md:grid-cols-2", 3: "@md:grid-cols-3", 4: "@md:grid-cols-4" },
    lg: { 2: "@lg:grid-cols-2", 3: "@lg:grid-cols-3", 4: "@lg:grid-cols-4" },
    xl: { 2: "@xl:grid-cols-2", 3: "@xl:grid-cols-3", 4: "@xl:grid-cols-4" },
    xl3: { 2: "@3xl:grid-cols-2", 3: "@3xl:grid-cols-3", 4: "@3xl:grid-cols-4" },
    xl4: { 2: "@4xl:grid-cols-2", 3: "@4xl:grid-cols-3", 4: "@4xl:grid-cols-4" },
}
/** Ascending container-step order — later steps must win, so emit them in width order. */
const STEP_ORDER = ["sm", "md", "lg", "xl", "xl3", "xl4"] as const
/** Gap class per supported spacing step. */
const GAP_CLASS: Record<2 | 3, string> = {
    2: "gap-2",
    3: "gap-3",
}

/**
 * A grid of `PressableCard`s that act and then get out of the way — the whole
 * group is ONE labelled unit (`role="group"` + `aria-label`), each cell is a
 * canonical `PressableCard`, and the cards' bodies stay the caller's to compose.
 *
 * Exists because a bare `<div className="grid">` of cards leaves a screen reader
 * hearing N loose buttons with nothing tying them together, and because the same
 * responsive-grid + keyboard plumbing was being hand-rolled at every call site.
 *
 * Reflows on the CONTAINER's width, not the viewport's ({@link GroupPressableCardColumns}) —
 * a reusable block does not know whether it was dropped into a full page column or
 * a 256px rail, and a viewport breakpoint reads a wide window as "I have room" even
 * when the actual slot is a sliver.
 *
 * **Not a selection control.** Nothing here stays "chosen": press a card and the
 * surface acts (grade the card, open the page) — so these are ACTIONS, not radios.
 * When the pick must PERSIST and read back as "this is my choice", use
 * `SelectableCardGroup` instead (a real HeroUI `RadioGroup`: `value`/`onChange`,
 * accent outline on the selected card, arrow-key roving). Deliberately no
 * `selected` prop here — that boundary is the whole point of two blocks.
 *
 * @param props - {@link GroupPressableCardProps}
 */
export const GroupPressableCard = ({
    items,
    ariaLabel,
    columns = {},
    gap = 3,
    keyboardShortcut = false,
    className,
}: GroupPressableCardProps) => {
    // `items` is typically rebuilt inline by the caller (`options.map(...)`), so a
    // fresh array arrives every render. Reading it through a ref keeps the window
    // listener subscribed ONCE instead of tearing down and re-adding on each pass,
    // while the handler still sees the current items.
    const itemsRef = React.useRef(items)
    useEffect(() => {
        itemsRef.current = items
    }, [items])

    // Press 1–N to act without reaching for the mouse. Opt-in: the listener is
    // on `window`, so a group that isn't the screen's main action would steal
    // every digit the page sees.
    useEffect(() => {
        if (!keyboardShortcut) {
            return
        }
        const onKeyDown = (event: KeyboardEvent) => {
            // never hijack a digit the user is typing into a field
            const target = event.target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return
            }
            const position = Number(event.key) - 1
            const current = itemsRef.current
            if (!Number.isInteger(position) || position < 0 || position >= current.length) {
                return
            }
            const item = current[position]
            if (item.isDisabled || !item.onPress) {
                return
            }
            event.preventDefault()
            item.onPress()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [keyboardShortcut])

    // an empty group would announce a label with nothing under it
    if (items.length === 0) {
        return null
    }

    return (
        // The `@container` wrapper is NOT decorative: an element cannot query its
        // own size, so the queried grid must live inside the container it reacts to.
        <div className={cn("@container", className)}>
            <div
                role="group"
                aria-label={ariaLabel}
                className={cn(
                    "grid",
                    GAP_CLASS[gap],
                    BASE_COLUMNS_CLASS[columns.base ?? 1],
                    STEP_ORDER.map((step) => {
                        const count = columns[step]
                        return count === undefined ? undefined : STEP_COLUMNS_CLASS[step][count]
                    }),
                )}
            >
                {items.map((item) => (
                    <PressableCard
                        key={item.key}
                        onPress={item.onPress}
                        href={item.href}
                        isDisabled={item.isDisabled}
                        label={item.label}
                        className={cn(TILE_CHROME, item.className)}
                    >
                        {item.content}
                    </PressableCard>
                ))}
            </div>
        </div>
    )
}
