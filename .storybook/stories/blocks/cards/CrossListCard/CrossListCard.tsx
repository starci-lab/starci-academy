import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import { surfaceFrame } from "../surface-card-header"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the MERGED marked-list card, keeping the established
 * name `CrossListCard` (thầy 2026-07-22: "có CrossListCard rồi giữ tên đó, đừng đẻ tên
 * mới"). The old `CheckListCard` folds in — they were identical bar one icon, so the
 * mark lives on the ITEM (`CrossListItem mark="check"|"cross"|"none"`) and ONE list can
 * mix included (✓) and excluded (✗) rows. Synced to `src` later — `src` should likewise
 * collapse `CheckListCard` into this `CrossListCard`.
 */

/** Per-row mark: success check · muted cross · none. */
export type ListMark = "check" | "cross" | "none"

/** Props for {@link CrossListCard}. */
export interface CrossListCardProps {
    /** The rows — typically {@link CrossListItem} elements. */
    children: ReactNode
    /**
     * `border border-default` instead of `shadow-surface` — for a list NESTED inside
     * another surface (modal/drawer/panel) where the shadow is invisible. Default `false`.
     */
    bordered?: boolean
    /** Extra classes on the list root. */
    className?: string
}

/**
 * Static "brief list" of MARKED rows (✓ / ✗ / none) in a bounded `bg-surface` card with
 * full-bleed dividers — a single list can mix marks (e.g. a plan's included ✓ and excluded
 * ✗ features). Read-only; for CLICKABLE rows use `SurfaceListCard`.
 *
 * @param props - {@link CrossListCardProps}
 */
export const CrossListCard = ({ children, bordered = false, className }: CrossListCardProps) => (
    <ul className={cn("overflow-hidden", surfaceFrame(bordered), className)}>{children}</ul>
)

const MARK_ICON: Record<ListMark, ReactNode> = {
    check: <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />,
    cross: <XCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />,
    none: null,
}

/** Props for {@link CrossListItem}. */
export interface CrossListItemProps {
    /**
     * Leading mark: `"check"` (success ✓, for included/done), `"cross"` (muted ✗, for
     * excluded/unavailable), or `"none"` (a plain row). Default `"check"`.
     */
    mark?: ListMark
    /** Row body — plain text (`<Typography>`) or markdown. */
    children: ReactNode
}

/**
 * One row of a {@link CrossListCard}: an optional leading mark + a free body, `p-3` with
 * a full-bleed separator (the last row hides it).
 *
 * @param props - {@link CrossListItemProps}
 */
export const CrossListItem = ({ mark = "check", children }: CrossListItemProps) => (
    <li className="relative flex items-start gap-3 p-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden">
        {MARK_ICON[mark]}
        <div className="min-w-0 flex-1">{children}</div>
    </li>
)
