import React from "react"
import { Avatar } from "@/components/atoms/display/Avatar"
import type { AvatarRing } from "@/components/atoms/display/Avatar"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/**
 * Ring tone for a ranked avatar — top-3 gets the strongest (warning) frame,
 * any other rank a quieter accent frame, no rank at all → no ring. A fact
 * about standing, not decoration chosen for its own sake. The atom (`Avatar`'s
 * `ring` prop) owns the frame's shape; this only picks the tone.
 */
const rankRingTone = (rank: number | undefined): AvatarRing | undefined => {
    if (rank == null) return undefined
    return rank <= 3 ? "warning" : "accent"
}

export interface ProfileRankAvatarProps {
    name: string
    avatarUrl?: string
    rank?: number
    isSkeleton?: boolean
}

/** Avatar with an optional rank-tinted ring, plus the "Rank #N" caption underneath. */
export const ProfileRankAvatar = ({ name, avatarUrl, rank, isSkeleton = false}: ProfileRankAvatarProps) => {
    const rankBody = (
        <>
            <div>
                <Avatar
                    name={name}
                    src={avatarUrl}
                    size="lg"
                    isSkeleton={isSkeleton}

                    ring={isSkeleton ? undefined : rankRingTone(rank)}
                />
            </div>
            {isSkeleton || rank != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    weight="medium"
                    isSkeleton={isSkeleton}
                    text={rank != null ? `Rank #${rank}` : undefined}

                />
            ) : null}
        </>
    )
    return <StackV gap={2} principles={["title-subtitle"]} align="center" isSkeleton={isSkeleton} items={[() => rankBody]} />
}
