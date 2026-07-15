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
    UserPlusIcon,
} from "@phosphor-icons/react"
import Link from "next/link"
import {
    FollowButton,
} from "@/components/reuseable/FollowButton"
import {
    WhoToFollowSkeleton,
} from "./WhoToFollowSkeleton"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useMutateSetFollowSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetFollowSwr"
import { useQuerySuggestedUsersSwr } from "@/hooks/swr/api/graphql/queries/useQuerySuggestedUsersSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { UserCell } from "@/components/blocks/identity/UserCell"

/** Props for {@link WhoToFollow}. */
export type WhoToFollowProps = WithClassNames<undefined>

/**
 * Right-rail "who to follow" card listing users the backend suggests, so the
 * social graph keeps growing from the home surface. Each row links to the user's
 * public profile and carries a follow button that owns the `setFollow` mutation
 * (FollowButton is presentational); a successfully-followed row flips to the
 * "following" state locally so the action feels instant. Self-fetches its own
 * leaf query; shows a skeleton while loading, then hides when there is nothing
 * to suggest.
 * @param props - optional className for the root element.
 */
export const WhoToFollow = ({
    className,
}: WhoToFollowProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading } = useQuerySuggestedUsersSwr()
    // owns the follow mutation; FollowButton rows stay presentational
    const { trigger: triggerSetFollow } = useMutateSetFollowSwr()
    // globalIds the viewer has just followed from this card (optimistic)
    const [followed, setFollowed] = useState<Set<string>>(new Set())
    // globalIds with a follow request currently in flight
    const [pending, setPending] = useState<Set<string>>(new Set())

    /** Follow the suggested user; flip the row to "following" on success. */
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
        [
            triggerSetFollow,
        ],
    )

    return (
        // skeleton while loading; hide when there is nothing to suggest (empty / error →
        // no emptyContent/errorContent → renders null).
        <AsyncContent
            isLoading={isLoading}
            skeleton={<WhoToFollowSkeleton className={className} />}
            isEmpty={!data || data.length === 0}
        >
            <SectionCard
                icon={<UserPlusIcon className="size-5 text-accent-soft-foreground" />}
                title={t("dashboard.whoToFollow.title")}
                className={className}
            >
                <div className="flex flex-col gap-2">
                    {(data ?? []).map((user) => (
                        <div
                            key={user.globalId}
                            className="flex items-center gap-3 rounded-medium px-2 py-1"
                        >
                            <Link
                                href={pathConfig().locale(locale).profile(user.username).build()}
                                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                                <UserCell
                                    className="min-w-0 flex-1"
                                    username={user.username}
                                    displayName={user.displayName ?? undefined}
                                    avatar={user.avatar}
                                    handle={`@${user.username}`}
                                    trailing={user.openToWork ? (
                                        <span className="shrink-0 rounded-full bg-success-soft px-2 text-[11px] font-medium text-success-soft-foreground">
                                            {t("dashboard.whoToFollow.openToWork")}
                                        </span>
                                    ) : undefined}
                                />
                            </Link>
                            <FollowButton
                                className="shrink-0"
                                following={followed.has(user.globalId)}
                                isPending={pending.has(user.globalId)}
                                onToggle={() => {
                                    // already followed from this card → no-op
                                    if (!followed.has(user.globalId)) {
                                        void onFollow(user.globalId)
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </SectionCard>
        </AsyncContent>
    )
}
