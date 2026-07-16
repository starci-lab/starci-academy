"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    Link,
    Typography,
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
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { UserCell } from "@/components/blocks/identity/UserCell"

/** How many leaders to show. */
const TOP_N = 5

/** Props for {@link TopLearners}. */
export type TopLearnersProps = WithClassNames<undefined>

/**
 * Dashboard "Community" tab — the platform's top learners this period (avatar · name
 * · XP) with an inline follow on each stranger row, PLUS the viewer's own global
 * standing as a header line (rank · total XP). Both read the SAME global-leaderboard
 * query, so they're one card (thầy 2026-07-17: "vị thế toàn cục gom với top học viên,
 * danh sách học viên render trong surface-in-surface như League tuần") — a framed
 * `LabeledCard` (standing line on top) over a `bordered` `SurfaceListCard`
 * (surface-in-surface). Self-fetches; renders a standard empty-state when there are no
 * entries; the header "see more" opens the full leaderboard.
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

    /**
     * Toggle follow/unfollow for a leader. The leaderboard exposes each user as an
     * OPAQUE global id (`toGlobalId`), but `setFollow` wants the raw `users.id` —
     * so decode it first (this is why follow previously did nothing). Flips the
     * row on success.
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
                <LabeledCard
                    label={t("dashboard.community.topLearners.title")}
                    onSeeMore={onSeeMore}
                    seeMoreLabel={t("dashboard.community.topLearners.seeMore")}
                    className={className}
                    contentClassName="flex flex-col gap-3"
                >
                    {/* the viewer's own platform-wide standing — a header line above the
                        list (the merged "Vị thế toàn cục"); only when the viewer has a rank */}
                    {data.myRank !== null && data.myRank !== undefined ? (
                        <Typography type="body-sm">
                            {t("dashboard.community.globalStanding.line", {
                                rank: data.myRank,
                                points: data.myPoints,
                            })}
                        </Typography>
                    ) : null}

                    {/* the top-N learners — nested surface-in-surface (bordered) like the
                        League tuần "Hạng của bạn" card */}
                    <SurfaceListCard bordered>
                        {data.entries.slice(0, TOP_N).map((entry) => {
                            const isMe = Boolean(me?.username) && entry.username === me?.username
                            return (
                                <SurfaceListCardItem key={entry.userGlobalId}>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 shrink-0 text-right text-xs text-muted">
                                            {entry.rank}
                                        </span>
                                        {/* avatar + name: the only clickable target (→ profile),
                                            dimming the whole cluster on hover — plain text, not a
                                            coloured/underlined link (mirrors LeagueRow) */}
                                        <Link
                                            href={pathConfig().locale(locale).profile(entry.username ?? undefined).build()}
                                            className="flex min-w-0 flex-1 items-center text-foreground no-underline transition-opacity hover:opacity-60"
                                        >
                                            <UserCell
                                                username={entry.username ?? ""}
                                                avatar={entry.avatar ?? undefined}
                                            />
                                        </Link>
                                        <Typography type="body-sm" color="muted" className="shrink-0">
                                            {t("dashboard.community.topLearners.xp", { points: entry.points })}
                                        </Typography>
                                        {!isMe ? (
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
                    </SurfaceListCard>
                </LabeledCard>
            ) : null}
        </AsyncContent>
    )
}
