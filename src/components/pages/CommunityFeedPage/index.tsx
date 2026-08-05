"use client"

import React, { useCallback, useMemo, useState } from "react"
import type { Key } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import { _CommunityFeedPage } from "./component"
import { useMutateReactCommunityPostSwr } from "@/hooks/swr/api/graphql/mutations/useMutateReactCommunityPostSwr"
import { useQueryCommunityFeedSwr } from "@/hooks/swr/api/graphql/queries/useQueryCommunityFeedSwr"
import { CommunityChannel } from "@/modules/api/graphql/queries/types/community-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { useAppSelector } from "@/redux/hooks"

/** Sentinel tab key for the unfiltered "all channels" feed. */
const ALL_KEY = "all"

/**
 * Community feed page — the CONNECTED half: fetches the cursor-paginated feed
 * (SWR infinite), holds the channel filter, reacts to posts, and resolves every
 * label via `t()`, handing them to the presentational {@link _CommunityFeedPage}.
 * See `design/storybook/architecture/split.md`.
 */
export const CommunityFeedPage = () => {
    const t = useTranslations()
    const router = useRouter()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    // null channel = the unfiltered "all channels" feed
    const [channel, setChannel] = useState<CommunityChannel | null>(null)

    const {
        data: pages,
        size,
        setSize,
        isLoading,
        isValidating,
        error,
        mutate,
    } = useQueryCommunityFeedSwr(channel)
    const { trigger: reactPost } = useMutateReactCommunityPostSwr()

    // flatten the SWR pages into a single newest-first list
    const items = useMemo(
        () => (pages ?? []).flatMap((page) => page.items),
        [pages],
    )
    // there is more iff the last loaded page still carries a next cursor
    const hasMore = Boolean(pages?.[pages.length - 1]?.nextCursor)
    // a "load more" is in flight when validating a page we have not yet rendered
    const isLoadingMore = isValidating && (pages?.length ?? 0) < size

    // react to a post, then revalidate so the count + my-reaction refresh
    const onReact = useCallback(
        async (postId: string, type: ReactionType | null) => {
            await reactPost({ postId, type })
            await mutate()
        },
        [reactPost, mutate],
    )

    // channel tabs (left group); "all" maps back to a null channel scope
    const channelTabs = useMemo(
        () => [
            { key: ALL_KEY, label: t("community.channel.all") },
            { key: CommunityChannel.Problems, label: t("community.channel.problems") },
            { key: CommunityChannel.FounderQa, label: t("community.channel.founderQa") },
            { key: CommunityChannel.General, label: t("community.channel.general") },
        ],
        [t],
    )

    // composer posts to the active channel; the "all" tab defaults to General
    const composerChannel = channel ?? CommunityChannel.General

    return (
        <_CommunityFeedPage
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && items.length === 0}
            // error beats loading + empty; only a settled fetch error (nothing in hand) reaches the block
            error={items.length === 0 ? error : undefined}
            onRetry={() => void mutate()}
            // settled with a resolved page that carries zero posts
            isEmpty={items.length === 0}
            isFilteredEmpty={channel !== null}
            channelTabs={channelTabs}
            selectedChannelKey={channel ?? ALL_KEY}
            onChannelChange={(key: Key) => {
                const value = String(key)
                setChannel(value === ALL_KEY ? null : (value as CommunityChannel))
            }}
            showComposer={authenticated}
            composerChannel={composerChannel}
            onPosted={() => void mutate()}
            onViewAllChannels={() => setChannel(null)}
            onBrowseCourses={() => router.push(pathConfig().locale().course().build())}
            onChatClick={() => router.push(`${pathConfig().locale().community().build()}/chat`)}
            items={items}
            authenticated={authenticated}
            onReact={onReact}
            onChanged={() => void mutate()}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={() => void setSize(size + 1)}
            labels={{
                title: t("community.title"),
                description: t("community.description"),
                chatLabel: t("community.chat.title"),
                channelTabsAriaLabel: t("community.channelTabsAria"),
                errorTitle: t("community.error"),
                retryLabel: t("community.retry"),
                emptyFilteredTitle: t("community.emptyFiltered"),
                viewAllChannelsLabel: t("community.viewAllChannels"),
                emptyTitle: t("community.empty"),
                browseCoursesLabel: t("cart.browseCourses"),
                loadMoreLabel: t("community.loadMore"),
            }}
        />
    )
}
