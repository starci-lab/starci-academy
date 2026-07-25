import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Legend } from "../Legend/Legend"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/CourseProgressBar`. Authored in Storybook (not
 * `src`); synced to `src` later.
 */

/** One dimension of course progress (content / challenge / milestone). */
export interface CourseProgressDimension {
    /** Stable key (also used as the i18n label lookup elsewhere). */
    key: string
    /** Legend label. */
    label: ReactNode
    /** Real completed count for this dimension. */
    completed: number
    /** Real total count for this dimension — dimensions with `total === 0` render no lane at all. */
    total: number
    /** CSS colour for this dimension's fill + legend dot. Falls back to a palette. */
    color?: string
}

/** Props for the {@link CourseProgressBar} block. */
export interface CourseProgressBarProps {
    /** The 3 (or N) progress dimensions, in display order. */
    dims: Array<CourseProgressDimension>
    /** Accessible summary of the whole bar. */
    ariaLabel: string
    /** Hide the legend row under the bar. */
    hideLegend?: boolean
    /** Extra classes on the root element. */
    className?: string
}

/** Default per-dimension colours (semantic tokens) when a dimension has no explicit `color`. */
const PALETTE = ["var(--accent)", "var(--success)", "var(--warning)", "var(--danger)", "var(--muted)"]

/**
 * Course progress as EQUAL-WIDTH lanes, one per dimension (content / challenge /
 * milestone), each independently filled to ITS OWN ratio — inside one continuous
 * rounded track. Deliberately NOT {@link SegmentBar} (which sizes each slice by its
 * raw-count share of a single shared total): course dimensions are different UNITS
 * at wildly different scales, so a shared-total bar renders the smaller dimensions
 * as sub-pixel slivers. Equal lanes guarantee every dimension a real, always-visible
 * width while each lane's OWN fill still reflects its true `completed / total` ratio.
 *
 * @param props - {@link CourseProgressBarProps}
 */
export const CourseProgressBar = ({
    dims,
    ariaLabel,
    hideLegend,
    className,
}: CourseProgressBarProps) => {
    const lanes = dims
        .filter((dim) => dim.total > 0)
        .map((dim, index) => ({
            ...dim,
            color: dim.color ?? PALETTE[index % PALETTE.length],
            ratio: Math.min(1, dim.completed / dim.total),
        }))

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div
                role="img"
                aria-label={ariaLabel}
                className="flex h-1 w-full overflow-hidden rounded-full bg-default"
            >
                {lanes.map((lane, index) => (
                    <div
                        key={lane.key}
                        className={cn("h-full flex-1", index > 0 && "border-l border-default")}
                    >
                        <div
                            className="h-full"
                            style={{ width: `${lane.ratio * 100}%`, backgroundColor: lane.color }}
                        />
                    </div>
                ))}
            </div>
            {!hideLegend ? (
                <Legend
                    items={lanes.map((lane) => ({
                        key: lane.key,
                        label: lane.label,
                        color: lane.color,
                        suffix: <>&nbsp;·&nbsp;{lane.completed}</>,
                    }))}
                />
            ) : null}
        </div>
    )
}
