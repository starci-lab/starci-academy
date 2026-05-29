"use client"

import React, { useState } from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { type WithClassNames } from "@/modules/types"
import { QuizDeckList } from "../QuizDeckList"
import { QuizDeckListSkeleton } from "../QuizDeckList/QuizDeckListSkeleton"
import { QuizTest } from "../QuizTest"

export type QuizLayoutProps = WithClassNames<undefined>

/**
 * Course-level interview-prep ("Quizlet") page. Lists the multiple-choice quiz
 * decks owned by the active course; selecting a deck opens its Test, where the
 * learner answers every card and submits for a graded score.
 * @param {QuizLayoutProps} props Optional wrapper styling props.
 */
export const QuizLayout = ({ className }: QuizLayoutProps) => {
    const t = useTranslations()
    // owning course id drives which decks are listed
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // selected deck (null = showing the deck list)
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)

    return (
        <div className={cn("p-3", className)}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {/* page heading */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        {t("quiz.title")}
                    </h1>
                    <p className="text-sm text-muted">{t("quiz.subtitle")}</p>
                </div>

                {/* wait for the course to hydrate before any deck query */}
                {!courseId ? (
                    <QuizDeckListSkeleton />
                ) : !selectedDeckId ? (
                    <QuizDeckList
                        courseId={courseId}
                        onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
                    />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div>
                            <Button
                                size="sm"
                                variant="secondary"
                                onPress={() => setSelectedDeckId(null)}
                            >
                                {t("quiz.backToDecks")}
                            </Button>
                        </div>
                        {/* keyed so switching decks resets the test's local state */}
                        <QuizTest key={selectedDeckId} deckId={selectedDeckId} />
                    </div>
                )}
            </div>
        </div>
    )
}
