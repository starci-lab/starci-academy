"use client"

import React from "react"
import {
    CaretUpIcon,
    CaretDownIcon,
} from "@phosphor-icons/react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link RankDeltaCaret}. */
export interface RankDeltaCaretProps extends WithClassNames<undefined> {
    /**
     * Rank movement vs the previous period (`lastRank - currentRank`): positive
     * = climbed N places (▲ green), negative = dropped (▼ red), 0 = unchanged
     * (muted dash), null = no baseline (renders nothing).
     */
    delta: number | null
}

/**
 * The rank-movement caret shown at the end of a leaderboard row: a green up
 * arrow + count when the user climbed, a red down arrow + count when they
 * dropped, a muted dash when unchanged, and nothing when there's no baseline.
 * Reused by the weekly-league board + the global leaderboard.
 *
 * @param props - {@link RankDeltaCaretProps}
 */
export const RankDeltaCaret = ({
    delta,
    className,
}: RankDeltaCaretProps) => {
    // no last-period baseline → an EMPTY SPACER that still reserves the column width
    // (the caller's `className` carries the `w-8`), so a #1 row with no movement keeps
    // the value/delta columns aligned with the rows below it instead of letting the
    // value slide right into the empty slot (thầy 2026-07-17 "xanh là phải thẳng hàng").
    if (delta === null) {
        return <span className={cn(className)} aria-hidden />
    }
    // unchanged → a muted dash so the column still aligns
    if (delta === 0) {
        return (
            <span className={cn("text-xs text-muted", className)}>
                —
            </span>
        )
    }
    const climbed = delta > 0
    return (
        <span
            className={cn(
                "flex items-center gap-0 text-xs font-medium",
                climbed ? "text-success-soft-foreground" : "text-danger-soft-foreground",
                className,
            )}
        >
            {climbed ? (
                <CaretUpIcon className="size-3.5" />
            ) : (
                <CaretDownIcon className="size-3.5" />
            )}
            {Math.abs(delta)}
        </span>
    )
}
