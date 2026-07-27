import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnNudges, type LearnNudge } from "@sb-components/blocks/learn/LearnNudges/LearnNudges"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LearnNudges.Base`: things to do today.
 *
 * §14b — the caller only passes `kind` (ENUM), **the block owns the `kind → icon`
 * table**. The screen must not know what "review a card" looks like; if the prop
 * were `leadingIcon`, the screen would have to hold an atom ⇒ breaks the law.
 *
 * Shares its `SurfaceCard.List` layout with `KeepGoingPath` — two clusters that
 * look alike must share one render path.
 *
 * 📐 **ONE LEAF** (§14d.2): full-3-things · single-thing · bordered all use the
 * SAME `SurfaceCard.List` tree ⇒ **STATE**, not a separate story. `isSkeleton`
 * alone gets its OWN LEAF (§12g.0a, teacher's call 2026-07-27) even though the DOM
 * tree is identical — the rule for this prop is an exception that overrides §14d.2.
 */
const meta: Meta<typeof LearnNudges.Base> = {
    title: "Blocks/Learn/LearnNudges/LearnNudges.Base",
    component: LearnNudges.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnNudges.Base>

const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A KHUNG is also a DEP (§11a.1) — this block already declares the khung it uses, kept as-is.
    "SurfaceCard.List": {
        storyId: "layouts-cards-surfacecard-surfacecard-list--default",
        tier: "primitive",
        role: "frame + row rhythm — the SAME layout as KeepGoingPath",
    },
}

/** The one and only leaf — full 3 kinds of work plus the single-thing case. The **pending** state lives in the `Skeleton` leaf below. */
export const Nudges: Story = {
    render: () => (
        <div className="mx-auto max-w-3xl p-8">
            <BlockAnatomy
                name="LearnNudges.Base"
                tier="block"
                leaf="Things to do"
                parts={[]}
                annotate={ANNOTATE}
                note="The `pending` bars pour straight into `items` — still ONE render path, no second branch drawing a frame."
                code={"<LearnNudges.Base items={nudges} />"}
            >
                <div className="flex flex-col gap-6">
                    <LearnNudges.Base
                        anatPart="SurfaceCard.List"
                        showAnatomy
                        items={NUDGES}
                    />
                    <LearnNudges.Base items={[NUDGES[0]]} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — tree IDENTICAL to the `Nudges` leaf (§12g.0a): same
 * `SurfaceCard.List` khung, only the STATE changes (`items` not known yet), no
 * node added/removed (§11f) ⇒ reuses the `ANNOTATE` above, no separate part array.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="mx-auto max-w-3xl p-8">
            <BlockAnatomy
                name="LearnNudges.Base"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                note="`pending`/empty while waiting on `dueSwr`/`leaderboardSwr` — holds the space so nothing flashes (source notes 2026-07-12)."
                code={"<LearnNudges.Base isSkeleton items={[]} />"}
            >
                <LearnNudges.Base
                    anatPart="SurfaceCard.List"
                    showAnatomy
                    isSkeleton
                    items={[]}
                />
            </BlockAnatomy>
        </div>
    ),
}
