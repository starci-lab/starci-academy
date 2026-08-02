import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardBoard } from "@sb-components/starci/blocks/learn/LeaderboardBoard/LeaderboardBoard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LeaderboardBoard`: the ranked board itself. See the component's own
 * file header for the full reuse contract; this file only adds the states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): loading / empty / error / how many rows / whether
 * the viewer needs pinning are all DATA — `AsyncContent`'s own branch switch
 * already reads that way — so this block has exactly ONE leaf ("Board") and five
 * states inside it, the same shape `QuizRecapList`'s single `Full` leaf uses.
 */
const meta: Meta<typeof LeaderboardBoard> = {
    title: "StarCi/Blocks/Learn/LeaderboardBoard/LeaderboardBoard",
    component: LeaderboardBoard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeaderboardBoard>

const STANDING = { rank: 42, primaryLabel: "1,240 XP this week", secondaryLabel: "Top 15% of the course" }

// No entry here is ever the viewer — the two states below place the viewer at
// rank 4 and rank 42, and neither belongs on the top-3 dais.
const PODIUM = [
    { rank: 2 as const, username: "hoang.tran", pointsLabel: "3.980 XP" },
    { rank: 1 as const, username: "minh.le", pointsLabel: "4.510 XP" },
    { rank: 3 as const, username: "thao.dang", pointsLabel: "3.640 XP" },
]

const ROWS = [
    { key: "r4", rank: 4, username: "duc.nguyen", valueLabel: "3.120 XP" },
    { key: "r5", rank: 5, username: "linh.vo", valueLabel: "2.980 XP" },
    { key: "r6", rank: 6, username: "an.bui", valueLabel: "2.760 XP" },
]

const SELF_ROW = { key: "self", rank: 42, username: "quynh.pham", valueLabel: "1.240 XP", isMe: true, profileHref: "/u/quynh.pham" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating standing, podium and the row list, owning the section-wide seam between the three regions", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame used both for the standing row and for laying the podium's three columns side by side", storyId: "frames-stack-stackh--default" },
    "SurfaceCard": { tier: "composite", role: "the standing card — a bare surface face wrapping the viewer's own rank and stat lines", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "IconTile": { tier: "atom", role: "the trophy badge on the standing card, giving the viewer's rank an identity mark", storyId: "atoms-display-icontile-icontile--default" },
    "Avatar": { tier: "atom", role: "a podium finisher's face — the same fallback chain (upload → generated → initials → icon) as everywhere else a person renders", storyId: "atoms-display-avatar-avatar--default" },
    "UserCell": { tier: "composite", role: "a ranked row's identity + accent — `isOwnRow` marks the viewer's own row without this block hand-rolling a second accent mechanism", storyId: "composites-lists-usercell-usercell--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — a rank number, a username, a score, or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "SurfaceCardList": { tier: "composite", role: "the bounded row list — takes the ranked rows plus the ellipsis + pinned self-row as data, via its free-form `content` escape hatch", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
}

/** LEAF — the ranked board: async lifecycle, standing, podium and rows, all as states of one shape. */
export const Board: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardBoard"
                tier="block"
                leaf="Board"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "content, viewer pinned below the visible rows",
                        why: "The viewer sits outside the top rows this board shows, so their own row is pinned at the end behind an ellipsis marker instead of being lost off-screen. `celebrateKey` is bumped here, so the top-3 confetti plays once — the SCREEN decides when a placement is worth celebrating, this block only reacts to the pulse.",
                        code: `<LeaderboardBoard
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    standing={{ rank: 42, primaryLabel: "1,240 XP this week", secondaryLabel: "Top 15% of the course" }}
    podiumEntries={podium}
    rows={rows}
    selfRow={{ key: "self", rank: 42, username: "quynh.pham", valueLabel: "1.240 XP", isMe: true, profileHref: "/u/quynh.pham" }}
    hiddenBetweenCount={35}
    celebrateKey={1}
    meLabel="You"
/>`,
                        render: (
                            <LeaderboardBoard

                               
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                standing={STANDING}
                                podiumEntries={PODIUM}
                                rows={ROWS}
                                selfRow={SELF_ROW}
                                hiddenBetweenCount={35}
                                celebrateKey={1}
                                meLabel="You"
                            />
                        ),
                    },
                    {
                        name: "content, viewer already inside the visible rows",
                        why: "When the viewer's placement is already one of the shown rows, `selfRow` is left unset: no ellipsis, no second copy of the same row pinned below. The `isMe` row inside `rows` alone carries the accent, so the viewer is never shown twice.",
                        code: `<LeaderboardBoard
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    standing={{ rank: 4, primaryLabel: "3,120 XP this week" }}
    podiumEntries={podium}
    rows={[{ key: "r4", rank: 4, username: "duc.nguyen", valueLabel: "3.120 XP", isMe: true }, ...]}
    celebrateKey={1}
    meLabel="You"
/>`,
                        render: (
                            <LeaderboardBoard
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                standing={{ rank: 4, primaryLabel: "3,120 XP this week" }}
                                podiumEntries={PODIUM}
                                rows={[{ ...ROWS[0], isMe: true }, ROWS[1], ROWS[2]]}
                                celebrateKey={1}
                                meLabel="You"
                            />
                        ),
                    },
                    {
                        name: "isLoading = true",
                        why: "Before any real board data lands, `AsyncContent` picks the loading branch and this block hands it a fixed-shape skeleton mirror — a placeholder standing card, three podium columns and five rows — so the page doesn't jump once the real counts land.",
                        code: "<LeaderboardBoard isLoading isEmpty={false} onRetry={refetch} podiumEntries={[]} rows={[]} celebrateKey={0} meLabel=\"You\" />",
                        render: (
                            <LeaderboardBoard
                                isLoading
                                isEmpty={false}
                                onRetry={() => {}}
                                podiumEntries={[]}
                                rows={[]}
                                celebrateKey={0}
                                meLabel="You"
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "Nobody has scored on this board yet, so `AsyncContent` falls to its empty branch instead of drawing a standing card, an empty dais and an empty list — three boxes with nothing in them would read as broken, not as intentionally empty.",
                        code: "<LeaderboardBoard isLoading={false} isEmpty onRetry={refetch} podiumEntries={[]} rows={[]} celebrateKey={0} meLabel=\"You\" />",
                        render: (
                            <LeaderboardBoard
                                isLoading={false}
                                isEmpty
                                onRetry={() => {}}
                                podiumEntries={[]}
                                rows={[]}
                                celebrateKey={0}
                                meLabel="You"
                            />
                        ),
                    },
                    {
                        name: "error present",
                        why: "A failed fetch beats loading/empty/content in `AsyncContent`'s priority order, so a stale board never sits under a silent spinner. `onRetry` is the caller's own refetch — the block only supplies the wording and the button.",
                        code: "<LeaderboardBoard isLoading={false} isEmpty={false} error={fetchError} onRetry={refetch} podiumEntries={[]} rows={[]} celebrateKey={0} meLabel=\"You\" />",
                        render: (
                            <LeaderboardBoard
                                isLoading={false}
                                isEmpty={false}
                                error={new Error("network")}
                                onRetry={() => {}}
                                podiumEntries={[]}
                                rows={[]}
                                celebrateKey={0}
                                meLabel="You"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
