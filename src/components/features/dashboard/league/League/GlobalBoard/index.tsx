"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    TrophyIcon,
} from "@phosphor-icons/react"
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
import {
    fromGlobalId,
} from "@/modules/utils/globalId"
import {
    UserCell,
} from "@/components/blocks/identity/UserCell"
import {
    GlobalBoardSkeleton,
} from "./GlobalBoardSkeleton"
import { StandingHeroCard } from "@/components/features/dashboard/league/StandingHeroCard"
import { Podium } from "@/components/features/dashboard/league/Podium"
import { rankBadgeIcon } from "@/components/features/dashboard/league/rankBadge"
import { Confetti } from "@/components/features/dashboard/league/Confetti"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { FollowButton } from "@/components/features/community/FollowButton"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryGlobalLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useQueryGlobalLeaderboardSwr"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Props for {@link GlobalBoard}. */
export type GlobalBoardProps = WithClassNames<undefined>

/**
 * The global (all-users) leaderboard — same shell as the weekly board: a
 * {@link StandingHeroCard} of the viewer's platform-wide standing (rank-driven
 * {@link IconTile} badge · goal-gradient · climb CTA), the top-3 {@link Podium}
 * (viewer ringed when a finisher), then rank 4+ as a followable
 * {@link SurfaceListCard}. When the viewer sits below the fetched slice, a pinned
 * self-row is appended after an ellipsis. Self-fetches its leaf query and owns the
 * follow mutation (rows stay presentational).
 *
 * @param props - optional className for the root element.
 */
