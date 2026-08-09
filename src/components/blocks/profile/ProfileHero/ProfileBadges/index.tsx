import React from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Cluster } from "@/components/frames/Cluster"
import type { ProfileBadge } from ".."

/** Two placeholder pills while loading — enough to read as "a row of badges", not a guess at the real count. */
const SKELETON_BADGE_KEYS = ["skeleton-badge-1", "skeleton-badge-2"] as const

/** Props for the {@link ProfileBadges} block — optional earned badges and a skeleton row. */
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
    return (
        <Cluster
            identity={{ tier: "block", component: "ProfileBadges" }}
            items={items}
            gap={3}
            principle="chip-row"
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
        />
    )
}
