import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModuleLessonList, type ModuleLessonListLesson } from "@sb-components/starci/blocks/learn/ModuleLessonList/ModuleLessonList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModuleLessonList` — the full, ordered lesson table of contents for one module —
 * every lesson, not just what's next. Sibling of `KeepGoingPath` (which trims to
 * the continue-learning queue and owns a heading); this block takes no heading of
 * its own. The block owns the per-row status icon (`resume`/`read`/`unread`), the
 * "N min read · M challenges" subtitle, and whether a difficulty chip and premium
 * lock ride on the trailing side. Row-level differences are states of one
 * `SurfaceCardList` tree; `isSkeleton` is its own leaf.
 */
const meta: Meta<typeof ModuleLessonList> = {
    title: "StarCi/Blocks/Learn/ModuleLessonList/ModuleLessonList",
    component: ModuleLessonList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModuleLessonList>

const LESSONS: Array<ModuleLessonListLesson> = [
    { id: "l1", title: "What is Docker", minutesRead: 6, challengeCount: 2, isRead: true, isPremium: false, difficulty: "beginner" },
    { id: "l2", title: "Writing an optimized Dockerfile", minutesRead: 12, challengeCount: 3, isRead: false, isPremium: false, difficulty: "intermediate" },
    { id: "l3", title: "Multi-stage build", minutesRead: 9, challengeCount: 4, isRead: false, isPremium: true, difficulty: "advanced" },
    { id: "l4", title: "Writing your own Operator", minutesRead: 22, challengeCount: 5, isRead: false, isPremium: true, difficulty: "insane" },
    { id: "l5", title: "Quick notes on BuildKit", minutesRead: 4, challengeCount: 0, isRead: false, isPremium: false },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": {
        storyId: "composites-cards-surfacecard-surfacecardlist--default",
        tier: "composite",
        role: "the bounded surface + row rhythm this block hands its lesson rows to, shared with KeepGoingPath's own list",
    },
    "VariantChipDifficulty": {
        storyId: "starci-blocks-learn-variantchip-variantchipdifficulty--levels",
        tier: "block",
        role: "the difficulty ramp riding on a row's trailing side, drawn whenever a lesson carries one",
    },
}

/**
 * The single leaf — one `SurfaceCardList`, every row-level variant present at
 * once: the resume lesson, an already-read lesson, two premium lessons across
 * different difficulty steps, and a lesson with no difficulty at all.
 */
export const List: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleLessonList"
                tier="block"
                leaf="Lesson list"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "lessons mix resume/read/unread, two premium, one with no difficulty",
                        why: "Every row-level variant renders inside the same list at once: the resume marker on l2, a finished lesson on l1, two locked premium rows carrying both their difficulty chip and the trailing lock, and l5 with neither a chip nor a lock. One mixed data set covers every shape a row can take, since none of these differences add or remove a node from the tree.",
                        code: `<ModuleLessonList
    lessons={lessons}
    resumeLessonId="l2"
    onSelectLesson={(id) => router.push(\`/learn/lesson/\${id}\`)}
/>`,
                        render: (
                            <ModuleLessonList


                                lessons={LESSONS}
                                resumeLessonId="l2"
                                onSelectLesson={() => {}}
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
 * same `SurfaceCardList` frame, only the content STATE changes (§11f) ⇒ reuses
 * the `ANNOTATE` above. Empty → assumes 3 rows, this composite's SSOT convention
 * for a repeated list already used by `KeepGoingPath`.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleLessonList"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton, lessons = []",
                        why: "The same `SurfaceCardList` frame renders three shimmer rows instead of real lesson rows, none of them a press target — nothing underneath can act yet. Three is this composite's resting row count, chosen so the list keeps its height instead of collapsing while the real lessons are still loading.",
                        code: "<ModuleLessonList isSkeleton lessons={[]} onSelectLesson={selectLesson} />",
                        render: (
                            <ModuleLessonList


                                isSkeleton
                                lessons={[]}
                                onSelectLesson={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
