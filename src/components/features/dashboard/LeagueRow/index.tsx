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
    /**
     * Promotion/demotion zone this row sits in — drives a THIN left-edge marker
     * (`border-l` success/danger), NOT a full-row background flood. Omit when the
     * parent decides zones aren't meaningful (small cohort where the cut lines
     * overlap) so degenerate cohorts read as a clean flat list. `accent-system` §5:
     * status is a small detail, never a block fill.
     */
    zone?: "promote" | "demote"
    /**
     * Whether this row is the viewer themselves → `ring-accent` + accent rank/points
     * (a bounded "của tôi" signal), NOT a `bg` fill (`accent-system` §3). Pass
     * `className="ring-0"` to suppress the ring where the surface already frames it
     * as mine (e.g. inside a bordered "Hạng của bạn" card).
     */
    isMe: boolean
}

/**
 * One full-width row of the weekly-league board: rank · avatar · name · week
 * points · rank-movement caret. The promote/demote {@link LeagueRowProps.zone}
 * and the viewer's own highlight come from the parent, which knows the cohort cut
 * lines. Shared by the dashboard {@link LeagueRow} card and the full `/league` page.
 *
 * @param props - {@link LeagueRowProps}
 */
export const LeagueRow = ({
    entry,
    zone,
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
                // zone = thin left-edge marker only (never a bg flood)
                zone === "promote" && "border-l-2 border-success",
                zone === "demote" && "border-l-2 border-danger",
                // "của tôi" = ring + accent value, nền surface (accent-system §3)
                isMe && "ring-2 ring-accent",
                className,
            )}
        >
            <span
                className={cn(
                    "w-6 shrink-0 text-right text-xs",
                    isMe ? "font-semibold text-accent" : "text-muted",
                )}
            >
                {entry.rank}
            </span>
            {identity}
            {/* trailing value (meta) → muted + same size as the name on this row
                (text-sm); left=primary foreground, right=muted meta. Thầy 2026-07-17.
                "của tôi" → accent value (accent-system §3 detail). */}
            <span
                className={cn(
                    "shrink-0 text-sm",
                    isMe ? "font-semibold text-accent" : "text-muted",
                )}
            >
                {t("dashboard.league.points", {
                    count: entry.weekPoints,
                })}
            </span>
            {/* rank movement vs last week — pinned to the far right */}
            <RankDeltaCaret delta={entry.rankDelta} className="w-8 shrink-0 justify-end" />
        </div>
    )
}
