"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import {
    StarciAiTier,
} from "../enums"
import type {
    StarciAiTierInfo,
} from "../types"
import {
    TIER_INFO_MAP,
} from "../map"

/**
 * Recommended-tier badge: a "Recommended tier:" label followed by a colored chip.
 *
 * Self-contained section (single-use): reads the cached AI tier from redux and
 * resolves its badge info from the static tier map, defaulting to the low tier.
 * The StarCI AI container just renders `<TierBadge />` with no props.
 * `"use client"` for the redux selector.
 */
export const TierBadge = () => {
    const tier = useAppSelector((state) => state.aiModels.tier)

    /** Resolve the badge info for the current tier, defaulting to the low tier. */
    const tierInfo = useMemo<StarciAiTierInfo>(
        () => TIER_INFO_MAP[(tier as StarciAiTier) ?? StarciAiTier.Low]
            ?? TIER_INFO_MAP[StarciAiTier.Low],
        [
            tier,
        ],
    )

    return (
        <div className="mt-4 flex items-center gap-1.5">
            <span className="text-sm text-muted">Mức khuyến nghị:</span>
            <Chip
                size="sm"
                color={tierInfo.color}
                variant="primary"
            >
                {tierInfo.label}
            </Chip>
        </div>
    )
}
