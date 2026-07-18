"use client"

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    WeeklyBoardSkeleton,
} from "./WeeklyBoardSkeleton"
import { StandingHeroCard } from "@/components/features/dashboard/league/StandingHeroCard"
import { Podium } from "@/components/features/dashboard/league/Podium"
import { rankBadgeIcon } from "@/components/features/dashboard/league/rankBadge"
import { Confetti } from "@/components/features/dashboard/league/Confetti"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { RankDeltaCaret } from "@/components/features/profile/RankDeltaCaret"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyLeagueSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyLeagueSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { pathConfig } from "@/resources/path"

/** Props for {@link WeeklyBoard}. */
export type WeeklyBoardProps = WithClassNames<undefined>

/**
 * The full weekly-league board — one shell shared with the global board:
 * a {@link StandingHeroCard} of the viewer's own standing (rank-driven
 * {@link IconTile} badge · goal-gradient meter · climb CTA), the top-3 {@link Podium}
 * (the viewer's own column ringed when they're a finisher), the promote/demote
 * legend, then rank 4+ in a {@link SurfaceListCard} (zone edge-markers + the
 * rank-movement caret). Self-fetches its leaf query; empty (not placed in a
 * cohort) funnels to courses.
 *
 * @param props - optional className for the root element.
 */
