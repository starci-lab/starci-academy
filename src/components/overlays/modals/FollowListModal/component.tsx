import React from "react"
import type { FollowListTab } from "@/hooks/zustand/overlay/store"
import {
    AsyncContentEmpty,
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { UserCell } from "@/components/composites/lists/UserCell"
import { Tabs, type TabItem } from "@/components/atoms/navigation/Tabs"
import { Typography } from "@/components/atoms/text/Typography"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Box } from "@/components/frames/Box"
import { ScrollArea } from "@/components/frames/ScrollArea"
import { StackH, StackV } from "@/components/frames/Stack"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/**
 * `_FollowListModal` — the presentational half of {@link FollowListModal}
 * (`index.tsx`): the followers / following lists for one profile, each an
 * infinite-scroll roster of clickable users. Composes `ModalShell` + `Tabs`
 * (a count beside each label) + `SurfaceCardList` (free-form rows reusing the
 * `UserCell` composite) inside a bounded scroll region. Error/empty fall to
 * the shared `AsyncContentError`/`AsyncContentEmpty` frames, dropped into
 * `SurfaceCardList`'s own `errorState`/`emptyState` slots (`isEmpty` is
 * derived by that list from `items.length`, never passed in separately);
 * otherwise the tree renders with `isSkeleton` threaded into each
 * placeholder row's `UserCell`. See `tiers/split.md` — the connected
 * `index.tsx` (unchanged public name `FollowListModal`) owns the overlay
 * store, the two `useSWRInfinite` hooks (only the active tab fetches), and
 * every translated string.
 */

/** The two follow-graph directions, in tab order. */
const TABS: ReadonlyArray<FollowListTab> = ["followers", "following"]

/** How many placeholder rows mirror the list while the first page hasn't landed yet. */
const FOLLOW_LIST_SKELETON_ROW_COUNT = 5

/** One row of either list, already resolved by the connected `FollowListModal` — no raw entity. */
export interface FollowListRow {
    /** Opaque id — the row's `key`; also resolves the profile route on click. */
    globalId: string
    username: string
    /** Falls back to {@link FollowListRow.username} at the connected layer when unset. */
    displayName: string
    avatar?: string | null
    /** `@username`, already built by the connected layer. */
    handle: string
}

/** All display text, already localized by the connected `FollowListModal`; a story passes i18n keys. */
export interface FollowListModalLabels {
    title: string
    followersTab: string
    followingTab: string
    /** `t("followList.empty.<tab>")` for the CURRENTLY active tab, already picked. */
    empty: string
    errorTitle: string
    errorRetry: string
}

/** Props for {@link _FollowListModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface FollowListModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** Active direction (controlled — the connected half gates which `useSWRInfinite` hook fetches). */
    tab: FollowListTab
    onTabChange: (tab: FollowListTab) => void
    /** Follower / following counts, shown beside each tab's label. */
    counts: Record<FollowListTab, number>
    /** The active tab's rows (nearest page first), already resolved. Empty while {@link isSkeleton} is on. */
    rows: Array<FollowListRow>
    /** Go to a user's profile — the connected half also closes the modal in the same handler. */
    onOpenUser: (username: string) => void
    /** `true` -> the sentinel below the list can still grow it. */
    hasMore: boolean
    /** Grow the active list by one page. */
    onLoadMore: () => void
    /** A page is already in flight — the sentinel stays detached meanwhile. */
    isLoadingMore?: boolean
    /** First load of the active tab, nothing in hand yet -> the list mirrors itself. */
    isSkeleton?: boolean
    /** Truthy -> the list falls to its error message (beats the skeleton, per `SurfaceCardList`). */
    error?: unknown
    onRetry: () => void
    labels: FollowListModalLabels
}

/**
 * The follow-list modal. See the file header for the full contract.
 *
 * @param props - {@link FollowListModalProps}
 */
