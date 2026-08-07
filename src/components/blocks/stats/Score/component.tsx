import React, { useMemo } from "react"
import { cn } from "@heroui/react"

/**
 * Color of the score based on the ratio compared to the threshold.
 */
type ScoreTone = "danger" | "warning" | "success"

const toneTextClass: Record<ScoreTone, string> = {
    danger: "text-danger-soft-foreground",
    warning: "text-warning-soft-foreground",
    success: "text-success-soft-foreground",
}

const resolveTone = (
    current: number,
    max: number,
    threshold: number,
): ScoreTone => {
    if (max <= 0 || !Number.isFinite(current) || !Number.isFinite(max)) {
        return "danger"
    }
    const ratio = Math.min(Math.max(current / max, 0), 1)
    const half = threshold / 2
    if (ratio < half) {
        return "danger"
    }
    if (ratio < threshold) {
        return "warning"
    }
    return "success"
}

/** Props for {@link _Score} — presentational; the label + aria-label already resolved. */
export interface ScoreProps {
    /** Current score (numerator). */
    current: number
    /** Maximum score (denominator). */
    max: number
    /**
     * Pass ratio for `current / max`.
     * Below `threshold / 2`: danger; from half to below `threshold`: warning; at or above `threshold`: success.
     */
    threshold?: number
    /** Already-localized + already-formatted "current/max" fraction text. */
    label: string
    /** Already-localized + already-formatted aria-label. */
    ariaLabel: string
    /** Extra classes on the root element (typography, spacing). */
}

/**
 * Renders `current/max` with tone from the ratio against `threshold` (default 0.7).
 * @param props - {@link ScoreProps}
 */
export const _Score = ({
    current,
    max,
    threshold = 0.7,
    label,
    ariaLabel,
}: ScoreProps) => {
    const tone = useMemo(
        () => resolveTone(current, max, threshold),
        [current, max, threshold],
    )

    return (
        <div
            className={
                cn(
                    "font-medium tabular-nums text-4xl font-bold",
                    toneTextClass[tone]
                )
            }
            aria-label={ariaLabel}
        >
            {label}
        </div>
    )
}
