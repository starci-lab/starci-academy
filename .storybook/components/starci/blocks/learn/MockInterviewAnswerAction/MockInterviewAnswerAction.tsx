import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MockInterviewAnswerAction`: the ONE control that submits the
 * candidate's current answer and moves the live interview forward.
 *
 * WHY THIS EXISTS. `MockInterviewPage`'s live phase is assembled from three
 * blocks this run built — `InterviewerPresence` (who's asking), `VoiceHero`
 * (how the candidate answers) — neither of which owns a submit action of its
 * own (see each file's own header: `VoiceHero` is "the answer composer",
 * nothing more; `InterviewerPresence` never renders a candidate-facing
 * control at all). The real `src` screen's own submit button
 * (`MockInterviewSession/index.tsx`, the `submitQnaAnswer` press handler) is a
 * PLAIN `Button` sitting directly in the screen tree — but §0's import
 * boundary is exact: a screen calls blocks and frames, never a bare atom.
 * The planner's own tree drew this as `Button (answer & next)` straight in
 * the screen; that is the exact violation this run's own brief (the
 * corrected `ContentModeNav` header) exists to catch, so this one-node block
 * exists to hold it instead.
 *
 * EARNS ITS LAYER (§10/`check-passthrough-block`) the same way
 * `MindMapContinueButton` does for the course mind-map's own single floating
 * CTA: the block owns a real DECISION (`isLastQuestion` swaps the label
 * between "answer & continue" and "answer & finish", mirroring the real
 * screen's `isLastQuestion ? answerAndFinish : answerAndNext` branch) plus
 * its OWN WORDING (§14d.1 — the two Vietnamese labels live here, never
 * passed in as a pre-formatted string), not a bare pass-through of one prop
 * to one atom.
 *
 * DISABLEMENT IS THE CALLER'S CALL, NOT THIS BLOCK'S (rule 7 — a block never
 * swallows an event on business grounds). The real screen disables the
 * button on "answer is blank" or "the interviewer is mid-turn" — both are
 * business facts about the conversation this block does not track (it has
 * no `value`/`isAsking` prop). So `isDisabled` arrives already resolved by
 * the screen, exactly like `ChallengeDeliverableList`'s own submit rows take
 * their disabled state from the caller rather than re-deriving it.
 *
 * NO `isSkeleton`. A submit action never has a loading shape of its own to
 * mirror — it either can be pressed or it can't — matching `VoiceHero`'s and
 * `ContentModeNav`'s own documented omission of the same flag.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: MockInterviewAnswerActionProps) => (
    <Button
        variant="primary"
        size="lg"
        label={isLastQuestion ? "Trả lời & kết thúc" : "Trả lời & tiếp tục"}
        suffixIcon={ArrowRightIcon}
        iconSlide
        onPress={onSubmit}
        isDisabled={isDisabled}
        isPending={isPending}
        classNames={["self-center"]}
        anatPart={anatPart ?? (showAnatomy ? "Button" : undefined)}
    />
)

export { MockInterviewAnswerAction }
