"use client"
import React, { PropsWithChildren } from "react"
import { cn } from "@heroui/react"
import { useSelectedLayoutSegment } from "next/navigation"
import { LearnShell } from "@/components/features/learn/LearnShell"
import { ContentMap } from "@/components/features/learn/ContentMap"
import { MilestoneOutline } from "@/components/features/learn/MilestoneOutline"
import { OnThisPage } from "@/components/features/learn/OnThisPage"
import { GithubLinkGate } from "@/components/layouts/auth/GithubLinkGate"
import { useQueryCourseSwr } from "@/hooks"
import { useAppSelector } from "@/redux"

export const Layout = ({ children }: PropsWithChildren) => {
    // load the active course here so EVERY learn tab has `course.entity` on a cold refresh
    // (the displayId is synced from the URL by a global effect). Tabs like personal-project
    // have no other loader, and downstream queries (milestones, etc.) gate on `course.id`.
    useQueryCourseSwr()
    // the milestone (personal-project) rail collapse is still redux-driven.
    const rightCollapsed = useAppSelector((state) => state.sidebar.rightCollapsed)
    // which learn sub-route is active. Docs-style layout:
    //  - "modules" (module list / detail / content) → content-map on the LEFT (persistent)
    //    + an on-this-page outline on the RIGHT (self-hides when the body has no headings).
    //  - "personal-project" → its own milestone rail on the right (redux-collapsible).
    // every other tab (mind-map, foundations, headhuntings, practice, leaderboard, starci-ai)
    // has no side rails, so its content spans the full width.
    const segment = useSelectedLayoutSegment()
    const isModules = segment === "modules"
    const isPersonalProject = segment === "personal-project"

    // milestone rail track width tracks the collapse flag; class literals are enumerated
    // so the Tailwind JIT emits them. Hidden below lg (mobile uses the drawer).
    const milestoneRailClass = cn(
        "hidden min-w-0 shrink-0 overflow-x-hidden transition-[width] duration-300 ease-in-out lg:block lg:self-start",
        rightCollapsed ? "lg:w-14" : "lg:w-80",
    )
    // persistent left content-map rail (always visible on desktop, no collapse):
    // fixed width, sticky under the navbar, scrolls internally when the tree is tall.
    const contentMapClass = "hidden w-80 shrink-0 lg:block lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto"

    // left content-map rail: the lean course content tree while reading.
    const leftRail = isModules ? (
        <ContentMap className={contentMapClass} />
    ) : undefined
    // right rail: on-this-page for lessons, milestone rail for the capstone.
    const rightRail = isModules ? (
        <OnThisPage />
    ) : isPersonalProject ? (
        <MilestoneOutline collapsed={rightCollapsed} className={milestoneRailClass} />
    ) : undefined

    return (
        <>
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            <LearnShell
                leftRail={leftRail}
                rightRail={rightRail}
                showRightCollapse={isPersonalProject}
            >
                {children}
            </LearnShell>
        </>
    )
}

export default Layout
