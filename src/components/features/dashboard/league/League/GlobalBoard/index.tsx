"use client"

import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import {
    UserAvatar,
} from "@/components/blocks/identity/UserAvatar"
import {
    GlobalBoardSkeleton,
} from "./GlobalBoardSkeleton"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryGlobalLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useQueryGlobalLeaderboardSwr"
import { useAppSelector } from "@/redux/hooks"
import type { QueryGlobalLeaderboardEntryData } from "@/modules/api/graphql/queries/types/league"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Props for {@link GlobalBoard}. */
export type GlobalBoardProps = WithClassNames<undefined>

/**
 * The global (all-users) leaderboard ranked by total reward points: a subtitle,
 * the viewer's own rank, then the top users. Self-fetches its own leaf query.
 *
 * @param props - optional className for the root element.
 */
export const GlobalBoard = ({
    className,
}: GlobalBoardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading } = useQueryGlobalLeaderboardSwr()
    const me = useAppSelector((state) => state.user.user)

    /** Render one full-width leaderboard row (rank · avatar · name · points). */
    const renderRow = (entry: QueryGlobalLeaderboardEntryData) => {
        const isMe = Boolean(me?.username) && entry.username === me?.username
        // avatar + name: the only clickable target (→ profile), dimming on hover
        const identity = entry.username ? (
            <Link
                href={pathConfig().locale(locale).profile(entry.username).build()}
                className="flex min-w-0 flex-1 items-center gap-2 text-foreground no-underline transition-opacity hover:opacity-60"
            >
                <UserAvatar
                    className="size-8 shrink-0"
                    username={entry.username}
                    avatar={entry.avatar}
                    seed={entry.username}
                />
                <span className="truncate text-sm">
                    {entry.username}
                </span>
            </Link>
        ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <UserAvatar
                    className="size-8 shrink-0"
                    username=""
                    avatar={entry.avatar}
                    seed={entry.userGlobalId}
                />
                <span className="truncate text-sm text-foreground">
                    —
                </span>
            </div>
        )
        return (
            <div
                key={entry.userGlobalId}
                className={cn(
                    "flex w-full items-center gap-2 rounded-3xl p-2",
                    isMe && "bg-primary/10",
                )}
            >
                <span className="w-8 shrink-0 text-right text-xs text-muted">
                    {entry.rank}
                </span>
                {identity}
                <span className="shrink-0 text-xs font-medium text-foreground">
                    {t("dashboard.league.points", {
                        count: entry.points,
                    })}
                </span>
            </div>
        )
    }

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={<GlobalBoardSkeleton className={className} />}
            isEmpty={!data}
        >
            {data ? (
                <div className={cn("flex flex-col gap-3", className)}>
                    {/* subtitle + the viewer's own standing */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted">
                            {t("dashboard.league.globalSubtitle")}
                        </span>
                        <span className="text-sm font-semibold text-accent-soft-foreground">
                            {t("dashboard.league.yourRank")} · {data.myRank}
                        </span>
                    </div>

                    {/* the global top N */}
                    <div className="flex flex-col gap-2">
                        {data.entries.map(renderRow)}
                    </div>
                </div>
            ) : null}
        </AsyncContent>
    )
}
