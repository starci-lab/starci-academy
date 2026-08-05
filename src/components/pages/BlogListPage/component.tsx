import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { Flex } from "@/components/frames/Flex"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { Masthead } from "./Masthead"
import { TopicsStrip } from "./TopicsStrip"
import { StartHereAnchor } from "./StartHereAnchor"
import { CategoryFilter } from "./CategoryFilter"
import { FeaturedPost } from "./FeaturedPost"
import { PostRow } from "@/components/blocks/blog/PostRow"
import { BlogCategory, type QueryBlogPostListItem } from "@/modules/api/graphql/queries/types/blog"

/** How many placeholder rows the co-located skeleton shows under the featured lead. */
const SKELETON_ROW_COUNT = 4

/** One flow-order post, paired with the caller's already-localized publish date. */
export interface BlogListRestItem {
    post: QueryBlogPostListItem
    formattedDate: string
}

/** All display text, already localized by the connected `BlogListPage`; a story passes i18n keys. */
export interface BlogListLabels {
    title: string
    subtitle: string
    errorTitle: string
    errorHint: string
    retry: string
    /** Unfiltered empty state (no posts published yet). */
    empty: string
    emptyHint: string
    /** Empty-in-filter state (the active pillar has zero posts) — offers a "clear filter" action. */
    emptyInFilter: string
    emptyInFilterHint: string
    clearFilter: string
    loadMore: string
}

/** Props for {@link _BlogListPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface BlogListPageProps {
    /** First load, nothing in hand → the results zone shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero posts → the empty message (beats content, loses to loading). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry: () => void

    /** Active editorial-pillar filter (`null` = all). */
    category: BlogCategory | null
    /** Fired when the reader picks a different pillar — also used as the empty-in-filter "clear" action. */
    onChangeCategory: (next: BlogCategory | null) => void
    /** Pillars that actually have posts. The caller (connected) hides the row entirely below two. */
    availableCategories: Array<BlogCategory>
    /** `true` → render the pillar filter row. `false` while loading or with a single pillar. */
    showFilter: boolean

    /** The pinned "start here" entry point, on the unfiltered view only. */
    pinnedPost?: QueryBlogPostListItem | null
    /** The newest post in the (post-pin) flow, given the editorial-lead treatment. */
    featuredPost?: QueryBlogPostListItem | null
    /** Localized, preformatted publish date for {@link featuredPost}. */
    featuredFormattedDate?: string
    /** The rest of the chronological flow, each paired with its formatted date. */
    restPosts?: Array<BlogListRestItem>

    /** `true` → a full page came back, so "load more" is offered. */
    hasMore?: boolean
    /** `true` → a "load more" fetch is in flight (button spinner). */
    isLoadingMore?: boolean
    /** Fired when "load more" is pressed. */
    onLoadMore: () => void

    labels: BlogListLabels
}

/**
 * Co-located mirror of {@link FeaturedPost}'s shape — `FeaturedPost` itself takes no
 * `isSkeleton` (see `missingSkeletonSupport`), so this stands in only while `isSkeleton`
 * is true, in the SAME position the real block renders in once the first page resolves.
 */
const FeaturedPostSkeleton = () => (
    <StackV gap={4} items={[
        () => <Skeleton className="h-5 w-28 rounded-full" />,
        () => <Typography size="h3" isSkeleton classNames={["w-3/4"]} />,
        () => <Typography isSkeleton classNames={["w-full"]} />,
        () => <Typography size="sm" isSkeleton classNames={["w-1/4"]} />,
    ]} />
)

/**
 * Co-located mirror of {@link PostRow}'s shape — same reason as {@link FeaturedPostSkeleton}.
 */
const PostRowSkeleton = () => (
    <StackV gap={3} items={[
        () => <Typography size="lg" isSkeleton classNames={["w-2/3"]} />,
        () => <Typography size="sm" isSkeleton classNames={["w-full"]} />,
        () => <Skeleton className="h-3 w-1/3 rounded-sm" />,
    ]} />
)

