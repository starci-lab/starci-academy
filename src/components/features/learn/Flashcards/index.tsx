"use client"

import React, { useEffect, useState } from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@heroui/react"
import { EnrollGate } from "../shared/EnrollGate"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { FlashcardReviewer } from "./FlashcardReviewer"
import { FlashcardReviewerSkeleton } from "./FlashcardReviewer/FlashcardReviewerSkeleton"
import { QuizSession } from "./QuizSession"
import { QuizSessionSkeleton } from "./QuizSession/QuizSessionSkeleton"
import { FlashcardQuizResult } from "./FlashcardQuizResult"
import { FlashcardQuizResultSkeleton } from "./FlashcardQuizResult/FlashcardQuizResultSkeleton"
import { DueReview } from "./DueReview"
import { DueReviewHero } from "./DueReviewHero"
import { FlashcardStatsStrip } from "./FlashcardStatsStrip"
import { FlashcardDeckList } from "./FlashcardDeckList"
import { FlashcardMobileNav } from "./FlashcardMobileNav"
import { FlashcardReviewHistory } from "./FlashcardReviewHistory"
import { FlashcardReviewStats } from "./FlashcardReviewStats"
import { FlashcardSessionStats } from "./FlashcardSessionStats"
import { FlashcardSessionStatsSkeleton } from "./FlashcardSessionStats/FlashcardSessionStatsSkeleton"
import { useFlashcardNav, type FlashcardMode } from "./useFlashcardNav"
import { type WithClassNames } from "@/modules/types/base/class-name"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useQueryMyFlashcardReviewSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionBySessionIdSwr"
import { useQueryMyFlashcardReviewSessionStatsBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardReviewSessionStatsBySessionIdSwr"
import { useQueryMyFlashcardQuizSessionBySessionIdSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFlashcardQuizSessionBySessionIdSwr"
import { queryFlashcardDeck } from "@/modules/api/graphql/queries/query-flashcard-deck"
import { pathConfig } from "@/resources/path"

/** Props for {@link Flashcards}. */
export interface FlashcardsProps extends WithClassNames<undefined> {
    /**
     * Present when reached via the dedicated `flashcards/quiz/sessions/[sessionId]`
     * route — threaded straight through to {@link QuizSession}, which
     * rehydrates that server-persisted "Hỏi nhanh" run (24h TTL) instead of
     * showing the setup screen. Mirrors `MockInterviewProps.resumeSessionId`.
     */
    resumeQuizSessionId?: string
    /**
     * Present when reached via the dedicated, resumable
     * `flashcards/review/sessions/[sessionId]` route — covers BOTH a
     * single-deck "Học thẻ" run and the cross-deck "Đến hạn hôm nay" (due)
     * run; ONE shared live route/prop for both kinds now (thầy 2026-07-11:
     * "bỏ deck đi, only session thôi" — supersedes the earlier separate
     * `resumeReviewSessionId`/`resumeDueReviewSessionId` props and the
     * `decks/[deckId]` route segment). `Flashcards` resolves which kind it is
     * (and the deck identity, when applicable) via
     * `myFlashcardReviewSessionBySessionId` — the session already persists
     * that context server-side (thầy: "session đã persist hết rồi"), no
     * `deckId` query hint needed — before rendering `FlashcardReviewer` (deck)
     * or `DueReview` (due). Mirrors `resumeQuizSessionId`.
     */
    resumeStudySessionId?: string
    /**
     * Present when reached via the dedicated
     * `flashcards/quiz/sessions/[sessionId]/result` route — renders
     * `FlashcardQuizResult` DIRECTLY, no in-progress check (2026-07-12). This
     * route only ever means "show the result"; `QuizSession` navigates here
     * once its completion mutation resolves. See that route's own doc for the
     * full root-cause this route split fixes.
     */
    resultQuizSessionId?: string
    /**
     * Present when reached via the dedicated
     * `flashcards/review/sessions/[sessionId]/result` route — renders
     * `FlashcardSessionStats` DIRECTLY (covers both single-deck review and
     * cross-deck due), no in-progress check (2026-07-12). Mirrors
     * `resultQuizSessionId`.
     */
    resultStudySessionId?: string
}

/**
 * Course-level flashcards WORK PANE. The mode switch + deck list live in the
 * left rail (rendered by the learn layout, same as the content-map rail); this
 * page is the right pane and reads the active surface off the URL via
 * {@link useFlashcardNav}: study mode lands on an overview (today's due queue +
 * mastery), opens a deck's SM-2 reviewer, or runs the cross-deck due session;
 * quiz mode drills the chosen deck by voice.
 *
 * Back navigation from a sub-view: the due session uses the breadcrumb's
 * clickable "Ôn tập" crumb; a deck reviewer ALSO gets its own in-pane
 * `BackLink` (thầy 2026-07-09: "cả 2 phần review và quiz đều không có nút
 * back về") since it's reachable via a direct `/decks/[id]` URL, same
 * reasoning as `QuizSession`'s own exit link.
 * @param {FlashcardsProps} props Optional wrapper placement props.
 */
export const Flashcards = ({
    className,
    resumeQuizSessionId,
    resumeStudySessionId,
    resultQuizSessionId,
    resultStudySessionId,
}: FlashcardsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // owning course slug — the finished-session stats recap deep-links study
    // suggestions (RAG) back into the course with it.
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const { mode, deckId, session, goMode, goDeck, goOverview } = useFlashcardNav()
    // resumed straight into a live "Hỏi nhanh" (quiz) or "Học thẻ" (review/due)
    // run (via the dedicated `flashcards/{quiz,review}/sessions/[sessionId]`
    // routes) — the session becomes a full-bleed focused work surface (its own
    // `WorkSessionHeader`), so the surrounding chrome (breadcrumb, mode tabs,
    // mobile nav, bounded column) steps aside instead of doubling up on the
    // session's own header.
    const isLive = Boolean(resumeQuizSessionId || resumeStudySessionId)
    // resolve WHICH kind a "Học thẻ" session id is (deck-review vs cross-deck
    // due) + the deck identity when applicable — the session already persists
    // that context server-side (thầy 2026-07-11: "bỏ deck đi, only session
    // thôi" + "session đã persist hết rồi"), no `deckId` query hint needed.
    const studySessionContextSwr = useQueryMyFlashcardReviewSessionBySessionIdSwr(resumeStudySessionId, courseId)
    // recap stats for THAT session — its `status` is how we tell a finished
    // (completed/abandoned) session apart from an in-progress one. A finished
    // session reached by direct URL/refresh must render the STATS recap, NOT be
    // handed to the reviewer (which would wrongly start a fresh session). The
    // sibling context query above resolves ANY status, so without this a revisit
    // used to fall through to `startSessionAndRedirect`.
    const sessionStatsSwr = useQueryMyFlashcardReviewSessionStatsBySessionIdSwr(resumeStudySessionId, courseId)
    const sessionStats = sessionStatsSwr.data
    // A revisit must resolve the session's STATUS before routing. Only a
    // POSITIVELY-confirmed `in_progress` session is handed to the reviewer /
    // DueReview (whose own effect self-resumes-or-starts). Anything else —
    // finished (completed/abandoned), not-found, or status-not-yet-known — must
    // NOT reach them, or their start-a-fresh-session effect fires and appends a
    // second `/sessions/…` (the revisit crash). Hold the skeleton until known.
    const studyStatusKnown = Boolean(courseId) && !sessionStatsSwr.isLoading
        && !studySessionContextSwr.isLoading && Boolean(studySessionContextSwr.data)
    const studyIsInProgress = sessionStats?.status === "in_progress"
    // ... and the same gate for a resumed "Hỏi nhanh" (quiz) id: a finished
    // (completed/abandoned) or unknown session reached by direct URL/refresh must
    // render the RESULT surface, NOT be handed to the live `QuizSession` (whose
    // resume effect only accepts an in-progress session and would otherwise
    // dead-end to setup — the revisit dead-end this fixes). Status-agnostic query,
    // so a not-found id resolves too (→ the result surface's own null fallback).
    const quizSessionSwr = useQueryMyFlashcardQuizSessionBySessionIdSwr(resumeQuizSessionId, courseId)
    const quizStatusKnown = Boolean(courseId) && !quizSessionSwr.isLoading
    const quizIsInProgress = quizSessionSwr.data?.status === "in_progress"
    // quiz is enrolled-only (it spends AI credits) — gate the tab for trial viewers
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true

    // once a resumed session's status resolves to "not in progress" (finished/
    // abandoned) at the LIVE route, redirect to the dedicated RESULT route
    // (2026-07-12) instead of rendering the result surface inline here — ONE
    // place decides "is this session done" (the URL itself), so an old
    // bookmark to the live route, or a session that self-heals its stuck
    // completion on a later resume attempt, both converge on `/result`
    // instead of silently rendering results at the live URL forever (which
    // is exactly what made today's bugs hard to reproduce/trust — F5 kept
    // landing back on ambiguous state). `replace` (not `push`) — the live URL
    // was never a real navigation step the learner chose.
    useEffect(() => {
        if (!resumeStudySessionId || !studyStatusKnown || studyIsInProgress || !courseDisplayId) {
            return
        }
        router.replace(
            pathConfig().locale(locale).course(courseDisplayId).learn()
                .flashcards().due(resumeStudySessionId).result().build(),
        )
    }, [resumeStudySessionId, studyStatusKnown, studyIsInProgress, courseDisplayId, locale, router])

    useEffect(() => {
        if (!resumeQuizSessionId || !quizStatusKnown || quizIsInProgress || !courseDisplayId) {
            return
        }
        router.replace(
            pathConfig().locale(locale).course(courseDisplayId).learn()
                .flashcards().quiz(resumeQuizSessionId).result().build(),
        )
    }, [resumeQuizSessionId, quizStatusKnown, quizIsInProgress, courseDisplayId, locale, router])

    // which study-overview tab is active ("Ôn tập" / "Lịch sử" / "Thống kê") —
    // overview only (no deck open, no due session). Seeded from `?tab=` so a
    // shared/refreshed link lands back on the same tab — mirrors QuizSession's
    // own `setupTab` (thầy 2026-07-09: "muốn số liệu này thật sự có ý nghĩa,
    // cần thêm bước build UI Lịch sử/Thống kê cho Review").
    const [overviewTab, setOverviewTab] = useState<"overview" | "history" | "stats">(() => {
        const initial = searchParams.get("tab")
        return initial === "history" || initial === "stats" ? initial : "overview"
    })
    useEffect(() => {
        const want = overviewTab === "overview" ? null : overviewTab
        if (searchParams.get("tab") === want) {
            return
        }
        const params = new URLSearchParams(searchParams.toString())
        if (want) {
            params.set("tab", want)
        } else {
            params.delete("tab")
        }
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [overviewTab, pathname, searchParams, router])

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

    // dedicated RESULT route (2026-07-12) — renders the result surface
    // directly, no in-progress check. This URL only ever means "show the
    // result"; both surfaces already handle not-found/degraded data via their
    // own `AsyncContent`.
    if (resultStudySessionId) {
        return (
            <div className={className}>
                {courseId ? (
                    <FlashcardSessionStats
                        sessionId={resultStudySessionId}
                        courseId={courseId}
                        courseDisplayId={courseDisplayId ?? ""}
                        onBack={goOverview}
                    />
                ) : (
                    // brief courseId-not-resolved-yet flash — the stats surface's OWN
                    // shape, not the full live-session skeleton (header + card +
                    // buttons is the wrong shape for a result page).
                    <FlashcardSessionStatsSkeleton />
                )}
            </div>
        )
    }
    if (resultQuizSessionId) {
        return (
            <div className={className}>
                {courseId ? (
                    <FlashcardQuizResult
                        sessionId={resultQuizSessionId}
                        courseId={courseId}
                        courseDisplayId={courseDisplayId ?? ""}
                        onBack={goOverview}
                    />
                ) : (
                    <FlashcardQuizResultSkeleton />
                )}
            </div>
        )
    }

    // live "Hỏi nhanh" run — full-bleed work surface, its own `WorkSessionHeader`
    // IS the header, so the breadcrumb/PageHeader, mobile nav, and mode tabs
    // (all "which surface am I on" chrome) step aside; nothing to switch away
    // from mid-run. No bounded `max-w-3xl` column either — matches the sticky
    // header band spanning edge-to-edge, same as `MockInterviewSession`.
    if (isLive) {
        return (
            <div className={className}>
                {resumeStudySessionId ? (
                    !studyStatusKnown || !studyIsInProgress ? (
                        // status not settled yet, OR resolved to "not in progress" — the
                        // effect above is redirecting to `/result` in the latter case; hold
                        // the skeleton through both, never fall through to the reviewer
                        // before a POSITIVELY-confirmed in-progress session.
                        <FlashcardReviewerSkeleton />
                    ) : studySessionContextSwr.data?.kind === "deck" && studySessionContextSwr.data.deckId ? (
                        <FlashcardReviewer
                            key={studySessionContextSwr.data.deckId}
                            deckId={studySessionContextSwr.data.deckId}
                            sessionId={resumeStudySessionId}
                            onBack={goOverview}
                        />
                    ) : (
                        <DueReview onExit={goOverview} sessionId={resumeStudySessionId} />
                    )
                ) : !quizStatusKnown || !quizIsInProgress ? (
                    // status not settled yet, OR resolved to "not in progress" — the effect
                    // above is redirecting to `/result` in the latter case; hold the
                    // skeleton through both, never hand a maybe-finished session to the
                    // live QuizSession (whose resume effect only accepts in-progress).
                    <QuizSessionSkeleton />
                ) : courseId ? (
                    <QuizSession
                        key={courseId}
                        courseId={courseId}
                        resumeSessionId={resumeQuizSessionId}
                    />
                ) : null}
            </div>
        )
    }

    return (
        <div className={className}>
            {/* header → content = gap-10 (named exception, fe/foundations/gap.md) —
                everything under the header is ONE gap-6 content cluster */}
            <div className={cn("mx-auto flex max-w-3xl flex-col gap-10")}>
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={t("flashcard.title")}
                    description={t("flashcard.subtitle")}
                />

                <div className="flex flex-col gap-6">
                    {/* mobile fallback for the hidden left rail: mode switch + deck picker */}
                    <FlashcardMobileNav />

                    {/* the flashcards surface is rail-less — the desktop mode switch lives in-pane
                        for BOTH study and quiz (study's deck list is now in the pane too).
                        This is a page-FEATURE switch (swaps the ENTIRE pane — study vs quiz are
                        separate routes) → TabsCard variant="primary" (fe/components/tabs.md §0b),
                        NOT SegmentedControl (that's for an in-place SETTING that doesn't change
                        the panel — see tabs.md §0 / segmented-control.md). Correction 2026-07-09:
                        this was on SegmentedControl before, which is what let QuizSession's OWN
                        inner setup tabs (also variant="primary") render at the exact same visual
                        weight as this outer mode switch — see tabs.md §0d for the fix. */}
                    <div className="hidden lg:block">
                        <TabsCard
                            variant="primary"
                            leftTabs={{
                                items: [
                                    { key: "study", label: t("flashcard.mode.study") },
                                    { key: "quiz", label: t("flashcard.mode.quiz") },
                                ],
                                selectedKey: mode,
                                ariaLabel: t("flashcard.title"),
                                onSelectionChange: (key) => goMode(key as FlashcardMode),
                            }}
                        />
                    </div>

                    {mode === "study" ? (
                        session === "due" ? (
                            <DueReview onExit={goOverview} />
                        ) : deckId ? (
                            // keyed so switching decks resets the reviewer's local state
                            <FlashcardReviewer key={deckId} deckId={deckId} onBack={goOverview} />
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* NESTED under the outer "Học thẻ/Hỏi nhanh" mode switch above —
                                    same variant="secondary" + w-full demotion QuizSession's own
                                    setup tabs use, for the same reason (tabs.md §0d). */}
                                <TabsCard
                                    variant="secondary"
                                    className="w-full"
                                    leftTabs={{
                                        items: [
                                            { key: "overview", label: t("flashcard.review.overviewTabOverview") },
                                            { key: "history", label: t("flashcard.review.overviewTabHistory") },
                                            { key: "stats", label: t("flashcard.review.overviewTabStats") },
                                        ],
                                        selectedKey: overviewTab,
                                        ariaLabel: t("flashcard.review.overviewTabOverview"),
                                        onSelectionChange: (key) => setOverviewTab(key as "overview" | "history" | "stats"),
                                    }}
                                />

                                {overviewTab === "history" ? (
                                    courseId ? (
                                        <FlashcardReviewHistory
                                            courseId={courseId}
                                            onStartReview={() => setOverviewTab("overview")}
                                        />
                                    ) : null
                                ) : overviewTab === "stats" ? (
                                    courseId ? (
                                        <FlashcardReviewStats
                                            courseId={courseId}
                                            onStartReview={() => setOverviewTab("overview")}
                                        />
                                    ) : null
                                ) : (
                                    <>
                                        {/* today's spaced-repetition queue + mastery overview */}
                                        <DueReviewHero />
                                        <FlashcardStatsStrip />
                                        {/* deck topic picker — now in the pane (rail dropped) */}
                                        <FlashcardDeckList onSelectDeck={goDeck} />
                                    </>
                                )}
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
                        />
                    ) : null}
                </div>
            </div>
        </div>
    )
}
