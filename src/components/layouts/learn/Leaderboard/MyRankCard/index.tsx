"use client"

import React from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/components/reuseable"
import type { CourseLeaderboardMyRank } from "@/modules/api/graphql"
import { XpBreakdown } from "../XpBreakdown"

/** Props for {@link MyRankCard}. */
export interface MyRankCardProps {
    /** The viewer's standing, or null when they have no activity yet. */
    myRank: CourseLeaderboardMyRank | null
    /** Viewer's display name (snapshot from the user slice). */
    username?: string | null
    /** Viewer's avatar URL (snapshot from the user slice). */
    avatar?: string | null
    /** Extra classes on the root. */
    className?: string
}

/**
 * The viewer's own standing, pinned regardless of whether they land in the top
 * window. Shows rank, total XP, and the XP breakdown; falls back to a prompt
 * when the viewer has no scored activity in the course.
 * @param props - {@link MyRankCardProps}
 */
export const MyRankCard = ({ myRank, username, avatar, className }: MyRankCardProps) => {
    const t = useTranslations()

    // no activity → invite the learner to start scoring instead of an empty rank
    if (!myRank) {
        return (
            <Card className={cn("w-full border-accent/30 bg-accent/5", className)}>
                <CardContent className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">
                        {t("leaderboard.yourRank")}
                    </span>
                    <p className="text-sm text-muted">{t("leaderboard.myRankEmpty")}</p>
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
                        <span className="text-xs text-muted">{t("leaderboard.rankPrefix")}</span>
                        <span className="text-2xl font-bold text-accent">#{myRank.rank}</span>
                    </div>
                    <UserAvatar
                        username={username}
                        avatar={avatar}
                        size="md"
                        className="ring-2 ring-accent"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-semibold text-foreground">
                            {t("leaderboard.you")}
                        </span>
                        <span className="text-sm font-bold text-accent">
                            {t("leaderboard.xp", { xp: myRank.totalXp })}
                        </span>
                    </div>
                </div>
                {/* how the viewer's XP was earned */}
                <XpBreakdown
                    totalScore={myRank.totalScore}
                    lessonsRead={myRank.lessonsRead}
                    milestoneProgress={myRank.milestoneProgress}
                    totalXp={myRank.totalXp}
                />
            </CardContent>
        </Card>
    )
}