export const GlobalBoard = ({
    className,
}: GlobalBoardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading } = useQueryGlobalLeaderboardSwr()
    const me = useAppSelector((state) => state.user.user)
    // owns the follow mutation; FollowButton rows stay presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    // globalIds the viewer follows from this board (optimistic) + in-flight set
    const [followed, setFollowed] = useState<Set<string>>(new Set())
    const [pending, setPending] = useState<Set<string>>(new Set())

    /** Whether an entry belongs to the viewer (best-effort username match). */
    const isMine = (username: string | null) => Boolean(me?.username) && username === me?.username

    /**
     * Toggle follow/unfollow for a user. The board exposes each user as an OPAQUE
     * global id, but `setFollow` wants the raw `users.id` — decode it first. Flips
     * the row optimistically on success. (Same pattern as `TopLearners`.)
     */
    const onToggleFollow = useCallback(
        async (globalId: string) => {
            const rawId = fromGlobalId(globalId)?.id ?? globalId
            const currentlyFollowing = followed.has(globalId)
            setPending((current) => new Set(current).add(globalId))
            try {
                const result = await triggerSetFollow({
                    userId: rawId,
                    follow: !currentlyFollowing,
                })
                if (result?.data?.setFollow?.success) {
                    setFollowed((current) => {
                        const next = new Set(current)
                        if (currentlyFollowing) {
                            next.delete(globalId)
                        } else {
                            next.add(globalId)
                        }
                        return next
                    })
                }
            } finally {
                setPending((current) => {
                    const next = new Set(current)
                    next.delete(globalId)
                    return next
                })
            }
        },
        [followed, triggerSetFollow],
    )

    /** Funnel to courses — climb the leaderboard by learning (the north-star CTA). */
    const onClimb = () => router.push(pathConfig().locale(locale).course().build())

    // the person directly above me — for the goal-gradient meter (FE-computed,
    // only when that rank is present in the fetched top slice).
    const above = data ? data.entries.find((entry) => entry.rank === data.myRank - 1) : undefined
    const pointsToNext = above ? Math.max(0, above.points - (data?.myPoints ?? 0) + 1) : 0
    // the viewer sits below the fetched top slice → pin a self-row at the bottom
    const viewerInList = data ? data.entries.some((entry) => isMine(entry.username)) : false
    const hiddenBetween = data ? Math.max(0, data.myRank - data.entries.length - 1) : 0

    // celebrate a top-3 platform finish with a confetti burst on tab entry
    const isTop = Boolean(data) && (data?.myRank ?? 99) <= 3
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
            skeleton={<GlobalBoardSkeleton className={className} />}
            // nothing to rank yet → funnel to courses
            isEmpty={!data || data.entries.length === 0}
            emptyContent={{
                title: t("dashboard.community.topLearners.noLeadersTitle"),
                description: t("dashboard.community.topLearners.noLeadersDescription"),
                icon: <TrophyIcon className="size-8 text-muted" aria-hidden focusable="false" />,
                onRetry: onClimb,
                retryLabel: t("dashboard.league.climbCta"),
            }}
        >
            {data ? (
                <div className={cn("flex flex-col gap-6", className)}>
                    <Confetti fireKey={celebrateKey} />
                    {/* your platform-wide standing — rank-driven badge · gap-meter · CTA */}
                    <StandingHeroCard
                        badge={<IconTile icon={rankBadgeIcon(data.myRank)} tone="neutral" size="sm" />}
                        rankLabel={t("dashboard.league.globalRankLine", { rank: data.myRank })}
                        meta={t("dashboard.league.points", { count: data.myPoints })}
                        progress={above && data.myRank > 1 ? {
                            ratio: data.myPoints / Math.max(1, above.points),
                            label: t("dashboard.league.pointsToNext", {
                                points: pointsToNext,
                                rank: data.myRank - 1,
                            }),
                        } : undefined}
                        ctaLabel={t("dashboard.league.climbCta")}
                        onCta={onClimb}
                    />

                    {/* the winners' dais — top-3 (viewer's own column ringed) */}
                    <Podium
                        meLabel={t("dashboard.league.you")}
                        entries={data.entries.slice(0, 3).map((entry) => ({
                            rank: entry.rank,
                            username: entry.username,
                            avatar: entry.avatar,
                            pointsLabel: t("dashboard.league.points", { count: entry.points }),
                            isMe: isMine(entry.username),
                        }))}
                    />

                    {/* rank 4+ — a followable list; the runners the podium can't hold */}
                    {data.entries.length > 3 || !viewerInList ? (
                        <SurfaceListCard>
                            {data.entries.slice(3).map((entry) => {
                                const mine = isMine(entry.username)
                                return (
                                    <SurfaceListCardItem key={entry.userGlobalId}>
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
                                                {t("dashboard.league.points", { count: entry.points })}
                                            </Typography>
                                            {!mine ? (
                                                <FollowButton
                                                    className="shrink-0"
                                                    quiet
                                                    following={followed.has(entry.userGlobalId)}
                                                    isPending={pending.has(entry.userGlobalId)}
                                                    onToggle={() => void onToggleFollow(entry.userGlobalId)}
                                                />
                                            ) : null}
                                        </div>
                                    </SurfaceListCardItem>
                                )
                            })}

                            {/* viewer below the fetched slice → ellipsis + pinned self-row */}
                            {!viewerInList ? (
                                <>
                                    <div className="flex items-center justify-center gap-2 bg-surface-secondary px-3 py-2 text-xs text-muted">
                                        <span className="text-base leading-none tracking-widest">⋯</span>
                                        {hiddenBetween > 0
                                            ? t("dashboard.league.othersCount", { count: hiddenBetween })
                                            : null}
                                    </div>
                                    <SurfaceListCardItem>
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 shrink-0 text-right text-xs font-semibold text-accent">
                                                {data.myRank}
                                            </span>
                                            <div className="flex min-w-0 flex-1 items-center">
                                                <UserCell
                                                    username={`${me?.username ?? ""} · ${t("dashboard.league.you")}`}
                                                    avatar={me?.avatar ?? undefined}
                                                />
                                            </div>
                                            <Typography type="body-sm" className="shrink-0 font-semibold text-accent">
                                                {t("dashboard.league.points", { count: data.myPoints })}
                                            </Typography>
                                        </div>
                                    </SurfaceListCardItem>
                                </>
                            ) : null}
                        </SurfaceListCard>
                    ) : null}
                </div>
            ) : null}
        </AsyncContent>
    )
}
