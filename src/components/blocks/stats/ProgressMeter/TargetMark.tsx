import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link ProgressMeterTargetMark} block. */
export interface ProgressMeterTargetMarkProps extends WithClassNames<undefined> {
    /** Horizontal position on the track, `0..100` (already clamped by the caller). */
    percent: number
    /** Optional short label floating just above the pill (e.g. `"85%"`). Keep it short — it floats over the bar. */
    label?: ReactNode
}

/**
 * The target / goal marker on a {@link ProgressMeter} track — a rounded pill
 * (`w-1 h-5`, `bg-surface` + hairline) that overshoots the thin bar so it reads
 * as a clean "notch" at the goal position, with an optional short label floating
 * above it. Extracted from `ProgressMeter` so the marker's look lives in ONE
 * place (thầy 2026-07-18: *"màu đỏ tách thành component riêng ... anchor render
 * cùng kích thước w-1 với h-5 và rounded, màu là bg-surface"*).
 *
 * `bg-accent` (thầy 2026-07-18: *"để màu accent được k?"*) — the goal marker is
 * a neutral brand tone, distinct from the bar's own band (danger/warning/success)
 * value color, so it reads as "the line to reach" not another value. Centered on
 * the bar via `top-1/2 -translate-y-1/2` (the parent meter forces an `h-5` bar row
 * when a target is present so the `h-5` pill sits exactly on the track midline),
 * on `percent` via `-translate-x-1/2`. The parent also reserves top room (`mt-5`)
 * when a label is present so the floating label never overlaps the caption above.
 * Pure/props-only.
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
