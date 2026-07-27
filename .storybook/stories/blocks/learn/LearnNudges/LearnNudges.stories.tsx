import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnNudges, type LearnNudge } from "@sb-components/blocks/learn/LearnNudges/LearnNudges"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LearnNudges`: things to do today.
 *
 * §14b — the caller only passes `kind` (ENUM), **the block owns the `kind → icon`
 * table**. The screen must not know what "review a card" looks like; if the prop
 * were `leadingIcon`, the screen would have to hold an atom ⇒ breaks the law.
 *
 * Shares its `SurfaceCardList` layout with `KeepGoingPath` — two clusters that
 * look alike must share one render path.
 *
 * 📐 **ONE LEAF** (§14d.2): full-3-things · single-thing · bordered all use the
 * SAME `SurfaceCardList` tree ⇒ **STATE**, rendered inside one leaf's `states[]`
 * (thầy chốt bố cục C, 2026-07-27), not a separate story. `isSkeleton` alone gets
 * its OWN LEAF (§12g.0a, teacher's call 2026-07-27) even though the DOM tree is
 * identical — the rule for this prop is an exception that overrides §14d.2.
 */
const meta: Meta<typeof LearnNudges> = {
    title: "Blocks/Learn/LearnNudges/LearnNudges",
    component: LearnNudges,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnNudges>

const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A KHUNG is also a DEP (§11a.1) — this block already declares the khung it uses, kept as-is.
    "SurfaceCardList": {
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
        tier: "composite",
        role: "the frame and row rhythm, the same layout KeepGoingPath uses",
    },
    // Only renders in the `Skeleton` leaf (the `isSkeleton` row title) — harmless to
    // declare here too, it simply never appears in the `Nudges` leaf's derived tree.
    "Typography": {
        storyId: "atoms-text-typography-typography--plain",
        tier: "atom",
        role: "shimmer bar standing in for a row's title while waiting on data",
    },
}

/** The one and only leaf — full 3 kinds of work plus the single-thing case. The **pending** state lives in the `Skeleton` leaf below. */
export const Nudges: Story = {
    render: () => (
        <div className="p-8">
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
                                anatPart="SurfaceCardList"
                                showAnatomy
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
 * `SurfaceCardList` khung, only the STATE changes (`items` not known yet), no
 * node added/removed (§11f) ⇒ reuses the `ANNOTATE` above, no separate part array.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
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
                        why: "The same `SurfaceCardList` frame renders shimmer rows in place of real nudges while `dueSwr`/`leaderboardSwr` are still resolving. Holding the frame's space during that wait is what stops the page from flashing once the real nudges land (source notes 2026-07-12).",
                        code: "<LearnNudges isSkeleton items={[]} />",
                        render: (
                            <LearnNudges
                                anatPart="SurfaceCardList"
                                showAnatomy
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
