"use client"

import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CourseContentTier,
    type WithClassNames,
} from "@/modules/types"

/** Chip color per learning tier — free→neutral, mid→amber, advanced→red. */
const TIER_COLOR: Record<CourseContentTier, "success" | "warning" | "danger"> = {
    [CourseContentTier.Foundation]: "success",
    [CourseContentTier.Intermediate]: "warning",
    [CourseContentTier.Advanced]: "danger",
}

/** Props for {@link ModuleTierBadge}. */
export interface ModuleTierBadgeProps extends WithClassNames<undefined> {
    /** The module's learning tier. */
    tier: CourseContentTier
}

/**
 * Small colored chip labelling a module's learning tier
 * (Foundation / Intermediate / Advanced). Label is i18n-driven.
 *
 * @param props - the tier to render and optional classes
 */
export const ModuleTierBadge = ({ tier, className }: ModuleTierBadgeProps) => {
    const t = useTranslations()
    return (
        <Chip
            size="sm"
            color={TIER_COLOR[tier]}
            variant="soft"
            className={className}
        >
            <Chip.Label>{t(`module.tier.${tier}`)}</Chip.Label>
        </Chip>
    )
}
