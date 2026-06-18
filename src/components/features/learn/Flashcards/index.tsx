"use client"

import React, { useState } from "react"
import { Button, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { type WithClassNames } from "@/modules/types"
import { PageHeader } from "@/components/blocks"
import { FlashcardDeckList } from "./FlashcardDeckList"
import { FlashcardReviewer } from "./FlashcardReviewer"
import { InterviewSession } from "./InterviewSession"

/** Props for {@link Flashcards}. */
export type FlashcardsProps = WithClassNames<undefined>

/** Study mode within a selected deck: flip cards vs. answer aloud. */
type FlashcardMode = "study" | "interview"

/**
 * Course-level interview-prep ("Flashcards") page. Lists the open-ended Q&A
 * flashcard decks owned by the active course; selecting a deck opens its
 * reviewer, where the learner flips each card from question to answer. A deck can
 * also be drilled in voice-interview mode. The selected-deck / mode are local UI
 * state owned by this orchestrator.
 * @param {FlashcardsProps} props Optional wrapper placement props.
 */
export const Flashcards = ({ className }: FlashcardsProps) => {
    const t = useTranslations()
    // selected deck (null = showing the deck list)
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
    // within a deck: flip-card study vs. voice-interview drilling
    const [mode, setMode] = useState<FlashcardMode>("study")

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-6">
                <PageHeader
                    title={t("flashcard.title")}
                    description={t("flashcard.subtitle")}
                />

                {/* deck list or reviewer */}
                {!selectedDeckId ? (
                    <FlashcardDeckList
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
                            <div className="flex items-center gap-2">
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
