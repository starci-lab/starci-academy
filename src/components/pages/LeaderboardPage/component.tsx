import React from "react"
import { LeaderboardHeader, type LeaderboardHeaderCrumb } from "@/components/blocks/learn/LeaderboardHeader"
import { TrialEnrollBanner } from "@/components/blocks/learn/TrialEnrollBanner"
import { LeaderboardCategoryNav, type LeaderboardCategoryKey, type LeaderboardCategoryOption } from "@/components/blocks/learn/LeaderboardCategoryNav"
import { LeaderboardToolbar } from "@/components/blocks/learn/LeaderboardToolbar"
import { LeaderboardBoard, type LeaderboardStanding, type LeaderboardPodiumEntry, type LeaderboardRow } from "@/components/blocks/learn/LeaderboardBoard"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `LeaderboardPage` — the screen to see who's ranked where, sorted by whichever
 * XP category the reader cares about. A screen owns a list of functions: it
 * calls blocks, places them in frames, and hands each typed data. Five
 * functions, in reading order: what this page is · a quiet nudge toward
 * enrolling · which category to rank by · what that ranking is and when it last
 * refreshed · the ranking itself. Reuses `TrialEnrollBanner` (not a new block).
 * The `Enrolled` leaf is a real structural difference: the banner self-hides
 * once enrolled, removing a whole node from the tree.
 *
 * src twin of `.storybook/components/starci/pages/LeaderboardPage/LeaderboardPage.tsx` —
 * presentational half; the connected {@link LeaderboardPage} (`index.tsx`) owns the fetch,
 * routing, and i18n and renders this through `@/components/*` block twins.
 */

/** Props for {@link _LeaderboardPage}. */
export interface LeaderboardPageProps {
    // ── header ──
    /** Breadcrumb trail as data. */
    breadcrumbItems: Array<LeaderboardHeaderCrumb>
    /** Page title, e.g. "Leaderboard". */
    title: string
    /** One-sentence subtitle explaining what the ranking measures. */
    description?: string

    // ── enroll nudge ──
    /** `true` once enrollment status has actually resolved. */
    isEnrollmentKnown: boolean
    /** Whether the reader is enrolled. `true` → the banner self-hides. */
    isEnrolled: boolean
    /** Fired when the reader takes the enroll nudge. */
    onEnroll: () => void

    // ── category nav (mobile chip row only; desktop rail is a shared layout slot, out of scope) ──
    /** Categories offered, in display order. */
    categoryItems: Array<LeaderboardCategoryOption>
    /** Which category the board is sorted by right now. */
    selectedCategory: LeaderboardCategoryKey
    /** Fired with the category the reader picked. */
    onCategorySelect: (key: LeaderboardCategoryKey) => void
    /** Accessible name for the category row. */
    categoryAriaLabel: string

    // ── toolbar ──
    /** The bare category name, e.g. "XP this week" — pre-worded by this screen's own caller. */
    categoryLabel: string
    /** When the board last refreshed. Omitted → nothing has loaded yet. */
    updatedAt?: Date
    /** Fired when the reader asks for a fresh ranking. */
    onRefresh: () => void
    /** `true` → a refresh is in flight. */
    isRefreshing?: boolean
    /** Localized trigger word for the refresh button, e.g. "Refresh". */
    refreshLabel: string

    // ── board ──
    /** True while the first load is running. */
    isBoardLoading: boolean
    /** True (once loaded) → the board has no participants at all. */
    isBoardEmpty: boolean
    /** Truthy → the board failed to load. */
    boardError?: unknown
    /** Retry handler for the board's error branch. */
    onBoardRetry: () => void
    /** The viewer's own standing, shown above the podium. Omitted when the viewer has no rank yet. */
    standing?: LeaderboardStanding
    /** Top-3 finishers, in any order. */
    podiumEntries: Array<LeaderboardPodiumEntry>
    /** The ranked rows below the podium, in display order. */
    rows: Array<LeaderboardRow>
    /** The viewer's own row, pinned at the end when it isn't already inside `rows`. */
    selfRow?: LeaderboardRow
    /** How many ranks sit between the visible `rows` and `selfRow`. */
    hiddenBetweenCount?: number
    /** Bumping this number replays the top-3 confetti burst. */
    celebrateKey: number
    /** Accessible tag for "this row is you", already localized. */
    meLabel: string

    /**
     * `true` → `LeaderboardHeader` and `LeaderboardBoard` mirror themselves
     * (data already loaded, background revalidate in flight). The category
     * row and toolbar never skeletonise — see the file header for why.
     */
    isSkeleton?: boolean
}

/**
 * The leaderboard screen. See the file header for the function list, the
 * `TrialEnrollBanner` reuse call, and the two independent skeleton surfaces.
 *
 * @param props - {@link LeaderboardPageProps}
 */
const _LeaderboardPage = ({
    breadcrumbItems,
    title,
    description,
    isEnrollmentKnown,
    isEnrolled,
    onEnroll,
    categoryItems,
    selectedCategory,
    onCategorySelect,
    categoryAriaLabel,
    categoryLabel,
    updatedAt,
    onRefresh,
    isRefreshing,
    refreshLabel,
    isBoardLoading,
    isBoardEmpty,
    boardError,
    onBoardRetry,
    standing,
    podiumEntries,
    rows,
    selfRow,
    hiddenBetweenCount,
    celebrateKey,
    meLabel,
    isSkeleton = false,
}: LeaderboardPageProps) => {
    const boardSection = (
        <>
            <LeaderboardCategoryNav

                className="@app-lg:hidden"
                items={categoryItems}
                selected={selectedCategory}
                onSelect={onCategorySelect}
                ariaLabel={categoryAriaLabel}

            />
            <LeaderboardToolbar

                categoryLabel={categoryLabel}
                updatedAt={updatedAt}
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
                refreshLabel={refreshLabel}

            />
            <LeaderboardBoard

                isLoading={isBoardLoading}
                isEmpty={isBoardEmpty}
                error={boardError}
                onRetry={onBoardRetry}
                standing={standing}
                podiumEntries={podiumEntries}
                rows={rows}
                selfRow={selfRow}
                hiddenBetweenCount={hiddenBetweenCount}
                celebrateKey={celebrateKey}
                meLabel={meLabel}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const leaderboardSections = (
        <>
            <LeaderboardHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <TrialEnrollBanner

                isVisible={isEnrollmentKnown && !isEnrolled}
                onEnroll={onEnroll}

            />
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => boardSection]} />
        </>
    )

    const leaderboardBody = <StackV gap={7} isSkeleton={isSkeleton} items={[() => leaderboardSections]} />

    return (
        <Container
            size="md"
            padding={6}
            body={() => leaderboardBody}
            identity={{ tier: "page", component: "LeaderboardPage" }}
        />
    )
}

export { _LeaderboardPage }
