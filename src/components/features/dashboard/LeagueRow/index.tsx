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
    UserAvatar,
} from "@/components/blocks/identity/UserAvatar"
import {
    RankDeltaCaret,
} from "@/components/features/profile/RankDeltaCaret"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import type { QueryMyLeagueEntryData } from "@/modules/api/graphql/queries/types/league"

/** Props for {@link LeagueRow}. */
export interface LeagueRowProps extends WithClassNames<undefined> {
    /** The ranked cohort member to render. */
    entry: QueryMyLeagueEntryData
    /** Whether this member sits in the promotion zone (green tint). */
    isPromote: boolean
    /** Whether this member sits in the demotion zone (red tint). */
    isDemote: boolean
    /** Whether this row is the viewer themselves (primary tint, wins over zones). */
    isMe: boolean
}

/**
 * One full-width row of the weekly-league board: rank · avatar · name · week
 * points · rank-movement caret. Zone tints (promote/demote) and the viewer's
 * own highlight come from the parent, which knows the cohort cut lines. Shared
 * by the dashboard {@link LeagueRow} card and the full `/league` page.
 *
 * @param props - {@link LeagueRowProps}
 */
export const LeagueRow = ({
    entry,
    isPromote,
    isDemote,
    isMe,
    className,
}: LeagueRowProps) => {
    const t = useTranslations()
    const locale = useLocale()

    // avatar + name: the only clickable target (→ the member's public profile),
    // dimming on hover. Plain text styling — not a coloured/underlined link.
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
            className={cn(
                "flex w-full items-center gap-2 rounded-3xl p-2",
                isMe && "bg-primary/10",
                !isMe && isPromote && "bg-success-soft",
                !isMe && isDemote && "bg-danger-soft",
                className,
            )}
        >
            <span className="w-6 shrink-0 text-right text-xs text-muted">
                {entry.rank}
            </span>
            {identity}
            {/* trailing value (meta) → muted + same size as the name on this row
                (text-sm); left=primary foreground, right=muted meta. Thầy 2026-07-17. */}
            <span className="shrink-0 text-sm text-muted">
                {t("dashboard.league.points", {
                    count: entry.weekPoints,
                })}
            </span>
            {/* rank movement vs last week — pinned to the far right */}
            <RankDeltaCaret delta={entry.rankDelta} className="w-8 shrink-0 justify-end" />
        </div>
    )
}
