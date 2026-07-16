"use client"

import React, {
    useCallback,
    useState,
} from "react"
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
import {
    TopLearnersSkeleton,
} from "./TopLearnersSkeleton"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useQueryGlobalLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useQueryGlobalLeaderboardSwr"
import { useAppSelector } from "@/redux/hooks"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import {
    LeaderboardListCard,
    LeaderboardRow,
} from "@/components/features/dashboard/league/LeaderboardListCard"

/** How many leaders to show. */
const TOP_N = 5

/** Props for {@link TopLearners}. */
export type TopLearnersProps = WithClassNames<undefined>

/**
 * Dashboard "Top học viên" card — maps the global leaderboard into the shared
 * {@link LeaderboardListCard} (standing header with a rank-driven medal/cup badge over
 * a medal-ranked list). Renders IDENTICALLY to the weekly "League tuần"
 * {@link import("../LeagueCard/LeagueCardContent").LeagueCardContent}; only the trailing
 * slot differs — here a quiet {@link FollowButton} per stranger row. Owns the follow
 * mutation; the shared card stays presentational (thầy 2026-07-17 "2 mục y chang").
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

    return (
        <AsyncContent
            isLoading={data === null || data === undefined || isLoading}
            skeleton={<TopLearnersSkeleton className={className} />}
            isEmpty={isEmpty}
            emptyContent={{
                title: t("dashboard.community.topLearners.noLeadersTitle"),
                description: t("dashboard.community.topLearners.noLeadersDescription"),
                icon: <TrophyIcon className="size-8 text-muted" aria-hidden focusable="false" />,
            }}
        >
            {!isEmpty && data ? (
                <LeaderboardListCard
                    className={className}
                    title={t("dashboard.community.topLearners.title")}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={t("dashboard.community.topLearners.seeMore")}
                    standing={{
                        rank: data.myRank,
                        primary: t("dashboard.league.globalRankLine", { rank: data.myRank }),
                        secondary: t("dashboard.league.points", { count: data.myPoints }),
                    }}
                    rows={shown.map(toRow)}
                    selfRow={showSelfRow ? {
                        key: "self",
                        rank: data.myRank,
                        username: me?.username ?? null,
                        avatar: me?.avatar,
                        valueLabel: t("dashboard.league.points", { count: data.myPoints }),
                        isMe: true,
                    } : undefined}
                    ellipsisLabel={data.myRank - TOP_N - 1 > 0
                        ? t("dashboard.league.othersCount", { count: data.myRank - TOP_N - 1 })
                        : undefined}
                    meLabel={t("dashboard.league.you")}
                />
            ) : null}
        </AsyncContent>
    )
}
