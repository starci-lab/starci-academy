import React from "react"
import { LeaderboardHeader, type LeaderboardHeaderCrumb } from "@sb-components/starci/blocks/learn/LeaderboardHeader/LeaderboardHeader"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { LeaderboardCategoryNav, type LeaderboardCategoryKey, type LeaderboardCategoryOption } from "@sb-components/starci/blocks/learn/LeaderboardCategoryNav/LeaderboardCategoryNav"
import { LeaderboardToolbar } from "@sb-components/starci/blocks/learn/LeaderboardToolbar/LeaderboardToolbar"
import { LeaderboardBoard, type LeaderboardStanding, type LeaderboardPodiumEntry, type LeaderboardRow } from "@sb-components/starci/blocks/learn/LeaderboardBoard/LeaderboardBoard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `LeaderboardPage`: see who's ranked where, sorted by whichever XP
 * category the reader cares about right now.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own.
 *
 * FIVE FUNCTIONS, in the order the reader meets them: what this page is · a
 * quiet nudge toward enrolling, if the reader hasn't · which category to rank
 * by · what that ranking is and when it last refreshed · the ranking itself.
 *
 * ⭐ `TrialEnrollBanner`, NOT A NEW `EnrollNudgeBanner`. The planner's tree
 * asked for a block by that name asserting none existed yet — that assertion
 * was checked and found false: `TrialEnrollBanner`'s own file header already
 * names "leaderboard" as one of the surfaces it is reused on ("foundations,
 * flashcard study, leaderboard — this screen (Quiz) is just one caller among
 * several"). Building a fourth near-duplicate of an already-tripled block
 * (`TrialEnrollBanner`, `FoundationTrialEnrollBanner`,
 * `TrialEnrollNudge`) would compound the exact parallel-agent drift this
 * catalog is trying to converge out of, not add a new function.
 *
 * ⭐ `LeaderboardCategoryNav` IS THE MOBILE HALF ONLY (`@app-lg:hidden`). Its
 * own file header explains why: the desktop rail half of the same fetch lives
 * in the shared `courses/[courseId]/learn/layout.tsx` `leftRail` slot, handed
 * to every learn tab, not just this screen — out of scope for a screen that
 * only owns what's inside its own body.
 *
 * ⭐ TWO INDEPENDENT SKELETON SURFACES, NOT ONE FLAG THREADED EVERYWHERE.
 * `isSkeleton` reaches only `LeaderboardHeader` and `LeaderboardBoard` — the
 * two blocks whose own file headers document an `isSkeleton` contract.
 * `LeaderboardCategoryNav` is deliberately NEVER skeletonised (its categories
 * are static chrome known before any fetch) and `LeaderboardToolbar` has no
 * such prop either (see their file headers) — so the flag simply is not
 * threaded to them, the same restraint `ContentPage` documents for its own
 * mode row.
 *
 * ⭐ THE BOARD'S OWN ASYNC LIFECYCLE (`isBoardLoading`/`isBoardEmpty`/
 * `boardError`) IS SEPARATE FROM THE SCREEN'S `isSkeleton`. The first load has
 * no shape yet — that is `LeaderboardBoard`'s own `AsyncContent` switch, fed
 * fixed-count placeholders. `isSkeleton` is for a background revalidate of a
 * board that is already showing real data (§12c) — an entirely different
 * moment, and conflating them would mean a mid-revalidate screen has no way to
 * shimmer without also discarding the ranking already on screen.
 *
 * ⭐ `categoryLabel` ARRIVES PRE-WORDED FROM THIS SCREEN'S OWN CALLER. It is
 * the bare category name `LeaderboardToolbar` builds its "Xếp hạng theo …"
 * sentence around (see that block's file header) — the same source of truth
 * the app page already used to build `categoryItems`, handed straight through
 * rather than this screen re-deriving or inventing a second copy of that
 * table.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link LeaderboardPage}. */
export interface LeaderboardPageProps {
    // ── header ──
    /** Breadcrumb trail as data. */
    breadcrumbItems: Array<LeaderboardHeaderCrumb>
    /** Page title, e.g. "Bảng xếp hạng". */
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
    /** The bare category name, e.g. "XP tuần này" — pre-worded by this screen's own caller. */
    categoryLabel: string
    /** When the board last refreshed. Omitted → nothing has loaded yet. */
    updatedAt?: Date
    /** Fired when the reader asks for a fresh ranking. */
    onRefresh: () => void
    /** `true` → a refresh is in flight. */
    isRefreshing?: boolean
    /** Localized trigger word for the refresh button, e.g. "Làm mới". */
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
    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: LeaderboardPageProps) => (
    <Container size="md" padding="roomy">
        <StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined}>
            <LeaderboardHeader
                anatPart="LeaderboardHeader"
                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <TrialEnrollBanner
                anatPart="TrialEnrollBanner"
                isVisible={isEnrollmentKnown && !isEnrolled}
                onEnroll={onEnroll}
                showAnatomy={showAnatomy}
            />
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                <LeaderboardCategoryNav
                    anatPart="LeaderboardCategoryNav"
                    className="@app-lg:hidden"
                    items={categoryItems}
                    selected={selectedCategory}
                    onSelect={onCategorySelect}
                    ariaLabel={categoryAriaLabel}
                    showAnatomy={showAnatomy}
                />
                <LeaderboardToolbar
                    anatPart="LeaderboardToolbar"
                    categoryLabel={categoryLabel}
                    updatedAt={updatedAt}
                    onRefresh={onRefresh}
                    isRefreshing={isRefreshing}
                    refreshLabel={refreshLabel}
                    showAnatomy={showAnatomy}
                />
                <LeaderboardBoard
                    anatPart="LeaderboardBoard"
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
                    showAnatomy={showAnatomy}
                />
            </StackV>
        </StackV>
    </Container>
)

export { LeaderboardPage }
