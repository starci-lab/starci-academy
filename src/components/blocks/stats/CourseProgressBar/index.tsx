import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

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
export interface CourseProgressBarProps extends WithClassNames<undefined> {
    /** The 3 (or N) progress dimensions, in display order. */
    dims: Array<CourseProgressDimension>
    /** Accessible summary of the whole bar. */
    ariaLabel: string
    /** Hide the legend row under the bar. */
    hideLegend?: boolean
}

/** Default per-dimension colours (semantic tokens) when a dimension has no explicit `color`. */
const PALETTE = ["var(--accent)", "var(--success)", "var(--warning)", "var(--danger)", "var(--muted)"]

/**
 * Course progress as EQUAL-WIDTH lanes, one per dimension (content / challenge /
 * milestone), each independently filled to ITS OWN ratio — inside one continuous
 * rounded track. Deliberately NOT {@link SegmentBar} (which sizes each slice by its
 * raw-count share of a single shared total): course dimensions are different UNITS
 * at wildly different scales (e.g. 87 content vs 329 challenges vs 100 milestone
 * tasks), so a shared-total bar renders the smaller dimensions as sub-pixel slivers
 * that break apart visually. Equal lanes guarantee every dimension a real,
 * always-visible width regardless of its absolute total, while each lane's OWN
 * fill still reflects its true `completed / total` ratio (still honest — never
 * inflated relative to the dimension's own total).
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
                className="flex h-2 w-full overflow-hidden rounded-full bg-default"
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
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {lanes.map((lane) => (
                        <div key={lane.key} className="flex items-center gap-2">
                            <span
                                aria-hidden
                                style={{ backgroundColor: lane.color }}
                                className="size-2.5 shrink-0 rounded-full"
                            />
                            <Typography type="body-xs" color="muted">
                                {lane.label}&nbsp;·&nbsp;{lane.completed}
                            </Typography>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
