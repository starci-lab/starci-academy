import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardPage } from "@sb-components/starci/pages/LeaderboardPage/LeaderboardPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeaderboardPage` — the screen to see who's ranked where, sorted by whichever
 * XP category the reader cares about. A screen owns a list of functions: it
 * calls blocks, places them in frames, and hands each typed data. Five
 * functions, in reading order: what this page is · a quiet nudge toward
 * enrolling · which category to rank by · what that ranking is and when it last
 * refreshed · the ranking itself. Reuses `TrialEnrollBanner` (not a new block).
 * The `Enrolled` leaf is a real structural difference: the banner self-hides
 * once enrolled, removing a whole node from the tree.
 */
const meta: Meta<typeof LeaderboardPage> = {
    title: "StarCi/Pages/LeaderboardPage/LeaderboardPage",
    component: LeaderboardPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeaderboardPage>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "leaderboard", label: "Leaderboard" },
]

const CATEGORY_ITEMS = [
    { key: "total" as const, xp: 420 },
    { key: "challenge" as const, xp: 260 },
    { key: "reading" as const, xp: 96 },
    { key: "milestone" as const, xp: 60 },
]

const FIVE_MINUTES_AGO = new Date(Date.now() - 5 * 60_000)

// Same fixture shape as `LeaderboardBoard`'s own story — no top-3 entry is
// ever the viewer while `selfRow` also places the viewer at rank 42.
const PODIUM = [
    { rank: 2 as const, username: "hoang.tran", pointsLabel: "3,980 XP" },
    { rank: 1 as const, username: "minh.le", pointsLabel: "4,510 XP" },
    { rank: 3 as const, username: "thao.dang", pointsLabel: "3,640 XP" },
]

const ROWS = [
    { key: "r4", rank: 4, username: "duc.nguyen", valueLabel: "3,120 XP" },
    { key: "r5", rank: 5, username: "linh.vo", valueLabel: "2,980 XP" },
    { key: "r6", rank: 6, username: "an.bui", valueLabel: "2,760 XP" },
]

const SELF_ROW = { key: "self", rank: 42, username: "quynh.pham", valueLabel: "1,240 XP", isMe: true, profileHref: "/u/quynh.pham" }

const STANDING = { rank: 42, primaryLabel: "1,240 XP this week", secondaryLabel: "Top 15% of the course" }

const BASE = {
    breadcrumbItems: CRUMBS,
    title: "Leaderboard",
    description: "Ranked by total practice score this month",
    onEnroll: () => {},
    categoryItems: CATEGORY_ITEMS,
    selectedCategory: "total" as const,
    onCategorySelect: () => {},
    categoryAriaLabel: "Ranking category",
    categoryLabel: "Total score",
    updatedAt: FIVE_MINUTES_AGO,
    onRefresh: () => {},
    refreshLabel: "Refresh",
    isBoardLoading: false,
    isBoardEmpty: false,
    onBoardRetry: () => {},
    standing: STANDING,
    podiumEntries: PODIUM,
    rows: ROWS,
    selfRow: SELF_ROW,
    hiddenBetweenCount: 35,
    celebrateKey: 1,
    meLabel: "You",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning every seam on this screen — between identity, the enroll nudge, and the ranking cluster, and again between the category row, toolbar and board inside it", storyId: "frames-stack-stackv--default" },
    "LeaderboardHeader": { tier: "block", role: "what this page is: trail, title, and what the ranking measures", storyId: "starci-blocks-learn-leaderboardheader-leaderboardheader--header" },
    "TrialEnrollBanner": { tier: "block", role: "the ambient trial → enroll nudge, reused as-is; self-hides once the reader is enrolled", storyId: "starci-blocks-learn-trialenrollbanner-trialenrollbanner--banner" },
    "LeaderboardCategoryNav": { tier: "block", role: "the mobile chip row for picking which XP category the board is sorted by — the desktop rail half lives in a shared layout slot, out of scope here", storyId: "starci-blocks-learn-leaderboardcategorynav-leaderboardcategorynav--chip-row" },
    "LeaderboardToolbar": { tier: "block", role: "the strip above the ranking — what it's ranked by, when it last refreshed, and a refresh trigger — living outside the board's own async region", storyId: "starci-blocks-learn-leaderboardtoolbar-leaderboardtoolbar--toolbar" },
    "LeaderboardBoard": { tier: "block", role: "the ranking itself: async lifecycle, the viewer's own standing, the top-3 podium, and the ranked rows with a pinned self-row", storyId: "starci-blocks-learn-leaderboardboard-leaderboardboard--board" },
}

/** LEAF — a reader who has NOT enrolled: every function is present, banner included. */
export const Ranked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardPage"
                tier="screen"
                leaf="Ranked"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEnrollmentKnown = true, isEnrolled = false",
                        why: "Every function of the screen is present, in the order the reader meets them: page identity, the ambient nudge toward enrolling, the category row, the toolbar, then the ranking itself. Each of the five nodes below is a block — the screen itself draws no shape at all.",
                        code: `<LeaderboardPage
    title="Leaderboard"
    isEnrollmentKnown
    isEnrolled={false}
    categoryItems={categories}
    selectedCategory="total"
    …
/>`,
                        render: (
                            <LeaderboardPage
                                {...BASE}

                                isEnrollmentKnown
                                isEnrolled={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — an ENROLLED reader ⇒ **loses the whole enroll-nudge node**, nothing else changes. */
export const Enrolled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardPage"
                tier="screen"
                leaf="Enrolled"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEnrollmentKnown = true, isEnrolled = true",
                        why: "`TrialEnrollBanner` self-hides once the reader is already enrolled — one whole block disappears from the tree, not just a line of text inside it. Everything below it keeps its place, which is why the category row does not jump around depending on enrollment.",
                        code: `<LeaderboardPage
    title="Leaderboard"
    isEnrollmentKnown
    isEnrolled
    …
/>`,
                        render: (
                            <LeaderboardPage
                                {...BASE}

                                isEnrollmentKnown
                                isEnrolled
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; header and board mirror themselves, the category row and toolbar do not. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The identity block and the board — the two that own an `isSkeleton` contract — mirror themselves while a background revalidate is in flight, keeping the exact shape their real data already drew. The category row and toolbar deliberately stay put: both are documented as never-skeletonised in their own file headers, so shimmering them would take away controls that were already ready.",
                        code: "<LeaderboardPage {...props} isSkeleton />",
                        render: (
                            <LeaderboardPage
                                {...BASE}

                                isEnrollmentKnown
                                isEnrolled={false}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
