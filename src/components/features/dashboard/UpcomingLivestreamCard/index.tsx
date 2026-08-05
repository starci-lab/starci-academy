"use client"

import React, {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import { useQueryMyUpcomingLivestreamsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyUpcomingLivestreamsSwr"
import {
    _UpcomingLivestreamCard,
    MAX_ROWS,
    type UpcomingLivestreamCardSession,
} from "./component"

/**
 * Right-rail card surfacing the viewer's next live sessions across enrolled
 * courses (soonest first) — the CONNECTED half. Self-fetches its own leaf query,
 * resolves the relative countdown + locale date for each row, and hands the
 * result to the presentational `_UpcomingLivestreamCard`. See `tiers/split.md`.
 */
export const UpcomingLivestreamCard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error, mutate } = useQueryMyUpcomingLivestreamsSwr()

    /** The soonest few sessions, sorted defensively by start time. */
    const sessions = useMemo(
        () => {
            return [...(data ?? [])]
                .sort(
                    (a, b) => new Date(a.nextStartAt).getTime()
                        - new Date(b.nextStartAt).getTime(),
                )
                .slice(0, MAX_ROWS)
        },
        [
            data,
        ],
    )

    /**
     * A short relative label until `iso` ("in Nd Nh" / "in Nh Nm" / "now"). Past
     * timestamps collapse to "now" since the list only holds upcoming sessions.
     */
    const relativeLabel = (iso: string) => {
        const remaining = new Date(iso).getTime() - Date.now()
        if (remaining <= 0) {
            return t("dashboard.upcomingLive.now")
        }
        const days = Math.floor(remaining / 86_400_000)
        const hours = Math.floor((remaining % 86_400_000) / 3_600_000)
        const minutes = Math.floor((remaining % 3_600_000) / 60_000)
        if (days > 0) {
            return t("dashboard.upcomingLive.inDays", {
                days,
                hours,
            })
        }
        if (hours > 0) {
            return t("dashboard.upcomingLive.inHours", {
                hours,
                minutes,
            })
        }
        return t("dashboard.upcomingLive.inMinutes", {
            minutes,
        })
    }

    /** Sessions resolved into the presentational row shape (relative + absolute labels, course link). */
    const sessionRows: Array<UpcomingLivestreamCardSession> = sessions.map((session) => ({
        key: `${session.courseGlobalId}-${session.nextStartAt}`,
        title: session.sessionTitle ?? session.courseTitle,
        subtitle: session.sessionTitle ? session.courseTitle : undefined,
        relativeLabel: relativeLabel(session.nextStartAt),
        dateLabel: new Date(session.nextStartAt).toLocaleDateString(locale),
        href: pathConfig().locale(locale).course(session.courseDisplayId).build(),
    }))

    return (
        <_UpcomingLivestreamCard
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={data === undefined && isLoading}
            isEmpty={sessions.length === 0}
            // only a settled fetch error (nothing in hand) reaches the block
            error={data === undefined ? error : undefined}
            onRetry={() => { void mutate() }}
            sessions={sessionRows}
            labels={{
                title: t("dashboard.upcomingLive.title"),
                errorTitle: t("dashboard.loadError"),
                retry: t("dashboard.retry"),
            }}
        />
    )
}
