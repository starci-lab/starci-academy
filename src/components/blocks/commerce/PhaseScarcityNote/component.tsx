import React from "react"
import { cn } from "@heroui/react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _PhaseScarcityNote} — presentational; labels already resolved. */
export interface PhaseScarcityNoteProps extends WithClassNames<undefined> {
    /** Seats left at the current phase price; `null` = unlimited → renders nothing. */
    seatsRemaining: number | null
    /** Already-localized "N spots left at the {phase} price" line. `null` when `seatsRemaining` is `null`. */
    slotsLeftLabel: string | null
    /** Already-localized "price rises to {X} after that" line; `null` hides it. */
    priceRisingLabel: string | null
}

/**
 * Honest pricing-phase scarcity line for a paywall: "N spots left at the {phase} price ·
 * price rises to {X} after that". Sits as a SIBLING below `PriceTag` (PriceTag owns the discount;
 * scarcity is orthogonal urgency). Renders ONLY when the current phase has a real seat
 * cap (`seatsRemaining != null`) — an unlimited phase has no honest "rises-when" trigger
 * so nothing shows. EVERY number comes from the backend `coursePricePreview` — this
 * NEVER fabricates a countdown or a seat figure (see `CTA.md` — fake scarcity is a
 * banned dark pattern).
 *
 * @param props - {@link PhaseScarcityNoteProps}
 */
export const _PhaseScarcityNote = ({
    seatsRemaining,
    slotsLeftLabel,
    priceRisingLabel,
    className,
}: PhaseScarcityNoteProps) => {
    // no seat cap on this phase → no honest scarcity trigger → render nothing
    if (seatsRemaining == null || slotsLeftLabel == null) {
        return null
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-2 text-warning-soft-foreground", className)}>
            <WarningCircleIcon aria-hidden focusable="false" className="size-4 shrink-0" />
            <span className="text-sm font-medium">
                {slotsLeftLabel}
            </span>
            {priceRisingLabel != null ? (
                <>
                    <span aria-hidden className="text-sm">·</span>
                    <span className="text-sm">
                        {priceRisingLabel}
                    </span>
                </>
            ) : null}
        </div>
    )
}
