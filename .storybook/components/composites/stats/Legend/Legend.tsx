import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/Legend`. Authored in Storybook (not `src`); synced
 * to `src` later.
 */

/**
 * Resolve a swatch `color` into the right paint channel: a Tailwind `bg-*`
 * utility class is applied as a className; anything else (a raw hex, `var(--…)`,
 * `rgb(…)`, …) is applied as an inline `backgroundColor` — same dual-mode
 * handling as the dot of `Chip` (`dotClassName` vs `dotColor`).
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

/** Props {@link Legend} carries regardless of loading state. */
interface LegendOwnProps {
    /**
     * Layout of the entries. `"row"` (default) is a `flex-wrap` row that wraps to
     * new lines when narrow; `"col"` stacks entries vertically.
     */
    direction?: "row" | "col"
    /** Entry count to shimmer while `isSkeleton`. Defaults to `3`. */
    skeletonCount?: number
    /** Extra classes on the root element. */
    className?: string
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** `true` → tag the dot/label skeleton bars with `data-anat-part="Skeleton"`. */
    showAnatomy?: boolean
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
export const Legend = ({
    items,
    direction = "row",
    isSkeleton = false,
    skeletonCount = 3,
    className,
    anatPart,
    showAnatomy = false,
}: LegendProps) => {
    return (
        <div
            className={cn(
                direction === "col"
                    ? "flex flex-col gap-2"
                    : "flex flex-wrap gap-x-3 gap-y-2",
                className,
            )}
            data-anat-part={anatPart}
        >
            {isSkeleton
                ? Array.from({ length: skeletonCount }, (_unused, index) => (
                    <StackH key={index} gap="related">
                        <HeroSkeleton className="size-2.5 shrink-0 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                        <HeroSkeleton className="h-3 w-16 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                    </StackH>
                ))
                : (items ?? []).map((item) => {
                    const dot = resolveDotColor(item.color)
                    return (
                        <StackH key={item.key} gap="related">
                            <span
                                aria-hidden
                                style={dot.style}
                                className={cn("size-2.5 shrink-0 rounded-full", dot.className)}
                            />
                            <Typography size="xs" color="muted" text={<>{item.label}{item.suffix}</>} />
                        </StackH>
                    )
                })}
        </div>
    )
}
