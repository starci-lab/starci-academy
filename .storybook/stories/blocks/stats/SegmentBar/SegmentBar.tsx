import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { Legend } from "../Legend/Legend"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/SegmentBar`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** One slice of a {@link SegmentBar}. */
export interface SegmentBarSegment {
    /** Stable key. */
    key: string
    /** Legend label (the name; the count is appended automatically). */
    label: ReactNode
    /** Raw count — segment width is its share of the total. */
    value: number
    /** CSS colour for the slice + legend dot (e.g. `var(--success)`). Falls back to a palette. */
    color?: string
}

/** Props for the {@link SegmentBar} block. */
export interface SegmentBarProps {
    /** Slices, in display order. */
    segments: SegmentBarSegment[]
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
    /** Optional muted takeaway sentence rendered below the legend. */
    caption?: ReactNode
    /** Extra classes on the root element. */
    className?: string
}

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
export const SegmentBar = ({
    segments,
    ariaLabel,
    max,
    hideLegend,
    inlineLabels,
    caption,
    className,
}: SegmentBarProps) => {
    const total = max ?? (segments.reduce((acc, segment) => acc + segment.value, 0) || 1)
    const colored = segments.map((segment, index) => ({
        ...segment,
        color: segment.color ?? PALETTE[index % PALETTE.length],
    }))
    const filled = colored.filter((segment) => segment.value > 0)
    const filledSum = filled.reduce((acc, segment) => acc + segment.value, 0)
    const remainder = Math.max(0, total - filledSum)

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div
                role="img"
                aria-label={ariaLabel}
                className={cn(
                    "flex w-full overflow-hidden bg-default",
                    inlineLabels ? "h-7 rounded-lg" : "h-1 rounded-full",
                )}
            >
                {filled.map((segment) => (
                    <div
                        key={segment.key}
                        className={cn(
                            "h-full min-w-0",
                            inlineLabels && "flex items-center justify-center overflow-hidden px-1.5",
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
                {remainder > 0 ? (
                    <div
                        aria-hidden
                        className="h-full min-w-0"
                        style={{ flexGrow: remainder, flexBasis: 0 }}
                    />
                ) : null}
            </div>
            {!hideLegend ? (
                <Legend
                    items={colored.map((segment) => ({
                        key: segment.key,
                        label: segment.label,
                        color: segment.color,
                        // the strip already prints the % inline in ladder mode, so
                        // drop the count suffix there; otherwise show the real count.
                        suffix: !inlineLabels ? <>&nbsp;·&nbsp;{segment.value}</> : undefined,
                    }))}
                />
            ) : null}
            {caption ? (
                <Typography type="body-xs" color="muted">
                    {caption}
                </Typography>
            ) : null}
        </div>
    )
}
