"use client"

import React from "react"
import { cn } from "@heroui/react"
import { FreeTierCard } from "@/components/blocks/commerce/FreeTierCard"
import { TierCard } from "@/components/blocks/commerce/TierCard"
import { useQueryAiSubscriptionTiersSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiSubscriptionTiersSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How many paid cards the resting grid holds — the free card plus these fills both columns. */
const SKELETON_PAID_CARDS = 3

/** Props for {@link TierGrid}. */
export interface TierGridProps extends WithClassNames<undefined> {
    /**
     * First load, nothing in hand → the SAME cards render resting, in the SAME grid.
     * A separate `AiSubscriptionSkeleton` used to mirror this layout by hand, along
     * with one twin per card; all three are gone.
     */
    isSkeleton?: boolean
}

/**
 * Responsive grid of subscription tiers: the static free tier followed by the
 * purchasable paid tiers.
 *
 * Reads eligible tiers from the AI subscription SWR singleton and the user's
 * current tier from the AI settings singleton. Each {@link TierCard} is a list
 * item that self-opens the payment overlay for the buy action.
 *
 * @param props - {@link TierGridProps}
 */
export const TierGrid = ({
    className,
    isSkeleton = false,
}: TierGridProps) => {
    const { data: tiersData } = useQueryAiSubscriptionTiersSwr()
    const { data: mySettings } = useQueryMyAiSettingsSwr()

    /** Purchasable paid tiers from the query (empty until loaded). */
    const tiers = tiersData ?? []
    /** The user's current tier slug, or null for the free tier. */
    const currentTier = mySettings?.tier ?? null

    return (
        <div className={cn("grid grid-cols-1 gap-6 @app-sm:grid-cols-2", className)}>
            <FreeTierCard isCurrent={currentTier === null} isSkeleton={isSkeleton} />
            {isSkeleton
                ? Array.from({ length: SKELETON_PAID_CARDS }, (_card, index) => (
                    <TierCard
                        key={`pending-${index}`}
                        isSkeleton
                        isCurrent={false}
                    />
                ))
                : tiers.map((tier) => (
                    <TierCard
                        key={tier.tier}
                        tier={tier}
                        isCurrent={currentTier === tier.tier}
                    />
                ))}
        </div>
    )
}
