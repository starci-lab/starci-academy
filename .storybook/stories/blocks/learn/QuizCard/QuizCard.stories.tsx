import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { QuizCard } from "@/components/blocks/learn/QuizCard"
import { ControlledQuizCard, SINGLE_OPTIONS, MULTIPLE_OPTIONS } from "./components"

const meta: Meta<typeof QuizCard> = {
    title: "Block/Learn/QuizCard",
    component: QuizCard,
}
export default meta
type Story = StoryObj<typeof QuizCard>

/**
 * Before submitting: a single-answer question, with each row in its default or selected
 * state (accent border). The answer isn't revealed. Pick an option, then click check to see the graded state.
 */
export const SingleChoice: Story = {
    parameters: {
        usage: "Use for a single-answer multiple-choice question before the student submits. Each row has only two states: default and selected (accent border) — the correct answer is never revealed. The check button is locked until a selection is made.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Single-answer question (before submitting)</Label>
                <Typography type="body-sm" color="muted">
                    Pick an option, then click check to reveal whether it's right or wrong.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={1}
                question="Which way of storing a session token is safest in the browser?"
                options={SINGLE_OPTIONS}
                selectionMode="single"
                explanation="A cookie with the HttpOnly flag can't be read by JavaScript, so it defends against XSS attacks stealing the token — unlike localStorage or a global variable."
            />
        </div>
    ),
}

/**
 * After submitting: a correct selected row is tinted success with a checkmark, a wrong
 * selected row is tinted danger with a cross, a correct-but-missed row has a soft success border, and the explanation appears.
 */
export const SingleChoiceSubmitted: Story = {
    parameters: {
        usage: "Use to view the post-submit state of a single-answer question. Here the student chose wrong: the selected row is tinted danger with a cross, the missed correct row has a soft success border with a checkmark, the group switches to read-only, and the explanation appears below.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Single-answer question (submitted, chose wrong)</Label>
                <Typography type="body-sm" color="muted">
                    The group is locked read-only; each row reveals its graded state and the explanation appears.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={1}
                question="Which way of storing a session token is safest in the browser?"
                options={SINGLE_OPTIONS}
                selectionMode="single"
                explanation="A cookie with the HttpOnly flag can't be read by JavaScript, so it defends against XSS attacks stealing the token — unlike localStorage or a global variable."
                startSelectedIds={["opt-local"]}
                startSubmitted
            />
        </div>
    ),
}

/**
 * A multiple-answer question with checkbox semantics: multiple options can be selected.
 * Check a few boxes, then click check to grade the whole selection.
 */
export const MultipleChoice: Story = {
    parameters: {
        usage: "Use for a question with several correct answers — selectionMode multiple is built with CheckboxGroup so multiple boxes can be checked. The check button is locked until at least one box is checked; after submitting, each box reveals its own graded state.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Multiple-answer question</Label>
                <Typography type="body-sm" color="muted">
                    Select all options that apply, then click check to grade the whole set.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={2}
                question="Which columns are usually good candidates for indexing in a relational database?"
                options={MULTIPLE_OPTIONS}
                selectionMode="multiple"
                submitLabel="Check selection"
                explanation="Columns often filtered in WHERE or joined in JOIN are queried frequently and benefit from an index; low-value columns like a boolean, or ones almost never queried, gain little from an index."
            />
        </div>
    ),
}
