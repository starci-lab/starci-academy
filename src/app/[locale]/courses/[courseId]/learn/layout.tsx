"use client"
import React, { PropsWithChildren } from "react"
import { useTranslations } from "next-intl"
import { useSelectedLayoutSegments } from "next/navigation"
import { Spinner } from "@heroui/react"
import { LearnShell } from "@/components/features/learn/LearnShell"
import { ContentMap } from "@/components/features/learn/ContentMap"
import { ResizableRail } from "@/components/blocks"
import { MilestoneOutline } from "@/components/features/learn/MilestoneOutline"
import { OnThisPage } from "@/components/features/learn/OnThisPage"
import { ContentAiFab } from "@/components/features/learn/ContentAiFab"
import { EnrollGate } from "@/components/features/learn/shared/EnrollGate"
import { GithubLinkGate } from "@/components/layouts/auth/GithubLinkGate"
import { GithubTeamGate } from "@/components/layouts/auth/GithubTeamGate"
import { useQueryCourseSwr, useQueryCourseEnrollmentStatusSwr } from "@/hooks"
import { useAppSelector } from "@/redux"

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

export const Layout = ({ children }: PropsWithChildren) => {
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
    const isModules = segments.includes("modules")
    // the course-content home (`/learn/content`) + the lesson reader (`/content/modules/...`)
    // both share the content-map rail on the LEFT: the full module → lesson tree lives in
    // the rail (its one home), and the dashboard body shows continue + progress + the
    // current-module path instead of re-drawing the whole tree.
    const isContent = segments[0] === "content"
    const isPersonalProject = segments[0] === "personal-project"
    // the mind-map is a full-bleed interactive canvas (fills the viewport edge-to-edge),
    // so it opts out of the shell's canonical p-6 reading-column padding.
    const isMindMap = segments[0] === "mind-map"
    // a single challenge (`…/contents/<id>/challenges/<id>`) KEEPS the course-tree rail (the
    // learner still navigates the course while solving), but its body is a tabbed single column
    // (Đề bài / Nộp bài), so it needs no on-this-page outline. Only the right rail is dropped.
    const isChallenge = segments.includes("challenges")

    // persistent left rail (always visible on desktop): the width is drag-resizable
    // (persisted) via ResizableRail; sticky under the navbar and a flex column bounded to
    // the viewport so the rail pins its header/search and scrolls ONLY the list. Hidden
    // below lg (mobile opens it in the LearnMobileBar drawer).
    const railClass = "hidden shrink-0 lg:flex lg:flex-col lg:sticky lg:top-16 lg:self-start lg:h-[calc(100dvh-4rem)]"

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
            <ContentMap className="min-h-0 lg:flex-1" />
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
            <MilestoneOutline className="min-h-0 lg:flex-1" />
        </ResizableRail>
    ) : undefined
    // right rail: on-this-page for lessons only; the capstone keeps its rail on the left, and
    // the challenge (tabbed single column) needs no outline.
    const rightRail = (isModules && !isChallenge) ? (
        <OnThisPage />
    ) : undefined

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
            {/* hard gate: force enrolled learners into their course GitHub team (non-dismissable) */}
            <GithubTeamGate />
            {/* floating "ask StarCi AI" mascot button (self-hides when no content is open) */}
            <ContentAiFab />
            <LearnShell
                leftRail={showSurface ? leftRail : undefined}
                rightRail={showSurface ? rightRail : undefined}
                fullBleed={isMindMap}
            >
                {content}
            </LearnShell>
        </>
    )
}

export default Layout
