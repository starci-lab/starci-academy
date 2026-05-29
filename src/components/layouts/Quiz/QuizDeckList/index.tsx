"use client"

import React from "react"
import useSWR from "swr"
import {
    Button,
    Card,
    CardContent,
    Chip,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { queryQuizDecksByCourse } from "@/modules/api/graphql"
import { ChallengeDifficulty, type QuizDeckEntity } from "@/modules/types"
import { QuizDeckListSkeleton } from "./QuizDeckListSkeleton"

/** HeroUI Chip color per difficulty tier. */
const DIFFICULTY_COLOR: Record<ChallengeDifficulty, "success" | "warning" | "danger"> = {
    [ChallengeDifficulty.Easy]: "success",
    [ChallengeDifficulty.Medium]: "warning",
    [ChallengeDifficulty.Hard]: "danger",
    [ChallengeDifficulty.Insane]: "danger",
}

/** Props for {@link QuizDeckList}. */
export interface QuizDeckListProps {
    /** Owning course id whose decks are listed. */
    courseId: string
    /** Called with the chosen deck id when the learner opens a deck. */
    onSelectDeck: (deckId: string) => void
}

/**
 * Lists the interview-prep quiz decks owned by the active course. Each deck card
 * shows its difficulty + card count and opens the Test for that deck.
 */
export const QuizDeckList = ({ courseId, onSelectDeck }: QuizDeckListProps) => {
    const t = useTranslations()

    // fetch the decks for this course; re-keys if the course changes
    const { data, isLoading, isValidating, error } = useSWR(
        ["quiz-decks-by-course", courseId],
        async () => {
            const response = await queryQuizDecksByCourse({
                request: { courseId },
            })
            return response.data?.quizDecksByCourse.data ?? null
        },
    )

    // loading gate: show the content only once the query has settled with data
    // and no error; otherwise mirror the deck list with a content-shaped skeleton.
    const ready = !isLoading && !isValidating && !!data && !error

    if (!ready) {
        return <QuizDeckListSkeleton />
    }

    // empty state when no decks are authored for this course
    if (!data || data.length === 0) {
        return (
            <p className="py-10 text-center text-muted">
                {t("quiz.empty")}
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {/* decks sorted by their display order */}
            {[...data]
                .sort((prev, next) => prev.orderIndex - next.orderIndex)
                .map((deck: QuizDeckEntity) => (
                    <Card
                        key={deck.id}
                        className="w-full transition-colors hover:bg-default-50"
                    >
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-medium">{deck.title}</span>
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    color={DIFFICULTY_COLOR[deck.difficulty]}
                                >
                                    {t(`quiz.difficulty.${deck.difficulty}`)}
                                </Chip>
                            </div>
                            {/* short description preview */}
                            {deck.description && (
                                <p className="line-clamp-2 text-sm text-muted">
                                    {deck.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-muted">
                                    {t("quiz.cardCount", { count: deck.cards?.length ?? 0 })}
                                </span>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onPress={() => onSelectDeck(deck.id)}
                                >
                                    {t("quiz.study")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
}
