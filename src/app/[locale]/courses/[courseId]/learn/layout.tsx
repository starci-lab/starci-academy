"use client"
import React, { PropsWithChildren } from "react"
import { cn } from "@heroui/react"
import { useSelectedLayoutSegment } from "next/navigation"
import { Sidebar } from "@/components/layouts/learn/Sidebar"
import { LearnMobileBar } from "@/components/layouts/learn/LearnMobileBar"
import { LearnPanelToggles } from "@/components/layouts/learn/LearnPanelToggles"
import { ModuleSidebar } from "@/components/layouts/learn/ModuleSidebar"
import { MilestoneSidebar } from "@/components/layouts/learn/MilestoneSidebar"
import { GithubLinkGate } from "@/components/layouts/auth/GithubLinkGate"
import { useQueryCourseSwr } from "@/hooks"
import { useAppSelector } from "@/redux"

export const Layout = ({ children }: PropsWithChildren) => {
    // load the active course here so EVERY learn tab has `course.entity` on a cold refresh
    // (the displayId is synced from the URL by a global effect). Tabs like personal-project
    // have no other loader, and downstream queries (milestones, etc.) gate on `course.id`.
    useQueryCourseSwr()
    // both rails are driven by their collapse flags: left (course nav) and right (lesson outline)
    const leftCollapsed = useAppSelector((state) => state.sidebar.leftCollapsed)
    const rightCollapsed = useAppSelector((state) => state.sidebar.rightCollapsed)
    // which learn sub-route is active. Only the lesson-reading routes carry a right rail:
    //  - "modules" (module list / module detail / content detail) → module-outline rail
    //  - "personal-project" → its own milestone rail
    // every other tab (mind-map, foundations, headhuntings, interview prep, practice, cv,
    // leaderboard, starci-ai) has NO right rail, so its content spans the full width.
    const segment = useSelectedLayoutSegment()
    const isModules = segment === "modules"
    const isPersonalProject = segment === "personal-project"
    const hasRightRail = isModules || isPersonalProject

    // grid tracks from lg up. With a right rail: nav | content | rail (both rails collapsible).
    // Without one: nav | content only. Class literals are enumerated so Tailwind JIT emits them.
    const gridCols = hasRightRail
        ? leftCollapsed
            ? rightCollapsed
                ? "lg:grid-cols-[4rem_1fr_3.5rem]"
                : "lg:grid-cols-[4rem_1fr_20rem]"
            : rightCollapsed
                ? "lg:grid-cols-[16rem_1fr_3.5rem]"
                : "lg:grid-cols-[16rem_1fr_20rem]"
        : leftCollapsed
            ? "lg:grid-cols-[4rem_1fr]"
            : "lg:grid-cols-[16rem_1fr]"

    return (
        // single column on mobile/tablet; explicit grid from lg up so the rails can collapse
        // without disturbing the content track
        <div
            className={cn(
                "grid grid-cols-1 items-start transition-[grid-template-columns] duration-300 ease-in-out",
                gridCols,
            )}
        >
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            {/* desktop course-nav rail (self-hides below lg, collapses to icons on demand) */}
            <Sidebar />
            {/* content column; only anchors the collapse handles + right border when a rail exists */}
            <div className={cn("min-h-0 min-w-0", hasRightRail && "relative lg:border-r")}>
                {/* desktop-only collapse handles, scoped to routes that actually have a right rail */}
                {hasRightRail && <LearnPanelToggles />}
                {/* mobile-only toolbar exposing both sidebars as drawers */}
                <LearnMobileBar />
                {children}
            </div>
            {/* right rail: module outline on lesson routes, milestone rail on personal-project.
                Both collapse to a slim numbered index. Mobile uses the drawer in LearnMobileBar. */}
            {isModules && (
                <ModuleSidebar
                    collapsed={rightCollapsed}
                    className="hidden min-w-0 overflow-x-hidden lg:block lg:self-start"
                />
            )}
            {isPersonalProject && (
                <MilestoneSidebar
                    collapsed={rightCollapsed}
                    className="hidden min-w-0 overflow-x-hidden lg:block lg:self-start"
                />
            )}
        </div>
    )
}

export default Layout
