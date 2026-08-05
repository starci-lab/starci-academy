"use client"

import React, {
    useCallback,
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
    FollowButton,
} from "@/components/features/community/FollowButton"
import {
    pathConfig,
} from "@/resources/path"
import {
    fromGlobalId,
} from "@/modules/utils/globalId"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import type { LeaderboardRow } from "@/components/features/dashboard/league/LeaderboardListCard"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useQueryGlobalLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useQueryGlobalLeaderboardSwr"
import { useAppSelector } from "@/redux/hooks"
import { _TopLearners } from "./component"

/** How many leaders to show. */
export const TOP_N = 5

/** Props for {@link TopLearners}. */
export type TopLearnersProps = WithClassNames<undefined>

/**
 * Dashboard "Top Learners" card — the CONNECTED half: fetches the global leaderboard, owns the
 * follow mutation (rows stay presentational), resolves the viewer's rank-relative slice (top-N +
 * pinned self-row), and hands the resolved shape + every translated label to the presentational
 * {@link _TopLearners}. See `tiers/split.md`.
 *
 * @param props - optional root class name (placement only)
 */
export const TopLearners = ({
    className,
}: TopLearnersProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading } = useQueryGlobalLeaderboardSwr()
    const me = useAppSelector((state) => state.user.user)
    // owns the follow mutation; FollowButton rows stay presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    // globalIds the viewer follows from this card (optimistic) + in-flight set
    const [followed, setFollowed] = useState<Set<string>>(new Set())
    const [pending, setPending] = useState<Set<string>>(new Set())

    const isMine = (username: string | null) => Boolean(me?.username) && username === me?.username

    /**
     * Toggle follow/unfollow. The leaderboard exposes each user as an OPAQUE global
     * id, but `setFollow` wants the raw `users.id` — decode it first. Flips the row
     * optimistically on success.
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

    // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
    const isSkeleton = data === null || data === undefined || isLoading
    // empty (after load) when the board has no entries
    const isEmpty = !data || data.entries.length === 0

    /** Open the full leaderboard page. */
    const onSeeMore = useCallback(
        () => router.push(pathConfig().locale(locale).league().build()),
        [router, locale],
    )

    // viewer below the shown slice → pin a self-row after an ellipsis
    const shown = data ? data.entries.slice(0, TOP_N) : []
    const viewerInTop = shown.some((entry) => isMine(entry.username))
    const showSelfRow = Boolean(data) && !viewerInTop

    /** Map a leaderboard entry → a normalised {@link LeaderboardRow} (follow trailing). */
    const toRow = (entry: NonNullable<typeof data>["entries"][number]): LeaderboardRow => {
        const mine = isMine(entry.username)
        return {
            key: entry.userGlobalId,
            rank: entry.rank,
            username: entry.username,
            avatar: entry.avatar,
            valueLabel: t("dashboard.league.points", { count: entry.points }),
            isMe: mine,
            profileHref: pathConfig().locale(locale).profile(entry.username ?? undefined).build(),
            trailing: mine ? undefined : (
                <FollowButton
                    quiet
                    following={followed.has(entry.userGlobalId)}
                    isPending={pending.has(entry.userGlobalId)}
                    onToggle={() => void onToggleFollow(entry.userGlobalId)}
                />
            ),
        }
    }

    // standing header + self row + ellipsis are only meaningful once `data` has settled
    const standing = data ? {
        rank: data.myRank,
        primary: t("dashboard.league.globalRankLine", { rank: data.myRank }),
        secondary: t("dashboard.league.points", { count: data.myPoints }),
    } : undefined

    const selfRow: LeaderboardRow | undefined = data && showSelfRow ? {
        key: "self",
        rank: data.myRank,
        username: me?.username ?? null,
        avatar: me?.avatar,
        valueLabel: t("dashboard.league.points", { count: data.myPoints }),
        isMe: true,
    } : undefined

    const ellipsisLabel = data && data.myRank - TOP_N - 1 > 0
        ? t("dashboard.league.othersCount", { count: data.myRank - TOP_N - 1 })
        : undefined

    return (
        <_TopLearners
            className={className}
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            onSeeMore={onSeeMore}
            standing={standing}
            rows={shown.map(toRow)}
            selfRow={selfRow}
            ellipsisLabel={ellipsisLabel}
            labels={{
                title: t("dashboard.community.topLearners.title"),
                seeMoreLabel: t("dashboard.community.topLearners.seeMore"),
                noLeadersTitle: t("dashboard.community.topLearners.noLeadersTitle"),
                noLeadersDescription: t("dashboard.community.topLearners.noLeadersDescription"),
                meLabel: t("dashboard.league.you"),
            }}
        />
    )
}
