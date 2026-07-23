import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/Legend`. Authored in Storybook (not `src`); synced
 * to `src` later.
 */

/**
 * Resolve a swatch `color` into the right paint channel: a Tailwind `bg-*`
 * utility class is applied as a className; anything else (a raw hex, `var(--…)`,
 * `rgb(…)`, …) is applied as an inline `backgroundColor` — same dual-mode
 * handling as `DotChip`.
 */
const resolveDotColor = (color: string): { className?: string; style?: React.CSSProperties } =>
    color.startsWith("bg-")
        ? { className: color }
        : { style: { backgroundColor: color } }

/** One legend entry: a colour swatch + its label (+ an optional trailing value). */
export interface LegendItem {
    /** Stable key. */
    key: string
    /** Label shown next to the swatch. */
    label: ReactNode
    /** Swatch colour — a Tailwind `bg-*` class OR a raw colour value (`var(--success)`, `#3178c6`). */
    color: string
    /**
     * Optional trailing value printed after the label in the SAME muted line
     * (e.g. a `·� 12` count or a `40%` share). Omit for a bare label.
     */
    suffix?: ReactNode
}

/** Props for the {@link Legend} block. */
export interface LegendProps {
    /** Entries to render, in order. */
    items: Array<LegendItem>
    /**
     * Layout of the entries. `"row"` (default) is a `flex-wrap` row that wraps to
     * new lines when narrow; `"col"` stacks entries vertically.
     */
    direction?: "row" | "col"
    /** Extra classes on the root element. */
    className?: string
}

/**
 * Standalone colour legend — a `flex-wrap` row (or vertical stack) of `dot +
 * label + optional trailing value`, matching the legend a {@link SegmentBar} or
 * {@link CourseProgressBar} renders under itself. Each entry's `color` accepts a
 * Tailwind `bg-*` class or a raw colour value, and an optional `suffix` prints a
 * count/share after the label. Pure/props-only.
 *
 * @param props - {@link LegendProps}
 */
export const Legend = ({ items, direction = "row", className }: LegendProps) => {
    return (
        <div
            className={cn(
                direction === "col"
                    ? "flex flex-col gap-2"
                    : "flex flex-wrap gap-x-3 gap-y-2",
                className,
            )}
        >
            {items.map((item) => {
                const dot = resolveDotColor(item.color)
                return (
                    <div key={item.key} className="flex items-center gap-2">
                        <span
                            aria-hidden
                            style={dot.style}
                            className={cn("size-2.5 shrink-0 rounded-full", dot.className)}
                        />
                        <Typography type="body-xs" color="muted">
                            {item.label}
                            {item.suffix}
                        </Typography>
                    </div>
                )
            })}
        </div>
    )
}
