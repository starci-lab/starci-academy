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
 * is a STATE of that same leaf, not a second leaf. `shell` helper đã xoá, mỗi
 * leaf giờ tự khai `states[]` (thầy chốt bố cục C, 2026-07-27).
 */
const meta: Meta<typeof ContinueLearning.Base> = {
    title: "Blocks/Learn/ContinueLearning/ContinueLearning.Base",
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
        role: "the `ContinueCard.Hero` card, given `title`/`meta` already turned into copy by the block so the design tier only has to draw them",
        storyId: "designs-cards-continuecard-hero-progress--not-urgent",
    },
]

/** The ONE leaf — has data. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContinueLearning.Base"
                tier="block"
                leaf="Currently studying"
                parts={PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "lessonIndex/lessonsRead/lessonsTotal/challengesDone/challengesTotal set",
                        why: "The block assembles the two lines of copy from numbers alone: `Bài 4 · …` and `Đã đọc 8/23 bài`. Design never sees what \"bài\" or \"thử thách\" even mean, it only draws the strings this block already wrote.",
                        code: `<ContinueLearning.Base
    lessonIndex={4}
    lessonTitle="Viết Dockerfile tối ưu"
    lessonsRead={8}
    lessonsTotal={23}
    challengesDone={2}
    challengesTotal={9}
    progressPercent={34}
    onResume={handleResume}
/>`,
                        render: <ContinueLearning.Base {...SAMPLE} anatPart="ContinueLearning" onResume={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE `isSkeleton` — the SAME structure, the flag flows straight down to design (§11f/§12c). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContinueLearning.Base"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "isSkeleton",
                        why: "The tree stays exactly the same as the leaf above, since `isSkeleton` is a state rather than a separate leaf. The block does not draw shimmer bars itself, the flag flows straight down to `ContinueCard`, whose own owner decides its resting shape (§12c).",
                        code: "<ContinueLearning.Base {...data} isSkeleton />",
                        render: <ContinueLearning.Base {...SAMPLE} anatPart="ContinueLearning" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
