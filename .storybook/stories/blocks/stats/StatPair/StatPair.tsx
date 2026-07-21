import React from "react"
import { cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/StatPair`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/** Value (title) typography size — `h4` (default) · `h5` · `body` (text-base). */
export type StatPairValueType = "h4" | "h5" | "body"

/** Props for {@link StatPair}. */
export interface StatPairProps {
    /**
     * The headline statistic — typically a number or short formatted count
     * (e.g. "1,204" or "12"). Rendered large and emphasized.
     */
    value: React.ReactNode
    /**
     * The caption describing what the value measures (e.g. "Followers").
     * Rendered small and muted beneath the value.
     */
    label: React.ReactNode
    /** Value (title) size — defaults to `h4`; use `body` (text-base) for a smaller title (long strings). */
    valueType?: StatPairValueType
    /** Extra classes on the root element. */
    className?: string
}

/**
 * A single count + label statistic, stacked vertically and left-aligned (value
 * `h4` over a muted caption). Presentational only: it takes its content via props
 * and is meant to sit inside a card / stat row alongside sibling pairs. No frame of
 * its own — the surrounding card supplies the surface and any dividers.
 *
 * @param props - {@link StatPairProps}
 */
export const StatPair = ({
    value,
    label,
    valueType = "h4",
    className,
}: StatPairProps) => {
    return (
        <div className={cn("flex flex-col items-start gap-0", className)}>
            <Typography type={valueType} weight="semibold">{value}</Typography>
            <Typography type="body-xs" color="muted">{label}</Typography>
        </div>
    )
}
