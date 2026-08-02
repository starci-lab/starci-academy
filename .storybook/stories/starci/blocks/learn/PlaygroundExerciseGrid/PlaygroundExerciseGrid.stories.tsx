import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundExerciseGrid, type PlaygroundExerciseGridItem } from "@sb-components/starci/blocks/learn/PlaygroundExerciseGrid/PlaygroundExerciseGrid"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundExerciseGrid` — the core of the Playground hub screen: a grid of
 * hands-on exercises the learner opens one of. Wraps `SurfaceCardPressableGroup`;
 * the cue row at the bottom of each tile stays decorative text, not a nested button.
 * Two shapes: `Default` (a bounded press-target grid of real tiles, or the
 * composite's own tile mirror while loading) and `Empty` (the grid replaced by
 * `EmptyState` when the course has no Playground exercises).
 */
const meta: Meta<typeof PlaygroundExerciseGrid> = {
    title: "StarCi/Blocks/Learn/PlaygroundExerciseGrid/PlaygroundExerciseGrid",
    component: PlaygroundExerciseGrid,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundExerciseGrid>

const EXERCISES: Array<PlaygroundExerciseGridItem> = [
    { id: "docker-build", title: "Write your first Dockerfile", stepCount: 5 },
    { id: "compose-stack", title: "Compose a multi-service stack", stepCount: 7 },
    { id: "k8s-deploy", title: "Deploy a Deployment to Kubernetes", stepCount: 6 },
    { id: "k8s-debug", title: "Debug a Pod stuck in CrashLoopBackOff", stepCount: 4 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardPressableGroup": {
        tier: "composite",
        role: "the bounded press-target grid this block hands its exercise tiles to, owning the grid reflow, the whole-card press pattern and the group's accessible name",
        storyId: "composites-cards-surfacecard-surfacecardpressablegroup--default",
    },
    "IconTile": {
        tier: "atom",
        role: "each tile's fixed terminal glyph — always TerminalWindowIcon, never a caller choice, because an exercise tile is always a hands-on terminal exercise",
        storyId: "atoms-display-icontile-icontile--default",
    },
    "Typography": {
        tier: "atom",
        role: "one of the block's own text lines inside a tile — the exercise title, or the decorative closing cue — real or its skeleton mirror",
        storyId: "atoms-text-typography-typography--plain",
    },
    "Chip": {
        tier: "atom",
        role: "the step-count badge under each tile's title, the one quiet fact this domain surfaces per exercise",
        storyId: "atoms-chips-chip-chip--icon",
    },
    "EmptyState": {
        tier: "composite",
        role: "the empty message that replaces the grid outright when the course has no Playground exercises",
        storyId: "composites-feedback-emptystate-emptystate--icon-and-title",
    },
}

/**
 * LEAF — `Default`: the populated exercise grid, and (a state of the same
 * tree) its own loading mirror.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundExerciseGrid"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "exercises populated",
                        why: "The everyday browse shape — four exercises in a two-column grid, each tile one whole press target: icon, title, step count and the closing cue stacked, no nested button. Opening a tile is the ONE thing this block exists to do.",
                        code: `<PlaygroundExerciseGrid
    exercises={exercises}
    onSelect={(id) => router.push(\`/learn/playground/\${id}\`)}
    ariaLabel="Playground exercises"
/>`,
                        render: (
                            <PlaygroundExerciseGrid

                               
                                exercises={EXERCISES}
                                onSelect={() => {}}
                                ariaLabel="Playground exercises"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, exercises = []",
                        why: "The first fetch hasn't resolved yet — the same bounded grid mirrors itself with four guessed placeholder tiles (this block's own SSOT count), none of them a press target, via the composite's own generic skeleton tile.",
                        code: "<PlaygroundExerciseGrid isSkeleton exercises={[]} onSelect={openExercise} ariaLabel=\"Playground exercises\" />",
                        render: (
                            <PlaygroundExerciseGrid
                                isSkeleton
                                exercises={[]}
                                onSelect={() => {}}
                                ariaLabel="Playground exercises"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `Empty`: the grid is replaced by `EmptyState` — the course has no Playground exercises. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundExerciseGrid"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "exercises = []",
                        why: "This course has not shipped a single Playground exercise yet, so the grid is replaced outright by a worded empty state rather than vanishing into a silent hole on the screen.",
                        code: "<PlaygroundExerciseGrid exercises={[]} onSelect={openExercise} ariaLabel=\"Playground exercises\" />",
                        render: (
                            <PlaygroundExerciseGrid

                               
                                exercises={[]}
                                onSelect={() => {}}
                                ariaLabel="Playground exercises"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
