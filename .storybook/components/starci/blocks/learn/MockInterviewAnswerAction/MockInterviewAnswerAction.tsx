import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * `MockInterviewAnswerAction` — the one control that submits the candidate's current
 * answer and moves a live interview forward. A one-node block holding the `Button` out of
 * the screen tree. Owns a real decision (`isLastQuestion` swaps the label between
 * "answer & continue" and "answer & finish") and its own wording. `isDisabled` arrives
 * already resolved by the caller (a blank answer or interviewer-mid-turn are business
 * facts this block doesn't track). No `isSkeleton`.
 */

/** Props for {@link MockInterviewAnswerAction}. */
export interface MockInterviewAnswerActionProps {
    /** `true` → this is the run's final question; swaps the label to the finishing wording. */
    isLastQuestion: boolean
    /** Fired when the candidate submits the current answer. */
    onSubmit: () => void
    /** `true` → the caller has decided this press cannot fire right now (e.g. a blank answer, or the interviewer still mid-turn). */
    isDisabled?: boolean
    /** `true` → the submit request is in flight. */
    isPending?: boolean
}

/**
 * The live interview's one submit action. See the file header for why this
 * exists as its own block instead of a bare `Button` in the screen tree.
 *
 * @param props - {@link MockInterviewAnswerActionProps}
 */
const MockInterviewAnswerAction = ({
    isLastQuestion,
    onSubmit,
    isDisabled = false,
    isPending = false,
}: MockInterviewAnswerActionProps) => (
    <Button
        variant="primary"
        size="lg"
        label={isLastQuestion ? "Answer & finish" : "Answer & continue"}
        suffixIcon={ArrowRightIcon}
        iconSlide
        onPress={onSubmit}
        isDisabled={isDisabled}
        isPending={isPending}
        classNames={["self-center"]}

    />
)

export { MockInterviewAnswerAction }
