import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuizEnrollGate } from "@sb-components/starci/blocks/learn/QuizEnrollGate/QuizEnrollGate"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuizEnrollGate` — shown in place of the whole quiz pane to a trial learner:
 * drilling is for enrolled learners. Replaces the pane rather than disabling it (a
 * drill has no previewable part). Not a paywall — one plain action through, no price
 * or scarcity line.
 */
const meta: Meta<typeof QuizEnrollGate> = {
    title: "StarCi/Blocks/Learn/QuizEnrollGate/QuizEnrollGate",
    component: QuizEnrollGate,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizEnrollGate>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "EmptyState": { tier: "composite", role: "the icon + title + description + one action — the whole gate is built from this one composite", storyId: "composites-feedback-emptystate--icon-and-title" },
    "Button": { tier: "atom", role: "the single way through: enroll, nothing else", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the gate, with and without the optional description line. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizEnrollGate"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Not a paywall — it asks for enrolment, not money, so there is no price or scarcity line, just one plain action through. It REPLACES the quiz pane rather than disabling it, because a drill has no previewable part for a trial learner to see."
                states={[
                    {
                        name: "description set",
                        why: "The headline names the action, the description says what enrolling opens up, and the one button is the entire way through. This is the shape used when the gate stands alone in the setup pane.",
                        code: `<QuizEnrollGate
    title="Enroll for quick-fire practice"
    description="Answer free-response questions and get graded instantly — unlocked once you enroll in the course."
    ctaLabel="Enroll now"
    onEnroll={enroll}
/>`,
                        render: (
                            <QuizEnrollGate
                                title="Enroll for quick-fire practice"
                                description="Answer free-response questions and get graded instantly — unlocked once you enroll in the course."
                                ctaLabel="Enroll now"
                                onEnroll={() => {}}
                            />
                        ),
                    },
                    {
                        name: "description omitted",
                        why: "The description is optional — dropping it leaves the headline and the button, still a complete gate with no half-empty gap where the sentence would have sat.",
                        code: `<QuizEnrollGate
    title="Enroll for quick-fire practice"
    ctaLabel="Enroll now"
    onEnroll={enroll}
/>`,
                        render: (
                            <QuizEnrollGate
                                title="Enroll for quick-fire practice"
                                ctaLabel="Enroll now"
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
