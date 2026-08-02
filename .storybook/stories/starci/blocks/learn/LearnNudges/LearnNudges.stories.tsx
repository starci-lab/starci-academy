import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnNudges, type LearnNudge } from "@sb-components/starci/blocks/learn/LearnNudges/LearnNudges"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LearnNudges` — the "things to do today" list. The caller passes only `kind`
 * (an enum); the block owns the `kind → icon` table. Shares its `SurfaceCardList`
 * layout with `KeepGoingPath`. Full/single/bordered are all states of one tree;
 * `isSkeleton` gets its own leaf even though the DOM is identical.
 */
const meta: Meta<typeof LearnNudges> = {
    title: "StarCi/Blocks/Learn/LearnNudges/LearnNudges",
    component: LearnNudges,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnNudges>

const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Review 12 cards due today", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Practice an interview for your capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "You're ranked #42 this week", onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A FRAME is also a DEP (§11a.1) — this block already declares the frame it uses, kept as-is.
    "SurfaceCardList": {
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
        tier: "composite",
        role: "the frame and row rhythm, the same layout KeepGoingPath uses",
    },
    // Only renders in the `Skeleton` leaf (the `isSkeleton` row title) — harmless to
    // declare here too, it simply never appears in the `Nudges` leaf's derived tree.
    "Typography": {
        storyId: "atoms-text-typography-typography--overview",
        tier: "atom",
        role: "shimmer bar standing in for a row's title while waiting on data",
    },
}

/** The one and only leaf — full 3 kinds of work plus the single-thing case. The **pending** state lives in the `Skeleton` leaf below. */
export const Nudges: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LearnNudges"
                tier="block"
                leaf="Things to do"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items.length = 3 (flashcards, interview, league)",
                        why: "Three rows render inside the `SurfaceCardList` frame, one per kind, each with the icon its own `kind` maps to. Showing all three kinds together is what proves the block owns the `kind → icon` table rather than the caller choosing an icon itself.",
                        code: "<LearnNudges items={nudges} />",
                        render: (
                            <LearnNudges

                               
                                items={NUDGES}
                            />
                        ),
                    },
                    {
                        name: "items.length = 1",
                        why: "The same frame renders with just one row instead of three, and no row is drawn any differently for being alone. A viewer with only one thing left to do today should not see empty space standing in for the two nudges that no longer apply.",
                        code: "<LearnNudges items={[nudges[0]]} />",
                        render: <LearnNudges items={[NUDGES[0]]} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — tree IDENTICAL to the `Nudges` leaf (§12g.0a): same
 * `SurfaceCardList` frame, only the STATE changes (`items` not known yet), no
 * node added/removed (§11f) ⇒ reuses the `ANNOTATE` above, no separate part array.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LearnNudges"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton, items = []",
                        why: "The same `SurfaceCardList` frame renders shimmer rows in place of real nudges while `dueSwr`/`leaderboardSwr` are still resolving. Holding the frame's space during that wait is what stops the page from flashing once the real nudges land.",
                        code: "<LearnNudges isSkeleton items={[]} />",
                        render: (
                            <LearnNudges

                               
                                isSkeleton
                                items={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
