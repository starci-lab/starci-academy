import React, { useMemo } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/Score`. Authored in Storybook (not `src`); synced
 * to `src` later.
 *
 * The real block formats the `current/max` fraction + aria-label via next-intl
 * (`useFormatter` / `t("score.fraction")`). next-intl is not an allowed Storybook
 * import, so the DESIGN-relevant behaviour (tone resolved from the ratio, the big
 * tabular-nums number) is ported verbatim while the fraction is built locally with
 * `Intl.NumberFormat` (`score.fraction` = `{current}/{max}`). Re-wire to next-intl
 * on sync to `src`.
 */

/** Color of the score based on the ratio compared to the threshold. */
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
    /** Extra classes on the root element (typography, spacing). */
    className?: string
}

/**
 * Renders `current/max` with tone from the ratio against `threshold` (default 0.7).
 * @param props - {@link ScoreProps}
 */
export const Score = (props: ScoreProps) => {
    const {
        current,
        max,
        threshold = 0.7,
        className,
    } = props

    const tone = useMemo(
        () => resolveTone(current, max, threshold),
        [current, max, threshold],
    )

    const numberFormat = useMemo(() => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }), [])
    const currentLabel = numberFormat.format(current)
    const maxLabel = numberFormat.format(max)

    const label = `${currentLabel}/${maxLabel}`
    const ariaLabel = `${currentLabel} out of ${maxLabel}`

    return (
        <div
            className={
                cn(
                    "font-medium tabular-nums text-4xl font-bold",
                    toneTextClass[tone],
                    className,
                )
            }
            aria-label={ariaLabel}
        >
            {label}
        </div>
    )
}
