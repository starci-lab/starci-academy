"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
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
import {
    fromGlobalId,
} from "@/modules/utils/globalId"
import {
    rankBadgeIcon,
} from "@/components/features/dashboard/league/rankBadge"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryGlobalLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useQueryGlobalLeaderboardSwr"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useAppSelector } from "@/redux/hooks"
import { _GlobalBoard } from "./component"

/** Props for {@link GlobalBoard}. */
export type GlobalBoardProps = WithClassNames<undefined>

/**
 * The global (all-users) leaderboard — the CONNECTED half of {@link import("./component")._GlobalBoard}.
 * Fetches the leaderboard, owns the follow mutation (rows stay presentational), computes the
 * first-load skeleton flag + the settled-empty flag, resolves every label, and hands the fully
 * resolved shape to the presentational component. See `tiers/split.md`.
 *
 * @param props - {@link GlobalBoardProps}
 */
export const GlobalBoard = ({
    className,
}: GlobalBoardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading } = useQueryGlobalLeaderboardSwr()
    const me = useAppSelector((state) => state.user.user)
    // owns the follow mutation; presentational rows only fire the resolved handler
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
        <_GlobalBoard
            className={className}
            // first load, nothing in hand → shimmer; settled (data OR a resolved error, which
            // SWR also clears `isLoading` for) stops it (loading-and-skeleton.md §2). Same
            // formula the retired `AsyncContent` used (`isLoading={isLoading && !data}`).
            isSkeleton={isLoading && !data}
            // settled with nothing to rank — also the branch a fetch error falls into, exactly
            // like the retired `AsyncContent` (it never had a distinct error branch either).
            isEmpty={!data || data.entries.length === 0}
            rankBadge={data ? rankBadgeIcon(data.myRank) : undefined}
            rankLabel={data ? t("dashboard.league.globalRankLine", { rank: data.myRank }) : undefined}
            pointsMeta={data ? t("dashboard.league.points", { count: data.myPoints }) : undefined}
            progress={data && above && data.myRank > 1 ? {
                ratio: data.myPoints / Math.max(1, above.points),
                label: t("dashboard.league.pointsToNext", {
                    points: pointsToNext,
                    rank: data.myRank - 1,
                }),
            } : undefined}
            climbCtaLabel={t("dashboard.league.climbCta")}
            onClimb={onClimb}
            meLabel={t("dashboard.league.you")}
            podiumEntries={data ? data.entries.slice(0, 3).map((entry) => ({
                rank: entry.rank,
                username: entry.username,
                avatar: entry.avatar,
                pointsLabel: t("dashboard.league.points", { count: entry.points }),
                isMe: isMine(entry.username),
            })) : undefined}
            rows={data ? data.entries.slice(3).map((entry) => {
                const mine = isMine(entry.username)
                return {
                    key: entry.userGlobalId,
                    rank: entry.rank,
                    isMine: mine,
                    displayName: mine ? `${entry.username} · ${t("dashboard.league.you")}` : (entry.username ?? ""),
                    avatar: entry.avatar,
                    profileHref: pathConfig().locale(locale).profile(entry.username ?? undefined).build(),
                    pointsLabel: t("dashboard.league.points", { count: entry.points }),
                    following: followed.has(entry.userGlobalId),
                    isPending: pending.has(entry.userGlobalId),
                    onToggleFollow: () => void onToggleFollow(entry.userGlobalId),
                }
            }) : undefined}
            showRows={data ? (data.entries.length > 3 || !viewerInList) : false}
            selfRow={data && !viewerInList ? {
                rank: data.myRank,
                displayName: `${me?.username ?? ""} · ${t("dashboard.league.you")}`,
                avatar: me?.avatar ?? null,
                pointsLabel: t("dashboard.league.points", { count: data.myPoints }),
            } : undefined}
            hiddenBetweenLabel={hiddenBetween > 0 ? t("dashboard.league.othersCount", { count: hiddenBetween }) : undefined}
            celebrateKey={celebrateKey}
            emptyTitle={t("dashboard.community.topLearners.noLeadersTitle")}
            emptyDescription={t("dashboard.community.topLearners.noLeadersDescription")}
        />
    )
}
