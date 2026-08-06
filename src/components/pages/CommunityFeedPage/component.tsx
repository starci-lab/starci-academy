import React from "react"
import type { Key } from "react"
import { ChatCircleIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Button } from "@/components/atoms/buttons/Button"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard, type TabsCardItem } from "@/components/blocks/navigation/TabsCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { CommunityComposer } from "./CommunityComposer"
import { CommunityPost } from "@/components/blocks/community/CommunityPost"
import { CommunityChannel } from "@/modules/api/graphql/queries/types/community-feed"
import type { QueryCommunityFeedItemData } from "@/modules/api/graphql/queries/types/community-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/** How many placeholder rows the co-located skeleton shows for the feed list. */
const SKELETON_ROW_COUNT = 3

/**
 * One placeholder feed row. `CommunityPost` (and the `CommunityPostCard` it wraps)
 * take a required `post` and carry no `isSkeleton` of their own, so this hand-mirrors
 * the card face right where it sits — author row, body block, reaction footer —
 * instead of pulling in a separate skeleton tree (loading-and-skeleton.md).
 */
const CommunityFeedSkeletonRow = () => (
    <SurfaceCard body={() => (
        <StackV gap={4} principle="card-caption" items={[
            () => (
                <StackH gap={4} principle="content-row" items={[
                    () => <Avatar isSkeleton size="md" />,
                    () => (
                        <StackV gap={3} principle="identity" classNames={["min-w-0", "flex-1"]} items={[
                            () => <Typography size="sm" isSkeleton classNames={["w-1/2"]} />,
                            () => <Typography size="xs" isSkeleton classNames={["w-3/4"]} />,
                        ]} />
                    ),
                ]} />
            ),
            () => <Skeleton className="h-16 w-full rounded-xl" />,
            () => (
                <StackH gap={6} principle="block-boundary" items={[
                    () => <Skeleton className="h-7 w-24 rounded-full" />,
                    () => <Skeleton className="h-7 w-14 rounded-full" />,
                ]} />
            ),
        ]} />
    )} />
)

/** All display text, already localized by the connected `CommunityFeedPage`; a story passes i18n keys. */
export interface CommunityFeedLabels {
    /** Page title. */
    title: string
    /** Page description under the title. */
    description: string
    /** Label on the "Chat" header action button. */
    chatLabel: string
    /** Accessible name for the channel tab strip. */
    channelTabsAriaLabel: string
    /** Error-branch title (feed failed to load). */
    errorTitle: string
    /** Retry button label, shared by the error branch. */
    retryLabel: string
    /** Empty-branch title when a channel filter has no posts. */
    emptyFilteredTitle: string
    /** Action label that clears the channel filter back to "all". */
    viewAllChannelsLabel: string
    /** Empty-branch title when the whole platform has no posts yet. */
    emptyTitle: string
    /** Action label that sends an empty-feed visitor into the course catalog. */
    browseCoursesLabel: string
    /** "Load more" button label under the feed. */
    loadMoreLabel: string
}

/** Props for {@link _CommunityFeedPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface CommunityFeedPageProps {
    /** First load, nothing in hand → the feed region shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with a resolved page that carries zero posts → the empty branch. */
    isEmpty?: boolean
    /** Truthy → the error branch (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — refetches the feed. Paired with `labels.retryLabel`. */
    onRetry?: () => void
    /** `true` while a channel filter is active — picks which of the two empty messages shows. */
    isFilteredEmpty?: boolean
    /** Channel tab strip, already resolved (i18n'd labels). */
    channelTabs: Array<TabsCardItem>
    /** Currently selected channel tab key ("all" or a {@link CommunityChannel}). */
    selectedChannelKey: string
    /** Fired with the newly selected tab key. */
    onChannelChange: (key: Key) => void
    /** `true` (signed-in) → renders the composer above the feed. */
    showComposer: boolean
    /** Channel the composer posts to (the "all" tab defaults to General). */
    composerChannel: CommunityChannel
    /** Called after a post is created so the feature can refetch the feed. */
    onPosted: () => void
    /** Clears the active channel filter back to "all channels". */
    onViewAllChannels: () => void
    /** Sends a platform-empty visitor into the course catalog. */
    onBrowseCourses: () => void
    /** Opens the community chat route. */
    onChatClick: () => void
    /** The flattened, newest-first feed page. */
    items: Array<QueryCommunityFeedItemData>
    /** Whether the viewer is signed in — gates reactions + the comment composer on each post. */
    authenticated: boolean
    /** React handler forwarded to each post — reacts, then refetches. */
    onReact: (postId: string, type: ReactionType | null) => void
    /** Called when a post's thread changes (new comment) so the feed can refresh. */
    onChanged: () => void
    /** `true` iff the last loaded page still carries a next cursor. */
    hasMore: boolean
    /** `true` while a "load more" page is in flight. */
    isLoadingMore: boolean
    /** Requests the next page. */
    onLoadMore: () => void
    labels: CommunityFeedLabels
}