export const _FollowListModal = ({
    isOpen,
    onOpenChange,
    tab,
    onTabChange,
    counts,
    rows,
    onOpenUser,
    hasMore,
    onLoadMore,
    isLoadingMore = false,
    isSkeleton = false,
    error,
    onRetry,
    labels,
}: FollowListModalProps) => {
    const tabLabel: Record<FollowListTab, string> = {
        followers: labels.followersTab,
        following: labels.followingTab,
    }

    // A count beside a tab label is not `TabItem.badge` (that anchors a
    // notification-style chip OVER the label, `color="danger"` — the wrong
    // voice for a plain quantity). No block owns "label + muted count" either,
    // so this stays minimal, inline composition of existing atoms/frames.
    const tabItems: Array<TabItem> = TABS.map((tabId) => ({
        key: tabId,
        label: (
            <StackH
                gap={3}
                principle="value-row"
                explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                align="center"
                items={[
                    () => <>{tabLabel[tabId]}</>,
                    () => <Typography size="sm" color="muted" tabularNums text={String(counts[tabId])} />,
                ]}
            />
        ),
    }))

    const skeletonRows: Array<SurfaceCardListItem> = Array.from(
        { length: FOLLOW_LIST_SKELETON_ROW_COUNT },
        (_row, index) => ({
            key: `skeleton-${index}`,
            content: () => <UserCell username="" handle="@" isSkeleton />,
        }),
    )

    const followRows: Array<SurfaceCardListItem> = rows.map((row) => ({
        key: row.globalId,
        content: () => (
            <UserCell
                username={row.username}
                displayName={row.displayName}
                avatar={row.avatar}
                handle={row.handle}
            />
        ),
        onPress: () => onOpenUser(row.username),
    }))

    const listBody: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={2}
            items={[
                () => (
                    <SurfaceCardList
                        items={isSkeleton ? skeletonRows : followRows}
                        isSkeleton={isSkeleton}
                        error={error}
                        errorState={() => (
                            <AsyncContentError
                                title={labels.errorTitle}
                                onRetry={onRetry}
                                retryLabel={labels.errorRetry}
                            />
                        )}
                        emptyState={() => <AsyncContentEmpty title={labels.empty} />}
                    />
                ),
                // grow the list as the sentinel scrolls into view — only while the
                // content branch is actually on screen (the error/skeleton/empty
                // branches above have nothing below them worth loading more of).
                ...(!isSkeleton && !error && rows.length > 0
                    ? [() => (
                        <InfiniteScrollSentinel
                            onReach={onLoadMore}
                            disabled={!hasMore || isLoadingMore}
                        />
                    )]
                    : []),
            ]}
        />
    )

    // Tabs <-> list-below = 2 different-function zones (nav vs content) -> gap-6,
    // not gap-3 (fe/foundations/gap.md's between-block rule).
    const modalBody: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={6}
            items={[
                () => (
                    <Tabs
                        items={tabItems}
                        selectedKey={tab}
                        onSelectionChange={(key) => onTabChange(key as FollowListTab)}
                        ariaLabel={labels.title}
                        variant="secondary"
                    />
                ),
                // NEW-VOCABULARY GAP: no frame owns "cap this region's height and
                // scroll it locally" outside a page shell — `ScrollArea`'s
                // `classNames` is a closed, positioning-only enum (no height
                // values), and `PinnedTrack` hard-owns the page-shell's own
                // `sticky top-0 z-40` for its one real consumer. `ScrollArea`
                // still owns the `overflow-y-auto` behaviour; only the height
                // cap itself has nowhere to live yet, so it goes through `Box`
                // (the sanctioned raw-appearance escape hatch) rather than a
                // bare `div`.
                () => (
                    <Box className="max-h-[60vh]">
                        <ScrollArea axis="y" body={listBody} />
                    </Box>
                ),
            ]}
        />
    )

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="sm"
            title={labels.title}
            body={modalBody}
            identity={{ tier: "overlay", component: "FollowListModal" }}
        />
    )
}
