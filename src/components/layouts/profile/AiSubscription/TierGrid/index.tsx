"use client"

import React from "react"
import type {
    AiSubscriptionTier,
} from "@/modules/api"
import {
    FreeTierCard,
} from "../FreeTierCard"
import {
    TierCard,
} from "./TierCard"

/** Props for {@link TierGrid}. */
export interface TierGridProps {
    /** Purchasable paid tiers, in display order. */
    tiers: Array<AiSubscriptionTier>
    /** The user's current tier slug, or `null` for the free tier. */
    currentTier: string | null
    /** Tier slug whose checkout is currently being created, or `null`. */
    purchasingTier: string | null
    /** Fired with the tier slug when the user presses a buy button. */
    onBuy: (tier: string) => void
}

/**
 * Responsive grid of subscription tiers: the static free tier followed by the
 * purchasable paid tiers.
 *
 * Presentational: maps tiers → {@link TierCard}, no logic.
 * @param props - tiers, current/purchasing slugs, buy callback
 */
export const TierGrid = ({
    tiers,
    currentTier,
    purchasingTier,
    onBuy,
}: TierGridProps) => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FreeTierCard isCurrent={currentTier === null} />
            {tiers.map((tier) => (
                <TierCard
                    key={tier.tier}
                    tier={tier}
                    isCurrent={currentTier === tier.tier}
                    isBuying={purchasingTier === tier.tier}
                    onBuy={onBuy}
                />
            ))}
        </div>
    )
}
