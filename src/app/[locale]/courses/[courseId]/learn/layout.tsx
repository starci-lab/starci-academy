"use client"
import React, { PropsWithChildren } from "react"
import { cn } from "@heroui/react"
import { useSelectedLayoutSegment } from "next/navigation"
import { LearnShell } from "@/components/features/learn/LearnShell"
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
    // the right (lesson outline) rail collapse is still redux-driven; the left rail
    // now collapses in place inside the LearnShell's CollapsibleSidebar block.
    const rightCollapsed = useAppSelector((state) => state.sidebar.rightCollapsed)
    // which learn sub-route is active. Only the lesson-reading routes carry a right rail:
    //  - "modules" (module list / module detail / content detail) → module-outline rail
    //  - "personal-project" → its own milestone rail
    // every other tab (mind-map, foundations, headhuntings, interview prep, practice, cv,
    // leaderboard, starci-ai) has NO right rail, so its content spans the full width.
    const segment = useSelectedLayoutSegment()
    const isModules = segment === "modules"
    const isPersonalProject = segment === "personal-project"

    // the right rail track width tracks the collapse flag; class literals are enumerated
    // so the Tailwind JIT emits them. Hidden below lg (mobile uses the drawer).
    const railClass = cn(
        "hidden min-w-0 shrink-0 overflow-x-hidden transition-[width] duration-300 ease-in-out lg:block lg:self-start",
        rightCollapsed ? "lg:w-14" : "lg:w-80",
    )

    // pick the active rail (or none). The LearnShell renders it beside the content
    // and exposes the collapse handle only when a rail is present.
    const rightRail = isModules ? (
        <ModuleSidebar collapsed={rightCollapsed} className={railClass} />
    ) : isPersonalProject ? (
        <MilestoneSidebar collapsed={rightCollapsed} className={railClass} />
    ) : undefined

    return (
        <>
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            <LearnShell rightRail={rightRail}>
                {children}
            </LearnShell>
        </>
    )
}

export default Layout
