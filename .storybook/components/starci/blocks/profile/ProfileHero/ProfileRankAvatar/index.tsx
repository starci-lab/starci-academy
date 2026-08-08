import React from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import type { AvatarRing } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

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

/** Props for {@link ProfileRankAvatar}. */
export interface ProfileRankAvatarProps {
    name: string
    avatarUrl?: string
    rank?: number
    isSkeleton?: boolean
}

/** Avatar with an optional rank-tinted ring, plus the "Rank #N" caption underneath. */
export const ProfileRankAvatar = ({ name, avatarUrl, rank, isSkeleton = false}: ProfileRankAvatarProps) => (
    <StackV
        identity={{ tier: "block", component: "ProfileRankAvatar" }}
        principle="title-subtitle"
        explain="Title over supporting line — not label-field, because neither line is a form control label."
        isSkeleton={isSkeleton}
        items={[
            () => (
                <div>
                    <Avatar
                        name={name}
                        src={avatarUrl}
                        size="lg"
                        isSkeleton={isSkeleton}

                        ring={isSkeleton ? undefined : rankRingTone(rank)}
                    />
                </div>
            ),
            ...(isSkeleton || rank != null
                ? [
                    () => (
                        <Typography
                            size="xs"
                            color="muted"
                            weight="medium"
                            isSkeleton={isSkeleton}
                            text={rank != null ? `Rank #${rank}` : undefined}

                        />
                    ),
                ]
                : []),
        ]}
    />
)
