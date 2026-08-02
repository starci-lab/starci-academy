import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueLearning } from "@sb-components/starci/blocks/learn/ContinueLearning/ContinueLearning"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContinueLearning` — the "jump back to where you left off" feature. It owns
 * the domain wording (e.g. "Read 8/23 lessons"); the screen hands over only
 * numbers. There is one structure, so `isSkeleton` is a state of that leaf, not
 * a second leaf.
 */
const meta: Meta<typeof ContinueLearning> = {
    title: "StarCi/Blocks/Learn/ContinueLearning/ContinueLearning",
    component: ContinueLearning,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContinueLearning>

/** Sample data — all NUMBERS, exactly what the screen is allowed to hand down (§14d.1). */
const SAMPLE = {
    lessonIndex: 4,
    lessonTitle: "Writing an optimized Dockerfile",
    lessonsRead: 8,
    lessonsTotal: 23,
    challengesDone: 2,
    challengesTotal: 9,
    progressPercent: 34,
}

const PARTS: Array<AnatomyNode> = [
    {
        name: "ContinueCardHero",
        tier: "block",
        role: "the design this block composes directly, given `title`/`meta` already turned into copy by the block so the design tier only has to draw them",
        storyId: "starci-blocks-learn-continuecard-hero-progress--not-urgent",
    },
]

/** The ONE leaf — has data. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearning"
                tier="block"
                leaf="Currently studying"
                parts={PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "lessonIndex/lessonsRead/lessonsTotal/challengesDone/challengesTotal set",
                        why: "The block assembles the two lines of copy from numbers alone: `Lesson 4 · …` and `Read 8/23 lessons`. Design never sees what \"lesson\" or \"challenge\" even mean, it only draws the strings this block already wrote.",
                        code: `<ContinueLearning
    lessonIndex={4}
    lessonTitle="Writing an optimized Dockerfile"
    lessonsRead={8}
    lessonsTotal={23}
    challengesDone={2}
    challengesTotal={9}
    progressPercent={34}
    onResume={handleResume}
/>`,
                        render: <ContinueLearning {...SAMPLE} onResume={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE `isSkeleton` — the SAME structure, the flag flows straight down to design (§11f/§12c). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearning"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "isSkeleton",
                        why: "The tree stays exactly the same as the leaf above, since `isSkeleton` is a state rather than a separate leaf. The block does not draw shimmer bars itself, the flag flows straight down to `ContinueCard`, whose own owner decides its resting shape (§12c).",
                        code: "<ContinueLearning {...data} isSkeleton />",
                        render: <ContinueLearning {...SAMPLE} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
