import React from "react"
import { ProgressCircle, Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressRing`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** Ring diameter + centered-label typography, keyed by the {@link ProgressRingProps.size} step. */
const SIZE_MAP = {
    sm: { ring: "size-16", label: "body-sm" },
    md: { ring: "size-24", label: "body" },
    lg: { ring: "size-32", label: "h5" },
} as const satisfies Record<"sm" | "md" | "lg", { ring: string; label: "body-sm" | "body" | "h5" }>

/**
 * A circular progress ring built on the HeroUI `ProgressCircle` primitive, with a
 * value label centered inside the ring and an optional caption below. Tier-3
 * presentational — every piece of content arrives via props.
 */
export interface ProgressRingProps {
    /** Completion percentage in the range `[0, 100]`. Values outside the range are clamped. */
    value: number
    /** Centered label rendered inside the ring. Defaults to the rounded percentage (e.g. `"68%"`). */
    label?: React.ReactNode
    /** Optional caption rendered below the ring — small and muted (`body-xs`). */
    caption?: React.ReactNode
    /** Ring diameter. `"sm"` (64px), `"md"` (96px, default), `"lg"` (128px). */
    size?: "sm" | "md" | "lg"
    /** Fill tone. Defaults to `"accent"`; pass a semantic tone (success / warning / danger) when the VALUE carries meaning. */
    tone?: "accent" | "success" | "warning" | "danger"
    /** Extra classes on the root element. */
    className?: string
}

/**
 * ProgressRing renders a circular completion indicator: a HeroUI `ProgressCircle`
 * with a value label centered inside the ring and an optional caption underneath.
 * The HeroUI `ProgressCircle` cannot host arbitrary centered content, so the ring
 * is wrapped in a relative container with the label absolutely centered over the SVG.
 *
 * @param props - {@link ProgressRingProps}
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
