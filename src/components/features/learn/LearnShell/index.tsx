"use client"

import React, { PropsWithChildren, ReactNode } from "react"
import { cn } from "@heroui/react"
import { LearnSidebar } from "./LearnSidebar"
import { LearnMobileBar } from "./LearnMobileBar"
import { LearnPanelToggles } from "./LearnPanelToggles"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link LearnShell}. */
export interface LearnShellProps extends WithClassNames<undefined>, PropsWithChildren {
    /**
     * The route's persistent left content rail (the course content-map), rendered
     * by the route layout between the course-nav icon rail and the content. Owns
     * its own width + sticky behavior; always visible (no collapse).
     */
    leftRail?: ReactNode
    /**
     * The route's right rail (on-this-page outline / milestone rail), rendered by
     * the route layout and slotted in here. When omitted the content spans full
     * width.
     */
    rightRail?: ReactNode
    /**
     * Whether the right rail exposes the desktop collapse handle + divider (used
     * by the redux-driven milestone rail). On-this-page rails self-size, so they
     * leave this off. Defaults to `false`.
     */
    showRightCollapse?: boolean
}

/**
 * Shell for the course-learn pages: the left course-nav rail, the mobile toolbar,
 * the desktop right-rail collapse handle, and the content column. Composes the
 * left rail ({@link LearnSidebar}) as a self-sizing, collapse-in-place flex
 * sibling (the {@link import("@/components/blocks").CollapsibleSidebar} block owns
 * its own width animation + persistence) beside the content. The route layout
 * supplies its own right rail (module outline on lesson routes, milestone rail on
 * personal-project) through {@link LearnShellProps.rightRail}; that rail keeps its
 * existing redux-driven `rightCollapsed` behavior, exposed via the right collapse
 * handle in {@link LearnPanelToggles}.
 *
 * @param props - {@link LearnShellProps}
 */
export const LearnShell = ({
    children,
    leftRail,
    rightRail,
    showRightCollapse = false,
    className,
}: LearnShellProps) => {
    return (
        // single column on mobile/tablet; a horizontal flow from lg up so the
        // content-map rail (left) and the optional right rail sit beside content
        <div className={cn("flex w-full flex-col items-start lg:flex-row", className)}>
            {/* desktop course-nav icon rail — sticks under the 4rem navbar, viewport-tall;
                the block owns its own scroll, divider, width animation + collapse. */}
            <aside className="hidden shrink-0 lg:sticky lg:top-16 lg:block lg:h-[calc(100dvh-4rem)]">
                <LearnSidebar />
            </aside>
            {/* persistent left content-map rail (course content tree) supplied by the layout */}
            {leftRail}
            {/* content column; only anchors the collapse handle + right border for the
                redux-driven (milestone) rail that opts into it */}
            <div className={cn("min-h-0 min-w-0 flex-1", showRightCollapse && "relative lg:border-r")}>
                {showRightCollapse && <LearnPanelToggles />}
                {/* mobile-only toolbar exposing both sidebars as drawers */}
                <LearnMobileBar />
                {children}
            </div>
            {/* right rail supplied by the layout (on-this-page outline / milestone rail) */}
            {rightRail}
        </div>
    )
}

export default LearnShell
