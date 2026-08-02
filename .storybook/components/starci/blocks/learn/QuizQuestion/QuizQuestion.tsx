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
            align="center"

            items={[() => <Chip tone="default" text={levelLabel} />]}
        />
    ) : null

    const expectedAnswerBlock = expectedAnswer != null ? (
        <StackV
            gap={3}

            items={[
                () => <Typography size="sm" weight="medium" text="Expected answer" />,
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

            items={[
                () => (
                    <StackH
                        gap={3}
                        align="center"

                        items={[
                            // One chip for the classifying axis. The reasoning below is an
                            // ordinary document — two loud signals and the learner reads the
                            // verdict twice.
                            () => (
                                <Chip
                                    tone={verdict === "correct" ? "success" : "danger"}
                                    icon={verdict === "correct" ? CheckCircleIcon : XCircleIcon}
                                    text={verdict === "correct" ? "Correct" : "Not quite"}

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
            justify="end"

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
