"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import {
    Button,
    Card,
    CardContent,
    Chip,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import {
    mutateSubmitQuizTest,
    queryQuizDeck,
    type SubmitQuizTestData,
} from "@/modules/api/graphql"
import { type QuizCardEntity } from "@/modules/types"
import { QuizTestSkeleton } from "../QuizTestSkeleton"

/** Props for {@link QuizTest}. */
export interface QuizTestProps {
    /** Deck id being tested. */
    deckId: string
}

/**
 * Quizlet-style "Learn" flow over a deck: one multiple-choice question at a
 * time, with instant correct/incorrect feedback and an explanation once the
 * learner answers. A progress bar tracks position; on the last question the
 * whole submission is sent to the backend to record the score, then a result
 * screen is shown.
 */
export const QuizTest = ({ deckId }: QuizTestProps) => {
    const t = useTranslations()
    // selected option id per card id (an entry means the card has been answered)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    // index of the question currently being shown
    const [currentIndex, setCurrentIndex] = useState(0)
    // graded result after the final submission (null = test not finished)
    const [result, setResult] = useState<SubmitQuizTestData | null>(null)
    // disables the finish button while grading is in flight
    const [submitting, setSubmitting] = useState(false)

    // load the full deck graph (cards + options)
    const { data, isLoading, error } = useSWR(
        ["quiz-deck", deckId],
        async () => {
            const response = await queryQuizDeck({
                request: { quizDeckId: deckId },
            })
            return response.data?.quizDeck.data ?? null
        },
    )

    // cards in display order
    const cards = useMemo<Array<QuizCardEntity>>(
        () => [...(data?.cards ?? [])].sort((prev, next) => prev.orderIndex - next.orderIndex),
        [data?.cards],
    )

    // reset the run back to the first question (Restart / after grading)
    const onRestart = () => {
        setAnswers({})
        setCurrentIndex(0)
        setResult(null)
    }

    // submit every answered card for grading and reveal the result screen
    const onFinish = async () => {
        const payload = Object.entries(answers).map(([quizCardId, selectedOptionId]) => ({
            quizCardId,
            selectedOptionId,
        }))
        if (payload.length === 0) {
            return
        }
        setSubmitting(true)
        try {
            const response = await mutateSubmitQuizTest({
                request: { quizDeckId: deckId, answers: payload },
            })
            setResult(response.data?.submitQuizTest.data ?? null)
        } finally {
            setSubmitting(false)
        }
    }

    // loading gate: show content only once the deck has settled with data and no
    // error; otherwise mirror the test question list with a content-shaped skeleton.
    const ready = !isLoading && !!data && !error

    if (!ready) {
        return <QuizTestSkeleton />
    }

    // empty deck guard
    if (cards.length === 0) {
        return (
            <p className="py-10 text-center text-muted">
                {t("quiz.empty")}
            </p>
        )
    }

    // result screen once the test has been graded
    if (result) {
        return (
            <Card className="border-primary">
                <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                    <span className="text-lg font-semibold text-foreground">
                        {t("quiz.testScore")}
                    </span>
                    <span className="text-4xl font-bold text-primary">
                        {result.scorePercent}%
                    </span>
                    <Chip color="success" variant="soft">
                        {t("quiz.testScoreValue", {
                            correct: result.correct,
                            total: result.total,
                            percent: result.scorePercent,
                        })}
                    </Chip>
                    <Button variant="primary" onPress={onRestart}>
                        {t("quiz.restart")}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const card = cards[currentIndex]
    const correctOptionId = card.options?.find((option) => option.isCorrect)?.id ?? null
    const options = [...(card.options ?? [])].sort(
        (prev, next) => prev.orderIndex - next.orderIndex,
    )
    const selectedOptionId = answers[card.id]
    const answered = selectedOptionId !== undefined
    const isLast = currentIndex === cards.length - 1
    // percentage of questions answered, for the progress bar
    const progressPercent = Math.round((Object.keys(answers).length / cards.length) * 100)

    return (
        <div className="flex flex-col gap-4">
            {/* progress: counter + bar */}
            <div className="flex flex-col gap-2">
                <span className="text-sm text-muted">
                    {t("quiz.questionProgress", {
                        current: currentIndex + 1,
                        total: cards.length,
                    })}
                </span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-default-200">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* question prompt */}
            <Card>
                <CardContent className="py-8">
                    <div className="text-lg font-medium text-foreground">
                        <MarkdownContent markdown={card.question} />
                    </div>
                </CardContent>
            </Card>

            {/* answer options as a 2-column grid of cards */}
            <div className="grid gap-3 sm:grid-cols-2">
                {options.map((option) => {
                    const isPicked = selectedOptionId === option.id
                    const isCorrect = option.id === correctOptionId
                    // after answering, color-code: correct=green, wrong pick=red, rest dimmed
                    const stateClass = answered
                        ? isCorrect
                            ? "border-success bg-success-50"
                            : isPicked
                                ? "border-danger bg-danger-50"
                                : "opacity-60"
                        : "hover:border-primary hover:bg-default-50"
                    return (
                        <button
                            key={option.id}
                            type="button"
                            disabled={answered}
                            onClick={() =>
                                setAnswers((prev) => ({ ...prev, [card.id]: option.id }))
                            }
                            className={cn(
                                "rounded-xl border border-default-200 p-4 text-left transition-colors disabled:cursor-default",
                                stateClass,
                            )}
                        >
                            <MarkdownContent markdown={option.text} />
                        </button>
                    )
                })}
            </div>

            {/* feedback + explanation once answered */}
            {answered && (
                <Card className="bg-default-50">
                    <CardContent className="flex flex-col gap-2">
                        <Chip
                            size="sm"
                            variant="soft"
                            color={selectedOptionId === correctOptionId ? "success" : "danger"}
                        >
                            {selectedOptionId === correctOptionId
                                ? t("quiz.correct")
                                : t("quiz.incorrect")}
                        </Chip>
                        {card.explanation && (
                            <div className="text-sm text-muted">
                                <MarkdownContent markdown={card.explanation} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* advance: next question, or finish + grade on the last one */}
            {answered && (
                <Button
                    variant="primary"
                    isPending={submitting}
                    onPress={() => {
                        if (isLast) {
                            void onFinish()
                        } else {
                            setCurrentIndex((index) => index + 1)
                        }
                    }}
                >
                    {isLast ? t("quiz.seeResults") : t("quiz.next")}
                </Button>
            )}
        </div>
    )
}
