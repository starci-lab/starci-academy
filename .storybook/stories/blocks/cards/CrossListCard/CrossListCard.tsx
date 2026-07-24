import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import { surfaceFrame } from "../surface-card-header"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

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
    /** The rows — typically {@link CrossListItem} elements. Not needed (ignored) when `isSkeleton`. */
    children?: ReactNode
    /**
     * `border border-default` instead of `shadow-surface` — for a list NESTED inside
     * another surface (modal/drawer/panel) where the shadow is invisible. Default `false`.
     */
    bordered?: boolean
    /** `true` → self-render `skeletonRows` placeholder rows (mark + text mirror) instead of `children`. */
    isSkeleton?: boolean
    /** Number of placeholder rows when `isSkeleton`. Default `3`. */
    skeletonRows?: number
    /** Extra classes on the list root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Static "brief list" of MARKED rows (✓ / ✗ / none) in a bounded `bg-surface` card with
 * full-bleed dividers — a single list can mix marks (e.g. a plan's included ✓ and excluded
 * ✗ features). Read-only; for CLICKABLE rows use `SurfaceListCard`.
 *
 * `isSkeleton` self-renders `skeletonRows` mirror rows (each a {@link CrossListItem} in its
 * own skeleton state) — consumer just flips the flag, no manual `<Skeleton>` assembly.
 *
 * @param props - {@link CrossListCardProps}
 */
export const CrossListCard = ({
    children,
    bordered = false,
    isSkeleton = false,
    skeletonRows = 3,
    className,
    anatPart,
}: CrossListCardProps) => (
    <ul className={cn("overflow-hidden", surfaceFrame(bordered), className)} data-anat-part={anatPart}>
        {isSkeleton
            ? Array.from({ length: skeletonRows }).map((_, index) => <CrossListItem key={index} isSkeleton />)
            : children}
    </ul>
)

/**
 * Tone of the mark — prominence climbs by TONE, the element stays (§2d):
 * `success` (green ✓ signal) · `muted` (recede, text leads) · `danger` (red — a hard
 * NEGATIVE signal: lost/blocked/warning row, not just "not included").
 */
export type MarkTone = "success" | "muted" | "danger"

const TONE_CLS: Record<MarkTone, string> = {
    success: "text-success-soft-foreground",
    muted: "text-muted",
    danger: "text-danger-soft-foreground",
}

const markIcon = (mark: ListMark, tone: MarkTone | undefined, anatPart: string | undefined): ReactNode => {
    if (mark === "check") {
        return (
            <CheckCircleIcon
                aria-hidden
                focusable="false"
                data-anat-part={anatPart}
                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "success"])}
            />
        )
    }
    if (mark === "cross") {
        return (
            <XCircleIcon
                aria-hidden
                focusable="false"
                data-anat-part={anatPart}
                className={cn("size-5 shrink-0", TONE_CLS[tone ?? "muted"])}
            />
        )
    }
    return null
}

/** Props for {@link CrossListItem}. */
export interface CrossListItemProps {
    /**
     * Leading mark: `"check"` (✓ included/done), `"cross"` (muted ✗ excluded), or `"none"`
     * (plain row). Default `"check"`.
     */
    mark?: ListMark
    /**
     * Tone of the mark. Defaults per mark: `check` → `"success"` (green ✓ — a real
     * included/done SIGNAL, e.g. PricingTable), `cross` → `"muted"` (excluded, recede).
     * `"muted"` on a check makes the TEXT lead (value-props INSIDE another card, see
     * `principles.md` §2); `"danger"` marks a hard NEGATIVE row (lost/blocked/warning —
     * e.g. a red ✗ "mất toàn bộ tiến độ"), not mere absence. Ignored for `none`.
     */
    tone?: MarkTone
    /** Row body — plain text (`<Typography>`) or markdown. Not needed (ignored) when `isSkeleton`. */
    children?: ReactNode
    /** `true` → render a skeleton mirror row (mark-sized dot + text bar) instead of `mark`/`children`. */
    isSkeleton?: boolean
    /** Anatomy tag: names this row so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Anatomy tag for the leading mark ICON slot (per-slot — the icon is internal, not a `children` prop). */
    markAnatPart?: string
}

/**
 * One row of a {@link CrossListCard}: an optional leading mark + a free body, `p-3` with
 * a full-bleed separator (the last row hides it).
 *
 * `isSkeleton` self-renders a mirror row (dot sized to the real mark icon + a `body-sm`
 * text bar) inside the SAME `<li>` box, so layout never shifts once data arrives.
 *
 * @param props - {@link CrossListItemProps}
 */
export const CrossListItem = ({
    mark = "check",
    tone,
    children,
    isSkeleton = false,
    anatPart,
    markAnatPart,
}: CrossListItemProps) => (
    <li
        className="relative flex items-start gap-3 p-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        data-anat-part={anatPart}
    >
        {isSkeleton ? (
            <>
                <Skeleton className="size-5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                    <Skeleton.Typography type="body-sm" width="3/4" />
                </div>
            </>
        ) : (
            <>
                {markIcon(mark, tone, markAnatPart)}
                <div className="min-w-0 flex-1">{children}</div>
            </>
        )}
    </li>
)
