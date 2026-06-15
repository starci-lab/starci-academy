"use client"

import React, { useState } from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { type WithClassNames } from "@/modules/types"
import { FlashcardDeckList } from "../FlashcardDeckList"
import { FlashcardDeckListSkeleton } from "../FlashcardDeckList/FlashcardDeckListSkeleton"
import { FlashcardReviewer } from "../FlashcardReviewer"
import { InterviewSession } from "../InterviewSession"

export type FlashcardLayoutProps = WithClassNames<undefined>

/** Study mode within a selected deck: flip cards vs. answer aloud. */
type FlashcardMode = "study" | "interview"

/**
 * Course-level interview-prep ("Flashcards") page. Lists the open-ended Q&A
 * flashcard decks owned by the active course; selecting a deck opens its
 * reviewer, where the learner flips each card from question to answer.
 * @param {FlashcardLayoutProps} props Optional wrapper styling props.
 */
export const FlashcardLayout = ({ className }: FlashcardLayoutProps) => {
    const t = useTranslations()
    // owning course id drives which decks are listed
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // selected deck (null = showing the deck list)
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
    // within a deck: flip-card study vs. voice-interview drilling
    const [mode, setMode] = useState<FlashcardMode>("study")

    return (
        <div className={cn("p-3", className)}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {/* page heading */}
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold text-foreground">
                        {t("flashcard.title")}
                    </h1>
                    <p className="text-sm text-muted">{t("flashcard.subtitle")}</p>
                </div>

                {/* wait for the course to hydrate before any deck query */}
                {!courseId ? (
                    <FlashcardDeckListSkeleton />
                ) : !selectedDeckId ? (
                    <FlashcardDeckList
                        courseId={courseId}
                        onSelectDeck={(deckId) => setSelectedDeckId(deckId)}
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* back to deck list + study/interview mode switch */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button
                                size="sm"
                                variant="secondary"
                                onPress={() => setSelectedDeckId(null)}
                            >
                                {t("flashcard.backToDecks")}
                            </Button>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    size="sm"
                                    variant={mode === "study" ? "primary" : "outline"}
                                    onPress={() => setMode("study")}
                                >
                                    {t("flashcard.mode.study")}
                                </Button>
                                <Button
                                    size="sm"
                                    variant={mode === "interview" ? "primary" : "outline"}
                                    onPress={() => setMode("interview")}
                                >
                                    {t("flashcard.mode.interview")}
                                </Button>
                            </div>
                        </div>
                        {/* keyed so switching decks resets the inner mode's local state */}
                        {mode === "study" ? (
                            <FlashcardReviewer key={selectedDeckId} deckId={selectedDeckId} />
                        ) : (
                            <InterviewSession key={selectedDeckId} deckId={selectedDeckId} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
