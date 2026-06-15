"use client"

import { CrownDiamond as CrownIcon } from "@gravity-ui/icons"
import React from "react"
import { Chip, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { UserAvatar } from "@/components/reuseable"
import type { CourseLeaderboardEntry } from "@/modules/api/graphql"
import type { WithClassNames } from "@/modules/types"


/** Props for {@link LeaderboardPodium}. */
export interface LeaderboardPodiumProps extends WithClassNames<undefined> {
    /** Top entries (only the first three are rendered). */
    entries: Array<CourseLeaderboardEntry>
    /** Current viewer's user id — highlights their pedestal. */
    viewerUserId?: string | null
}

/** Per-rank visual presets: avatar size, accent ring, and pedestal height. */
const RANK_STYLE: Record<1 | 2 | 3, { avatar: "md" | "lg"; ring: string; pedestal: string; chip: "warning" | "default" }> = {
    1: { avatar: "lg", ring: "ring-2 ring-warning", pedestal: "h-24 bg-warning/15", chip: "warning" },
    2: { avatar: "md", ring: "ring-2 ring-default-300", pedestal: "h-16 bg-default-100", chip: "default" },
    3: { avatar: "md", ring: "ring-2 ring-default-300", pedestal: "h-12 bg-default-100", chip: "default" },
}

/**
 * Top-3 podium: the rank-1 learner sits center on the tallest pedestal with a
 * crown, flanked by rank 2 (left) and rank 3 (right). Stacks naturally on
 * narrow screens. Renders nothing when there are no entries.
 * @param props - {@link LeaderboardPodiumProps}
 */
export const LeaderboardPodium = ({ entries, viewerUserId, className }: LeaderboardPodiumProps) => {
    const t = useTranslations()
    const top = entries.slice(0, 3)
    if (top.length === 0) {
        return null
    }

    // display order places rank 1 in the middle: [2nd, 1st, 3rd]
    const ordered = [top[1], top[0], top[2]].filter(Boolean) as Array<CourseLeaderboardEntry>

    return (
        <div className={cn("flex items-end justify-center gap-3 sm:gap-6", className)}>
            {ordered.map((entry) => {
                const style = RANK_STYLE[entry.rank as 1 | 2 | 3] ?? RANK_STYLE[3]
                const isViewer = !!viewerUserId && entry.userId === viewerUserId
                return (
                    <div
                        key={entry.enrollmentId}
                        className="flex flex-1 flex-col items-center gap-1.5"
                    >
                        {/* crown only on the champion */}
                        {entry.rank === 1 && (
                            <CrownIcon
                                className="size-6 text-warning"
                                aria-hidden
                            />
                        )}
                        <UserAvatar
                            username={entry.username}
                            avatar={entry.avatar}
                            size={style.avatar}
                            className={cn(style.ring, isViewer && "ring-accent")}
                        />
                        <div className="flex flex-col items-center gap-0 text-center">
                            <span className="line-clamp-1 max-w-28 text-sm font-medium text-foreground">
                                {isViewer ? t("leaderboard.you") : entry.username}
                            </span>
                            <span className="text-xs font-semibold text-accent">
                                {t("leaderboard.xp", { xp: entry.totalXp })}
                            </span>
                        </div>
                        {/* pedestal: height encodes the rank */}
                        <div
                            className={cn(
                                "flex w-full items-start justify-center rounded-t-xl pt-1.5",
                                style.pedestal,
                            )}
                        >
                            <Chip size="sm" variant="soft" color={style.chip}>
                                {entry.rank}
                            </Chip>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
