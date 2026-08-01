import React from "react"
import type { ReactNode } from "react"
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
 * One recap card's content — verdict chip, question, given/expected answers,
 * rating bar. Extracted to a helper (rather than hoisted to a const) because
 * it depends on the loop variable `card` from the `.map()` that calls it.
 */
const recapCardBody = (
    card: QuizRecapCard,
    ratingOptions: Array<RatingOption>,
    onRate: (cardKey: string, grade: number) => void,
    ratingAriaLabel: string,
): ReactNode => (
    <StackV
        gap={6}

        body={
            <>
                <StackH
                    gap={3}
                    align="center"

                    body={
                        <Chip
                            tone={card.wasCorrect ? "success" : "danger"}
                            text={card.wasCorrect ? "Correct" : "Incorrect"}

                        />
                    }
                />
                <MarkdownContent
                    source={card.question}
                    measure="compact"

                />
                {card.givenAnswer != null ? (
                    <StackV
                        gap={3}

                        body={
                            <>
                                <Typography size="xs" color="muted" text="Your answer" />
                                <Typography size="sm" text={card.givenAnswer} />
                            </>
                        }
                    />
                ) : null}
                <StackV
                    gap={3}

                    body={
                        <>
                            <Typography size="xs" color="muted" text="Expected answer" />
                            <MarkdownContent
                                source={card.expectedAnswer}
                                measure="compact"

                            />
                        </>
                    }
                />
                {/* Stays put after a tap. A learner going back over a run changes
                    their mind, and removing the control would make the first tap
                    final without ever saying so. */}
                <RatingBar
                    options={ratingOptions}
                    onRate={(grade) => onRate(card.key, grade)}
                    ariaLabel={ratingAriaLabel}


                />
            </>
        }
    />
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
}: QuizRecapListProps) => {
    if (isSkeleton) {
        const skeletonCardBody = (
            <>
                <HeroSkeleton className="h-5 w-16 rounded-full" />
                <HeroSkeleton className="h-4 w-full rounded" />
                <HeroSkeleton className="h-4 w-2/3 rounded" />
            </>
        )
        const skeletonCards = Array.from({ length: skeletonCount }, (_unused, index) => (
            <SurfaceCard
                key={index}

                body={() => <StackV gap={6} body={skeletonCardBody} />}
            />
        ))
        const loadingBody = (
            <>
                <HeroSkeleton className="h-3.5 w-40 rounded" />
                {skeletonCards}
            </>
        )
        return (
            <div>
                <StackV gap={6} body={loadingBody} />
            </div>
        )
    }
    const unrated = (cards ?? []).filter((card) => card.rating == null).length

    const recapCards = (cards ?? []).map((card) => (
        <SurfaceCard
            key={card.key}

            body={() => recapCardBody(card, ratingOptions, onRate, ratingAriaLabel)}
        />
    ))

    const recapBody = (
        <>
            {/* Counted, not celebrated. The recap is work; the learner is here to finish
                it, not to be congratulated for starting it. */}
            <Typography
                size="sm"
                color="muted"
                text={unrated > 0 ? `${unrated}/${(cards ?? []).length} cards left to self-grade` : `All ${(cards ?? []).length} cards self-graded`}

            />
            {recapCards}
        </>
    )

    return (
        <div>
            <StackV gap={6} body={recapBody} />
        </div>
    )
}

export { QuizRecapList }