/**
 * The public `/blog` listing — presentational half of {@link BlogListPage}. Four states in the
 * fixed order error → loading → empty → content, scoped to the RESULTS zone only: `error`
 * falls to the shared `AsyncContentError` frame, settled-empty to `AsyncContentEmpty`, and
 * otherwise the flow (pinned anchor → featured lead → rows → "load more") renders with
 * `isSkeleton` threaded to every leaf that supports it (loading-and-skeleton.md). The
 * masthead, header and topics strip sit above the results zone and render unconditionally —
 * they carry no async state of their own. See `tiers/split.md` — the connected `index.tsx`
 * owns the fetch, pagination and i18n.
 *
 * @param props - {@link BlogListPageProps}
 */
const _BlogListPage = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    category,
    onChangeCategory,
    availableCategories,
    showFilter,
    pinnedPost,
    featuredPost,
    featuredFormattedDate,
    restPosts = [],
    hasMore = false,
    isLoadingMore = false,
    onLoadMore,
    labels,
}: BlogListPageProps) => {
    const resultsZone = () => {
        // error beats a stale loading flag; empty only once settled (BLOCK-8 order).
        if (error) {
            return (
                <AsyncContentError
                    title={labels.errorTitle}
                    description={labels.errorHint}
                    onRetry={onRetry}
                    retryLabel={labels.retry}
                />
            )
        }
        if (!isSkeleton && isEmpty) {
            return category ? (
                <AsyncContentEmpty
                    title={labels.emptyInFilter}
                    description={labels.emptyInFilterHint}
                    onRetry={() => onChangeCategory(null)}
                    retryLabel={labels.clearFilter}
                />
            ) : (
                <AsyncContentEmpty
                    title={labels.empty}
                    description={labels.emptyHint}
                />
            )
        }

        // ROWS — while shimmering, placeholder rows keep the SAME `PostRow` shape/count
        // (loading-and-skeleton.md §1: same row component, same count shape).
        const rowItems: Array<ComponentTypeWithSkeleton> = isSkeleton
            ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => () => <PostRowSkeleton key={`skeleton-row-${index}`} />)
            : restPosts.map(({ post, formattedDate }) => () => <PostRow key={post.id} post={post} formattedDate={formattedDate} />)

        const resultItems: Array<ComponentTypeWithSkeleton> = [
            ...(!isSkeleton && pinnedPost ? [() => <StartHereAnchor post={pinnedPost} />] : []),
            ...(isSkeleton
                ? [() => <FeaturedPostSkeleton />]
                : featuredPost
                    ? [() => <FeaturedPost post={featuredPost} formattedDate={featuredFormattedDate ?? ""} />]
                    : []),
            ...(rowItems.length > 0 ? [() => <StackV gap={1} items={rowItems} />] : []),
            ...(!isSkeleton && hasMore
                ? [() => (
                    <Flex justify="center" gap={1} body={
                        <Button
                            variant="secondary"
                            size="md"
                            isPending={isLoadingMore}
                            label={labels.loadMore}
                            onPress={onLoadMore}
                        />
                    } />
                )]
                : []),
        ]

        return <StackV gap={4} items={resultItems} />
    }

    return (
        <Container
            identity={{ tier: "block", component: "BlogListPage" }}
            size="md"
            padding={6}
            body={() => (
                <StackV gap={6} items={[
                    () => <Masthead />,
                    () => (
                        <StackV gap={7} items={[
                            () => <PageHeader title={labels.title} description={labels.subtitle} />,
                            () => (
                                <StackV gap={6} items={[
                                    () => <TopicsStrip />,
                                    ...(showFilter
                                        ? [() => (
                                            <CategoryFilter
                                                value={category}
                                                onChange={onChangeCategory}
                                                categories={availableCategories}
                                            />
                                        )]
                                        : []),
                                    () => resultsZone(),
                                ]} />
                            ),
                        ]} />
                    ),
                ]} />
            )}
        />
    )
}

export { _BlogListPage }
