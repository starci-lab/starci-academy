import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"

/**
 * `MockInterviewAnswerAction` — the one control that submits the candidate's
 * current answer and advances the live interview. Exists as a one-node block so the
 * screen tier need not import a bare `Button` directly; it holds the
 * `isLastQuestion` decision and wording the button alone cannot own. `isLastQuestion`
 * / `isDisabled` / `isPending` flip the same button's label and press-ability.
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
