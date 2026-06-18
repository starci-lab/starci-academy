"use client"

import React from "react"
import { Card, CardContent, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/components/reuseable"
import type { CourseLeaderboardMyRank } from "@/modules/api/graphql"
import type { WithClassNames } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { XpBreakdown } from "../XpBreakdown"

/** Props for {@link MyRankCard}. */
export interface MyRankCardProps extends WithClassNames<undefined> {
    /** The viewer's standing, or null when they have no activity yet. */
    myRank: CourseLeaderboardMyRank | null
    /** Localised "updated {time}" line shown as the snapshot freshness footer. */
    updatedAtLabel?: string
}

/**
 * The viewer's own standing, pinned regardless of whether they land in the top
 * window. Shows rank, total XP, and the XP breakdown; falls back to a prompt
 * when the viewer has no scored activity in the course. Reads viewer identity
 * directly from the user Redux slice.
 * @param props - {@link MyRankCardProps}
 */
export const MyRankCard = ({ myRank, updatedAtLabel, className }: MyRankCardProps) => {
    const t = useTranslations()
    // read viewer identity directly from the user slice — no prop drilling needed
    const viewer = useAppSelector((state) => state.user.user)
    const username = viewer?.username
    const avatar = viewer?.avatar

    // no activity → invite the learner to start scoring instead of an empty rank
    if (!myRank) {
        return (
            <Card className={cn("w-full border-accent/30 bg-accent/5", className)}>
                <CardContent className="flex flex-col gap-2">
                    <Typography type="body-sm" weight="semibold">
                        {t("leaderboard.yourRank")}
                    </Typography>
                    <Typography type="body-sm" color="muted">
                        {t("leaderboard.myRankEmpty")}
                    </Typography>
                    {updatedAtLabel ? (
                        <Typography type="body-xs" color="muted">{updatedAtLabel}</Typography>
                    ) : null}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn("w-full border-accent/40 bg-accent/5", className)}>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    {/* rank position */}
                    <div className="flex flex-col items-center">
                        <Typography type="body-xs" color="muted">{t("leaderboard.rankPrefix")}</Typography>
                        <Typography type="h4" weight="bold" className="text-accent">#{myRank.rank}</Typography>
                    </div>
                    <UserAvatar
                        username={username}
                        avatar={avatar}
                        size="md"
                        className="ring-2 ring-accent"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0">
                        <Typography type="body-sm" weight="semibold">
                            {t("leaderboard.you")}
                        </Typography>
                        <Typography type="body-sm" weight="bold" className="text-accent">
                            {t("leaderboard.xp", { xp: myRank.totalXp })}
                        </Typography>
                    </div>
                </div>
                {/* how the viewer's XP was earned */}
                <XpBreakdown
                    totalScore={myRank.totalScore}
                    lessonsRead={myRank.lessonsRead}
                    milestoneProgress={myRank.milestoneProgress}
                    totalXp={myRank.totalXp}
                />
                {/* snapshot freshness — the board is cached server-side */}
                {updatedAtLabel ? (
                    <Typography type="body-xs" color="muted">{updatedAtLabel}</Typography>
                ) : null}
            </CardContent>
        </Card>
    )
}
