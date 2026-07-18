"use client"

import React from "react"
import { ProgressBar, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"

import { ProgressMeterTargetMark } from "@/components/blocks/stats/ProgressMeter/TargetMark"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for the {@link ProgressMeter} block.
 *
 * A presentational, props-only progress meter that renders an optional
 * label / value row above a HeroUI {@link ProgressBar}. It performs no data
 * fetching and reads no global store — all content arrives via props.
 */
export interface ProgressMeterProps extends WithClassNames<undefined> {
    /**
     * Current progress value. Should fall within the range `[0, max]`.
     */
    value: number
    /**
     * Maximum value representing 100% completion. Defaults to `100`.
     */
    max?: number
    /**
     * Optional descriptive label rendered on the left of the top row.
     * Pass a translated string (e.g. `t("...")`) — the block never calls
     * `useTranslations` itself.
     */
    label?: ReactNode
    /**
     * When `true`, renders the rounded completion percentage on the right of
     * the top row. Defaults to `false`.
     */
    showValue?: boolean
    /**
     * Fill color. Defaults to `"accent"`; pass a semantic tone (e.g. by score
     * ratio: danger / warning / success) when the bar's VALUE carries meaning.
     */
    color?: "accent" | "success" | "warning" | "danger"
    /**
     * Optional TARGET mark on the track — a thin tick at `target/max` (e.g. an
     * "85% retention goal" line the fill is compared against). Omit when the bar
     * has no meaningful goal to aim at. Canonical here so no caller ever hand-rolls
     * the overlay again (2026-07-17: moved out of `VerdictHeroCard`, which drew it
     * by hand).
     */
    target?: number
    /**
     * Optional label rendered above the target tick (e.g. `"85%"`). Only shown
     * when {@link ProgressMeterProps.target} is set. Keep it short — it floats
     * over the bar, so a long label collides with the top row.
     */
    targetLabel?: ReactNode
}

/**
 * ProgressMeter renders a labelled, accessible progress bar.
 *
 * Layout:
 * - An optional top row (only shown when {@link ProgressMeterProps.label} or
 *   {@link ProgressMeterProps.showValue} is provided) with the label on the
 *   left and the rounded percentage on the right.
 * - The HeroUI {@link ProgressBar} sized small with the accent color.
 *
 * @param props - See {@link ProgressMeterProps}.
 * @returns The rendered progress meter.
 * @see Story: .storybook/stories/blocks/stats/ProgressMeter/ProgressMeter.stories
 */
export const ProgressMeter = ({
    value,
    max = 100,
    label,
    showValue = false,
    color = "accent",
    target,
    targetLabel,
    className,
}: ProgressMeterProps) => {
    const safeMax = max > 0 ? max : 1
    const percent = Math.round((value / safeMax) * 100)
    const hasTopRow = label !== undefined || showValue
    // target tick position, clamped into the track (0..100%)
    const targetPercent = target === undefined
        ? null
        : Math.min(Math.max((target / safeMax) * 100, 0), 100)

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {hasTopRow ? (
                <div className="flex items-center justify-between gap-2">
                    <Typography type="body-xs" color="muted" className="min-w-0 truncate">{label}</Typography>
                    {showValue ? (
                        <Typography type="body-xs" color="muted" className="shrink-0">{percent}%</Typography>
                    ) : null}
                </div>
            ) : null}
            {/* With a target marker, force the bar row to the pill's own height (`h-5`)
                and center the bar in it, so the `h-5` pill sits EXACTLY on the track
                midline (thầy 2026-07-18: "nấc này ở giữa" — the bare `.relative` was as
                tall as ProgressBar's box, taller than the h-1 track, so `top-1/2` landed
                above the visible line). Reserve top room (`mt-5`) for a floating label so
                it never overlaps the caption above. */}
            <div
                className={cn(
                    "relative",
                    targetPercent !== null && "flex h-5 items-center",
                    targetPercent !== null && targetLabel !== undefined && "mt-5",
                )}
            >
                <div className="w-full">
                    <ProgressBar
                        aria-label={typeof label === "string" ? label : "Progress"}
                        value={value}
                        maxValue={safeMax}
                        color={color}
                        size="sm"
                    >
                        <ProgressBar.Track className="h-1">
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </div>
                {targetPercent === null ? null : (
                    <ProgressMeterTargetMark percent={targetPercent} label={targetLabel} />
                )}
            </div>
        </div>
    )
}
