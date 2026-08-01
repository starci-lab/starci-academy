import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaEngagementStrip } from "@sb-components/starci/blocks/learn/CourseQaEngagementStrip/CourseQaEngagementStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseQaEngagementStrip`: the "you're not learning alone" honest
 * aggregate under `CourseQaHeader` on a course Q&A board — enrolled learners,
 * then answered/total questions. See the component file header for the full
 * real-numbers-only contract and the leaf/state judgement call.
 */
const meta: Meta<typeof CourseQaEngagementStrip> = {
    title: "StarCi/Blocks/Learn/CourseQaEngagementStrip/CourseQaEngagementStrip",
    component: CourseQaEngagementStrip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaEngagementStrip>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the two lines as one aggregate statement, owning the flush seam between them", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own muted lines — enrollment or the answered/total readout, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
}

/**
 * LEAF — `Default`: every branch below (enrollment present/absent, empty
 * board, loading) is a STATE inside this one leaf — none of them change which
 * components are composed, only which line shows or what it says.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaEngagementStrip"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "full data",
                        why: "Both real numbers are known, so both lines print: how many learners actually enrolled, and how much of the board is answered. This is the honest reassurance the strip exists to give — real presence, real answer rate, nothing invented.",
                        code: `<CourseQaEngagementStrip
    enrollmentCount={214}
    totalQuestions={38}
    answeredQuestions={31}
/>`,
                        render: (
                            <CourseQaEngagementStrip

                               
                                enrollmentCount={214}
                                totalQuestions={38}
                                answeredQuestions={31}
                            />
                        ),
                    },
                    {
                        name: "enrollmentCount omitted",
                        why: "The caller has no honest enrollment number yet, so the whole first line is DROPPED — not replaced with a vague placeholder. The strip falls back to its one line it can always vouch for: the answered/total count.",
                        code: `<CourseQaEngagementStrip
    totalQuestions={38}
    answeredQuestions={31}
/>`,
                        render: (
                            <CourseQaEngagementStrip
                                totalQuestions={38}
                                answeredQuestions={31}
                            />
                        ),
                    },
                    {
                        name: "empty board",
                        why: "Zero questions asked would make \"0/38 answered\" a lie by omission — it reads as abandonment, not as a fresh board. The second line swaps to an honest admission that nothing has been asked yet instead of computing a ratio from zero.",
                        code: `<CourseQaEngagementStrip
    enrollmentCount={12}
    totalQuestions={0}
    answeredQuestions={0}
/>`,
                        render: (
                            <CourseQaEngagementStrip
                                enrollmentCount={12}
                                totalQuestions={0}
                                answeredQuestions={0}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Both lines shimmer while the board's stats are still loading, keeping the exact two-line box the real data will land into — the flag flows into the real `Typography` atoms rather than a parallel skeleton tree.",
                        code: `<CourseQaEngagementStrip
    totalQuestions={0}
    answeredQuestions={0}
    isSkeleton
/>`,
                        render: (
                            <CourseQaEngagementStrip
                                totalQuestions={0}
                                answeredQuestions={0}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
