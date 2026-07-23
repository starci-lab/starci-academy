import React, { useEffect } from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import { PressableCard } from "../PressableCard/PressableCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { type VerdictBand, verdictBandClassName } from "../verdict-band"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/GroupPressableCard`. Authored in Storybook (not
 * `src`); synced back to `src` later.
 */

/**
 * Column count per CONTAINER width — these are container queries, not viewport
 * breakpoints. A block cannot know where it is placed: the same grid may sit in a
 * full page column or in a 256px rail. Steps mirror Tailwind v4's container sizes.
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
    /**
     * Named icon slot — TRẦN (no size/color className). The primitive owns sizing
     * (§4/§5a: tile body defaults to `body-sm`/`text-sm` → `size-5`) + muted color
     * in ONE place, instead of every call-site hand-setting `className="size-5
     * text-muted"` on its own icon.
     */
    icon?: ReactNode
    /** Where {@link GroupPressableCardItem.icon} sits relative to `content`. Defaults to `"leading"`. */
    iconPosition?: "leading" | "trailing"
    /** Card body — composed freely by the caller (text, chips…). */
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
     * Forwarded to this card's own `className` — for grid placement (`@lg:col-start-2`)
     * and for tile-level tweaks on top of the `PressableCard` surface. Placement
     * classes must use the **container** variant (`@lg:`), NOT the viewport one.
     */
    className?: string
    /**
     * Verdict variant: a LEFT band marking this tile with a signal that comes from
     * DATA (`card.md` §3i) — the canonical {@link VerdictBand}, SAME shape as
     * `SectionCard`/`SurfaceListCardItem`.
     */
    withVerdict?: VerdictBand
    /**
     * `true` → mark this tile as the CHOSEN one in a selectable grid — an accent
     * `ring-2` around the card (via `PressableCard.isSelected`). Use when the grid
     * is a single/multi-select chooser instead of a fire-and-forget action grid.
     */
    selected?: boolean
}

/** Props for the {@link GroupPressableCard} block. */
export interface GroupPressableCardProps {
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
     * screen's primary action (e.g. a flashcard rating bar).
     */
    keyboardShortcut?: boolean
    /**
     * `true` → render a skeleton mirror grid (same columns/gap/tile chrome, one
     * placeholder tile per item) instead of live cards. Consumer just flips the
     * flag — same as base Button/ButtonGroup's `isSkeleton`.
     */
    isSkeleton?: boolean
    /** Extra classes on the container wrapper. */
    className?: string
}

// Compact grid cell, not a standalone top-level card: one nấc down from
// `PressableCard`'s own `rounded-3xl`/`shadow-surface` default (concentric
// radius: card 24px − 1 step → 16px) and one nấc UP from the flat button.
const TILE_CHROME = "rounded-2xl shadow-field"

// Tailwind needs LITERAL class strings — `@sm:grid-cols-${n}` interpolation is
// never emitted by the compiler, so each supported count maps to a written-out class.
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

/** Grid classes shared by the live grid AND its skeleton mirror — one place, one shape. */
const gridClassName = (columns: GroupPressableCardColumns, gap: 2 | 3) =>
    cn(
        "grid",
        GAP_CLASS[gap],
        BASE_COLUMNS_CLASS[columns.base ?? 1],
        STEP_ORDER.map((step) => {
            const count = columns[step]
            return count === undefined ? undefined : STEP_COLUMNS_CLASS[step][count]
        }),
    )

// §5a: tile body defaults to body-sm/text-sm → icon size-5, muted (list-icon convention).
// Forced HERE (descendant selector) so no call-site ever hand-sets icon size/color again.
const ITEM_ICON_CLS = "shrink-0 [&_svg]:size-5 [&_svg]:shrink-0 text-muted"

