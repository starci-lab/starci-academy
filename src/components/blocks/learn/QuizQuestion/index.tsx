import { InputTextarea } from "@/components/atoms/forms"
import React from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"

import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `QuizQuestion` — one question, the learner's answer, and the verdict. The
 * answer field turns read-only after grading rather than emptying (the value of
 * a drill is comparing what you said with what was expected). The expected
 * answer appears only after grading. The verdict is a chip; the reasoning rides
 * as a document below it. No score number — the running total lives in
 * `WorkSessionHeader`.
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
}: QuizQuestionProps) => {
    const isGraded = verdict != null

    const levelRow = levelLabel != null ? (
        <StackH
            gap={3}
            principle="chip-row"
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
            align="center"
            isSkeleton={isSkeleton}
            items={[() => <Chip tone="default" text={levelLabel} isSkeleton={isSkeleton} />]}
        />
    ) : null

    const expectedAnswerBlock = expectedAnswer != null ? (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text="Expected answer" />,
                () => (
                    <MarkdownContent
                        source={expectedAnswer}
                        measure="compact"

                    />
                ),
            ]}
        />
    ) : null

    const gradedDetails = isGraded ? (
        <StackV
            gap={6}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <StackH
                        gap={3}
                        principle="chip-row"
                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                        align="center"
                        isSkeleton={isSkeleton}
                        items={[
                            // One chip for the classifying axis. The reasoning below is an
                            // ordinary document — two loud signals and the learner reads the
                            // verdict twice.
                            () => (
                                <Chip
                                    tone={verdict === "correct" ? "success" : "danger"}
                                    icon={verdict === "correct" ? CheckCircleIcon : XCircleIcon}
                                    text={verdict === "correct" ? "Correct" : "Not quite"}
                                    isSkeleton={isSkeleton}
                                />
                            ),
                        ]}
                    />
                ),
                () => expectedAnswerBlock,
                ...(explanation != null ? [() => (
                    <MarkdownContent
                        source={explanation}
                        measure="compact"

                    />
                )] : []),
            ]}
        />
    ) : null

    const actionRow = (
        <StackH
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            justify="end"
            isSkeleton={isSkeleton}
            items={[
                () =>
                    isGraded ? (
                        <Button label={nextLabel} variant="primary" onPress={onNext} />
                    ) : (
                        <Button
                            label={submitLabel}
                            variant="primary"
                            onPress={onSubmit}
                            isDisabled={answer.trim().length === 0}
                            isPending={isPending}

                        />
                    ),
            ]}
        />
    )

    const questionBody = (
        <>
            {levelRow}

            <MarkdownContent
                source={question}
                measure="reading"

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

            />

            {gradedDetails}

            {actionRow}
        </>
    )

    return (
        <div>
            <SurfaceCard
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} items={[() => questionBody]} />}
            />
        </div>
    )
}

export { QuizQuestion }
