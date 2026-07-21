"use client"
import React, { PropsWithChildren } from "react"
import { useTranslations } from "next-intl"
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation"
import { Spinner } from "@heroui/react"
import { LearnShell } from "@/components/features/learn/LearnShell"
import { ContentMap } from "@/components/features/learn/ContentMap"
import { MilestoneOutline } from "@/components/features/learn/MilestoneOutline"
import { LeaderboardCategoryRail } from "@/components/features/learn/Leaderboard/LeaderboardCategoryRail"
import { OnThisPage } from "@/components/features/learn/OnThisPage"
import { ContentAiFab } from "@/components/features/learn/ContentAiFab"
import { ContentAiSelectionAsk } from "@/components/features/learn/ContentAiSelectionAsk"
import { EnrollGate } from "@/components/features/learn/shared/EnrollGate"
import { PersonalProjectGatePreview } from "@/components/features/learn/PersonalProject/PersonalProjectGatePreview"
import { GithubLinkGate } from "@/components/features/auth/GithubLinkGate"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useAppSelector } from "@/redux/hooks"

/**
 * Learn surfaces that require enrollment. Only the capstone (personal-project) is gated:
 * it's the enrolled-only hands-on outcome. Trial viewers ("Học thử") may freely browse the
 * rest — flashcards (non-premium), leaderboard, foundations, content + mind-map — so those
 * are NOT gated. Keyed by `segments[0]`.
 */
const ENROLL_REQUIRED_SURFACES: ReadonlySet<string> = new Set([
    "personal-project",
])

/** i18n key for each gated surface's display name (folded into the gate title). */
const SURFACE_LABEL_KEY: Record<string, string> = {
    "personal-project": "finalProject.title",
}

/** Per-surface MOCK teaser rendered behind the enroll card (Medium-style gate). */
const SURFACE_PREVIEW: Record<string, React.ReactNode> = {
    "personal-project": <PersonalProjectGatePreview />,
}

