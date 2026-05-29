"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"

/** Props for {@link QuotaBar}. */
export interface QuotaBarProps {
    /** Window label (e.g. "Next 5 hours"). */
    label: string
    /** Amount consumed in the window. */
    used: number
    /** Cap for the window (0 means "no allowance"). */
    limit: number
    /** Unit suffix shown next to the counts (e.g. "uses", "credits"). */
    unit: string
    /** Tailwind class for the fill colour (defaults to accent). */
    fillClassName?: string
}

/**
 * A single labelled usage bar: "label — used/limit unit" + a filled track.
 *
 * Presentational (render-only). The fill width is the consumed ratio, so a
 * fuller bar means less remaining quota.
 * @param props - label, counts, unit, optional fill colour
 */
export const QuotaBar = ({
    label,
    used,
    limit,
    unit,
    fillClassName = "bg-accent",
}: QuotaBarProps) => {
    // guard divide-by-zero; with no allowance the bar reads as full
    const ratio = limit > 0
        ? Math.min(1, Math.max(0, used / limit))
        : (used > 0 ? 1 : 0)
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-foreground">
                    {used}
                    {" / "}
                    {limit}
                    {" "}
                    <span className="text-muted">{unit}</span>
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-default/60">
                <div
                    className={cn("h-full rounded-full transition-all", fillClassName)}
                    style={{ width: `${ratio * 100}%` }}
                />
            </div>
        </div>
    )
}
