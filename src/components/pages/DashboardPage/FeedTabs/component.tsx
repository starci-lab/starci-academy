import React from "react"
import type {
    Key,
} from "react"
import {
    AsyncContentEmpty,
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import {
    SurfaceListCard,
    SurfaceListCardItem,
} from "@/components/blocks/cards/SurfaceListCard"
import {
    TabsCard,
    type TabsCardItem,
} from "@/components/blocks/navigation/TabsCard"
import { ActivityFeed } from "@/components/blocks/feed/ActivityFeed"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { CallerIdentity } from "@/components/frames/_identity"
import { TrendingContents } from "../TrendingContents"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import type { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/** Placeholder day groups, and rows per group, the co-located feed skeleton shows. */
const SKELETON_GROUP_COUNT = 2
const SKELETON_ROW_COUNT = 3

/**
 * One placeholder day-group of feed rows — a date label above a joined card of
 * `[avatar · two text lines]` rows. `ActivityFeed` carries no `isSkeleton` of its
 * own, so this hand-mirrors its shape right where it sits, instead of pulling in a
 * separate skeleton tree (loading-and-skeleton.md; `missingSkeletonSupport`).
 */
const FeedSkeletonGroup = () => (
    <StackV gap={3} principle="sibling-stack"
        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
        items={[
            () => <Typography size="xs" color="muted" isSkeleton classNames={["w-1/4"]} />,
            () => (
                <SurfaceListCard>
                    {Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => (
                        <SurfaceListCardItem key={index}>
                            <StackH gap={2} principle="icon-text"
                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                align="start" items={[
                                    () => <Skeleton className="size-9 shrink-0 rounded-full" />,
                                    () => (
                                        <StackV gap={1} principle="name-handle"
                                            explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                            classNames={["min-w-0", "flex-1"]} items={[
                                                () => <Typography size="sm" isSkeleton classNames={["w-3/4"]} />,
                                                () => <Typography size="xs" isSkeleton classNames={["w-1/4"]} />,
                                            ]} />
                                    ),
                                ]} />
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            ),
        ]} />
)

/** All display text, already localized by the connected `FeedTabs`; a story passes i18n keys. */
export interface FeedTabsLabels {
    /** Accessible name for the audience scope tab strip ("For you" / "Following"). */
    scopeTabsAria: string
    /** Accessible name for the category filter chip strip. */
    filterTabsAria: string
    /** Empty-branch title when a category filter matched nothing. */
    emptyFilteredTitle: string
    /** Action label that clears the category filter back to "all". */
    emptyFilteredCta: string
    /** Empty-branch title when the whole scope has nothing yet. */
    emptyPlatformTitle: string
    /** Empty-branch description under {@link FeedTabsLabels.emptyPlatformTitle}. */
    emptyPlatformDescription: string
    /** Action label that sends an empty-feed visitor into the course catalog. */
    emptyPlatformCta: string
    /** Error-branch title — shared by the full error branch and the inline load-more retry. */
    errorTitle: string
    /** Retry button label — shared by the error branch and the inline load-more retry. */
    retryLabel: string
    /** "Load more" button label under the feed. */
    loadMoreLabel: string
}

/** Props for {@link _FeedTabs} — presentational; all data resolved, no fetch/store/i18n. */
export interface FeedTabsProps {
    /** First load, nothing in hand → the feed region shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with a resolved page that carries zero items → the empty branch. */
    isEmpty?: boolean
    /** Truthy → the error branch (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — refetches the feed. Paired with `labels.retryLabel`; also drives the inline load-more retry. */
    onRetry?: () => void
    /** `true` while a category filter narrower than "all" is active — picks which empty message shows. */
    isFilteredEmpty?: boolean
    /** Audience-scope tab strip ("For you" / "Following"), already resolved (i18n'd labels). */
    scopeTabs: Array<TabsCardItem>
    /** Currently selected scope tab key. */
    selectedScopeKey: string
    /** Fired with the newly selected scope tab key. */
    onScopeChange: (key: Key) => void
    /** Category filter chip strip, already resolved (i18n'd labels + icons). */
    filterTabs: Array<TabsCardItem>
    /** Currently selected filter chip key. */
    selectedFilterKey: string
    /** Fired with the newly selected filter chip key. */
    onFilterChange: (key: Key) => void
    /** Clears the active category filter back to "all". */
    onResetFilter: () => void
    /** Sends a platform-empty visitor into the course catalog. */
    onBrowseCourses: () => void
    /** The flattened, newest-first feed page. */
    items: Array<QueryMyFeedItemData>
    /** Resolve a global id to a press handler that navigates to the entity, or `undefined` when unroutable. */
    onResolve: (globalId: string | null | undefined) => (() => void) | undefined
    /** React handler forwarded to each feed item. */
    onReact: (activityId: string, type: ReactionType | null) => void
    /** `true` iff the last loaded page still carries a next cursor. */
    hasMore: boolean
    /** `true` while a "load more" page is in flight. */
    isLoadingMore: boolean
    /** Requests the next page. */
    onLoadMore: () => void
    /**
     * `true` → a "load more" page failed while existing items stayed on screen; shows
     * an inline retry instead of falling back to the full error branch.
     */
    hasLoadMoreError?: boolean
    labels: FeedTabsLabels
}

/**
 * Explore feed (ContentBody-style `TabsCard` pattern) — the presentational half of
 * {@link import("./index").FeedTabs}, composed on the tier-correct vocabulary
 * (`TabsCard` / `ActivityFeed` / `SurfaceListCard`). CARD 1 = "Trending this week"
 * (self-fetching, always rendered, self-hides when nothing trends). Below it, a
 * double-tabs toolbar (audience scope left, category filter right) always renders;
 * only the activity stream it governs runs the fixed order error → loading → empty →
 * content: `error` falls to the shared `AsyncContentError` frame, `isEmpty` to
 * `AsyncContentEmpty` (filtered vs platform), and otherwise the feed renders with
 * `isSkeleton` threaded to every leaf that supports it so the shimmer mirrors the
 * loaded shape (loading-and-skeleton.md). See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch, the tab/filter state, and i18n.
 *
 * @param props - {@link FeedTabsProps}
 */
export const _FeedTabs = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    isFilteredEmpty = false,
    scopeTabs,
    selectedScopeKey,
    onScopeChange,
    filterTabs,
    selectedFilterKey,
    onFilterChange,
    onResetFilter,
    onBrowseCourses,
    items,
    onResolve,
    onReact,
    hasMore,
    isLoadingMore,
    onLoadMore,
    hasLoadMoreError = false,
    labels,
}: FeedTabsProps) => {
    const identity: CallerIdentity = { tier: "block", component: "FeedTabs" }

    // Hoisted so outer gap-only / named frames are not scanned as owning nested decisions.
    const feedStreamItems = [
        ...(isSkeleton
            ? Array.from({ length: SKELETON_GROUP_COUNT }, () => () => <FeedSkeletonGroup />)
            : [() => <ActivityFeed items={items} onResolve={onResolve} onReact={onReact} />]),
        ...(!isSkeleton && hasMore ? [() => (
            <StackV gap={3} principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center" items={[
                    () => (
                        <Button
                            variant="secondary"
                            size="sm"
                            isPending={isLoadingMore}
                            label={labels.loadMoreLabel}
                            onPress={onLoadMore}
                        />
                    ),
                    ...(hasLoadMoreError && !isLoadingMore ? [() => (
                        <StackH gap={2} principle="icon-text"
                            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                            items={[
                                () => <Typography size="xs" color="danger" text={labels.errorTitle} />,
                                () => <Button variant="tertiary" size="sm" label={labels.retryLabel} onPress={onRetry} />,
                            ]} />
                    )] : []),
                ]} />
        )] : []),
    ]

    const tabsZoneItems = [
        () => (
            <TabsCard
                leftTabs={{
                    items: scopeTabs,
                    selectedKey: selectedScopeKey,
                    ariaLabel: labels.scopeTabsAria,
                    onSelectionChange: onScopeChange,
                }}
                rightTabs={{
                    items: filterTabs,
                    selectedKey: selectedFilterKey,
                    ariaLabel: labels.filterTabsAria,
                    onSelectionChange: onFilterChange,
                }}
            />
        ),
        () => {
            // error beats a stale loading flag; empty only once settled
            if (error) {
                return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retryLabel} />
            }
            if (!isSkeleton && isEmpty) {
                // two distinct reasons need two distinct empties: filtered-empty
                // offers a way back to "all"; platform-empty invites into courses.
                return isFilteredEmpty ? (
                    <AsyncContentEmpty
                        title={labels.emptyFilteredTitle}
                        action={() => (
                            <Button variant="secondary" size="sm" label={labels.emptyFilteredCta} onPress={onResetFilter} />
                        )}
                    />
                ) : (
                    <AsyncContentEmpty
                        title={labels.emptyPlatformTitle}
                        description={labels.emptyPlatformDescription}
                        action={() => (
                            <Button variant="secondary" size="sm" label={labels.emptyPlatformCta} onPress={onBrowseCourses} />
                        )}
                    />
                )
            }

            // the feed lives DIRECTLY in the zone — do NOT wrap it in an outer
            // Card (each day is already a labeled-list-card; an outer Card
            // would nest card-in-card inside the big zone)
            return <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={feedStreamItems}  />
        },
    ]

    return (
        <StackV gap={6} principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            identity={identity} items={[
            // CARD 1 — "Trending this week": platform-wide trending discovery (own
            // query, NOT scope-dependent) → shown on both scopes; self-hides when
            // nothing trends.
                () => <TrendingContents />,
                // CARD 2 — TabsCard pattern (like the lesson ContentBody): the double-tabs
                // toolbar floats OUTSIDE, above the card; the card holds the activity
                // stream the tabs govern.
                () => (
                    <StackV gap={3} principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={tabsZoneItems}  />
                ),
            ]} />
    )
}
