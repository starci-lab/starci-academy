import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/composites/stats/Legend`. Authored in Storybook (not `src`); synced
 * to `src` later.
 */

/**
 * Resolve a swatch `color` into the right paint channel: a Tailwind `bg-*`
 * utility class is applied as a className; anything else (a raw hex, `var(--…)`,
 * `rgb(…)`, …) is applied as an inline `backgroundColor` — same dual-mode
 * handling as the dot of `Chip` (`dotClassName` vs `dotColor`).
 */
const resolveDotColor = (color: string): { bgClass?: string; style?: React.CSSProperties } =>
    color.startsWith("bg-")
        ? { bgClass: color }
        : { style: { backgroundColor: color } }

/** One legend entry: a colour swatch + its label (+ an optional trailing value). */
export interface LegendItem {
    /** Stable key. */
    key: string
    /**
     * Label shown next to the swatch. `string`, not `ReactNode` — the composite
     * wraps it in `Typography` itself, so it must be able to build it.
     */
    label: string
    /** Swatch colour — a Tailwind `bg-*` class OR a raw colour value (`var(--success)`, `#3178c6`). */
    color: string
    /**
     * Optional trailing value printed after the label in the SAME muted line
     * (e.g. a "· 12" count or a "40%" share). Omit for a bare label. `string` —
     * see {@link LegendItem.label}.
     */
    suffix?: string
}

/** Props {@link Legend} carries regardless of loading state. */
interface LegendOwnProps {
    /**
     * Layout of the entries. `"row"` (default) is a `flex-wrap` row that wraps to
     * new lines when narrow; `"col"` stacks entries vertically.
     */
    direction?: "row" | "col"
    /** Entry count to shimmer while `isSkeleton`. Defaults to `3`. */
    skeletonCount?: number
    /** `true` → tag the dot/label skeleton bars with ``. */
}

/**
 * Props for the {@link Legend} block. `items` is REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer legend has no real entries to show yet.
 */
export type LegendProps = LegendOwnProps &
    (
        | { isSkeleton: true; items?: Array<LegendItem> }
        | { isSkeleton?: false; items: Array<LegendItem> }
    )

/**
 * Standalone colour legend — a `flex-wrap` row (or vertical stack) of `dot +
 * label + optional trailing value`, matching the legend a {@link SegmentBar} or
 * {@link CourseProgressBar} renders under itself. Each entry's `color` accepts a
 * Tailwind `bg-*` class or a raw colour value, and an optional `suffix` prints a
 * count/share after the label. Pure/props-only.
 *
 * @param props - {@link LegendProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Legend" } as const

/** A standalone dot + label (+ optional value) legend row matching a chart's own legend. */
export const Legend = ({
    items,
    direction = "row",
    isSkeleton = false,
    skeletonCount = 3}: LegendProps) => {
    return (
        <div
            className={cn(
                direction === "col"
                    ? "flex flex-col gap-2"
                    : "flex flex-wrap gap-x-3 gap-y-2")}
            data-tier="composite"
            data-component="Legend"
            data-principle={direction === "col" ? "sibling-stack" : undefined}
        >
            {isSkeleton
                ? Array.from({ length: skeletonCount }, (_unused, index) => (
                    <StackH
                        key={index}
                        principle="icon-text"
                        explain="Swatch hugs its legend label — not name-handle, because this is a colour key not an identity pair."
                        items={[
                            /* ATOM GAP: no swatch/dot atom exists yet, so the dot stays a
                                    real plain span in both states — a neutral flat fill (no
                                    hand-drawn `animate-pulse`, COMPOSITE-10) instead of reaching
                                    for a vendor Skeleton (the same span shape the loaded entry
                                    below draws, just without a real color). */
                            () => (
                                <span
                                    aria-hidden
                                    className="size-2.5 shrink-0 rounded-full bg-default"
                                />
                            ),
                            () => <Typography size="xs" isSkeleton />,
                        ]}
                    />
                ))
                : (items ?? []).map((item) => {
                    const dot = resolveDotColor(item.color)
                    return (
                        <StackH
                            key={item.key}
                            principle="icon-text"
                            explain="Swatch hugs its legend label — not name-handle, because this is a colour key not an identity pair."
                            items={[
                                () => (
                                    <span
                                        aria-hidden
                                        style={dot.style}
                                        className={cn("size-2.5 shrink-0 rounded-full", dot.bgClass)}
                                    />
                                ),
                                () => <Typography size="xs" color="muted" text={`${item.label}${item.suffix ?? ""}`} />,
                            ]}
                        />
                    )
                })}
        </div>
    )
}
