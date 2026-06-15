"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryMyLeagueSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    LeagueTierBadge,
    LeagueTier,
} from "@/components/reuseable/LeagueTierBadge"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link League}. */
export type LeagueProps = WithClassNames<undefined>

/**
 * Duolingo-style weekly-league standing rendered on the dashboard: the viewer's
 * tier badge + a reset countdown, then the ranked cohort with promotion (top)
 * and demotion (bottom) zones highlighted and the viewer's own row marked.
 * Self-fetches its own leaf query (layout container — no data props).
 * @param props - optional className for the root element.
 */
export const League = ({
    className,
}: LeagueProps) => {
    const t = useTranslations()
    const { data } = useQueryMyLeagueSwr()
    const me = useAppSelector((state) => state.user.user)

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return null
            }
            // remaining ms until the week window closes (clamp at 0)
            const remaining = Math.max(
                0,
                new Date(data.weekEndAt).getTime() - Date.now(),
            )
            const days = Math.floor(remaining / 86_400_000)
            const hours = Math.floor((remaining % 86_400_000) / 3_600_000)
            return {
                days,
                hours,
            }
        },
        [
            data,
        ],
    )

    // nothing to show until the viewer is placed in a cohort
    if (!data || data.entries.length === 0) {
        return null
    }

    // zone boundaries: top `promoteCount` ranks promote, bottom `demoteCount` demote
    const total = data.entries.length
    const demoteFrom = total - data.demoteCount

    return (
        <div className={cn("flex flex-col gap-3 p-3",
            className)}
        >
            {/* tier header + reset countdown */}
            <div className="flex items-center justify-between gap-3">
                <LeagueTierBadge
                    tier={data.tier as LeagueTier}
                    size={28}
                    showLabel
                />
                {countdown ? (
                    <div className="text-xs text-muted">
                        {t("dashboard.league.resetIn",
                            {
                                days: countdown.days,
                                hours: countdown.hours,
                            })}
                    </div>
                ) : null}
            </div>

            {/* promote / demote legend */}
            <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
                    {t("dashboard.league.promote",
                        {
                            count: data.promoteCount,
                        })}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />
                    {t("dashboard.league.demote",
                        {
                            count: data.demoteCount,
                        })}
                </span>
            </div>

            {/* ranked cohort (scrolls; zones + the viewer's row are highlighted) */}
            <div className="flex max-h-[360px] flex-col gap-1.5 overflow-y-auto">
                {data.entries.map((entry) => {
                    // promotion zone (top) / demotion zone (bottom) tints
                    const isPromote = entry.rank <= data.promoteCount
                    const isDemote = entry.rank > demoteFrom
                    // best-effort "you" match by username (no raw id on the entry)
                    const isMe = Boolean(me?.username) && entry.username === me?.username
                    return (
                        <div
                            key={entry.userGlobalId}
                            className={cn(
                                "flex items-center gap-1.5 rounded-medium px-1.5 py-1",
                                isMe && "bg-primary/10",
                                !isMe && isPromote && "bg-success/10",
                                !isMe && isDemote && "bg-danger/10",
                            )}
                        >
                            <span className="w-6 shrink-0 text-right text-xs text-muted">
                                {entry.rank}
                            </span>
                            <UserAvatar
                                className="size-6 shrink-0"
                                username={entry.username ?? ""}
                                avatar={entry.avatar}
                                seed={entry.username ?? entry.userGlobalId}
                            />
                            <span className="flex-1 truncate text-sm text-foreground">
                                {entry.username ?? "—"}
                            </span>
                            <span className="shrink-0 text-xs font-medium text-foreground">
                                {t("dashboard.league.points",
                                    {
                                        count: entry.weekPoints,
                                    })}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