/**
 * Community feed page (Facebook/Twitter-style) — the presentational half of
 * {@link CommunityFeedPage}, composed on the tier-correct vocabulary (`PageContainer` /
 * `PageHeader` / `TabsCard` / `SurfaceCard`). The header, channel tabs, and composer
 * always render; only the feed region itself runs the fixed order
 * error → loading → empty → content: `error` falls to the shared `AsyncContentError`
 * frame, `isEmpty` to `AsyncContentEmpty` (filtered vs platform-wide), and otherwise
 * the post list renders with `isSkeleton` threaded to every leaf that supports it so
 * the shimmer mirrors the loaded shape (loading-and-skeleton.md). See `tiers/split.md`
 * — the connected `index.tsx` owns the fetch, the channel filter, and i18n.
 *
 * @param props - {@link CommunityFeedPageProps}
 */
export const _CommunityFeedPage = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    isFilteredEmpty = false,
    channelTabs,
    selectedChannelKey,
    onChannelChange,
    showComposer,
    composerChannel,
    onPosted,
    onViewAllChannels,
    onBrowseCourses,
    onChatClick,
    items,
    authenticated,
    onReact,
    onChanged,
    hasMore,
    isLoadingMore,
    onLoadMore,
    labels,
}: CommunityFeedPageProps) => {
    return (
        <PageContainer>
            <StackV gap={7} principle="layout-split" items={[
                () => (
                    <PageHeader
                        title={labels.title}
                        description={labels.description}
                        actions={(
                            <Button
                                variant="secondary"
                                size="sm"
                                prefixIcon={ChatCircleIcon}
                                label={labels.chatLabel}
                                onPress={onChatClick}
                            />
                        )}
                    />
                ),
                () => (
                    <StackV gap={6} principle="block-boundary" items={[
                        () => (
                            <TabsCard
                                leftTabs={{
                                    items: channelTabs,
                                    selectedKey: selectedChannelKey,
                                    ariaLabel: labels.channelTabsAriaLabel,
                                    onSelectionChange: onChannelChange,
                                }}
                            />
                        ),
                        ...(showComposer ? [() => (
                            <CommunityComposer channel={composerChannel} onPosted={onPosted} />
                        )] : []),
                        () => {
                            // error beats a stale loading flag; empty only once settled
                            if (error) {
                                return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retryLabel} />
                            }
                            if (!isSkeleton && isEmpty) {
                                // empty feed is still a conversion surface. Two distinct reasons need
                                // two distinct empties (§State-matrix): filtered-empty offers a way
                                // back to "all channels"; platform-empty invites into courses.
                                return isFilteredEmpty ? (
                                    <AsyncContentEmpty
                                        title={labels.emptyFilteredTitle}
                                        action={() => (
                                            <Button variant="secondary" size="sm" label={labels.viewAllChannelsLabel} onPress={onViewAllChannels} />
                                        )}
                                    />
                                ) : (
                                    <AsyncContentEmpty
                                        title={labels.emptyTitle}
                                        action={() => (
                                            <Button variant="secondary" size="sm" label={labels.browseCoursesLabel} onPress={onBrowseCourses} />
                                        )}
                                    />
                                )
                            }

                            // ROWS — while shimmering, placeholder rows keep the SAME count shape as the
                            // real list; `CommunityPost` has no `isSkeleton` of its own (missingSkeletonSupport).
                            const rowItems = isSkeleton
                                ? Array.from({ length: SKELETON_ROW_COUNT }, () => () => <CommunityFeedSkeletonRow />)
                                : items.map((post) => () => (
                                    <CommunityPost
                                        post={post}
                                        authenticated={authenticated}
                                        onReact={authenticated ? onReact : undefined}
                                        onChanged={onChanged}
                                    />
                                ))

                            return (
                                <StackV gap={6} principle="block-boundary" items={[
                                    ...rowItems,
                                    ...(!isSkeleton && hasMore ? [() => (
                                        <div className="flex justify-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                isPending={isLoadingMore}
                                                label={labels.loadMoreLabel}
                                                onPress={onLoadMore}
                                            />
                                        </div>
                                    )] : []),
                                ]} />
                            )
                        },
                    ]} />
                ),
            ]} />
        </PageContainer>
    )
}
