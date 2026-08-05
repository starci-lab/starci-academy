import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuizQuestion } from "@sb-components/starci/blocks/learn/QuizQuestion/QuizQuestion"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuizQuestion` — one question, the learner's answer, and the verdict. The answer
 * field turns read-only after grading rather than emptying (the value of a drill is
 * comparing what you said with what was expected). The expected answer appears only
 * after grading. The verdict is a chip; the reasoning rides as a document below it.
 * No score number — the running total lives in `WorkSessionHeader`.
 */
const meta: Meta<typeof QuizQuestion> = {
    title: "StarCi/Blocks/Learn/QuizQuestion/QuizQuestion",
    component: QuizQuestion,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuizQuestion>

const QUESTION = "What breaks if you put `COPY . .` before `npm ci`?"
const GIVEN_ANSWER = "I think it makes the image heavier."
const EXPECTED_ANSWER = "Any code change **busts the cache** of the dependency-install step, so every build reinstalls from scratch."
const EXPLANATION = "Copying early makes Docker treat the dependency-install step as changed every time the code changes, so it always rebuilds from that step onward."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the one card face holding the question, the answer field, and — once graded — the verdict", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "vertical rhythm between the question, the answer field, the graded details, and the action row", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the level chip row and the trailing action row", storyId: "frames-stack-stackh--default" },
    "Chip": { tier: "atom", role: "the seniority chip before grading, the correct/incorrect verdict chip after", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "the \"Expected answer\" label above the expected-answer document", storyId: "atoms-text-typography-typography--overview" },
    "MarkdownContent": { tier: "composite", role: "the question body, the expected answer, and the grading explanation — all authored markdown", storyId: "composites-viewers-markdowncontent--reading" },
    "InputTextarea": { tier: "atom", role: "the learner's answer — read-only once graded rather than emptied", storyId: "atoms-forms-input-inputtextarea--default" },
    "Button": { tier: "atom", role: "submit for grading, or move to the next question once graded", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — before grading: the learner is still typing, submit is the only control. */
export const Ungraded: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizQuestion"
                tier="block"
                leaf="Ungraded"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="No score number anywhere on this card — the running total lives in `WorkSessionHeader`, one level up, so this block only ever answers ONE question at a time."
                states={[
                    {
                        name: "verdict = undefined, answer typed",
                        why: "The seniority chip leads, the question renders as markdown, and the answer field is editable — nothing below the field yet because there is nothing to grade against until the learner submits.",
                        code: `<QuizQuestion
    question={question}
    levelLabel="Middle"
    answer={answer}
    onAnswerChange={setAnswer}
    onSubmit={submit}
    submitLabel="Grade"
    nextLabel="Next question"
    onNext={next}
/>`,
                        render: (
                            <QuizQuestion
                                question={QUESTION}
                                levelLabel="Middle"
                                answer={GIVEN_ANSWER}
                                onAnswerChange={() => {}}
                                onSubmit={() => {}}
                                submitLabel="Grade"
                                nextLabel="Next question"
                                onNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true (grading in flight)",
                        why: "Submitting fires the grading request; the submit control owns its own busy affordance so a second tap is caught while the first is still resolving.",
                        code: "<QuizQuestion … isPending />",
                        render: (
                            <QuizQuestion
                                question={QUESTION}
                                levelLabel="Middle"
                                answer={GIVEN_ANSWER}
                                onAnswerChange={() => {}}
                                onSubmit={() => {}}
                                submitLabel="Grade"
                                nextLabel="Next question"
                                onNext={() => {}}
                                isPending
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — graded: the field locks, the verdict chip appears, the expected answer and explanation follow. */
export const Graded: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizQuestion"
                tier="block"
                leaf="Graded"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "verdict = \"incorrect\"",
                        why: "The answer field locks read-only rather than clearing — comparing what was said with what was expected is the whole value of a drill, and clearing the field removes that exactly when it becomes useful. The verdict chip leads the graded block, the expected answer and the grading explanation follow as ordinary documents, and the action row switches from Grade to Next.",
                        code: `<QuizQuestion
    question={question}
    answer={answer}
    onAnswerChange={setAnswer}
    onSubmit={submit}
    verdict="incorrect"
    expectedAnswer={expected}
    explanation={why}
    submitLabel="Grade"
    nextLabel="Next question"
    onNext={next}
/>`,
                        render: (
                            <QuizQuestion
                                question={QUESTION}
                                levelLabel="Middle"
                                answer={GIVEN_ANSWER}
                                onAnswerChange={() => {}}
                                onSubmit={() => {}}
                                verdict="incorrect"
                                expectedAnswer={EXPECTED_ANSWER}
                                explanation={EXPLANATION}
                                submitLabel="Grade"
                                nextLabel="Next question"
                                onNext={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verdict = \"correct\"",
                        why: "Same shape, the other verdict — the chip switches tone (`success` vs `danger`) and icon, and the expected answer + explanation still ride along underneath so the learner can compare their own wording against it either way.",
                        code: "<QuizQuestion … verdict=\"correct\" expectedAnswer={expected} explanation={why} />",
                        render: (
                            <QuizQuestion
                                question={QUESTION}
                                levelLabel="Middle"
                                answer="Because the earlier layer still has the file — deleting it later is just an overwrite."
                                onAnswerChange={() => {}}
                                onSubmit={() => {}}
                                verdict="correct"
                                expectedAnswer="Layers are **additive**: a later layer only overwrites, the space already claimed in an earlier layer still stays in the image."
                                submitLabel="Grade"
                                nextLabel="Next question"
                                onNext={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the whole card mirrors its own eventual shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="QuizQuestion"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The level chip, the question document, and the answer field all shimmer in the exact shape they will hold once the next question lands.",
                        code: `<QuizQuestion
    question=""
    levelLabel="Middle"
    answer=""
    submitLabel="Grade"
    nextLabel="Next question"
    isSkeleton
/>`,
                        render: (
                            <QuizQuestion
                                question=""
                                levelLabel="Middle"
                                answer=""
                                onAnswerChange={() => {}}
                                onSubmit={() => {}}
                                submitLabel="Grade"
                                nextLabel="Next question"
                                onNext={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
