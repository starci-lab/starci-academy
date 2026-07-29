import React from "react"
import { LockIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, ChipGroup, type ChipGroupItem } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { RatingBar, type RatingOption } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FlashcardStudyCard`: one card of a review run — question, then reveal
 * to grade. Shared shape for BOTH surfaces that walk cards one at a time
 * (due-review and deck-review are near-identical in the real source), the way
 * `QuizQuestion` is shared by the quiz surfaces.
 *
 * ⭐ REUSE FIRST, NOT REBUILD: this composes `SurfaceCard` (face) · `MarkdownContent`
 * (question/answer/explanation) · `Chip`/`ChipGroup` (level/tags) · `Button`
 * (reveal/prev/next/unlock) · the shared `RatingBar` block UNCHANGED for grading.
 * The one genuinely new bit is the locked-premium message, because no existing
 * composite draws a lock notice sized for a single card face — see the note on
 * that leaf below for why it stays hand-rolled instead of reaching for
 * `FeedbackEmpty` (that composite fills a whole pane; this is one paragraph
 * inside a card that still has a question and nav controls around it).
 *
 * ⭐ ONE CHIP PER META ROW (`starci-fe/no-adjacent-chip`, L3). `levelLabel` gets
 * the lone classifying `Chip`; `tags` go through `ChipGroup` instead of a second
 * run of bare `<Chip>` siblings — `ChipGroup` exists exactly for "a row of chips
 * that is ONE unit, truncated when it overflows" (see its own file header), so
 * it is the sanctioned way to show more than one tag without re-opening the rule
 * `ContentHeader`/`ChallengeHeader` already burned down to zero debt.
 *
 * ⭐ THREE LEAVES BY STRUCTURE, NOT FOUR. `revealed` toggling from false → true
 * swaps the question-only body for the answer body — a real structural change,
 * so it is its own leaf. Within the revealed leaf, `isLocked` swaps the answer
 * for a lock notice — also structural (the answer, the explanation and
 * `RatingBar` all disappear together), so LOCKED is its own leaf too. But
 * `levelLabel`/`tags`/`explanation` being present or absent only changes what
 * shows INSIDE an already-existing node, so those stay STATES of their leaf
 * (§14d.2) rather than four more leaves.
 *
 * ⭐ PREV/NEXT NEVER GRADE. They sit in the same footer row as the reveal button
 * but fire `onPrev`/`onNext` regardless of `revealed`/`isLocked` — walking away
 * from a card the learner has not graded is a real, ungated action (skip it, come
 * back later), not something this block gets to block on the caller's behalf
 * (§ block never swallows an event on business grounds).
 *
 * ⛔ NO SCORE, NO STREAK. Grading feedback is `RatingBar`'s job once tapped; a
 * running count belongs to whatever session header wraps a run of these cards,
 * not to one card repeating it.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: FlashcardStudyCardProps) => {
    const hasMeta = levelLabel != null || (tags != null && tags.length > 0)
    const tagItems: Array<ChipGroupItem> = (tags ?? []).map((tag) => ({ key: tag, text: tag }))

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard isSkeleton={isSkeleton} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    {hasMeta ? (
                        <StackH gap="related" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                            {levelLabel != null ? (
                                <Chip tone="neutral" text={levelLabel} anatPart={showAnatomy ? "Chip" : undefined} />
                            ) : null}
                            {tagItems.length > 0 ? (
                                <ChipGroup
                                    items={tagItems}
                                    anatPart={showAnatomy ? "ChipGroup" : undefined}
                                    showAnatomy={showAnatomy}
                                />
                            ) : null}
                        </StackH>
                    ) : null}

                    <MarkdownContent
                        source={question}
                        measure="compact"
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />

                    {revealed ? (
                        isLocked ? (
                            // The one hand-rolled part of this block (see file header): no
                            // existing composite draws a lock message sized for ONE card face
                            // that still has a question and nav controls around it —
                            // `FeedbackEmpty` fills a whole pane, which is the wrong weight here.
                            <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                                <StackH gap="related" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                    <LockIcon aria-hidden focusable="false" weight="bold" className="size-5 shrink-0 text-muted" />
                                    <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                                        <Typography size="sm" weight="medium" text="Đáp án bị khoá" anatPart={showAnatomy ? "Typography" : undefined} />
                                        <Typography size="xs" color="muted" text="Nâng cấp Premium để xem đáp án và lời giải của thẻ này" anatPart={showAnatomy ? "Typography" : undefined} />
                                    </StackV>
                                </StackH>
                                <Button label="Mở khoá thẻ này" variant="primary" onPress={onUnlock} anatPart={showAnatomy ? "Button" : undefined} />
                            </StackV>
                        ) : (
                            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <Typography size="xs" color="muted" text="Đáp án" anatPart={showAnatomy ? "Typography" : undefined} />
                                    <MarkdownContent
                                        source={answer ?? ""}
                                        measure="compact"
                                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                                    />
                                </StackV>
                                {explanation != null ? (
                                    <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                                        <Typography size="xs" color="muted" text="Giải thích" anatPart={showAnatomy ? "Typography" : undefined} />
                                        <MarkdownContent
                                            source={explanation}
                                            measure="compact"
                                            anatPart={showAnatomy ? "MarkdownContent" : undefined}
                                        />
                                    </StackV>
                                ) : null}
                                {/* The recall grade, not the run's right/wrong — same shared block
                                    and same reasoning as `QuizRecapList`'s use of it. */}
                                <RatingBar
                                    options={ratingOptions}
                                    onRate={onRate}
                                    ariaLabel="Chọn mức độ nhớ"
                                    isPending={isRatingPending}
                                    anatPart={showAnatomy ? "RatingBar" : undefined}
                                    showAnatomy={showAnatomy}
                                />
                            </StackV>
                        )
                    ) : null}

                    {/* Prev/next live beside reveal but never gate on it — see file header. */}
                    <StackH gap="related" justify="between" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                        <Button
                            isIconOnly
                            prefixIcon={CaretLeftIcon}
                            ariaLabel="Thẻ trước"
                            variant="tertiary"
                            isDisabled={isFirst}
                            onPress={onPrev}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                        {!revealed ? (
                            <Button label="Xem đáp án" variant="primary" onPress={onReveal} anatPart={showAnatomy ? "Button" : undefined} />
                        ) : null}
                        <Button
                            isIconOnly
                            prefixIcon={CaretRightIcon}
                            ariaLabel="Thẻ sau"
                            variant="tertiary"
                            isDisabled={isLast}
                            onPress={onNext}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    </StackH>
                </StackV>
            </SurfaceCard>
        </div>
    )
}

export { FlashcardStudyCard }
