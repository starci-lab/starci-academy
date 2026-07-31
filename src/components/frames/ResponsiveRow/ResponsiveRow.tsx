import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { GAP_CLASS, type SeamScale } from "@/components/frames/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (frame) — `ResponsiveRow.*`: a repeat-list row that is a FIXED grid below
 * a container step and an EQUAL-SHARE flex row from it up. One member, `ResponsiveRow`.
 *
 * WHY THIS EXISTS (§13z, 2026-07-29). `StatRibbon` needs BOTH shapes on the same row: a
 * padded 2-column grid on a narrow shell, and — from `@app-sm` — one un-padded row where
 * N cells share the width evenly and a `border-l` marks the seam between them instead of a
 * gap. Neither existing frame covers this: `Grid` is always `display:grid` with a FIXED
 * column count, so 2 items in a 4-column grid leave two tracks empty instead of sharing the
 * row; `Flex`/`Stack` is always one display type, with no per-step switch at all. Measured
 * that day: exactly one call-site needed this (`StatRibbon`), so the frame stays narrow —
 * one switch step, one gap, columns capped at what a narrow shell can actually hold.
 *
 * FRAME API LAW (§13b) — REPEATING LIST ⇒ `items` DATA, `children` FORBIDDEN, same
 * contract as `Grid`/`Cluster`: every cell is the same kind of thing.
 *
 * WHY NO GAP ABOVE THE SWITCH STEP: a divided row (`border-l` between cells) has ONE seam
 * mechanism, not two — a `gap` AND a border would double the visible space on every cell
 * boundary. The row goes flush (`gap-0`) once flex takes over; the caller marks the seam
 * with a border on its own cell content instead (§10a: a divided row owns its rhythm with
 * a border, not a gap it would then have to strip off the first/last cell by hand).
 *
 * CONTAINER QUERIES, NOT VIEWPORT: same reasoning as `Grid` (see that file's header) —
 * `@app-sm/md/lg` answer the nearest `@container`, not the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One cell of a {@link ResponsiveRow}. */
export interface ResponsiveRowItem {
    /** Stable React key. */
    key: string
    /** The cell's content, fully built by the caller (§13b: the frame places, never styles). */
    content: ReactNode
}

/**
 * Container step the row leaves the grid for the flex row at.
 *
 * The shared width-switch scale for the frame tier — any frame naming the container step it
 * changes shape at (FRAME-10) reuses this union rather than minting its own. `xl` exists for
 * `SplitWorkspace`, whose real `src` sources both switch at `@app-xl`.
 */
export type ResponsiveRowSwitch = "sm" | "md" | "lg" | "xl"

/** Props for {@link ResponsiveRow}. */
export interface ResponsiveRowProps {
    /**
     * The cells, in reading order. REQUIRED — repeat list = DATA, never children (§13b).
     */
    items: ReadonlyArray<ResponsiveRowItem>
    /**
     * Grid column count BELOW `at`. Capped at `1 | 2` — a narrow shell wide enough for a
     * 3+ column grid is wide enough for the flex row instead, so a caller needing more
     * belongs on `Grid`, not here.
     */
    columns: 1 | 2
    /** Container step the row switches from the fixed grid to the equal-share flex row at. */
    at: ResponsiveRowSwitch
    /** Seam BELOW `at` (the grid gap). At/above `at` the row goes flush — see the file header. */
    gap: SeamScale
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** Grid column count → literal class. Tailwind never emits an interpolated `grid-cols-${n}`. */
const COLUMNS_CLASS: Record<1 | 2, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
}

/**
 * Switch step → the literal classes that flip the row from grid to flex from that step up.
 * Written out per step for the same reason `Grid`'s own tables are: Tailwind never emits an
 * interpolated `@app-${step}:flex`.
 */
const SWITCH_CLASS: Record<ResponsiveRowSwitch, string> = {
    sm: "@app-sm:flex @app-sm:items-stretch @app-sm:gap-0",
    md: "@app-md:flex @app-md:items-stretch @app-md:gap-0",
    lg: "@app-lg:flex @app-lg:items-stretch @app-lg:gap-0",
    xl: "@app-xl:flex @app-xl:items-stretch @app-xl:gap-0",
}

/**
 * The grid-below/flex-above row. See the file header for why it exists and what it
 * deliberately does not cover.
 *
 * @param props - {@link ResponsiveRowProps}
 */
const ResponsiveRowBase = ({
    items,
    columns,
    at,
    gap,
    className,
    classNames,
}: ResponsiveRowProps) => (
    <div
        className={cn(
            "grid",
            COLUMNS_CLASS[columns],
            GAP_CLASS[gap],
            SWITCH_CLASS[at],
            className,
            classNames,
        )}
    >
        {items.map((item) => (
            <React.Fragment key={item.key}>{item.content}</React.Fragment>
        ))}
    </div>
)

/**
 * `ResponsiveRow.*` — the grid-below/flex-above frame namespace. Namespace only — no bare
 * component export (§13a).
 */
export { ResponsiveRowBase as ResponsiveRow }
