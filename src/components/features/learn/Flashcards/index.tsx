"use client"

import React, { useState } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"
import { type WithClassNames } from "@/modules/types"
import { LabeledCard, PageHeader } from "@/components/blocks"
import { FlashcardDeckList } from "./FlashcardDeckList"
import { FlashcardReviewer } from "./FlashcardReviewer"
import { InterviewSession } from "./InterviewSession"
import { DueReview } from "./DueReview"
import { DueReviewHero } from "./DueReviewHero"
import { FlashcardStatsStrip } from "./FlashcardStatsStrip"

/** Props for {@link Flashcards}. */
export type FlashcardsProps = WithClassNames<undefined>

/** Top-level view: the home hub, the cross-deck due review, or one deck. */
type FlashcardView = "home" | "due" | "deck"

/** Within a selected deck: flip-card study vs. answer aloud. */
type FlashcardMode = "study" | "interview"

/**
 * Course-level flashcards page. Spaced-repetition first: the home leads with the
 * "due today" review queue (the primary action) and lists the course's decks as a
 * secondary browse/cram path. Starting the due review opens a cross-deck SM-2
 * session; opening a deck opens its reviewer (flip + grade) or a voice mock
 * interview. View / selected-deck / mode are local UI state owned here.
 * @param {FlashcardsProps} props Optional wrapper placement props.
 */
export const Flashcards = ({ className }: FlashcardsProps) => {
    const t = useTranslations()
    // which top-level view is showing
    const [view, setView] = useState<FlashcardView>("home")
    // selected deck id (set when entering the "deck" view)
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
    // within a deck: flip-card study vs. voice-interview drilling
    const [mode, setMode] = useState<FlashcardMode>("study")

    // return to the home hub from any sub-view
    const goHome = () => {
        setView("home")
        setSelectedDeckId(null)
    }

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-6">
                <PageHeader title={t("flashcard.title")} description={t("flashcard.subtitle")} />

                {view === "home" ? (
                    <>
                        {/* PRIMARY: today's spaced-repetition queue */}
                        <DueReviewHero onStart={() => setView("due")} />

                        {/* progress snapshot (auto-hides until first review) */}
                        <FlashcardStatsStrip />

                        {/* SECONDARY: browse / cram the course's decks */}
                        <LabeledCard label={t("flashcard.decksLabel")} frameless>
                            <FlashcardDeckList
                                onSelectDeck={(deckId) => {
                                    setSelectedDeckId(deckId)
                                    setMode("study")
                                    setView("deck")
                                }}
                            />
                        </LabeledCard>
                    </>
                ) : null}

                {view === "due" ? (
                    <div className="flex flex-col gap-6">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="self-start"
                            onPress={goHome}
                        >
                            {t("flashcard.backToHome")}
                        </Button>
                        <DueReview onExit={goHome} />
                    </div>
                ) : null}

                {view === "deck" && selectedDeckId ? (
                    <div className="flex flex-col gap-6">
                        {/* back to home + study/interview mode switch */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button size="sm" variant="secondary" onPress={goHome}>
                                {t("flashcard.backToHome")}
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
                ) : null}
            </div>
        </div>
    )
}
