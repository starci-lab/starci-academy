"use client"

import React, { useCallback, useMemo } from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyLeagueSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyLeagueSwr"
import type { QueryMyLeagueEntryData } from "@/modules/api/graphql/queries/types/league"
import {
    _LeagueCard,
    type LeagueCardEntry,
} from "./component"

/** How many top-of-cohort rows to show before truncating (no inner scroll). */
const TOP_ROWS = 5

/** Props for {@link LeagueCard}. */
export interface LeagueCardProps {
    /**
     * When true, render the league inside a `LabeledCard` (title as a Label OUTSIDE
     * the card) instead of the flat inline heading — used on the DashboardPage Community
     * tab so it matches the other LabeledCard sections. Defaults to the flat layout
     * (the standalone /league page). Kept for API compatibility with `_LeagueCard`;
     * the card is always framed now.
     */
    framed?: boolean
}

/** Resolve one query entry into the display-ready {@link LeagueCardEntry} the presentational half renders. */
const toEntry = (
    entry: QueryMyLeagueEntryData,
    locale: string,
    meUsername: string | undefined,
    pointsLabel: string,
): LeagueCardEntry => ({
    userGlobalId: entry.userGlobalId,
    rank: entry.rank,
    username: entry.username,
    avatar: entry.avatar,
    rankDelta: entry.rankDelta,
    isMe: Boolean(meUsername) && entry.username === meUsername,
    profileHref: pathConfig().locale(locale).profile(entry.username ?? undefined).build(),
    pointsLabel,
})

/**
 * Compact weekly-league card for the DashboardPage — the CONNECTED half: self-fetches the
 * league leaf query, computes the async decisions and every derived value (standing,
 * top rows, the pinned self-row), resolves all i18n, and hands them to the
 * presentational {@link _LeagueCard}. `isSkeleton` uses the nullish form so the shimmer
 * holds until data actually arrives (and never on a falsy-but-valid value). See
 * `tiers/split.md`.
 * @param props - {@link LeagueCardProps}
 */
export const LeagueCard = ({
    framed = false}: LeagueCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const me = useAppSelector((state) => state.user.user)
    const { data, isLoading } = useQueryMyLeagueSwr()

    // first load, nothing in hand → shimmer (same condition the pre-split `AsyncContent` used)
    const isSkeleton = data === null || data === undefined || isLoading
    // not yet placed in a cohort → translated empty state (join hint), not self-hide
    const isEmpty = data === null || data === undefined || data.entries.length === 0

    /** Open the full leaderboard/league page (see-more link in the card header). */
    const onSeeMore = useCallback(
        () => router.push(pathConfig().locale(locale).league().build()),
        [router, locale],
    )

    const total = data?.entries.length ?? 0
    const myEntry = data && me?.username
        ? data.entries.find((entry) => entry.username === me.username)
        : undefined
    const myPercent = myEntry ? Math.max(1, Math.ceil((myEntry.rank / total) * 100)) : null

    // top slice INCLUDING the viewer in place; a pinned self-row follows when the
    // viewer sits below it.
    const topRows = data ? data.entries.slice(0, TOP_ROWS) : []
    const viewerInTop = myEntry
        ? topRows.some((entry) => entry.userGlobalId === myEntry.userGlobalId)
        : true
    const showSelfRow = Boolean(myEntry) && !viewerInTop
    const hiddenBetween = showSelfRow && myEntry
        ? Math.max(0, myEntry.rank - topRows.length - 1)
        : 0

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return { days: 0, hours: 0 }
            }
            const remaining = Math.max(0, new Date(data.weekEndAt).getTime() - Date.now())
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [data],
    )

    /** "N pts" label for one entry's weekly points, already translated. */
    const pointsLabel = useCallback(
        (weekPoints: number) => t("DashboardPage.league.points", { count: weekPoints }),
        [t],
    )

    return (
        <_LeagueCard
            framed={framed}
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            title={t("DashboardPage.league.title")}
            titleHelp={t("DashboardPage.league.help")}
            onSeeMore={onSeeMore}
            seeMoreLabel={t("DashboardPage.league.seeMore")}
            standing={myEntry && myPercent !== null ? {
                rank: myEntry.rank,
                primary: t("DashboardPage.myProfile.rankLine", {
                    rank: myEntry.rank,
                    percent: myPercent,
                }),
                secondary: `${pointsLabel(myEntry.weekPoints)} · ${t("DashboardPage.league.resetIn", {
                    days: countdown.days,
                    hours: countdown.hours,
                })}`,
            } : undefined}
            entries={topRows.map((entry) => toEntry(entry, locale, me?.username, pointsLabel(entry.weekPoints)))}
            selfEntry={showSelfRow && myEntry ? toEntry(myEntry, locale, me?.username, pointsLabel(myEntry.weekPoints)) : undefined}
            ellipsisLabel={hiddenBetween > 0
                ? t("DashboardPage.league.othersCount", { count: hiddenBetween })
                : undefined}
            meLabel={t("DashboardPage.league.you")}
            emptyTitle={t("DashboardPage.league.emptyTitle")}
            emptyDescription={t("DashboardPage.league.emptyDescription")}
        />
    )
}

export default LeagueCard
