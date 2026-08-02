import React from "react"
import { LeaderboardHeader, type LeaderboardHeaderCrumb } from "@sb-components/starci/blocks/learn/LeaderboardHeader/LeaderboardHeader"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { LeaderboardCategoryNav, type LeaderboardCategoryKey, type LeaderboardCategoryOption } from "@sb-components/starci/blocks/learn/LeaderboardCategoryNav/LeaderboardCategoryNav"
import { LeaderboardToolbar } from "@sb-components/starci/blocks/learn/LeaderboardToolbar/LeaderboardToolbar"
import { LeaderboardBoard, type LeaderboardStanding, type LeaderboardPodiumEntry, type LeaderboardRow } from "@sb-components/starci/blocks/learn/LeaderboardBoard/LeaderboardBoard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LeaderboardPage` — the screen for seeing rankings sorted by whichever XP category
 * the reader cares about. It composes blocks in frames and hands each typed data,
 * drawing no shape of its own.
 *
 * Five functions: what this page is, a self-hiding trial-enroll nudge, which category
 * to rank by (`LeaderboardCategoryNav`, the mobile half only — the desktop rail lives
 * in the shared learn layout), the toolbar (ranking + last-refresh), and the ranking
 * board. `categoryLabel` arrives pre-worded. `isSkeleton` (a background revalidate)
 * reaches only the header and board, separate from the board's own first-load async
 * lifecycle.
 */

/** Props for {@link LeaderboardPage}. */
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
const LeaderboardPage = ({
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
            <StackV gap={6} items={[() => boardSection]} />
        </>
    )

    const leaderboardBody = <StackV gap={7} items={[() => leaderboardSections]} />

    return <Container size="md" padding={6} body={leaderboardBody} />
}

export { LeaderboardPage }