export const WeeklyBoard = ({
    className,
}: WeeklyBoardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading } = useQueryMyLeagueSwr()
    const me = useAppSelector((state) => state.user.user)

    /** Hours/days left until the weekly reset (computed from `weekEndAt`). */
    const countdown = useMemo(
        () => {
            if (!data) {
                return null
            }
            const remaining = Math.max(0, new Date(data.weekEndAt).getTime() - Date.now())
            return {
                days: Math.floor(remaining / 86_400_000),
                hours: Math.floor((remaining % 86_400_000) / 3_600_000),
            }
        },
        [data],
    )

    const total = data?.entries.length ?? 0

    /** Whether an entry belongs to the viewer (best-effort username match). */
    const isMine = (username: string | null) => Boolean(me?.username) && username === me?.username

    // the viewer's own standing + goal-gradient toward the promotion cutoff (all
    // computed FE from data already fetched — no BE change).
    const myEntry = data && me?.username
        ? data.entries.find((entry) => entry.username === me.username)
        : undefined
    const myPercent = myEntry ? Math.max(1, Math.ceil((myEntry.rank / total) * 100)) : null
    const promoteCutoff = data ? data.entries[data.promoteCount - 1] : undefined
    const inPromote = myEntry ? myEntry.rank <= (data?.promoteCount ?? 0) : false
    const pointsToPromote = myEntry && promoteCutoff && !inPromote
        ? Math.max(0, promoteCutoff.weekPoints - myEntry.weekPoints + 1)
        : 0

    /** Funnel to courses — climb the league by learning (the north-star CTA). */
    const onClimb = () => router.push(pathConfig().locale(locale).course().build())

    // celebrate a top-3 finish with a confetti burst when the viewer lands here
    // (the board remounts on tab switch → fires once per visit to a podium tab).
    const isTop = Boolean(myEntry) && (myEntry?.rank ?? 99) <= 3
    const [celebrateKey, setCelebrateKey] = useState(0)
    const celebratedRef = useRef(false)
    useEffect(
        () => {
            if (isTop && !celebratedRef.current) {
                celebratedRef.current = true
                setCelebrateKey((key) => key + 1)
            }
        },
        [isTop],
    )

    return (
        <AsyncContent
            isLoading={isLoading && !data}
            skeleton={<WeeklyBoardSkeleton className={className} />}
            // nothing to show until the viewer is placed in a cohort → funnel to courses
            isEmpty={!data || data.entries.length === 0}
            emptyContent={{
                title: t("dashboard.league.emptyTitle"),
                description: t("dashboard.league.emptyDescription"),
                onRetry: onClimb,
                retryLabel: t("dashboard.league.climbCta"),
            }}
        >
            {data ? (
                <div className={cn("flex flex-col gap-6", className)}>
                    <Confetti fireKey={celebrateKey} />
                    {/* your standing hero — rank-driven badge · promote-meter · climb CTA */}
                    {myEntry && myPercent !== null ? (
                        <StandingHeroCard
                            badge={<IconTile icon={rankBadgeIcon(myEntry.rank)} tone="neutral" size="sm" />}
                            rankLabel={t("dashboard.myProfile.rankLine", {
                                rank: myEntry.rank,
                                percent: myPercent,
                            })}
                            meta={
                                <>
                                    {t("dashboard.league.points", { count: myEntry.weekPoints })}
                                    {countdown
                                        ? ` · ${t("dashboard.league.resetIn", {
                                            days: countdown.days,
                                            hours: countdown.hours,
                                        })}`
                                        : ""}
                                </>
                            }
                            progress={!inPromote && promoteCutoff ? {
                                ratio: myEntry.weekPoints / Math.max(1, promoteCutoff.weekPoints),
                                label: t("dashboard.league.pointsToPromote", { points: pointsToPromote }),
                            } : undefined}
                            ctaLabel={t("dashboard.league.climbCta")}
                            onCta={onClimb}
                        />
                    ) : null}

                    {/* the winners' dais — top-3 (viewer's own column ringed) */}
                    <Podium
                        meLabel={t("dashboard.league.you")}
                        entries={data.entries.slice(0, 3).map((entry) => ({
                            rank: entry.rank,
                            username: entry.username,
                            avatar: entry.avatar,
                            pointsLabel: t("dashboard.league.points", { count: entry.weekPoints }),
                            isMe: isMine(entry.username),
                            rankDelta: entry.rankDelta,
                        }))}
                    />

                    {/* promote / demote legend */}
                    <div className="flex items-center gap-3 text-[11px] text-muted">
                        <span className="flex items-center gap-2">
                            <span className="size-2 shrink-0 rounded-full bg-success" />
                            {t("dashboard.league.promote", { count: data.promoteCount })}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="size-2 shrink-0 rounded-full bg-danger" />
                            {t("dashboard.league.demote", { count: data.demoteCount })}
                        </span>
                    </div>

                    {/* rank 4+ — the runners the podium can't hold; zone edge-markers */}
                    {data.entries.length > 3 ? (
                        <SurfaceListCard>
                            {data.entries.slice(3).map((entry) => {
                                const mine = isMine(entry.username)
                                // band = weekly rank MOVEMENT (mirrors the ▴▾ caret), a
                                // per-row signal that ALWAYS shows — NOT the cohort zone
                                // (which the disjoint gate hides on a small cohort). card.md §3i.
                                const delta = entry.rankDelta ?? 0
                                return (
                                    <SurfaceListCardItem
                                        key={entry.userGlobalId}
                                        withVerdict={{
                                            enable: delta !== 0,
                                            variant: delta > 0 ? "success" : "danger",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "w-6 shrink-0 text-right text-xs",
                                                    mine ? "font-semibold text-accent" : "text-muted",
                                                )}
                                            >
                                                {entry.rank}
                                            </span>
                                            <Link
                                                href={pathConfig().locale(locale).profile(entry.username ?? undefined).build()}
                                                className="flex min-w-0 flex-1 items-center text-foreground no-underline transition-opacity hover:opacity-60"
                                            >
                                                <UserCell
                                                    username={mine ? `${entry.username} · ${t("dashboard.league.you")}` : (entry.username ?? "")}
                                                    avatar={entry.avatar ?? undefined}
                                                />
                                            </Link>
                                            <Typography
                                                type="body-sm"
                                                color={mine ? undefined : "muted"}
                                                className={cn("shrink-0", mine && "font-semibold text-accent")}
                                            >
                                                {t("dashboard.league.points", { count: entry.weekPoints })}
                                            </Typography>
                                            <RankDeltaCaret delta={entry.rankDelta} className="w-8 shrink-0 justify-end" />
                                        </div>
                                    </SurfaceListCardItem>
                                )
                            })}
                        </SurfaceListCard>
                    ) : null}
                </div>
            ) : null}
        </AsyncContent>
    )
}
