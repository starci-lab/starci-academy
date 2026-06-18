"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
    Typography,
    cn,
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
import type { WithClassNames } from "@/modules/types"

/** Props for {@link TierBadge}. */
export interface TierBadgeProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props; tier is read from redux. */
    readonly _reserved?: undefined
}

/**
 * Recommended-tier badge: a "Recommended tier:" label followed by a colored chip.
 *
 * Self-contained section (single-use): reads the cached AI tier from redux and
 * resolves its badge info from the static tier map, defaulting to the low tier.
 * The StarCI AI container just renders `<TierBadge />` with no props.
 * `"use client"` for the redux selector.
 */
export const TierBadge = ({ className }: TierBadgeProps) => {
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
        <div className={cn("flex items-center gap-2", className)}>
            <Typography type="body-sm" color="muted">Mức khuyến nghị:</Typography>
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
