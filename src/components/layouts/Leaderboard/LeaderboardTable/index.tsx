"use client"

import React from "react"
import { Chip, Tooltip, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/components/reuseable"
import type { CourseLeaderboardEntry } from "@/modules/api/graphql"
import { XpBreakdown } from "../XpBreakdown"

/** Props for {@link LeaderboardTable}. */
export interface LeaderboardTableProps {
    /** Rows to render (typically the entries below the podium). */
    entries: Array<CourseLeaderboardEntry>
    /** Current viewer's user id — highlights their row. */
    viewerUserId?: string | null
}

/**
 * Ranked rows below the podium: rank, learner (avatar + name, "You" chip on the
 * viewer's own row), a compact challenge/reading stat line, and the total XP with
 * a hover breakdown. Renders nothing when there are no rows.
 * @param props - {@link LeaderboardTableProps}
 */
export const LeaderboardTable = ({ entries, viewerUserId }: LeaderboardTableProps) => {
    const t = useTranslations()
    if (entries.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col gap-1.5">
            {entries.map((entry) => {
                const isViewer = !!viewerUserId && entry.userId === viewerUserId
                return (
                    <div
                        key={entry.enrollmentId}
                        className={cn(
                            "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                            isViewer ? "bg-accent/10" : "hover:bg-default-50",
                        )}
                    >
                        {/* rank position */}
                        <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted">
                            {entry.rank}
                        </span>
                        <UserAvatar
                            username={entry.username}
                            avatar={entry.avatar}
                            size="sm"
                            className={cn(isViewer && "ring-2 ring-accent")}
                        />
                        {/* learner name + stat line */}
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="line-clamp-1 text-sm font-medium text-foreground">
                                    {entry.username}
                                </span>
                                {isViewer && (
                                    <Chip size="sm" variant="soft" color="accent">
                                        {t("leaderboard.you")}
                                    </Chip>
                                )}
                            </div>
                            <span className="line-clamp-1 text-xs text-muted">
                                {t("leaderboard.stats.completedChallenges", { count: entry.completedChallenges })}
                                {" · "}
                                {t("leaderboard.stats.lessonsRead", { count: entry.lessonsRead })}
                            </span>
                        </div>
                        {/* total XP with a hover breakdown */}
                        <Tooltip delay={300}>
                            <Tooltip.Trigger>
                                <span className="shrink-0 cursor-default text-sm font-semibold text-accent">
                                    {t("leaderboard.xp", { xp: entry.totalXp })}
                                </span>
                            </Tooltip.Trigger>
                            <Tooltip.Content placement="left" showArrow>
                                <Tooltip.Arrow />
                                <XpBreakdown
                                    totalScore={entry.totalScore}
                                    lessonsRead={entry.lessonsRead}
                                    milestoneProgress={entry.milestoneProgress}
                                    totalXp={entry.totalXp}
                                />
                            </Tooltip.Content>
                        </Tooltip>
                    </div>
                )
            })}
        </div>
    )
}
