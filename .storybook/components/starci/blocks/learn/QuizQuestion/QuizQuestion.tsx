import React from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuizQuestion`: one question, the learner's answer, and the verdict.
 *
 * ⭐ THE ANSWER STAYS ON SCREEN AFTER GRADING. The field turns read-only rather
 * than emptying: the whole value of a drill is comparing what you said with what
 * was expected, and clearing the field takes that comparison away at the exact
 * moment it becomes useful.
 *
 * ⭐ THE EXPECTED ANSWER APPEARS ONLY AFTER GRADING, and never before. Showing it
 * alongside an empty field would turn recall into reading.
 *
 * VERDICT IS A CHIP, THE REASONING IS NOT. One chip carries right-or-wrong — the
 * classifying axis — and the explanation rides as an ordinary document under it.
 * Two loud signals would make the learner read the verdict twice.
 *
 * ⛔ NO SCORE NUMBER. The verdict is a judgement about one answer, not a running
 * total; the session's own progress lives in `WorkSessionHeader`, and repeating
 * it here would give the learner two places to look for the same thing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How the answer was judged. */
export type QuizVerdict = "correct" | "incorrect"

/** Props for {@link QuizQuestion}. */
export interface QuizQuestionProps {
    /** The question, as authored markdown. */
    question: string
    /** Seniority this question aims at, e.g. "Middle" — already localized. */
    levelLabel?: string
    /** What the learner has typed. */
    answer: string
    /** Fired as the learner types. Ignored once graded. */
    onAnswerChange: (value: string) => void
    /** Fired when the learner submits for grading. */
    onSubmit: () => void
    /** Set → the answer has been judged; the field locks and the verdict shows. */
    verdict?: QuizVerdict
    /** The expected answer, as markdown. Shown ONLY after grading. */
    expectedAnswer?: string
    /** Why the answer was judged that way, as markdown. Shown only after grading. */
    explanation?: string
    /** Label of the submit control, localized by the caller. */
    submitLabel: string
    /** Label of the move-on control shown after grading. */
    nextLabel: string
    /** Fired when the learner moves to the next question. */
    onNext: () => void
    /** `true` → grading is in flight; the submit control owns the busy affordance. */
    isPending?: boolean
    /** `true` → the card mirrors itself while the question is drawn. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * One drill question. See the file header for the full contract.
 *
 * @param props - {@link QuizQuestionProps}
 */
const QuizQuestion = ({
    question,
    levelLabel,
    answer,
    onAnswerChange,
    onSubmit,
    verdict,
    expectedAnswer,
    explanation,
    submitLabel,
    nextLabel,
    onNext,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: QuizQuestionProps) => {
    const isGraded = verdict != null

    const levelRow = levelLabel != null ? (
        <StackH
            gap={3}
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={<Chip tone="default" text={levelLabel} showAnatomy={showAnatomy} />}
        />
    ) : null

    const expectedAnswerBlock = expectedAnswer != null ? (
        <StackV
            gap={3}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography size="sm" weight="medium" text="Expected answer" showAnatomy={showAnatomy} />
                    <MarkdownContent
                        source={expectedAnswer}
                        measure="compact"
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />
                </>
            }
        />
    ) : null

    const gradedDetails = isGraded ? (
        <StackV
            gap={6}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <StackH
                        gap={3}
                        align="center"
                        anatPart={showAnatomy ? "StackH" : undefined}
                        body={
                            // One chip for the classifying axis. The reasoning below is an
                            // ordinary document — two loud signals and the learner reads the
                            // verdict twice.
                            <Chip
                                tone={verdict === "correct" ? "success" : "danger"}
                                icon={verdict === "correct" ? CheckCircleIcon : XCircleIcon}
                                text={verdict === "correct" ? "Correct" : "Not quite"}
                                showAnatomy={showAnatomy}
                            />
                        }
                    />
                    {expectedAnswerBlock}
                    {explanation != null ? (
                        <MarkdownContent
                            source={explanation}
                            measure="compact"
                            anatPart={showAnatomy ? "MarkdownContent" : undefined}
                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const actionRow = (
        <StackH
            gap={3}
            justify="end"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                isGraded ? (
                    <Button label={nextLabel} variant="primary" onPress={onNext} showAnatomy={showAnatomy} />
                ) : (
                    <Button
                        label={submitLabel}
                        variant="primary"
                        onPress={onSubmit}
                        isDisabled={answer.trim().length === 0}
                        isPending={isPending}
                        showAnatomy={showAnatomy}
                    />
                )
            }
        />
    )

    const questionBody = (
        <>
            {levelRow}

            <MarkdownContent
                source={question}
                measure="reading"
                anatPart={showAnatomy ? "MarkdownContent" : undefined}
            />

            {/* Read-only rather than emptied: the whole value of a drill is comparing
                what you SAID with what was expected, and clearing the field takes that
                comparison away exactly when it becomes useful. */}
            <InputTextarea
                value={answer}
                onValueChange={onAnswerChange}
                placeholder="Answer as if you're speaking to the interviewer"
                ariaLabel="Answer"
                rows={4}
                isDisabled={isGraded}
                showAnatomy={showAnatomy}
            />

            {gradedDetails}

            {actionRow}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "SurfaceCard" : undefined}
                body={() => <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={questionBody} />}
            />
        </div>
    )
}

export { QuizQuestion }
