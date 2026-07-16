"use client"

import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    UserAvatar,
} from "@/components/blocks/identity/UserAvatar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** One podium finisher (top-3). */
export interface PodiumEntry {
    /** 1-based rank (1 · 2 · 3). */
    rank: number
    /** Display username (null → dash). */
    username: string | null
    /** Avatar URL (null → generated fallback). */
    avatar: string | null
    /** Pre-formatted points label (e.g. "1420đ"). */
    pointsLabel: React.ReactNode
    /** True when this finisher is the viewer → ring-accent avatar + accent name + label. */
    isMe?: boolean
}

/** Props for the {@link Podium} block. */
export interface PodiumProps extends WithClassNames<undefined> {
    /** Top finishers best→worst; at most 3 are shown. */
    entries: Array<PodiumEntry>
    /** Optional "you" label appended to the viewer's finisher (e.g. `t("...you")`). */
    meLabel?: React.ReactNode
}

/**
 * Top-3 leaderboard podium — the classic winners' dais (2nd · 1st · 3rd, the
 * champion centered and raised) that gives a global board its "who's winning"
 * moment. Presentational + props-only; the board owns the data. Accent lives
 * only on the champion's step (a single focal point, not a flood —
 * `accent-system`).
 *
 * @param props - {@link PodiumProps}
 */
export const Podium = ({
    entries,
    meLabel,
    className,
}: PodiumProps) => {
    const top = entries.slice(0, 3)
    // visual order: runner-up · champion · third — champion centered + raised
    const ordered = [top[1], top[0], top[2]].filter(Boolean) as Array<PodiumEntry>

    return (
        <div className={cn("flex items-end justify-center gap-3", className)}>
            {ordered.map((entry) => {
                const isChampion = entry.rank === 1
                return (
                    <div key={entry.rank} className="flex flex-col items-center gap-2">
                        <UserAvatar
                            // the viewer's own avatar is ringed (accent-system §3 "của tôi"
                            // = ring + value accent, NOT a filled step)
                            className={cn(
                                "shrink-0",
                                isChampion ? "size-14" : "size-12",
                                entry.isMe && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
                            )}
                            username={entry.username ?? ""}
                            avatar={entry.avatar}
                            seed={entry.username ?? String(entry.rank)}
                        />
                        <div className="flex w-20 flex-col items-center">
                            <Typography
                                type="body-sm"
                                weight="medium"
                                truncate
                                className={cn("max-w-full", entry.isMe && "text-accent-soft-foreground")}
                            >
                                {entry.username ?? "—"}
                                {entry.isMe && meLabel ? <> · {meLabel}</> : null}
                            </Typography>
                            <Typography type="body-xs" color="muted">
                                {entry.pointsLabel}
                            </Typography>
                        </div>
                        {/* the dais step — champion raised, marked by a ring + accent
                            number (NOT an accent fill: accent-system §5 + the
                            LeaderboardPodium ruling — the winner's bệ is not tinted) */}
                        <div
                            className={cn(
                                "flex w-20 items-center justify-center rounded-t-2xl font-bold",
                                isChampion
                                    ? "h-16 bg-surface text-accent ring-2 ring-inset ring-accent"
                                    : "h-10 bg-surface-secondary text-foreground",
                            )}
                        >
                            {entry.rank}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Podium
