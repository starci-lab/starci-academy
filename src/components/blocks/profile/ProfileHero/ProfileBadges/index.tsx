"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useProfileUsername,
} from "@/hooks/profile/useProfileUsername"
import { useQueryUserAchievementsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserAchievementsSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { MascotBadge } from "@/components/blocks/profile/MascotBadge"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { getRank } from "@/modules/utils/rank"

/** How many medals to show before the "+N" overflow. */
const MAX_BADGES = 6

/** Placeholder medals shown while the achievements load. */
const SKELETON_BADGES = 4

/**
 * The medals OVERLAP by a negative inline gap — no frame names a negative seam
 * (the scale starts at zero), so the row keeps its literal, stated once and shared
 * by the resting and loaded states.
 */
const MEDAL_ROW = "flex -space-x-2"

/** Each medal wears a background ring so the overlap reads as separate coins. */
const MEDAL_RING = "rounded-full ring-2 ring-background"

/**
 * Earned-achievement medal strip in the identity column: the user's earned
 * badges as an overlapping avatar list (rank-ring framed via {@link MascotBadge}),
 * highest tier first; hover a medal to reveal its name + rank. A "+N" chip caps
 * the row. Self-contained; self-hides once settled with nothing earned.
 */
export const ProfileBadges = () => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const { data: achievements, isLoading } = useQueryUserAchievementsSwr(userId)

    // earned only, highest tier first (the flex leads)
    const earned = (achievements ?? [])
        .filter((item) => item.earned)
        .sort((a, b) => (b.tierReached ?? 0) - (a.tierReached ?? 0))
    const visible = earned.slice(0, MAX_BADGES)
    const extra = Math.max(earned.length - visible.length, 0)

    const isSkeleton = isLoading && !achievements
    if (isSkeleton) {
        return (
            <Box className={MEDAL_ROW}>
                {Array.from({ length: SKELETON_BADGES }, (_medal, index) => (
                    <Skeleton key={index} className={`size-9 ${MEDAL_RING}`} />
                ))}
            </Box>
        )
    }
    // settled with nothing earned → the strip self-hides rather than leaving a gap
    if (earned.length === 0) {
        return null
    }

    return (
        <Box className={MEDAL_ROW}>
            {visible.map((item) => {
                const { labelKey, ring } = getRank(item.earned, item.tierReached)
                const status = labelKey ? t(labelKey) : null
                return (
                    <InfoTooltip
                        key={item.slug}
                        content={(
                            <StackV
                                gap={2}
                                items={[
                                    () => <Typography size="sm" weight="semibold" text={item.name} />,
                                    // the condition that earns this badge — users don't remember
                                    // every rule, so spell it out on hover
                                    () => <Typography size="xs" color="muted" text={item.description} />,
                                    // rank + rarity share ONE line, dot-separated, so the meta reads
                                    // as a single fact group and the card doesn't feel empty. Rank is
                                    // tinted by the badge's own ring colour (bronze/silver/gold) = the
                                    // single standout; the dot + rarity stay muted behind it.
                                    ...(status || item.rarityPercent != null ? [() => (
                                        <StackH
                                            gap={3}
                                            align="center"
                                            items={[
                                                // the rank tint is the badge's own ring colour, computed
                                                // per tier — a value no token names, so it rides Box's style
                                                ...(status ? [() => (
                                                    <Box style={ring ? { color: ring } : undefined}>
                                                        <Typography size="xs" weight="medium" text={status} />
                                                    </Box>
                                                )] : []),
                                                ...(status && item.rarityPercent != null
                                                    ? [() => <Typography size="xs" color="muted" text="·" />]
                                                    : []),
                                                ...(item.rarityPercent != null ? [() => (
                                                    <Typography
                                                        size="xs"
                                                        color="muted"
                                                        text={t("publicProfile.rarity", { percent: item.rarityPercent ?? 0 })}
                                                    />
                                                )] : []),
                                            ]}
                                        />
                                    )] : []),
                                ]}
                            />
                        )}
                    >
                        <Box className={MEDAL_RING}>
                            <MascotBadge
                                objectKey={item.iconKey}
                                name={item.name}
                                earned={item.earned}
                                tierReached={item.tierReached}
                                size={36}
                            />
                        </Box>
                    </InfoTooltip>
                )
            })}
            {/* the overflow coin is a COUNT, not an identity — the Avatar atom's `fallback`
                names a MODE (generated / initials / icon), so it cannot carry "+N" */}
            {extra > 0 ? (
                <Box className={`flex size-9 shrink-0 items-center justify-center bg-default ${MEDAL_RING}`}>
                    <Typography size="xs" weight="medium" text={`+${extra}`} />
                </Box>
            ) : null}
        </Box>
    )
}
