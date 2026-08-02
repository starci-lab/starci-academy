import React from "react"
import { LockIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { ChipGroup, type ChipGroupItem } from "@sb-components/composites/chips/ChipGroup/ChipGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { RatingBar, type RatingOption } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FlashcardStudyCard` — one card of a review run: question, then reveal to grade.
 * Shared by both the due-review and deck-review surfaces.
 *
 * Composes `SurfaceCard`, `MarkdownContent`, `Chip`/`ChipGroup`, `Button`, and the
 * shared `RatingBar` for grading; a locked-premium card face is hand-rolled. One
 * classifying `Chip` per meta row (`levelLabel`), with `tags` in a `ChipGroup`.
 *
 * Three structural leaves: question-only, revealed (answer + explanation + `RatingBar`),
 * and locked. Prev/Next always fire regardless of reveal/lock state. No running score
 * or streak — that belongs to the session header wrapping a run of these cards.
 */

/** Props for {@link FlashcardStudyCard}. */
export interface FlashcardStudyCardProps {
    /** The question, as authored markdown. */
    question: string
    /** Seniority/difficulty this card targets, e.g. "Middle" — already localized. */
    levelLabel?: string
    /** Free-form tags on the card, e.g. topic labels. Rendered as a truncating row. */
    tags?: Array<string>
    /** `true` → the answer body (or the lock notice) is shown under the question. */
    revealed: boolean
    /** Fired when the learner asks to see the answer. */
    onReveal: () => void
    /** The answer, as authored markdown. Shown only once `revealed` and not `isLocked`. */
    answer?: string
    /** Optional reasoning under the answer, as authored markdown. */
    explanation?: string
    /**
     * `true` → this card's answer is premium content the learner has not bought.
     * Only meaningful once `revealed`: the question always shows, but revealing
     * swaps in a lock notice + unlock CTA instead of the real answer.
     */
    isLocked?: boolean
    /** Fired when the learner takes the way through the lock. Required when `isLocked` can be true. */
    onUnlock?: () => void
    /** Recall grades offered once the real answer is showing. */
    ratingOptions: Array<RatingOption>
    /** Fired with the grade the learner picked. */
    onRate: (grade: number) => void
    /** `true` → a grade is in flight; `RatingBar` owns the busy affordance. */
    isRatingPending?: boolean
    /** `true` → this is the first card of the run; the previous control is disabled. */
    isFirst: boolean
    /** `true` → this is the last card of the run; the next control is disabled. */
    isLast: boolean
    /** Fired to step back a card, regardless of whether this one was graded. */
    onPrev: () => void
    /** Fired to step forward a card, regardless of whether this one was graded. */
    onNext: () => void
    /** `true` → the card draws its own mirror instead of the real content. */
    isSkeleton?: boolean
}

/**
 * One review card. See the file header for the full contract, in particular why
 * this has exactly three leaves and why prev/next never gate on grading.
 *
 * @param props - {@link FlashcardStudyCardProps}
 */
const FlashcardStudyCard = ({
    question,
    levelLabel,
    tags,
    revealed,
    onReveal,
    answer,
    explanation,
    isLocked = false,
    onUnlock,
    ratingOptions,
    onRate,
    isRatingPending = false,
    isFirst,
    isLast,
    onPrev,
    onNext,
    isSkeleton = false,
}: FlashcardStudyCardProps) => {
    const hasMeta = levelLabel != null || (tags != null && tags.length > 0)
    const tagItems: Array<ChipGroupItem> = (tags ?? []).map((tag) => ({ key: tag, text: tag }))

    const metaRow = hasMeta ? (
        <StackH
            gap={3}
            wrap
            align="center"
            isSkeleton={isSkeleton}
            items={[
                ...(levelLabel != null ? [({ isSkeleton }: { isSkeleton?: boolean }) => <Chip isSkeleton={isSkeleton} tone="default" text={levelLabel} />] : []),
                ...(tagItems.length > 0
                    ? [
                        ({ isSkeleton }: { isSkeleton?: boolean }) => (
                            <ChipGroup
                                items={tagItems}
                                isSkeleton={isSkeleton}

                            />
                        ),
                    ]
                    : []),
            ]}
        />
    ) : null

    // The one hand-rolled part of this block (see file header): no existing
    // composite draws a lock message sized for ONE card face that still has a
    // question and nav controls around it — `EmptyState` fills a whole
    // pane, which is the wrong weight here.
    const lockNotice = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: { isSkeleton?: boolean }) => (
                    <StackH
                        gap={3}
                        align="center"
                        isSkeleton={isSkeleton}
                        items={[
                            () => <LockIcon aria-hidden focusable="false" weight="bold" className="size-5 shrink-0 text-muted" />,
                            ({ isSkeleton }: { isSkeleton?: boolean }) => (
                                <StackV
                                    gap={1}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        ({ isSkeleton }: { isSkeleton?: boolean }) => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text="Answer locked" />,
                                        ({ isSkeleton }: { isSkeleton?: boolean }) => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Upgrade to Premium to see this card's answer and explanation" />,
                                    ]}
                                />
                            ),
                        ]}
                    />
                ),
                ({ isSkeleton }: { isSkeleton?: boolean }) => <Button isSkeleton={isSkeleton} label="Unlock this card" variant="primary" onPress={onUnlock} />,
            ]}
        />
    )

    const answerBody = (
        <StackV
            gap={6}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: { isSkeleton?: boolean }) => (
                    <StackV
                        gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            ({ isSkeleton }: { isSkeleton?: boolean }) => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Answer" />,
                            () => (
                                <MarkdownContent
                                    source={answer ?? ""}
                                    measure="compact"

                                />
                            ),
                        ]}
                    />
                ),
                ...(explanation != null
                    ? [
                        ({ isSkeleton }: { isSkeleton?: boolean }) => (
                            <StackV
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={[
                                    ({ isSkeleton }: { isSkeleton?: boolean }) => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text="Explanation" />,
                                    () => (
                                        <MarkdownContent
                                            source={explanation}
                                            measure="compact"

                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]
                    : []),
                // The recall grade, not the run's right/wrong — same shared block
                // and same reasoning as `QuizRecapList`'s use of it.
                ({ isSkeleton }: { isSkeleton?: boolean }) => (
                    <RatingBar
                        options={ratingOptions}
                        onRate={onRate}
                        ariaLabel="Choose recall level"
                        isPending={isRatingPending}
                        isSkeleton={isSkeleton}

                    />
                ),
            ]}
        />
    )

    // Prev/next live beside reveal but never gate on it — see file header.
    const navRow = (
        <StackH
            gap={3}
            justify="between"
            align="center"
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: { isSkeleton?: boolean }) => (
                    <Button
                        isSkeleton={isSkeleton}
                        isIconOnly
                        prefixIcon={CaretLeftIcon}
                        ariaLabel="Previous card"
                        variant="tertiary"
                        isDisabled={isFirst}
                        onPress={onPrev}

                    />
                ),
                ...(!revealed ? [({ isSkeleton }: { isSkeleton?: boolean }) => <Button isSkeleton={isSkeleton} label="Show answer" variant="primary" onPress={onReveal} />] : []),
                ({ isSkeleton }: { isSkeleton?: boolean }) => (
                    <Button
                        isSkeleton={isSkeleton}
                        isIconOnly
                        prefixIcon={CaretRightIcon}
                        ariaLabel="Next card"
                        variant="tertiary"
                        isDisabled={isLast}
                        onPress={onNext}

                    />
                ),
            ]}
        />
    )

    const cardBody = (
        <>
            {metaRow}
            <MarkdownContent
                source={question}
                measure="compact"

            />
            {revealed ? (isLocked ? lockNotice : answerBody) : null}
            {navRow}
        </>
    )

    return (
        <div>
            <SurfaceCard
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => cardBody]} />}
            />
        </div>
    )
}

export { FlashcardStudyCard }
