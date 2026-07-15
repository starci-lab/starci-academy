"use client"

import React, {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    VideoCameraIcon,
} from "@phosphor-icons/react"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyUpcomingLivestreamsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyUpcomingLivestreamsSwr"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"

/** How many upcoming sessions to list (the soonest plus a few more). */
const MAX_ROWS = 3

/** Props for {@link UpcomingLivestreamCard}. */
export type UpcomingLivestreamCardProps = WithClassNames<undefined>

/**
 * Right-rail card surfacing the viewer's next live sessions across enrolled
 * courses (soonest first), so a scheduled stream is visible from the home surface
 * instead of buried in a course page. The soonest session leads with a relative
 * countdown ("in Nd Nh"); a short list of the next few follows. Self-fetches its
 * own leaf query; shows a skeleton while loading, then hides entirely (no
 * emptyContent) when there is nothing upcoming — matches the sibling right-rail
 * widgets (`WhoToFollow`) that self-hide rather than render an empty-state.
 * @param props - optional className for the root element.
 */
export const UpcomingLivestreamCard = ({
    className,
}: UpcomingLivestreamCardProps) => {
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

    return (
        <AsyncContent
            isLoading={data === undefined || isLoading}
            skeleton={(
                <SectionCard
                    icon={<VideoCameraIcon className="size-5 text-accent-soft-foreground" />}
                    title={t("dashboard.upcomingLive.title")}
                    className={className}
                >
                    <SurfaceListCard bordered>
                        {[0, 1, 2].map((row) => (
                            <Skeleton.ListRow key={row} withSubtitle className="px-4" />
                        ))}
                    </SurfaceListCard>
                </SectionCard>
            )}
            isEmpty={sessions.length === 0}
            error={data === undefined ? error : undefined}
            errorContent={{
                title: t("dashboard.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
        >
            <SectionCard
                icon={<VideoCameraIcon className="size-5 text-accent-soft-foreground" />}
                title={t("dashboard.upcomingLive.title")}
                className={className}
            >
                <SurfaceListCard bordered>
                    {sessions.map((session) => (
                        <SurfaceListCardRow
                            key={`${session.courseGlobalId}-${session.nextStartAt}`}
                            leading={<IconTile icon={<VideoCameraIcon />} tone="accent" size="sm" />}
                            title={session.sessionTitle ?? session.courseTitle}
                            subtitle={session.sessionTitle ? session.courseTitle : undefined}
                            meta={(
                                <span className="text-xs font-medium text-accent-soft-foreground">
                                    {relativeLabel(session.nextStartAt)}
                                    {" · "}
                                    {new Date(session.nextStartAt).toLocaleDateString(locale)}
                                </span>
                            )}
                            href={pathConfig().locale(locale).course(session.courseDisplayId).build()}
                        />
                    ))}
                </SurfaceListCard>
            </SectionCard>
        </AsyncContent>
    )
}
