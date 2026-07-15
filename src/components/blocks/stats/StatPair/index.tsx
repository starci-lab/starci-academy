import React from "react"
import {
    cn,
    Typography,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link StatPair}. */
export interface StatPairProps extends WithClassNames<undefined> {
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
    className,
}: StatPairProps) => {
    return (
        <div className={cn("flex flex-col items-start gap-0", className)}>
            <Typography type="h4" weight="semibold">{value}</Typography>
            <Typography type="body-xs" color="muted">{label}</Typography>
        </div>
    )
}
