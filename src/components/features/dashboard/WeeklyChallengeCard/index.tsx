"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import {
    EntityToken,
} from "../EntityToken"
import {
    WeeklyChallengeCardSkeleton,
} from "./WeeklyChallengeCardSkeleton"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryWeeklyChallengeSwr } from "@/hooks/swr/api/graphql/queries/useQueryWeeklyChallengeSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import {
    SurfaceListCard,
    SurfaceListCardRow,
} from "@/components/blocks/cards/SurfaceListCard"

/** How many leaderboard rows to show before truncating. */
const TOP_ROWS = 5

/** Props for {@link WeeklyChallengeCard}. */
export type WeeklyChallengeCardProps = WithClassNames<undefined>

/**
 * "Thử thách tuần" section — the featured challenge of the week: title (routable),
 * a live countdown, the viewer's pass status, total pass count, and a short
 * leaderboard of recent finishers. Owns its own `LabeledCard` frame (label outside)
 * and shows a standard empty state (frame stays) when no event is active.
 * Self-fetches its leaf query.
 * @param props - optional className for the root element.
 */
export const WeeklyChallengeCard = ({
    className,
}: WeeklyChallengeCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading } = useQueryWeeklyChallengeSwr()

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

    const topRows = data?.leaderboard.slice(0, TOP_ROWS) ?? []

    return (
        // AsyncContent only owns the loading branch (skeleton mirrors the full
        // LabeledCard frame). Once resolved, LabeledCard stays mounted and the
        // empty state (no event active) renders INSIDE it instead of self-hiding,
        // so the dashboard slot never disappears entirely.
        <AsyncContent
            isLoading={isLoading}
            skeleton={<WeeklyChallengeCardSkeleton className={className} />}
        >
            <LabeledCard
                label={t("weeklyChallenge.title")}
                className={className}
                contentClassName="flex flex-col gap-3"
            >
                {!data ? (
                    <EmptyContent
                        title={t("weeklyChallenge.emptyTitle")}
                        description={t("weeklyChallenge.emptyDescription")}
                    />
                ) : (
                    <>
                        {/* featured challenge title (routable) */}
                        <EntityToken
                            globalId={data.challengeGlobalId}
                            label={data.title}
                        />

                        {/* countdown + viewer status */}
                        <div className="flex items-center justify-between gap-3">
                            {countdown ? (
                                <Typography type="body-xs" color="muted">
                                    {t("weeklyChallenge.endsIn", {
                                        days: countdown.days,
                                        hours: countdown.hours,
                                    })}
                                </Typography>
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
                        <Typography type="body-xs" color="muted">
                            {t("weeklyChallenge.passedCount", {
                                count: data.passedCount,
                            })}
                        </Typography>

                        {/* recent finishers */}
                        {topRows.length > 0 ? (
                            <SurfaceListCard bordered>
                                {topRows.map((entry) => (
                                    <SurfaceListCardRow
                                        key={entry.username}
                                        leading={(
                                            <UserAvatar
                                                className="size-6 shrink-0"
                                                username={entry.username}
                                                avatar={entry.avatar}
                                                seed={entry.username}
                                            />
                                        )}
                                        title={entry.username}
                                        trailing={(
                                            <Typography type="body-xs" color="muted" className="shrink-0">
                                                {formatRelative(entry.passedAt)}
                                            </Typography>
                                        )}
                                    />
                                ))}
                            </SurfaceListCard>
                        ) : null}
                    </>
                )}
            </LabeledCard>
        </AsyncContent>
    )
}
