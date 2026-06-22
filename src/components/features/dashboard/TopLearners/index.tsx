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
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useMutateSetFollowSwr,
    useQueryGlobalLeaderboardSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    AsyncContent,
    LabeledCard,
} from "@/components/blocks"
import {
    FollowButton,
} from "@/components/reuseable/FollowButton"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    TopLearnersSkeleton,
} from "./TopLearnersSkeleton"

/** How many leaders to show. */
const TOP_N = 5

/** Props for {@link TopLearners}. */
export type TopLearnersProps = WithClassNames<undefined>

/**
 * Dashboard "Community" tab — the platform's top learners this period (avatar · name
 * · XP) with an inline follow on each stranger row. Self-fetches the global
 * leaderboard and self-hides when there are no entries.
 * @param props - optional root class name (placement only)
 */
export const TopLearners = ({
    className,
}: TopLearnersProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading } = useQueryGlobalLeaderboardSwr()
    const me = useAppSelector((state) => state.user.user)
    // owns the follow mutation; FollowButton rows stay presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    // globalIds just followed from this card (optimistic) + in-flight set
    const [followed, setFollowed] = useState<Set<string>>(new Set())
    const [pending, setPending] = useState<Set<string>>(new Set())

    /** Follow a leader; flip the row to "following" on success. */
    const onFollow = useCallback(
        async (globalId: string) => {
            setPending((current) => new Set(current).add(globalId))
            try {
                const result = await triggerSetFollow({
                    userId: globalId,
                    follow: true,
                })
                if (result?.data?.setFollow?.success) {
                    setFollowed((current) => new Set(current).add(globalId))
                }
            } finally {
                setPending((current) => {
                    const next = new Set(current)
                    next.delete(globalId)
                    return next
                })
            }
        },
        [triggerSetFollow],
    )

    // empty (after load) when the board has no entries
    const isEmpty = !data || data.entries.length === 0

    return (
        <AsyncContent
            isLoading={data === null || data === undefined || isLoading}
            skeleton={<TopLearnersSkeleton className={className} />}
            isEmpty={isEmpty}
        >
            {!isEmpty && data ? (
                <LabeledCard
                    label={t("dashboard.community.topLearners.title")}
                    className={className}
                    contentClassName="flex flex-col gap-3"
                >
                    {data.entries.slice(0, TOP_N).map((entry) => {
                        const isMe = Boolean(me?.username) && entry.username === me?.username
                        return (
                            <div key={entry.userGlobalId} className="flex items-center gap-3">
                                <Typography type="body-sm" color="muted" align="center" className="w-5 shrink-0">
                                    {entry.rank}
                                </Typography>
                                <Link
                                    href={pathConfig().locale(locale).profile(entry.username ?? undefined).build()}
                                    className="flex min-w-0 flex-1 items-center gap-2"
                                >
                                    <UserAvatar
                                        className="size-6 shrink-0"
                                        username={entry.username}
                                        avatar={entry.avatar ?? undefined}
                                        seed={entry.username}
                                    />
                                    <Typography type="body-sm" weight="medium" truncate>
                                        {entry.username}
                                    </Typography>
                                </Link>
                                <Typography type="body-xs" color="muted" className="shrink-0">
                                    {t("dashboard.community.topLearners.xp", { points: entry.points })}
                                </Typography>
                                {!isMe ? (
                                    <FollowButton
                                        className="shrink-0"
                                        following={followed.has(entry.userGlobalId)}
                                        isPending={pending.has(entry.userGlobalId)}
                                        onToggle={() => {
                                            if (!followed.has(entry.userGlobalId)) {
                                                void onFollow(entry.userGlobalId)
                                            }
                                        }}
                                    />
                                ) : null}
                            </div>
                        )
                    })}
                </LabeledCard>
            ) : null}
        </AsyncContent>
    )
}
