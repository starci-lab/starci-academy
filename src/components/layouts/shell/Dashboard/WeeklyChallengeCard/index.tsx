"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    Flame as FlameIcon,
} from "@gravity-ui/icons"
import {
    useQueryWeeklyChallengeSwr,
} from "@/hooks"
import {
    SectionCard,
} from "@/components/reuseable"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import {
    EntityToken,
} from "../EntityToken"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** How many leaderboard rows to show before truncating. */
const TOP_ROWS = 5

/** Props for {@link WeeklyChallengeCard}. */
export type WeeklyChallengeCardProps = WithClassNames<undefined>

/**
 * Right-rail "weekly challenge" event card. Surfaces the featured challenge of
 * the week: its title (routable via {@link EntityToken}), a live countdown to the
 * close, the viewer's pass status (success chip when done, else a "try now"
 * link), the total pass count and a short leaderboard of recent finishers.
 * Self-fetches its own leaf query and hides entirely when no event is active.
 * @param props - optional className for the root element.
 */
export const WeeklyChallengeCard = ({
    className,
}: WeeklyChallengeCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data } = useQueryWeeklyChallengeSwr()

    /** Days/hours left until the event closes (computed from `weekEndAt`). */
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

    /** Locale-aware relative-time formatter for the "passed N ago" labels. */
    const relativeFormatter = useMemo(
        () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        [
            locale,
        ],
    )

    /** Render a coarse "x ago" label for an ISO timestamp. */
    const formatRelative = (iso: string) => {
        const diffMs = new Date(iso).getTime() - Date.now()
        const minutes = Math.round(diffMs / 60_000)
        if (Math.abs(minutes) < 60) {
            return relativeFormatter.format(minutes, "minute")
        }
        const hours = Math.round(minutes / 60)
        if (Math.abs(hours) < 24) {
            return relativeFormatter.format(hours, "hour")
        }
        return relativeFormatter.format(Math.round(hours / 24), "day")
    }

    // no active event (or not loaded yet) → no card
    if (!data) {
        return null
    }

    const topRows = data.leaderboard.slice(0, TOP_ROWS)

    return (
        <SectionCard
            icon={<FlameIcon className="size-4 text-accent" />}
            title={t("weeklyChallenge.title")}
            className={className}
        >
            {/* featured challenge title (routable) */}
            <EntityToken
                globalId={data.challengeGlobalId}
                label={data.title}
            />

            {/* countdown + viewer status */}
            <div className="flex items-center justify-between gap-3">
                {countdown ? (
                    <span className="text-xs text-muted">
                        {t("weeklyChallenge.endsIn", {
                            days: countdown.days,
                            hours: countdown.hours,
                        })}
                    </span>
                ) : <span />}
                {data.viewerPassed ? (
                    <Chip color="success" size="sm" variant="soft">
                        <Chip.Label>
                            {t("weeklyChallenge.passed")}
                        </Chip.Label>
                    </Chip>
                ) : (
                    <EntityToken
                        globalId={data.challengeGlobalId}
                        label={t("weeklyChallenge.tryNow")}
                    />
                )}
            </div>

            {/* total passers */}
            <span className="text-xs text-muted">
                {t("weeklyChallenge.passedCount", {
                    count: data.passedCount,
                })}
            </span>

            {/* recent finishers */}
            {topRows.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                    {topRows.map((entry) => (
                        <div
                            key={entry.username}
                            className="flex items-center gap-1.5 rounded-medium px-1.5 py-1"
                        >
                            <UserAvatar
                                className="size-6 shrink-0"
                                username={entry.username}
                                avatar={entry.avatar}
                                seed={entry.username}
                            />
                            <span className="flex-1 truncate text-sm text-foreground">
                                {entry.username}
                            </span>
                            <span className="shrink-0 text-xs text-muted">
                                {formatRelative(entry.passedAt)}
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}
        </SectionCard>
    )
}
