"use client"

import React, {
    useMemo,
} from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useQueryMyLeagueSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    LeagueRow,
} from "@/components/reuseable"
import {
    LeagueTier,
    LeagueTierBadge,
} from "@/components/reuseable/LeagueTierBadge"
import {
    InfoTooltip,
} from "@/components/blocks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** How many top-of-cohort rows to show before truncating (no inner scroll). */
const TOP_ROWS = 5

/** Props for {@link LeagueCard}. */
export type LeagueCardProps = WithClassNames<undefined>

/**
 * Compact weekly-league card for the dashboard RIGHT rail. Replaces the old
 * centre-column league block whose inner `max-h` scroll fought the page scroll:
 * here the cohort is **capped** at {@link TOP_ROWS} rows (no nested scroll), with
 * the viewer's own row appended when they sit outside the top and a "+N others"
 * footer for the remainder. Surfaces tier + reset countdown + the viewer's rank.
 * Self-fetches its own leaf query; renders nothing until the viewer is in a cohort.
 * @param props - optional className for the root element.
 */
export const LeagueCard = ({
    className,
}: LeagueCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data } = useQueryMyLeagueSwr()
    const me = useAppSelector((state) => state.user.user)

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return null
            }
            const remaining = Math.max(
                0,
                new Date(data.weekEndAt).getTime() - Date.now(),
            )
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
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

    const total = data.entries.length
    const demoteFrom = total - data.demoteCount

    // the viewer's own standing (best-effort username match — no raw id on entries)
    const myEntry = me?.username
        ? data.entries.find((entry) => entry.username === me.username)
        : undefined
    const myPercent = myEntry
        ? Math.max(1, Math.ceil((myEntry.rank / total) * 100))
        : null

    // top rows, then the viewer's own row if it falls outside the visible top
    const topRows = data.entries.slice(0, TOP_ROWS)
    const showMyRow = Boolean(myEntry) && (myEntry?.rank ?? 0) > TOP_ROWS
    // people not represented by a visible row (top rows + the appended self row)
    const hiddenCount = Math.max(0, total - TOP_ROWS - (showMyRow ? 1 : 0))

    /** Render one full-width cohort row (rank · avatar · name · points · caret). */
    const renderRow = (entry: typeof data.entries[number]) => (
        <LeagueRow
            key={entry.userGlobalId}
            entry={entry}
            isPromote={entry.rank <= data.promoteCount}
            isDemote={entry.rank > demoteFrom}
            isMe={Boolean(me?.username) && entry.username === me?.username}
        />
    )

    return (
        <div className={cn("flex w-full flex-col gap-3", className)}>
            <div className="font-semibold">
                <InfoTooltip
                    title={t("dashboard.league.title")}
                    description={t("dashboard.league.help")}
                >
                    {t("dashboard.league.title")}
                </InfoTooltip>
            </div>
            {/* tier + reset countdown */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                    <InfoTooltip description={t("dashboard.league.tierHelp")}>
                        <LeagueTierBadge
                            tier={data.tier as LeagueTier}
                        />
                    </InfoTooltip>
                    {myEntry && myPercent !== null ? (
                        <span className="text-sm">
                            {t("dashboard.myProfile.rankLine", {
                                rank: myEntry.rank,
                                percent: myPercent,
                            })}
                        </span>
                    ) : null}
                </div>
                {countdown ? (
                    <span className="text-xs text-muted">
                        {t("dashboard.league.resetIn", {
                            days: countdown.days,
                            hours: countdown.hours,
                        })}
                    </span>
                ) : null}
            </div>

            {/* promote / demote legend */}
            <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-3xl bg-success" />
                    {t("dashboard.league.promote", {
                        count: data.promoteCount,
                    })}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full bg-danger" />
                    {t("dashboard.league.demote", {
                        count: data.demoteCount,
                    })}
                </span>
            </div>

            {/* capped cohort — no inner scroll; viewer's row appended if outside top */}
            <div className="flex w-full flex-col gap-1.5">
                {topRows.map(renderRow)}
                {showMyRow && myEntry ? renderRow(myEntry) : null}
            </div>

            {/* "+N others" + full-board link, inline on one line */}
            <div className="flex items-center gap-1.5 text-xs">
                {hiddenCount > 0 ? (
                    <span className="text-muted">
                        {t("dashboard.league.others", {
                            count: hiddenCount,
                        })}
                    </span>
                ) : null}
                <Link
                    href={pathConfig().locale(locale).league().build()}
                    className="inline-flex items-center text-xs font-medium text-accent hover:underline"
                >
                    {t("dashboard.league.seeMore")}
                </Link>
            </div>
        </div>
    )
}