const Layout = ({ children }: PropsWithChildren) => {
    const t = useTranslations()
    // load the active course here so EVERY learn tab has `course.entity` on a cold refresh
    // (the displayId is synced from the URL by a global effect). Tabs like personal-project
    // have no other loader, and downstream queries (milestones, etc.) gate on `course.id`.
    useQueryCourseSwr()
    // enrollment status drives the enroll-gate on hands-on surfaces (populates state.user.enrolled).
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrolled = useAppSelector((state) => state.user.enrolled)
    // `enrolled` defaults to false, so only trust it once the status query has settled —
    // otherwise an enrolled viewer would flash the gate on cold load.
    const enrollKnown = Boolean(enrollmentSwr.data) || Boolean(enrollmentSwr.error)
    // which learn sub-route is active. Docs-style layout:
    //  - "modules" (module list / detail / content) → content-map on the LEFT (persistent)
    //    + an on-this-page outline on the RIGHT (self-hides when the body has no headings).
    //  - "personal-project" → its milestone rail on the LEFT too (same place as the content-map),
    //    so the capstone reads like every other learn tab; no right rail.
    // every other tab (mind-map, foundations, headhuntings, practice, leaderboard, starci-ai)
    // has no side rails, so its content spans the full width.
    // lessons now live UNDER the content home (`/learn/content/modules/...`), so the
    // immediate child segment is "content" for BOTH the dashboard home and the reader.
    // Use the full segment list: `includes("modules")` flags the reader/module routes,
    // while `segments[0]` flags the top-level tabs (content / personal-project / mind-map).
    const segments = useSelectedLayoutSegments()
    const searchParams = useSearchParams()
    const isModules = segments.includes("modules")
    // the course-content home (`/learn/content`) + the lesson reader (`/content/modules/...`)
    // both share the content-map rail on the LEFT: the full module → lesson tree lives in
    // the rail (its one home), and the dashboard body shows continue + progress + the
    // current-module path instead of re-drawing the whole tree.
    const isContent = segments[0] === "content"
    const isPersonalProject = segments[0] === "personal-project"
    // the flashcards surface goes RAIL-LESS entirely (per concepts/when-rail: drop the 2nd rail
    // for the whole Ôn tập surface). The deck list lives IN the pane (study overview) and the
    // mode switch is in-pane on desktop too. `isFlashcards` only drives the mobile-bar choice.
    const isFlashcards = segments[0] === "flashcards"
    // the "Hỏi nhanh" quiz goes full-bleed ONLY during a live run (a focused work
    // surface: its own `WorkSessionHeader` band IS the header) — detected off the
    // dedicated resumable route (`flashcards/quiz/sessions/[sessionId]`), same
    // pattern as the mock-interview's `isMockInterviewInterviewRoute` below.
    const isFlashcardQuizLive = isFlashcards && segments[1] === "quiz" && segments[2] === "sessions"
    // "Học thẻ"/"Ôn thẻ đến hạn" review goes full-bleed ONLY during a live session
    // — same idiom, detected off the dedicated resumable route
    // (`flashcards/review/sessions/[sessionId]`, 2026-07-11 đính chính: "ôn thẻ
    // giao diện y chang"). This ONE route now serves BOTH FlashcardReviewer
    // (single-deck) and DueReview (cross-deck) — the old deck-scoped route
    // (`review/decks/[deckId]/sessions/[sessionId]`) was consolidated away; the
    // bare `.../review` overview route (no `sessions` segment) is just the
    // resolve-only shim — stays centered, never full-bleed. Correction
    // 2026-07-12: the gate still checked the DELETED deck-scoped shape and
    // never matched the real route, so the shell kept applying its `p-6`
    // reading-column padding ON TOP of the surface's own full-bleed padding
    // (thầy: "bỏ padding-6 ở đây này", pointed at DevTools showing the shell's
    // `p-6 @max-app-lg:pb-16` wrapper still active on a live review session).
    const isFlashcardReviewLive = isFlashcards && segments[1] === "review" && segments[2] === "sessions"
    // the mind-map is a full-bleed interactive canvas (fills the viewport edge-to-edge),
    // so it opts out of the shell's canonical p-6 reading-column padding.
    const isMindMap = segments[0] === "mind-map"
    // the mock interview goes full-bleed ONLY during the live `interview` phase (a focused
    // work surface: conversation + tool workspace). setup/grading/scorecard stay centered.
    // The active phase is mirrored into the URL (`?phase=interview`) by MockInterviewSession
    // so the shell can drop the course rails + reading padding for that phase only.
    const isMockInterview = segments[0] === "mock-interview"
    // the dedicated resumable route (`mock-interview/interview/[sessionId]`) is
    // ALWAYS the live work surface — detected straight off the path segment so
    // there is no `?phase=interview` round-trip to wait on before the shell
    // drops its rails. Additive: the legacy `?phase=interview` query-param
    // mirror (still written by MockInterviewSession once mounted) keeps working
    // for the same route too.
    const isMockInterviewInterviewRoute = isMockInterview && segments[1] === "interview"
    const isMockInterviewLive = isMockInterviewInterviewRoute || (isMockInterview && searchParams.get("phase") === "interview")
    // a live quiz / interview grades a recruiter-facing signal → the AI chat is a
    // cheat channel there and gets suppressed (mirrors the same gate in InnerLayout,
    // which also kills a rail the learner left open before navigating in).
    const isAssessmentLive = isFlashcardQuizLive || isMockInterviewLive
    // ONLY the session (`…/playground/<slug>/session`) is a full-bleed work
    // surface (step guide + terminal/resources tabs), same reasoning as the live
    // mock-interview route. The exercise's SETUP page (`…/playground/<slug>`) and
    // the hub list (`…/playground`) are reading surfaces — install + pair
    // guidance, progress, machine status — so they keep the normal reading column.
    const isPlaygroundSession = segments[0] === "playground" && segments[2] === "session"
    // the leaderboard shows its XP-category selector as a sidebar (like the content
    // page) on the LEFT; the board reads the selection from the `?category=` URL param.
    const isLeaderboard = segments[0] === "leaderboard"
    // a single challenge (`…/contents/<id>/challenges/<id>`) KEEPS the course-tree rail (the
    // learner still navigates the course while solving), but its body is a tabbed single column
    // (Đề bài / Nộp bài), so it needs no on-this-page outline. Only the right rail is dropped.
    const isChallenge = segments.includes("challenges")

    // persistent left rail (always visible on desktop): the width is drag-resizable
    // (persisted) via ResizableRail; sticky under the navbar and a flex column bounded to
    // the viewport so the rail pins its header/search and scrolls ONLY the list. Hidden
    // below lg (mobile opens it in the LearnMobileBar drawer).
    const railClass = "hidden shrink-0 @app-lg:flex @app-lg:flex-col @app-lg:sticky @app-lg:top-16 @app-lg:self-start @app-lg:h-[calc(100dvh-4rem)]"

    // left rail: course content-map while reading lessons AND on the content home;
    // milestone outline for the capstone.
    const leftRail = (isModules || isContent) ? (
        <ResizableRail
            className={railClass}
            storageKey="starci.learn.contentMap.width"
            defaultWidth={320}
            minWidth={256}
            maxWidth={560}
            ariaLabel={t("courseContents.resizeRail")}
        >
            <ContentMap className="min-h-0 @app-lg:flex-1" />
        </ResizableRail>
    ) : isPersonalProject ? (
        <ResizableRail
            className={railClass}
            storageKey="starci.learn.milestoneMap.width"
            defaultWidth={320}
            minWidth={256}
            maxWidth={560}
            ariaLabel={t("courseContents.resizeRail")}
        >
            <MilestoneOutline className="min-h-0 @app-lg:flex-1" />
        </ResizableRail>
    ) : isLeaderboard ? (
        <ResizableRail
            className={railClass}
            storageKey="starci.learn.leaderboardRail.width"
            defaultWidth={300}
            minWidth={240}
            maxWidth={420}
            ariaLabel={t("leaderboard.categories.label")}
        >
            <LeaderboardCategoryRail variant="rail" className="min-h-0 @app-lg:flex-1" />
        </ResizableRail>
    ) : undefined
    // right rail: on-this-page for the LESSON READER only (a real "contents/<id>" route) —
    // the module SHELL page (`/content/modules/<moduleId>`, no `contents` segment) is its own
    // dashboard (mirrors the course-content home, which also has no right rail) and would
    // otherwise inherit a stale TOC from whatever lesson was read last (OnThisPage self-hides
    // on `!contentId`, not on route — the module shell has no active content of its own).
    const isLessonReader = isModules && segments.includes("contents")
    const rightRail = (isLessonReader && !isChallenge) ? (
        <OnThisPage />
    ) : undefined

    // The content-AI chat rail is NOT a learn concern any more: it docks beside the
    // whole app from `InnerLayout`, so the learn right-rail slot is free to keep
    // serving the surface's own outline again.

    // enroll-gate: a trial viewer hitting a hands-on surface sees the enroll CTA, not a broken
    // page. Only gate once enrollment is KNOWN (enrolled defaults false → would flash otherwise);
    // while it resolves, hold the surface (and its enrollment-bound hooks) back behind a spinner.
    const surface = segments[0]
    const isEnrollRequired = Boolean(surface) && ENROLL_REQUIRED_SURFACES.has(surface as string)
    const showSurface = !isEnrollRequired || (enrollKnown && enrolled)
    const isGated = isEnrollRequired && enrollKnown && !enrolled
    const gateLabelKey = surface ? SURFACE_LABEL_KEY[surface] : undefined

    const content = showSurface
        ? children
        : isGated
            ? (
                <EnrollGate
                    title={t("enrollGate.title", { surface: gateLabelKey ? t(gateLabelKey) : "" })}
                    description={t("enrollGate.description")}
                    preview={surface ? SURFACE_PREVIEW[surface] : undefined}
                />
            )
            : (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            )

    return (
        <>
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            {/* floating "ask StarCi AI" mascot button — available on EVERY learn tab
                (grounds on the open lesson, or on the whole course when there is none)
                EXCEPT a live quiz / mock-interview: those grade a recruiter-facing
                signal, so a course-grounded AI beside them is a cheat channel that
                inflates the score (assessment-surface-integrity). Chat returns after
                the session, on the scorecard, for "ôn tag yếu". */}
            {!isAssessmentLive ? <ContentAiFab /> : null}
            {/* "ask AI about this passage" button on lesson-article text selection */}
            {!isAssessmentLive ? <ContentAiSelectionAsk /> : null}
            <LearnShell
                leftRail={showSurface ? leftRail : undefined}
                rightRail={showSurface ? rightRail : undefined}
                fullBleed={isMindMap || isMockInterviewLive || isPlaygroundSession || isFlashcardQuizLive || isFlashcardReviewLive}
                simpleMobileBar={isLeaderboard || isFlashcards}
            >
                {content}
            </LearnShell>
        </>
    )
}

export default Layout
