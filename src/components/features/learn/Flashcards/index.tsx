"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { cn } from "@heroui/react"
import { EnrollGate } from "../shared/EnrollGate"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { FlashcardReviewer } from "./FlashcardReviewer"
import { QuizSession } from "./QuizSession"
import { DueReview } from "./DueReview"
import { DueReviewHero } from "./DueReviewHero"
import { FlashcardStatsStrip } from "./FlashcardStatsStrip"
import { FlashcardDeckList } from "./FlashcardDeckList"
import { FlashcardMobileNav } from "./FlashcardMobileNav"
import { useFlashcardNav, type FlashcardMode } from "./useFlashcardNav"
import { type WithClassNames } from "@/modules/types/base/class-name"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"

/** Props for {@link Flashcards}. */
export interface FlashcardsProps extends WithClassNames<undefined> {
    /**
     * Present when reached via the dedicated `flashcards/quiz/[sessionId]`
     * route — threaded straight through to {@link QuizSession}, which
     * rehydrates that server-persisted "Hỏi nhanh" run (24h TTL) instead of
     * showing the setup screen. Mirrors `MockInterviewProps.resumeSessionId`.
     */
    resumeQuizSessionId?: string
}

/**
 * Course-level flashcards WORK PANE. The mode switch + deck list live in the
 * left rail (rendered by the learn layout, same as the content-map rail); this
 * page is the right pane and reads the active surface off the URL via
 * {@link useFlashcardNav}: study mode lands on an overview (today's due queue +
 * mastery), opens a deck's SM-2 reviewer, or runs the cross-deck due session;
 * quiz mode drills the chosen deck by voice.
 *
 * Back navigation from a sub-view (a deck / the due session) is the breadcrumb's
 * clickable "Ôn tập" crumb — no separate back-link.
 * @param {FlashcardsProps} props Optional wrapper placement props.
 */
export const Flashcards = ({ className, resumeQuizSessionId }: FlashcardsProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const { mode, deckId, session, goMode, goDeck, goDue, goOverview } = useFlashcardNav()
    // quiz is enrolled-only (it spends AI credits) — gate the tab for trial viewers
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true
    // widens ONLY while the quiz's real cloze/flip work UI is on screen — a
    // làm-việc-tập-trung job. setup/recap AND the active phase's building/error/empty
    // sub-states (centered messages, not the work surface itself) stay at the study
    // tab's width (per surface-job-drives-layout, mirroring the Mock Interview
    // per-phase shell precedent). A `resumeQuizSessionId` always lands straight in the
    // active phase, so it counts as wide immediately too — no waiting on QuizSession's
    // own `onWorkSurfaceChange` effect to catch up after mount.
    const [isQuizWorking, setIsQuizWorking] = useState(false)
    const isWide = mode === "quiz" && (isQuizWorking || Boolean(resumeQuizSessionId))

    // deck name for the breadcrumb when reviewing one deck (shared SWR key with the
    // reviewer → one fetch). The reviewer owns the heavy card states.
    const { data: deckData } = useSWR(
        deckId ? ["flashcard-deck", deckId] : null,
        async () => {
            const response = await queryFlashcardDeck({
                request: { flashcardDeckId: deckId as string },
            })
            return response.data?.flashcardDeck.data ?? null
        },
    )

    // breadcrumb: a sub-view (deck / due session) inserts a clickable "Ôn tập" crumb
    // (→ overview) + names the sub-view; the overview/quiz just end at "Ôn tập".
    const isDeck = mode === "study" && Boolean(deckId)
    const isDue = mode === "study" && session === "due"
    const breadcrumb = isDeck ? (
        <LearnBreadcrumb
            current={deckData?.title ?? t("flashcard.title")}
            section={{ label: t("flashcard.title"), onPress: goOverview }}
        />
    ) : isDue ? (
        <LearnBreadcrumb
            current={t("flashcard.due.label")}
            section={{ label: t("flashcard.title"), onPress: goOverview }}
        />
    ) : (
        <LearnBreadcrumb current={t("flashcard.title")} />
    )

    return (
        <div className={className}>
            {/* header → content = gap-10 (named exception, fe/foundations/gap.md) —
                everything under the header is ONE gap-6 content cluster */}
            <div className={cn("mx-auto flex flex-col gap-10", isWide ? "max-w-5xl" : "max-w-3xl")}>
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={t("flashcard.title")}
                    description={t("flashcard.subtitle")}
                />

                <div className="flex flex-col gap-6">
                    {/* mobile fallback for the hidden left rail: mode switch + deck picker */}
                    <FlashcardMobileNav />

                    {/* the flashcards surface is rail-less — the desktop mode switch lives in-pane
                        for BOTH study and quiz (study's deck list is now in the pane too). */}
                    <div className="hidden lg:block">
                        <SegmentedControl<FlashcardMode>
                            ariaLabel={t("flashcard.title")}
                            value={mode}
                            onChange={goMode}
                            items={[
                                { value: "study", label: t("flashcard.mode.study") },
                                { value: "quiz", label: t("flashcard.mode.quiz") },
                            ]}
                        />
                    </div>

                    {mode === "study" ? (
                        session === "due" ? (
                            <DueReview onExit={goOverview} />
                        ) : deckId ? (
                            // keyed so switching decks resets the reviewer's local state
                            <FlashcardReviewer key={deckId} deckId={deckId} />
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* today's spaced-repetition queue + mastery overview */}
                                <DueReviewHero onStart={goDue} />
                                <FlashcardStatsStrip />
                                {/* deck topic picker — now in the pane (rail dropped) */}
                                <FlashcardDeckList onSelectDeck={goDeck} />
                            </div>
                        )
                    ) : !isEnrolled ? (
                        // trial viewer → lock the quiz behind an enroll CTA
                        <EnrollGate
                            title={t("flashcard.quiz.gateTitle")}
                            description={t("flashcard.quiz.gateDescription")}
                        />
                    ) : courseId ? (
                        // a fixed-length random session over the whole course (no per-deck
                        // topic pick); keyed by course so it resets
                        <QuizSession
                            key={courseId}
                            courseId={courseId}
                            resumeSessionId={resumeQuizSessionId}
                            onWorkSurfaceChange={setIsQuizWorking}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    )
}
