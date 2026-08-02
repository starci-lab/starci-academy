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
 * `QuizRecapList` — after a run ends, go back over each answer and rate how well
 * you actually knew it. This grade is the learner's self-assessment for the
 * spaced-repetition schedule, distinct from the run's automatic right/wrong
 * verdict. Already-graded cards keep their rating bar (a learner can change
 * their mind). Progress is a quiet count of unrated cards — no score, no
 * confetti.
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

        items={[
            () => (
                <StackH
                    gap={3}
                    align="center"

                    items={[
                        () => (
                            <Chip
                                tone={card.wasCorrect ? "success" : "danger"}
                                text={card.wasCorrect ? "Correct" : "Incorrect"}

                            />
                        ),
                    ]}
                />
            ),
            () => (
                <MarkdownContent
                    source={card.question}
                    measure="compact"

                />
            ),
            ...(card.givenAnswer != null ? [() => (
                <StackV
                    gap={3}

                    items={[
                        () => <Typography size="xs" color="muted" text="Your answer" />,
                        () => <Typography size="sm" text={card.givenAnswer} />,
                    ]}
                />
            )] : []),
            () => (
                <StackV
                    gap={3}

                    items={[
                        () => <Typography size="xs" color="muted" text="Expected answer" />,
                        () => (
                            <MarkdownContent
                                source={card.expectedAnswer}
                                measure="compact"

                            />
                        ),
                    ]}
                />
            ),
            // Stays put after a tap. A learner going back over a run changes
            // their mind, and removing the control would make the first tap
            // final without ever saying so.
            () => (
                <RatingBar
                    options={ratingOptions}
                    onRate={(grade) => onRate(card.key, grade)}
                    ariaLabel={ratingAriaLabel}


                />
            ),
        ]}
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

                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => skeletonCardBody]} />}
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
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => loadingBody]} />
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
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => recapBody]} />
        </div>
    )
}

export { QuizRecapList }