/** Composes the named `icon` slot (if any) with `content`, owning layout + icon sizing. */
const itemBody = (item: GroupPressableCardItem) => {
    if (!item.icon) {
        return item.content
    }
    const iconSlot = <span className={ITEM_ICON_CLS}>{item.icon}</span>
    return (
        <div className="flex items-center gap-3">
            {item.iconPosition === "trailing" ? null : iconSlot}
            <div className="min-w-0 flex-1">{item.content}</div>
            {item.iconPosition === "trailing" ? iconSlot : null}
        </div>
    )
}

/**
 * One skeleton placeholder tile — mirrors {@link TILE_CHROME} + the standard
 * ProfileCard content shape (avatar + title + description), so the loading grid
 * holds the real shape these card-grids carry (thầy chốt 2026-07-22: skeleton
 * theo pattern ProfileCard).
 */
const GroupPressableCardSkeletonTile = ({ className }: { className?: string }) => (
    <div className={cn(TILE_CHROME, "flex items-center gap-3 p-3", className)}>
        <Skeleton.Avatar size="md" className="shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col">
            <Skeleton.Typography type="body-sm" width="1/3" />
            <Skeleton.Typography type="body-xs" width="2/3" />
        </div>
    </div>
)

/**
 * A grid of `PressableCard`s that act and then get out of the way — the whole
 * group is ONE labelled unit (`role="group"` + `aria-label`), each cell is a
 * canonical `PressableCard`, and the cards' bodies stay the caller's to compose.
 * Reflows on the CONTAINER's width, not the viewport's ({@link GroupPressableCardColumns}).
 *
 * **Two modes.** Default = ACTIONS (press a card and the surface acts — grade, open
 * a page — nothing stays "chosen"). Opt into SELECTION by passing `item.selected`:
 * the chosen tile gets an accent `ring-2` (the card-equivalent of a list row's
 * trailing check) — for a single/multi-select grid (pick a plan, an avatar…).
 *
 * @param props - {@link GroupPressableCardProps}
 */
export const GroupPressableCard = ({
    items,
    ariaLabel,
    columns = {},
    gap = 3,
    keyboardShortcut = false,
    isSkeleton = false,
    className,
}: GroupPressableCardProps) => {
    // Reading `items` through a ref keeps the window listener subscribed ONCE
    // instead of tearing down and re-adding on each render.
    const itemsRef = React.useRef(items)
    useEffect(() => {
        itemsRef.current = items
    }, [items])

    // Press 1–N to act without reaching for the mouse. Opt-in: the listener is on
    // `window`, so a group that isn't the screen's main action would steal digits.
    // Also off while `isSkeleton` — nothing underneath can act yet.
    useEffect(() => {
        if (!keyboardShortcut || isSkeleton) {
            return
        }
        const onKeyDown = (event: KeyboardEvent) => {
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
    }, [keyboardShortcut, isSkeleton])

    // an empty group would announce a label with nothing under it
    if (items.length === 0) {
        return null
    }

    if (isSkeleton) {
        return (
            <div className={cn("@container", className)}>
                <div role="group" aria-label={ariaLabel} className={gridClassName(columns, gap)}>
                    {items.map((item) => (
                        <GroupPressableCardSkeletonTile key={item.key} className={item.className} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        // The `@container` wrapper is NOT decorative: an element cannot query its
        // own size, so the queried grid must live inside the container it reacts to.
        <div className={cn("@container", className)}>
            <div role="group" aria-label={ariaLabel} className={gridClassName(columns, gap)}>
                {items.map((item) => (
                    <PressableCard
                        key={item.key}
                        onPress={item.onPress}
                        href={item.href}
                        isDisabled={item.isDisabled}
                        isSelected={item.selected}
                        label={item.label}
                        className={cn(
                            TILE_CHROME,
                            verdictBandClassName(item.withVerdict),
                            item.className,
                        )}
                    >
                        {itemBody(item)}
                    </PressableCard>
                ))}
            </div>
        </div>
    )
}
