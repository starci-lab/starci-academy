import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CheckListCard}. */
export interface CheckListCardProps extends WithClassNames<undefined> {
    /** The list rows — typically {@link CheckListItem} elements. */
    children: ReactNode
    /**
     * Renders `border border-default` **instead of** `shadow-surface` — when this
     * list sits NESTED inside another surface (modal / drawer / panel body).
     * Shadow is invisible on `bg-surface` (surface-in-surface); use border to
     * delineate. Same rule as `SurfaceListCard bordered`. Default `false` keeps
     * the top-level shadow look.
     */
    bordered?: boolean
}

/**
 * Static "list card" surface (see `elements/card.md` §3b): one bounded `bg-surface`
 * card whose rows are separated by full-bleed dividers (the `Accordion
 * variant="surface"` look, but static — no expand, no click). Pair it with a
 * `LabeledCard frameless` for the section label (label outside — no card-in-card).
 *
 * **Surface-in-surface:** inside a modal/drawer, pass `bordered` (viền, không
 * shadow). Top-level on the page → omit `bordered` (shadow).
 *
 * For clickable rows use `SurfaceListCard` instead — this one is for read-only
 * brief lists (value props, expected outputs, prerequisites…).
 *
 * @param props - See {@link CheckListCardProps}.
 */
export const CheckListCard = ({ children, bordered = false, className }: CheckListCardProps) => (
    <ul
        className={cn(
            "overflow-hidden rounded-3xl bg-surface",
            bordered ? "border border-default" : "shadow-surface",
            className,
        )}
    >
        {children}
    </ul>
)

/** Props for {@link CheckListItem}. */
export interface CheckListItemProps {
    /**
     * Show the leading success check (`CheckCircleIcon`, `text-success-soft-foreground`). Default
     * `true`. Pass `false` for "things you need beforehand" lists (prerequisites) —
     * those are requirements, NOT achievements, so they carry no tick.
     */
    showCheck?: boolean
    /** Row body — plain text (`<Typography>`) or `<MarkdownContent>`. */
    children: ReactNode
}

/**
 * One row of a {@link CheckListCard}: an optional leading success check followed by a
 * free body. Rows are divided by a full-bleed separator (the last row hides it) —
 * surface-in-surface also keeps separators edge-to-edge.
 *
 * @param props - See {@link CheckListItemProps}.
 */
export const CheckListItem = ({ showCheck = true, children }: CheckListItemProps) => (
    <li className="relative flex items-start gap-3 p-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden">
        {showCheck ? (
            <CheckCircleIcon
                aria-hidden
                focusable="false"
                className="size-5 shrink-0 text-success-soft-foreground"
            />
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
    </li>
)
