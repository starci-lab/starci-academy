"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { RankDeltaCaret } from "@/components/features/profile/RankDeltaCaret"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import {
    LeaderboardListCard,
    LeaderboardRow,
} from "@/components/features/dashboard/league/LeaderboardListCard"
import type { QueryMyLeagueData } from "@/modules/api/graphql/queries/types/league"

/** How many top-of-cohort rows to show before truncating (no inner scroll). */
const TOP_ROWS = 5

/** Props for {@link LeagueCardContent}. */
export interface LeagueCardContentProps extends WithClassNames<undefined> {
    /** The resolved (non-null) weekly-league standing — supplied by the container. */
    data: QueryMyLeagueData
    /** Kept for API compatibility with the container; the card is always framed now. */
    framed?: boolean
}

/**
 * Dashboard "League tuần" card — maps the resolved weekly-league data into the shared
 * {@link LeaderboardListCard} (standing header with a rank-driven medal/cup badge, then
 * the top cohort as a medal-ranked list with a rank-movement caret per row). Renders
 * identically to the global {@link import("../../TopLearners").TopLearners} card; only
 * the trailing slot (caret vs follow) differs (thầy 2026-07-17 "2 mục y chang").
 *
 * @param props - {@link LeagueCardContentProps}
 */
export const LeagueCardContent = ({
    data,
    className,
}: LeagueCardContentProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const me = useAppSelector((state) => state.user.user)

    /** Open the full leaderboard/league page (see-more link in the card header). */
    const onSeeMore = useCallback(
        () => router.push(pathConfig().locale(locale).league().build()),
        [router, locale],
    )

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            const remaining = Math.max(0, new Date(data.weekEndAt).getTime() - Date.now())
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [data],
    )

    const total = data.entries.length
    const isMine = (username: string | null) => Boolean(me?.username) && username === me?.username

    const myEntry = me?.username
        ? data.entries.find((entry) => entry.username === me.username)
        : undefined
    const myPercent = myEntry ? Math.max(1, Math.ceil((myEntry.rank / total) * 100)) : null

    // top slice INCLUDING the viewer in place; a pinned self-row follows when the
    // viewer sits below it.
    const topRows = data.entries.slice(0, TOP_ROWS)
    const viewerInTop = myEntry
        ? topRows.some((entry) => entry.userGlobalId === myEntry.userGlobalId)
        : true
    const showSelfRow = Boolean(myEntry) && !viewerInTop
    const hiddenBetween = showSelfRow && myEntry
        ? Math.max(0, myEntry.rank - topRows.length - 1)
        : 0

    /** Map a cohort entry → a normalised {@link LeaderboardRow} (caret trailing). */
    const toRow = (entry: typeof data.entries[number]): LeaderboardRow => ({
        key: entry.userGlobalId,
        rank: entry.rank,
        username: entry.username,
        avatar: entry.avatar,
        valueLabel: t("dashboard.league.points", { count: entry.weekPoints }),
        isMe: isMine(entry.username),
        profileHref: pathConfig().locale(locale).profile(entry.username ?? undefined).build(),
        trailing: <RankDeltaCaret delta={entry.rankDelta} className="w-8 justify-end" />,
    })

    /** League title (with help tooltip) — the card label. */
    const titleNode = (
        <InfoTooltip
            title={t("dashboard.league.title")}
            description={t("dashboard.league.help")}
        >
            {t("dashboard.league.title")}
        </InfoTooltip>
    )

    return (
        <LeaderboardListCard
            className={className}
            title={titleNode}
            onSeeMore={onSeeMore}
            seeMoreLabel={t("dashboard.league.seeMore")}
            standing={myEntry && myPercent !== null ? {
                rank: myEntry.rank,
                primary: t("dashboard.myProfile.rankLine", {
                    rank: myEntry.rank,
                    percent: myPercent,
                }),
                secondary: (
                    <>
                        {t("dashboard.league.points", { count: myEntry.weekPoints })}
                        {` · ${t("dashboard.league.resetIn", {
                            days: countdown.days,
                            hours: countdown.hours,
                        })}`}
                    </>
                ),
            } : undefined}
            rows={topRows.map(toRow)}
            selfRow={showSelfRow && myEntry ? toRow(myEntry) : undefined}
            ellipsisLabel={hiddenBetween > 0
                ? t("dashboard.league.othersCount", { count: hiddenBetween })
                : undefined}
            meLabel={t("dashboard.league.you")}
        />
    )
}
