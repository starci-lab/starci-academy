"use client"
import React, { PropsWithChildren } from "react"
import { useTranslations } from "next-intl"
import { useSelectedLayoutSegment } from "next/navigation"
import { LearnShell } from "@/components/features/learn/LearnShell"
import { ContentMap } from "@/components/features/learn/ContentMap"
import { ResizableRail } from "@/components/blocks"
import { MilestoneOutline } from "@/components/features/learn/MilestoneOutline"
import { OnThisPage } from "@/components/features/learn/OnThisPage"
import { ContentAiFab } from "@/components/features/learn/ContentAiFab"
import { GithubLinkGate } from "@/components/layouts/auth/GithubLinkGate"
import { useQueryCourseSwr } from "@/hooks"

export const Layout = ({ children }: PropsWithChildren) => {
    const t = useTranslations()
    // load the active course here so EVERY learn tab has `course.entity` on a cold refresh
    // (the displayId is synced from the URL by a global effect). Tabs like personal-project
    // have no other loader, and downstream queries (milestones, etc.) gate on `course.id`.
    useQueryCourseSwr()
    // which learn sub-route is active. Docs-style layout:
    //  - "modules" (module list / detail / content) → content-map on the LEFT (persistent)
    //    + an on-this-page outline on the RIGHT (self-hides when the body has no headings).
    //  - "personal-project" → its milestone rail on the LEFT too (same place as the content-map),
    //    so the capstone reads like every other learn tab; no right rail.
    // every other tab (mind-map, foundations, headhuntings, practice, leaderboard, starci-ai)
    // has no side rails, so its content spans the full width.
    const segment = useSelectedLayoutSegment()
    const isModules = segment === "modules"
    const isPersonalProject = segment === "personal-project"
    // the mind-map is a full-bleed interactive canvas (fills the viewport edge-to-edge),
    // so it opts out of the shell's canonical p-6 reading-column padding.
    const isMindMap = segment === "mind-map"

    // persistent left rail (always visible on desktop): the width is drag-resizable
    // (persisted) via ResizableRail; sticky under the navbar and a flex column bounded to
    // the viewport so the rail pins its header/search and scrolls ONLY the list. Hidden
    // below lg (mobile opens it in the LearnMobileBar drawer).
    const railClass = "hidden shrink-0 lg:flex lg:flex-col lg:sticky lg:top-16 lg:self-start lg:h-[calc(100dvh-4rem)]"

    // left rail: course content-map while reading lessons; milestone outline for the capstone.
    const leftRail = isModules ? (
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
    // right rail: on-this-page for lessons only; the capstone now keeps its rail on the left.
    const rightRail = isModules ? (
        <OnThisPage />
    ) : undefined

    return (
        <>
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            {/* floating "ask StarCi AI" mascot button (self-hides when no content is open) */}
            <ContentAiFab />
            <LearnShell
                leftRail={leftRail}
                rightRail={rightRail}
                fullBleed={isMindMap}
            >
                {children}
            </LearnShell>
        </>
    )
}

export default Layout
