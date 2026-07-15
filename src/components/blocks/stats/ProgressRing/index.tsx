"use client"

import React from "react"
import { ProgressCircle, Typography, cn } from "@heroui/react"

import type { WithClassNames } from "@/modules/types/base/class-name"

/** Ring diameter + centered-label typography, keyed by the {@link ProgressRingProps.size} step. */
const SIZE_MAP = {
    sm: { ring: "size-16", label: "body-sm" },
    md: { ring: "size-24", label: "body" },
    lg: { ring: "size-32", label: "h5" },
} as const satisfies Record<"sm" | "md" | "lg", { ring: string; label: "body-sm" | "body" | "h5" }>

/**
 * Props for the {@link ProgressRing} block.
 *
 * A circular progress ring built on the HeroUI `ProgressCircle` primitive, with a
 * value label centered inside the ring and an optional caption below. Tier-3
 * presentational — every piece of content arrives via props; no store, no fetch.
 */
export interface ProgressRingProps extends WithClassNames<undefined> {
    /**
     * Completion percentage in the range `[0, 100]`. Values outside the range are
     * clamped. Drives both the ring fill and the default label.
     */
    value: number
    /**
     * Centered label rendered inside the ring. Defaults to the rounded percentage
     * (e.g. `"68%"`). Pass a `ReactNode` to show a fraction or a short word instead.
     */
    label?: React.ReactNode
    /**
     * Optional caption rendered below the ring — small and muted (`body-xs`). Use it
     * to name what the ring measures (e.g. `"Tiến độ khoá học"`).
     */
    caption?: React.ReactNode
    /**
     * Ring diameter. `"sm"` (64px) for inline/compact spots, `"md"` (96px, default)
     * for cards, `"lg"` (128px) for a hero stat. The centered label scales with it.
     */
    size?: "sm" | "md" | "lg"
    /**
     * Fill tone. Defaults to `"accent"`; pass a semantic tone (success / warning /
     * danger) when the VALUE itself carries meaning (e.g. a quiz score by threshold).
     */
    tone?: "accent" | "success" | "warning" | "danger"
}

/**
 * ProgressRing renders a circular completion indicator: a HeroUI `ProgressCircle`
 * with a value label centered inside the ring and an optional caption underneath.
 * It reads better than a linear bar for course-completion, quiz-score, or streak
 * displays where the number wants to sit inside the arc.
 *
 * The HeroUI `ProgressCircle` cannot host arbitrary centered content, so the ring
 * is wrapped in a relative container with the label absolutely centered over the
 * SVG (which is stretched to fill the container via an inline size).
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 *
 * @param props - {@link ProgressRingProps}
 *
 * @example
 * <ProgressRing value={68} caption="Tiến độ khoá học" />
 *
 * @example
 * <ProgressRing value={92} tone="success" size="lg" label="9/10" caption="Điểm bài kiểm tra" />
 */
export const ProgressRing = ({
    value,
    label,
    caption,
    size = "md",
    tone = "accent",
    className,
}: ProgressRingProps) => {
    const safeValue = Math.min(100, Math.max(0, value))
    const resolvedLabel = label ?? `${Math.round(safeValue)}%`
    const { ring, label: labelType } = SIZE_MAP[size]
    const ariaLabel = typeof caption === "string" ? caption : `${Math.round(safeValue)}%`

    return (
        <div className={cn("inline-flex flex-col items-center gap-2", className)}>
            {/* Relative container: the ring fills it, the label overlays its center */}
            <div className={cn("relative inline-flex items-center justify-center", ring)}>
                <ProgressCircle aria-label={ariaLabel} value={safeValue} color={tone}>
                    {/* Inline size stretches the SVG to the wrapper so the overlay stays centered */}
                    <ProgressCircle.Track style={{ width: "100%", height: "100%" }}>
                        <ProgressCircle.TrackCircle />
                        <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                </ProgressCircle>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Typography type={labelType} weight="semibold">
                        {resolvedLabel}
                    </Typography>
                </div>
            </div>

            {/* Optional caption — small + muted, distinct from the centered value */}
            {caption ? (
                <Typography type="body-xs" color="muted" className="text-center">
                    {caption}
                </Typography>
            ) : null}
        </div>
    )
}
