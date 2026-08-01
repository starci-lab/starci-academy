import React from "react"
import { cn } from "@heroui/react"
import { Legend } from "@sb-components/composites/stats/Legend/Legend"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/SegmentBar`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One slice of a {@link SegmentBar}. */
export interface SegmentBarSegment {
    /** Stable key. */
    key: string
    /**
     * Legend label (the name; the count is appended automatically). `string`,
     * not `ReactNode` — the composite renders it itself (inline in the ladder
     * strip, or via {@link Legend} otherwise).
     */
    label: string
    /** Raw count — segment width is its share of the total. */
    value: number
    /** CSS colour for the slice + legend dot (e.g. `var(--success)`). Falls back to a palette. */
    color?: string
}

/** Props {@link SegmentBar} carries regardless of loading state. */
interface SegmentBarOwnProps {
    /** Accessible summary of the whole bar (screen readers read this instead of the slices). */
    ariaLabel: string
    /**
     * Optional denominator. When set, slice widths are `value / max` so the bar
     * fills to the real total (leaving an empty remainder) — use for "progress".
     * Omit for a pure mix bar that always fills 100%.
     */
    max?: number
    /** Hide the legend row under the bar. */
    hideLegend?: boolean
    /**
     * Render a thick "ladder" strip with each slice's label + share (%) printed
     * inline instead of a thin proportion sliver. The legend below then drops its
     * count suffix since the % is already visible on the strip.
     */
    inlineLabels?: boolean
    /**
     * Optional muted takeaway sentence rendered below the legend. `string`, not
     * `ReactNode` — the composite wraps it in `Typography` itself, so it must be
     * able to build it (a pre-built node could not be told it is loading).
     */
    caption?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for the {@link SegmentBar} block. `segments` is REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer bar has no real slices to show yet.
 */
export type SegmentBarProps = SegmentBarOwnProps &
    (
        | { isSkeleton: true; segments?: SegmentBarSegment[] }
        | { isSkeleton?: false; segments: SegmentBarSegment[] }
    )

/** Default slice colours (semantic tokens) when a segment has no explicit `color`. */
const PALETTE = [
    "var(--accent)",
    "var(--success)",
    "var(--warning)",
    "var(--danger)",
    "var(--muted)",
]

/**
 * A GitHub-style proportion bar: one thin rounded track split into colour slices
 * sized by each segment's share of the total, with a legend of colour-dot +
 * label + real count below. Honest (widths are true proportions, never
 * relative-to-max) and compact. Set `inlineLabels` for a thicker "ladder" reading.
 * Pure/props-only; owns its look.
 *
 * @param props - {@link SegmentBarProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "SegmentBar" } as const

export const SegmentBar = ({
    segments,
    ariaLabel,
    max,
    hideLegend,
    inlineLabels,
    caption,
    isSkeleton = false,
    classNames,
}: SegmentBarProps) => {
    // `segments` is REQUIRED whenever `isSkeleton` is false (discriminated union above) —
    // guaranteed by the type at every real call site — the `?? []` only satisfies narrowing
    // across the destructure, and is never seen while `isSkeleton`.
    const total = max ?? ((segments ?? []).reduce((acc, segment) => acc + segment.value, 0) || 1)
    const colored = (segments ?? []).map((segment, index) => ({
        ...segment,
        color: segment.color ?? PALETTE[index % PALETTE.length],
    }))
    const filled = colored.filter((segment) => segment.value > 0)
    const filledSum = filled.reduce((acc, segment) => acc + segment.value, 0)
    const remainder = Math.max(0, total - filledSum)

    const barContent = (
        <>
            {/* ATOM GAP: the proportion-slice track has no atom counterpart, so it stays a
                real element in both states — `isSkeleton` swaps its slices for a flat
                neutral fill instead of reaching for a vendor `Skeleton` or hand-rolling a
                bespoke `animate-pulse` shimmer (COMPOSITE-10). */}
            <div
                role="img"
                aria-label={ariaLabel}
                className={cn(
                    "flex w-full overflow-hidden bg-default",
                    inlineLabels ? "h-7 rounded-lg" : "h-1 rounded-full",
                )}
            >
                {isSkeleton ? null : filled.map((segment) => (
                    <div
                        key={segment.key}
                        className={cn(
                            "h-full min-w-0",
                            // inset-exception: optical nudge keeping the inline label off the segment edge
                            inlineLabels && "flex items-center justify-center overflow-hidden px-1",
                        )}
                        style={{
                            // slices touch flush (no gap) so the bar reads as ONE line —
                            // a gap would reveal the track at fractional-pixel seams.
                            // flex-grow = true proportions.
                            flexGrow: segment.value,
                            flexBasis: 0,
                            backgroundColor: segment.color,
                        }}
                    >
                        {inlineLabels ? (
                            <span className="truncate text-[10px] font-bold text-white">
                                {segment.label}&nbsp;{Math.round((segment.value / total) * 100)}%
                            </span>
                        ) : null}
                    </div>
                ))}
                {!isSkeleton && remainder > 0 ? (
                    <div
                        aria-hidden
                        className="h-full min-w-0"
                        style={{ flexGrow: remainder, flexBasis: 0 }}
                    />
                ) : null}
            </div>
            {!hideLegend ? (
                <Legend


                    isSkeleton={isSkeleton}
                    items={isSkeleton ? undefined : colored.map((segment) => ({
                        key: segment.key,
                        label: segment.label,
                        color: segment.color,
                        // the strip already prints the % inline in ladder mode, so
                        // drop the count suffix there; otherwise show the real count.
                        suffix: !inlineLabels ? ` · ${segment.value}` : undefined,
                    }))}
                />
            ) : null}
            {caption !== undefined ? (
                <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={caption} />
            ) : null}
        </>
    )
    return <StackV gap={3} classNames={classNames} body={barContent} />
}
