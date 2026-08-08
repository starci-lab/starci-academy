"use client"

import React from "react"
import { FreeTierCard } from "@/components/blocks/commerce/FreeTierCard"
import { TierCard } from "@/components/blocks/commerce/TierCard"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { useQueryAiSubscriptionTiersSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiSubscriptionTiersSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"

/** How many paid cards the resting grid holds — the free card plus these fills both columns. */
const SKELETON_PAID_CARDS = 3

/** Props for {@link TierGrid}. */
export interface TierGridProps {
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
    isSkeleton = false}: TierGridProps) => {
    const { data: tiersData } = useQueryAiSubscriptionTiersSwr()
    const { data: mySettings } = useQueryMyAiSettingsSwr()

    /** Purchasable paid tiers from the query (empty until loaded). */
    const tiers = tiersData ?? []
    /** The user's current tier slug, or null for the free tier. */
    const currentTier = mySettings?.tier ?? null

    const items: Array<GridItem> = [
        {
            key: "free",
            content: () => (
                <FreeTierCard isCurrent={currentTier === null} isSkeleton={isSkeleton} />
            ),
        },
        ...(isSkeleton
            ? Array.from({ length: SKELETON_PAID_CARDS }, (_card, index) => ({
                key: `pending-${index}`,
                content: () => (
                    <TierCard
                        isSkeleton
                        isCurrent={false}
                    />
                ),
            }))
            : tiers.map((tier) => ({
                key: tier.tier,
                content: () => (
                    <TierCard
                        tier={tier}
                        isCurrent={currentTier === tier.tier}
                    />
                ),
            }))),
    ]

    return (
        <Grid
            identity={{ tier: "block", component: "TierGrid" }}
            columns={{ base: 1, sm: 2 }}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major tier cards rather than nested section groups."
            items={items}
        />
    )
}
