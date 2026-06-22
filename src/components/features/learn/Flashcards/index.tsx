"use client"

import React, { useState, type Key } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"
import { type WithClassNames } from "@/modules/types"
import { LabeledCard, PageHeader, TabsCard } from "@/components/blocks"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { FlashcardDeckList } from "./FlashcardDeckList"
import { FlashcardReviewer } from "./FlashcardReviewer"
import { InterviewSession } from "./InterviewSession"
import { DueReview } from "./DueReview"
import { DueReviewHero } from "./DueReviewHero"
import { FlashcardStatsStrip } from "./FlashcardStatsStrip"

/** Props for {@link Flashcards}. */
export type FlashcardsProps = WithClassNames<undefined>

/** The two top-level modes, each its own surface (one tab apiece). */
type FlashcardTab = "study" | "interview"

/** Within the study tab: the home hub, the cross-deck due review, or one deck. */
type StudyView = "home" | "due" | "deck"

/**
 * Course-level flashcards page, split into two sibling modes by a secondary tab
 * row under the header — each mode is its own surface with its own model:
 *
 * - "Study" (spaced repetition): the due-today queue is the primary action; decks
 *   are a secondary cram/browse path; opening one runs the flip + SM-2 reviewer.
 * - "Mock interview": a topic picker (the same decks, SR chrome hidden) leads into
 *   a voice question-answer drill graded by the backend.
 *
 * The active tab, the study sub-view, and the two selected-deck ids are local UI
 * state owned here. Interview is no longer a hidden toggle inside a deck — every
 * interview entry lives on its own tab.
 * @param {FlashcardsProps} props Optional wrapper placement props.
 */
export const Flashcards = ({ className }: FlashcardsProps) => {
    const t = useTranslations()
    // which top-level mode is showing (one tab each)
    const [tab, setTab] = useState<FlashcardTab>("study")
    // study tab: which sub-view + which deck is open for study
    const [studyView, setStudyView] = useState<StudyView>("home")
    const [studyDeckId, setStudyDeckId] = useState<string | null>(null)
    // interview tab: which deck is being drilled (null = still on the topic picker)
    const [interviewDeckId, setInterviewDeckId] = useState<string | null>(null)

    // return to the study hub from any study sub-view
    const goStudyHome = () => {
        setStudyView("home")
        setStudyDeckId(null)
    }

    // the two mode tabs, both secondary (one nav layer)
    const modeTabs = {
        items: [
            { key: "study", label: t("flashcard.mode.study") },
            { key: "interview", label: t("flashcard.mode.interview") },
        ],
        selectedKey: tab,
        ariaLabel: t("flashcard.title"),
        onSelectionChange: (key: Key) => setTab(key as FlashcardTab),
    }

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <PageHeader
                    breadcrumb={<LearnBreadcrumb current={t("flashcard.title")} />}
                    title={t("flashcard.title")}
                    description={t("flashcard.subtitle")}
                />

                {/* split the page into two sibling surfaces: study vs interview */}
                <TabsCard leftTabs={modeTabs} />

                {/* ── STUDY TAB ───────────────────────────────────────────── */}
                {tab === "study" ? (
                    <>
                        {studyView === "home" ? (
                            <div className="flex flex-col gap-6">
                                {/* PRIMARY: today's spaced-repetition queue */}
                                <DueReviewHero onStart={() => setStudyView("due")} />

                                {/* progress snapshot (auto-hides until first review) */}
                                <FlashcardStatsStrip />

                                {/* SECONDARY: browse / cram the course's decks */}
                                <LabeledCard label={t("flashcard.decksLabel")} frameless>
                                    <FlashcardDeckList
                                        onSelectDeck={(deckId) => {
                                            setStudyDeckId(deckId)
                                            setStudyView("deck")
                                        }}
                                    />
                                </LabeledCard>
                            </div>
                        ) : null}

                        {studyView === "due" ? (
                            <div className="flex flex-col gap-6">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="self-start"
                                    onPress={goStudyHome}
                                >
                                    {t("flashcard.backToHome")}
                                </Button>
                                <DueReview onExit={goStudyHome} />
                            </div>
                        ) : null}

                        {studyView === "deck" && studyDeckId ? (
                            <div className="flex flex-col gap-6">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="self-start"
                                    onPress={goStudyHome}
                                >
                                    {t("flashcard.backToHome")}
                                </Button>
                                {/* keyed so switching decks resets the reviewer's local state */}
                                <FlashcardReviewer key={studyDeckId} deckId={studyDeckId} />
                            </div>
                        ) : null}
                    </>
                ) : null}

                {/* ── INTERVIEW TAB ───────────────────────────────────────── */}
                {tab === "interview" ? (
                    interviewDeckId ? (
                        <div className="flex flex-col gap-6">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="self-start"
                                onPress={() => setInterviewDeckId(null)}
                            >
                                {t("flashcard.interview.backToTopics")}
                            </Button>
                            {/* keyed so switching topics resets the session's local state */}
                            <InterviewSession key={interviewDeckId} deckId={interviewDeckId} />
                        </div>
                    ) : (
                        // topic picker: the same decks, SR chrome hidden, interview CTA
                        <LabeledCard label={t("flashcard.interview.pickLabel")} frameless>
                            <FlashcardDeckList
                                showProgress={false}
                                ctaLabel={t("flashcard.interview.start")}
                                onSelectDeck={(deckId) => setInterviewDeckId(deckId)}
                            />
                        </LabeledCard>
                    )
                ) : null}
            </div>
        </div>
    )
}
