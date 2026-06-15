"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    HistoryRail,
} from "./HistoryRail"
import {
    ContributionHeatmap,
} from "./ContributionHeatmap"
import {
    StreakStrip,
} from "./StreakStrip"
import {
    League,
} from "./League"
import {
    FeedTabs,
} from "./FeedTabs"
import {
    DashboardSidebar,
} from "./DashboardSidebar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link Dashboard}. */
export type DashboardProps = WithClassNames<undefined>

/**
 * GitHub-style logged-in home — pure layout. Three independent, self-fetching
 * panes: the left rail (identity + courses + weekly stats + history, via its own
 * leaf queries), the centre activity feed (cursor-paginated), and the right rail
 * (ad banner + changelog, xl only). Each pane owns its own loading + error state,
 * so the page never hangs on one shared query.
 * @param props - optional className for the root element
 */
export const Dashboard = ({
    className,
}: DashboardProps) => {
    return (
        <div className={cn("w-full", className)}>
            {/* full-height grid: columns stretch to ≥ viewport so the column
                dividers run unbroken from the very top to the bottom */}
            <div className="grid grid-cols-1 items-stretch lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr_320px]">
                <HistoryRail />
                {/* divider before the feed column (lg+) — full column height */}
                <div className="flex flex-col md:border-l md:border">
                    {/* GitHub-style learning-activity heatmap on top of the feed */}
                    <ContributionHeatmap />
                    {/* streak strip (last 7 days + current/longest) under the heatmap */}
                    <StreakStrip />
                    {/* Duolingo-style weekly-league standing */}
                    <League />
                    <FeedTabs />
                </div>
                {/* right rail — ad banner + changelog (xl only), divider before it */}
                <div className="hidden md:block md:border-l md:border">
                    <DashboardSidebar />
                </div>
            </div>
        </div>
    )
}
