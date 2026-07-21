import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressMeter/TargetMark`. Authored in Storybook
 * (not `src`); synced to `src` later.
 */

/** Props for the {@link ProgressMeterTargetMark} block. */
export interface ProgressMeterTargetMarkProps {
    /** Horizontal position on the track, `0..100` (already clamped by the caller). */
    percent: number
    /** Optional short label floating just above the pill (e.g. `"85%"`). Keep it short — it floats over the bar. */
    label?: ReactNode
    /** Extra classes on the root element. */
    className?: string
}

/**
 * The target / goal marker on a {@link ProgressMeter} track — a rounded pill
 * (`w-1 h-5`, `bg-accent`) that overshoots the thin bar so it reads as a clean
 * "notch" at the goal position, with an optional short label floating above it.
 * `bg-accent` — the goal marker is a neutral brand tone, distinct from the bar's
 * own value band (danger/warning/success), so it reads as "the line to reach" not
 * another value. Centered on the bar via `top-1/2 -translate-y-1/2`, on `percent`
 * via `-translate-x-1/2`. Pure/props-only.
 *
 * @param props - {@link ProgressMeterTargetMarkProps}
 */
export const ProgressMeterTargetMark = ({ percent, label, className }: ProgressMeterTargetMarkProps) => (
    <div
        className={cn("pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2", className)}
        style={{ left: `${percent}%` }}
    >
        <div className="h-5 w-1 rounded bg-accent" />
        {label === undefined ? null : (
            <Typography
                type="body-xs"
                color="muted"
                className="absolute bottom-[calc(100%+3px)] left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
                {label}
            </Typography>
        )}
    </div>
)
