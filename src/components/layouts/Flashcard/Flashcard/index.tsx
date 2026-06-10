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

export type FlashcardLayoutProps = WithClassNames<undefined>

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

    return (
        <div className={cn("p-3", className)}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {/* page heading */}
                <div className="flex flex-col gap-2">
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
                    <div className="flex flex-col gap-4">
                        <div>
                            <Button
                                size="sm"
                                variant="secondary"
                                onPress={() => setSelectedDeckId(null)}
                            >
                                {t("flashcard.backToDecks")}
                            </Button>
                        </div>
                        {/* keyed so switching decks resets the reviewer's local state */}
                        <FlashcardReviewer key={selectedDeckId} deckId={selectedDeckId} />
                    </div>
                )}
            </div>
        </div>
    )
}
