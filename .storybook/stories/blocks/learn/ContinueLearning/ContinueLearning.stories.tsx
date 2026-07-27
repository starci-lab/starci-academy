import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueLearning } from "@sb-components/blocks/learn/ContinueLearning/ContinueLearning"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContinueLearning.Base`: the "jump back to where you left off" feature.
 *
 * ⭐ This block was born 2026-07-27 (teacher: "design is only the UI/UX layer"):
 * the `CourseContents` screen used to import `ContinueCard` (the design tier)
 * DIRECTLY and assemble the string `"Đã đọc 8/23 bài"` itself. The domain wording
 * now lives HERE; the screen only hands over NUMBERS.
 *
 * §11f — leaves split by STRUCTURE: there's only ONE structure, so `isSkeleton`
 * is a STATE of that same leaf, not a second leaf.
 */
const meta: Meta<typeof ContinueLearning.Base> = {
    title: "Blocks/Learn/ContinueLearning",
    component: ContinueLearning.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContinueLearning.Base>

/** Sample data — all NUMBERS, exactly what the screen is allowed to hand down (§14d.1). */
const SAMPLE = {
    lessonIndex: 4,
    lessonTitle: "Viết Dockerfile tối ưu",
    lessonsRead: 8,
    lessonsTotal: 23,
    challengesDone: 2,
    challengesTotal: 9,
    progressPercent: 34,
}

const PARTS: Array<AnatomyNode> = [
    {
        name: "ContinueLearning",
        tier: "design",
        role: "the `ContinueCard.Hero` card — the block hands down `title`/`meta` ALREADY turned into copy; the design only draws",
        storyId: "designs-cards-continuecard-hero-progress--not-urgent",
    },
]

const shell = (leaf: string, node: React.ReactNode, note: string, code: string) => (
    <div className="max-w-2xl p-8">
        <BlockAnatomy name="ContinueLearning.Base" tier="block" leaf={leaf} parts={PARTS} note={note} code={code}>
            {node}
        </BlockAnatomy>
    </div>
)

/** The ONE leaf — has data. */
export const Default: Story = {
    render: () =>
        shell(
            "Currently studying",
            <ContinueLearning.Base {...SAMPLE} anatPart="ContinueLearning" onResume={() => {}} />,
            "The block assembles the sentence from NUMBERS: `Bài 4 · …` and `Đã đọc 8/23 bài`. Design has no idea what \"bài\"/\"thử thách\" even mean.",
            `<ContinueLearning.Base
    lessonIndex={4}
    lessonTitle="Viết Dockerfile tối ưu"
    lessonsRead={8}
    lessonsTotal={23}
    challengesDone={2}
    challengesTotal={9}
    progressPercent={34}
    onResume={handleResume}
/>`,
        ),
}

/** STATE `isSkeleton` — the SAME structure, the flag flows straight down to design (§11f/§12c). */
export const Skeleton: Story = {
    render: () =>
        shell(
            "Prop `isSkeleton`",
            <ContinueLearning.Base {...SAMPLE} anatPart="ContinueLearning" isSkeleton />,
            "The SAME structure as the leaf above — skeleton is a STATE, not a separate leaf. The block doesn't draw the bars itself: the flag flows straight down to `ContinueCard`, whose owner handles its own shimmer (§12c).",
            "<ContinueLearning.Base {...data} isSkeleton />",
        ),
}
