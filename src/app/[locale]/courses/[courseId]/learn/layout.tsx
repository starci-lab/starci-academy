"use client"
import React, { PropsWithChildren } from "react"
import { cn } from "@heroui/react"
import { Sidebar } from "@/components/layouts/Sidebar"
import { LearnMobileBar } from "@/components/layouts/LearnMobileBar"
import { GithubLinkGate } from "@/components/layouts/GithubLinkGate"
import { useAppSelector } from "@/redux"

export const Layout = ({ children }: PropsWithChildren) => {
    // left rail width is driven by the collapse flag: full (16rem) vs icon-only (4rem)
    const leftCollapsed = useAppSelector((state) => state.sidebar.leftCollapsed)
    return (
        // single column on mobile/tablet; explicit 2-track grid from lg up so the
        // left rail can shrink to an icon-only width without disturbing the content track
        <div
            className={cn(
                "grid grid-cols-1 items-start transition-[grid-template-columns] duration-300 ease-in-out",
                leftCollapsed ? "lg:grid-cols-[4rem_1fr]" : "lg:grid-cols-[16rem_1fr]",
            )}
        >
            {/* soft prompt: nudge learners with no linked GitHub to connect once per session */}
            <GithubLinkGate />
            {/* desktop course-nav rail (self-hides below lg, collapses to icons on demand) */}
            <Sidebar />
            <div className="min-h-0 min-w-0">
                {/* mobile-only toolbar exposing both sidebars as drawers */}
                <LearnMobileBar />
                {children}
            </div>
        </div>
    )
}

export default Layout
