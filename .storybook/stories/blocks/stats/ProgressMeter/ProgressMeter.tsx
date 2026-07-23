import React from "react"
import { ProgressBar, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"

import { ProgressMeterTargetMark } from "./TargetMark"
import { AnatomyOverlay } from "../../layout/AnatomyOverlay/AnatomyOverlay"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressMeter`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * A presentational, props-only progress meter that renders an optional
 * label / value row above a HeroUI {@link ProgressBar}.
 */
export interface ProgressMeterProps {
    /** Current progress value. Should fall within the range `[0, max]`. */
    value: number
    /** Maximum value representing 100% completion. Defaults to `100`. */
    max?: number
    /**
     * Optional descriptive label rendered on the left of the top row. Pass a
     * translated string — the block never calls `useTranslations` itself.
     */
    label?: ReactNode
    /** When `true`, renders the rounded completion percentage on the right of the top row. */
    showValue?: boolean
    /**
     * Fill color. Defaults to `"accent"`; pass a semantic tone (danger / warning /
     * success) when the bar's VALUE carries meaning.
     */
    color?: "accent" | "success" | "warning" | "danger"
    /** Optional TARGET mark on the track — a thin tick at `target/max` (e.g. an "85% goal" line). */
    target?: number
    /** Optional label rendered above the target tick (e.g. `"85%"`). Only shown when {@link ProgressMeterProps.target} is set. */
    targetLabel?: ReactNode
    /** Extra classes on the root element. */
    className?: string
    /** Dev/spec: overlay the anatomy annotation on this meter. */
    showAnatomy?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * ProgressMeter renders a labelled, accessible progress bar: an optional top row
 * (label + rounded percentage) above a HeroUI {@link ProgressBar}, with an
 * optional target/goal marker overlaid on the track.
 *
 * @param props - {@link ProgressMeterProps}
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
    showAnatomy = false,
    anatPart,
}: ProgressMeterProps) => {
    const safeMax = max > 0 ? max : 1
    const percent = Math.round((value / safeMax) * 100)
    const hasTopRow = label !== undefined || showValue
    // target tick position, clamped into the track (0..100%)
    const targetPercent = target === undefined
        ? null
        : Math.min(Math.max((target / safeMax) * 100, 0), 100)

    return (
        <div className={cn("flex flex-col gap-2", showAnatomy && "relative", className)} data-anat={showAnatomy ? "" : undefined} data-anat-part={anatPart}>
            {showAnatomy ? <AnatomyOverlay label="ProgressMeter" tier="primitive" href="/?path=/docs/primitives-stats-progressmeter--docs" /> : null}
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
                midline. Reserve top room (`mt-5`) for a floating label so it never
                overlaps the caption above. */}
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
