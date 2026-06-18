"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    ChangelogList,
} from "../ChangelogList"
import {
    LeagueCard,
} from "../LeagueCard"
import {
    AiQuotaCard,
} from "../AiQuotaCard"
import {
    UpcomingLivestreamCard,
} from "../UpcomingLivestreamCard"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link DashboardSidebar}. */
export type DashboardSidebarProps = WithClassNames<undefined>

/**
 * GitHub-style dashboard RIGHT rail: the weekly league standing on top, then an
 * advertisement banner (paid slot or the internal "advertise here" house ad) and
 * the system changelog. The viewer's own identity lives in the left rail header
 * (not repeated here). Each block hides itself when it has nothing to show.
 * `"use client"` for the SWR hooks.
 * @param props - optional className for the root element
 */
export const DashboardSidebar = ({
    className,
}: DashboardSidebarProps = {}) => {
    return (
        // vertical column on mobile + xl (its own rail); a horizontal card band at
        // lg, where it sits full-width under the two columns instead of vanishing
        <div className={cn("flex flex-col gap-6 p-3 lg:grid lg:grid-cols-3 lg:items-start xl:flex xl:flex-col", className)}>
            {/* weekly league standing — moved out of the centre column (no nested scroll) */}
            <LeagueCard />
            {/* free AI-lane quota for the current 5h window */}
            <AiQuotaCard />
            {/* next scheduled live sessions across enrolled courses */}
            <UpcomingLivestreamCard />
            <ChangelogList />
        </div>
    )
}
