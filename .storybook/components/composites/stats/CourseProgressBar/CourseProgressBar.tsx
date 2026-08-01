import React from "react"
import { cn } from "@heroui/react"
import { Legend } from "@sb-components/composites/stats/Legend/Legend"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/CourseProgressBar`. Authored in Storybook (not
 * `src`); synced to `src` later.
 */

/** One dimension of course progress (content / challenge / milestone). */
export interface CourseProgressDimension {
    /** Stable key (also used as the i18n label lookup elsewhere). */
    key: string
    /**
     * Legend label. `string`, not `ReactNode` — passed straight into
     * {@link Legend}'s `label` field, which the composite wraps in `Typography`
     * itself.
     */
    label: string
    /** Real completed count for this dimension. */
    completed: number
    /** Real total count for this dimension — dimensions with `total === 0` render no lane at all. */
    total: number
    /** CSS colour for this dimension's fill + legend dot. Falls back to a palette. */
    color?: string
}

/** Props {@link CourseProgressBar} carries regardless of loading state. */
interface CourseProgressBarOwnProps {
    /** Accessible summary of the whole bar. */
    ariaLabel: string
    /** Hide the legend row under the bar. */
    hideLegend?: boolean
    /** Layout utilities on the root element, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for the {@link CourseProgressBar} block. `dims` is REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer track has no real ratios to show yet.
 */
export type CourseProgressBarProps = CourseProgressBarOwnProps &
    (
        | { isSkeleton: true; dims?: Array<CourseProgressDimension> }
        | { isSkeleton?: false; dims: Array<CourseProgressDimension> }
    )

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
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "CourseProgressBar" } as const

export const CourseProgressBar = ({
    dims,
    ariaLabel,
    hideLegend,
    isSkeleton = false,
    classNames,
}: CourseProgressBarProps) => {
    const lanes = (dims ?? [])
        .filter((dim) => dim.total > 0)
        .map((dim, index) => ({
            ...dim,
            color: dim.color ?? PALETTE[index % PALETTE.length],
            ratio: Math.min(1, dim.completed / dim.total),
        }))

    return (
        <StackV
            gap={3}
            classNames={classNames}
            body={
                <>
                    {/* ATOM GAP: equal-width multi-lane track has no atom counterpart (see
                        file header note), so it stays a hand-drawn real element — the SAME
                        track renders in both states; isSkeleton hides the lanes for a flat
                        neutral fill instead of reaching for a vendor Skeleton or hand-rolling
                        a bespoke `animate-pulse` shimmer (COMPOSITE-10). */}
                    <div
                        role="img"
                        aria-label={ariaLabel}
                        className={cn("flex h-1 w-full overflow-hidden rounded-full bg-default")}
                    >
                        {isSkeleton
                            ? null
                            : lanes.map((lane, index) => (
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
                            isSkeleton={isSkeleton}
                            items={isSkeleton ? undefined : lanes.map((lane) => ({
                                key: lane.key,
                                label: lane.label,
                                color: lane.color,
                                suffix: ` · ${lane.completed}`,
                            }))}
                        />
                    ) : null}
                </>
            }
        />
    )
}
