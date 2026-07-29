import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { RatingBar, type RatingOption } from "@sb-components/starci/blocks/learn/RatingBar/RatingBar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuizRecapList`: the run is over, go back over what you answered and
 * say how well you actually knew each one.
 *
 * ⭐ THE GRADE HERE IS NOT THE VERDICT FROM THE RUN. During the drill the system
 * judged whether the answer was right; here the LEARNER judges how well they
 * remembered. They are different questions, and a card can be marked correct and
 * still be one the learner wants back tomorrow — which is exactly the case the
 * spaced-repetition schedule needs and the automatic verdict cannot see.
 *
 * ⭐ ALREADY-GRADED CARDS KEEP THEIR RATING BAR. Nothing collapses or locks after
 * a tap: a learner going back over a run changes their mind, and taking the
 * control away would make the first tap final without ever saying so.
 *
 * PROGRESS IS COUNTED, NOT CELEBRATED. A quiet line says how many are still
 * unrated. No confetti, no score — the recap is work, and the learner is here to
 * finish it rather than to be congratulated for starting.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One answered card in the recap. */
export interface QuizRecapCard {
    /** Stable React key. */
    key: string
    /** The question, as authored markdown. */
    question: string
    /** The expected answer, as authored markdown. */
    expectedAnswer: string
    /** What the learner typed during the run. */
    givenAnswer?: string
    /** How the run judged it. */
    wasCorrect: boolean
    /** The learner's own recall grade, once they have given one. */
    rating?: number
}

interface QuizRecapListOwnProps {
    /** Recall grades offered per card. */
    ratingOptions: Array<RatingOption>
    /** Fired with the card key and the grade the learner picked. */
    onRate: (cardKey: string, grade: number) => void
    /** Accessible name for each card's rating group, localized by the caller. */
    ratingAriaLabel: string
    /** Card count to shimmer while `isSkeleton` (no real `cards` yet). Defaults to `3`. */
    skeletonCount?: number
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Props for {@link QuizRecapList}. `cards` is REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer recap has no real cards to show yet.
 */
export type QuizRecapListProps = QuizRecapListOwnProps &
    (
        | { isSkeleton: true; cards?: Array<QuizRecapCard> }
        | { isSkeleton?: false; cards: Array<QuizRecapCard> }
    )

/**
 * The end-of-run recap. See the file header for the full contract.
 *
 * @param props - {@link QuizRecapListProps}
 */
const QuizRecapList = ({
    cards,
    ratingOptions,
    onRate,
    ratingAriaLabel,
    isSkeleton = false,
    skeletonCount = 3,
    showAnatomy = false,
    anatPart,
}: QuizRecapListProps) => {
    if (isSkeleton) {
        return (
            <div data-anat-part={anatPart}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <HeroSkeleton className="h-3.5 w-40 rounded" />
                    {Array.from({ length: skeletonCount }, (_unused, index) => (
                        <SurfaceCard key={index} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                                <HeroSkeleton className="h-5 w-16 rounded-full" />
                                <HeroSkeleton className="h-4 w-full rounded" />
                                <HeroSkeleton className="h-4 w-2/3 rounded" />
                            </StackV>
                        </SurfaceCard>
                    ))}
                </StackV>
            </div>
        )
    }
    const unrated = (cards ?? []).filter((card) => card.rating == null).length

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                {/* Counted, not celebrated. The recap is work; the learner is here to finish
                    it, not to be congratulated for starting it. */}
                <Typography
                    size="sm"
                    color="muted"
                    text={unrated > 0 ? `Còn ${unrated}/${(cards ?? []).length} thẻ chưa tự chấm` : `Đã tự chấm đủ ${(cards ?? []).length} thẻ`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
                {(cards ?? []).map((card) => (
                    <SurfaceCard key={card.key} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                        <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                            <StackH gap="related" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                <Chip
                                    tone={card.wasCorrect ? "success" : "danger"}
                                    text={card.wasCorrect ? "Đúng" : "Chưa đúng"}
                                    anatPart={showAnatomy ? "Chip" : undefined}
                                />
                            </StackH>
                            <MarkdownContent
                                source={card.question}
                                measure="compact"
                                anatPart={showAnatomy ? "MarkdownContent" : undefined}
                            />
                            {card.givenAnswer != null ? (
                                <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <Typography size="xs" color="muted" text="Bạn đã trả lời" anatPart={showAnatomy ? "Typography" : undefined} />
                                    <Typography size="sm" text={card.givenAnswer} anatPart={showAnatomy ? "Typography" : undefined} />
                                </StackV>
                            ) : null}
                            <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                                <Typography size="xs" color="muted" text="Đáp án mong đợi" anatPart={showAnatomy ? "Typography" : undefined} />
                                <MarkdownContent
                                    source={card.expectedAnswer}
                                    measure="compact"
                                    anatPart={showAnatomy ? "MarkdownContent" : undefined}
                                />
                            </StackV>
                            {/* Stays put after a tap. A learner going back over a run changes
                                their mind, and removing the control would make the first tap
                                final without ever saying so. */}
                            <RatingBar
                                options={ratingOptions}
                                onRate={(grade) => onRate(card.key, grade)}
                                ariaLabel={ratingAriaLabel}
                                anatPart={showAnatomy ? "RatingBar" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        </StackV>
                    </SurfaceCard>
                ))}
            </StackV>
        </div>
    )
}

export { QuizRecapList }
