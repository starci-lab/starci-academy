import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModuleChallengeList, type ModuleChallengeItem } from "@sb-components/starci/blocks/learn/ModuleChallengeList/ModuleChallengeList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModuleChallengeList` — every challenge across this module's lessons, flattened
 * into one solve-me list. Distinct from a lesson list: a challenge row means "go
 * solve", shows the same `PuzzlePieceIcon` recoloured by solved state (no
 * in-progress state), and a press opens the owning lesson's Challenges tab (there
 * is no standalone challenge route). Solved/unsolved and all four difficulty steps
 * are states of one `SurfaceCardList` → rows tree.
 */
const meta: Meta<typeof ModuleChallengeList> = {
    title: "StarCi/Blocks/Learn/ModuleChallengeList/ModuleChallengeList",
    component: ModuleChallengeList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModuleChallengeList>

const MIXED: Array<ModuleChallengeItem> = [
    { id: "c1", title: "Fix a Dockerfile with broken caching", difficulty: "beginner", completed: true, lessonId: "l1" },
    { id: "c2", title: "Write a multi-stage build for a Node service", difficulty: "intermediate", completed: true, lessonId: "l2" },
    { id: "c3", title: "Shrink the image below 50MB", difficulty: "advanced", completed: false, lessonId: "l2" },
    { id: "c4", title: "Write your own health check for a degraded container", difficulty: "insane", completed: false, lessonId: "l3" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A FRAME is also a DEP (§11a.1) — this block already declares the frame it uses, kept as-is.
    "SurfaceCardList": {
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
        tier: "composite",
        role: "the frame and row rhythm every challenge row shares — same layout as a lesson list, different meaning underneath",
    },
    "VariantChipDifficulty": {
        storyId: "starci-blocks-learn-variantchip-variantchipdifficulty--levels",
        tier: "block",
        role: "a 4-step difficulty ramp, the challenge's one other fact besides solved state",
    },
}

/**
 * The single leaf — renders **ONE** frame, with every variant inside it:
 * solved · unsolved, across all 4 difficulty steps, spread over more than one
 * owning lesson.
 */
export const List: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleChallengeList"
                tier="block"
                leaf="List"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "challenges mix solved/unsolved across all 4 difficulty steps and 3 owning lessons",
                        why: "Every row-level variant renders inside the same `SurfaceCardList` frame at once: solved rows carry the success-coloured icon and the 'Completed' subtitle, unsolved rows stay plain, and the difficulty chip cycles through all four steps. One mixed data set is enough, since none of these differences add or remove a node from the tree — a press always calls back with the challenge's OWNING LESSON id, never the challenge id.",
                        code: `<ModuleChallengeList
    challenges={challenges}
    onSelectChallenge={(lessonId) => router.push(\`/lessons/\${lessonId}?tab=challenges\`)}
/>`,
                        render: (
                            <ModuleChallengeList

                               
                                challenges={MIXED}
                                onSelectChallenge={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `List` leaf (§12g.0a):
 * same `SurfaceCardList` frame, same row count, only the content STATE changes
 * (§11f) ⇒ reuses the `ANNOTATE` above. Empty → assume 3 rows (this pass's
 * convention for a repeated list).
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleChallengeList"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton, challenges = []",
                        why: "The same `SurfaceCardList` frame renders three shimmer rows instead of real challenge rows. Three is this pass's convention for a repeated list's resting row count, chosen so the frame keeps its height instead of collapsing while the module's challenges are still loading.",
                        code: "<ModuleChallengeList isSkeleton challenges={[]} onSelectChallenge={onSelectChallenge} />",
                        render: (
                            <ModuleChallengeList

                               
                                isSkeleton
                                challenges={[]}
                                onSelectChallenge={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
