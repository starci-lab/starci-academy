import React from "react"
import { cn } from "@heroui/react"
import { XCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CrossListCard}. */
export interface CrossListCardProps extends WithClassNames<undefined> {
    /** The list rows — typically {@link CrossListItem} elements. */
    children: ReactNode
    /**
     * Renders `border border-default` **instead of** `shadow-surface` — when this
     * list sits NESTED inside another surface (modal / drawer / panel body).
     * Same rule as {@link import("../CheckListCard").CheckListCard}. Default `false`
     * keeps the top-level shadow look.
     */
    bordered?: boolean
}

/**
 * The NEGATIVE mirror of {@link import("../CheckListCard").CheckListCard}: same
 * bounded `bg-surface` list card with full-bleed dividers, but each row carries a
 * muted cross (`XCircleIcon`, `text-muted`) instead of a success check — for
 * "things NOT included / not available / excluded" briefs (e.g. features a pricing
 * tier does NOT get, limitations, missing prerequisites). Read-only; for clickable
 * rows use `SurfaceListCard`.
 *
 * @param props - See {@link CrossListCardProps}.
 */
export const CrossListCard = ({ children, bordered = false, className }: CrossListCardProps) => (
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

/** Props for {@link CrossListItem}. */
export interface CrossListItemProps {
    /**
     * Show the leading muted cross (`XCircleIcon`, `text-muted`). Default `true`.
     * Pass `false` for a plain row with no leading mark.
     */
    showCross?: boolean
    /** Row body — plain text (`<Typography>`) or `<MarkdownContent>`. */
    children: ReactNode
}

/**
 * One row of a {@link CrossListCard}: an optional leading muted cross followed by a
 * free body. Rows are divided by a full-bleed separator (the last row hides it).
 *
 * @param props - See {@link CrossListItemProps}.
 */
export const CrossListItem = ({ showCross = true, children }: CrossListItemProps) => (
    <li className="relative flex items-start gap-3 px-4 py-4 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden">
        {showCross ? (
            <XCircleIcon
                aria-hidden
                focusable="false"
                className="size-5 shrink-0 text-muted"
            />
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
    </li>
)
