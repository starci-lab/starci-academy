import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import type { ProfileBadge } from "../ProfileHero"

/** Two placeholder pills while loading — enough to read as "a row of badges", not a guess at the real count. */
const SKELETON_BADGE_KEYS = ["skeleton-badge-1", "skeleton-badge-2"] as const

export interface ProfileBadgesProps {
    badges?: ReadonlyArray<ProfileBadge>
    isSkeleton?: boolean
}

/** A wrapping row of earned-achievement chips. */
export const ProfileBadges = ({ badges, isSkeleton = false}: ProfileBadgesProps) => {
    const items = isSkeleton
        ? SKELETON_BADGE_KEYS.map(() => () => <Chip isSkeleton />)
        : (badges ?? []).map((badge) => () => (
            <Chip
                tone="accent"
                icon={badge.icon}
                text={badge.label}
            />
        ))
    return <Cluster items={items} gap={2} />
}
