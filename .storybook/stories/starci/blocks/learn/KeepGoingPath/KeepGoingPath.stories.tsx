import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeepGoingPath, type KeepGoingContent } from "@sb-components/starci/blocks/learn/KeepGoingPath/KeepGoingPath"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `KeepGoingPath`: the continue-learning path for the **current
 * chapter**.
 *
 * Deliberately does NOT redraw the full module tree — that tree lives in the
 * left rail, drawing it twice would be two sources of truth. This block only
 * answers "where am I + what's next".
 *
 * The BLOCK OWNS the shape: state icon (play/check/circle) · difficulty chip ·
 * lock. The caller only supplies DATA — no node, no class.
 *
 * 📐 **ONE LEAF** (§11f + §14d.2): every variant below shares the SAME DOM tree
 * (`SurfaceCardList` → rows), differing only in content ⇒ they're all
 * **STATE**, rendered inside one leaf's `states[]` (teacher's call on layout C,
 * 2026-07-27). Previously `AllRead`/`AllDifficulties`/`Bordered` were split into
 * separate stories — wrong, since none of them add or remove a node.
 */
const meta: Meta<typeof KeepGoingPath> = {
    title: "StarCi/Blocks/Learn/KeepGoingPath/KeepGoingPath",
    component: KeepGoingPath,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeepGoingPath>

const MIXED: Array<KeepGoingContent> = [
    { id: "l1", title: "What is Docker", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Writing an optimized Dockerfile", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "advanced", locked: true, onPress: () => {} },
    { id: "l4", title: "Writing your own Operator", minutes: 22, state: "todo", difficulty: "insane", locked: true, onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A FRAME is also a DEP (§11a.1) — this block already declares the frame it uses, kept as-is.
    "SurfaceCardList": {
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
        tier: "composite",
        role: "the frame and row rhythm, shared with LearnNudges so no second render path gets born",
    },
    "VariantChipDifficulty": {
        storyId: "starci-blocks-learn-variantchip-variantchipdifficulty--levels",
        tier: "block",
        role: "a 4-step difficulty ramp, not a status token",
    },
}

/**
 * The single leaf — renders **ONE** frame, with every variant inside it: 3
 * lesson states (done · active · todo) · all 4 difficulty steps · a locked
 * lesson.
 *
 * ⛔ Do NOT render two copies to show off `bordered` (teacher's call
 * 2026-07-26): the app has NO surface-in-surface case ⇒ `bordered` would be a
 * MADE-UP case. A block doesn't invent cases just to round out the set.
 */
export const Path: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeepGoingPath"
                tier="block"
                leaf="Path ahead"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "contents mixes done/active/todo across all 4 difficulty steps, one locked",
                        why: "Every row-level variant renders inside the same `SurfaceCardList` frame at once: three lesson states, all four difficulty steps, and a locked lesson at the bottom. One mixed data set is enough to show every shape a row can take, since none of these differences add or remove a node from the tree.",
                        code: `<KeepGoingPath
    module={{ index: 2, name: "Containerization" }}
    contents={contents}
/>`,
                        render: (
                            <KeepGoingPath
                                anatPart="SurfaceCardList"
                                showAnatomy
                                module={{ index: 2, name: "Containerization" }}
                                contents={MIXED}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `Path` leaf (§12g.0a):
 * same `SurfaceCardList` frame, same row count, only the content STATE changes
 * (§11f) ⇒ reuses the `ANNOTATE` above, no separate parts array declared for the
 * skeleton state. Empty → assume 3 rows (this pass's convention for a repeated
 * list).
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeepGoingPath"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton, contents = []",
                        why: "The same `SurfaceCardList` frame renders three shimmer rows instead of real lesson rows. Three is this pass's convention for a repeated list's resting row count, chosen so the frame keeps its height instead of collapsing while the real contents are still loading.",
                        code: "<KeepGoingPath isSkeleton module={{ index: 2, name: \"Containerization\" }} contents={[]} />",
                        render: (
                            <KeepGoingPath
                                anatPart="SurfaceCardList"
                                showAnatomy
                                isSkeleton
                                module={{ index: 2, name: "Containerization" }}
                                contents={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
