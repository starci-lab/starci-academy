import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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

export const Legend = ({
    items,
    direction = "row",
    isSkeleton = false,
    skeletonCount = 3,
    classNames,
}: LegendProps) => {
    return (
        <div
            className={cn(
                direction === "col"
                    ? "flex flex-col gap-2"
                    : "flex flex-wrap gap-x-3 gap-y-2",
                classNames,
            )}

            data-tier="composite"
            data-component="Legend"
            data-principles={direction === "col" ? "sibling-stack" : undefined}
        >
            {isSkeleton
                ? Array.from({ length: skeletonCount }, (_unused, index) => (
                    <StackH
                        key={index}
                        gap={3}
                        isSkeleton={isSkeleton}
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
                            gap={3}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <span
                                        aria-hidden
                                        style={dot.style}
                                        className={cn("size-2.5 shrink-0 rounded-full", dot.className)}
                                    />
                                ),
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={`${item.label}${item.suffix ?? ""}`} />,
                            ]}
                        />
                    )
                })}
        </div>
    )
}
