"use client"

import React from "react"
import {
    HistoryRail,
} from "./HistoryRail"
import {
    FeedTabs,
} from "./FeedTabs"
import {
    DashboardSidebar,
} from "./DashboardSidebar"

/**
 * GitHub-style logged-in home — pure layout. Three independent, self-fetching
 * panes: the left rail (identity + courses + weekly stats + history, via its own
 * leaf queries), the centre activity feed (cursor-paginated), and the right rail
 * (ad banner + changelog, xl only). Each pane owns its own loading + error state,
 * so the page never hangs on one shared query.
 */
export const Dashboard = () => {
    return (
        <div className="w-ful">
            {/* full-height grid: columns stretch to ≥ viewport so the column
                dividers run unbroken from the very top to the bottom */}
            <div className="grid grid-cols-1 items-stretch lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr_320px]">
                <HistoryRail />
                {/* divider before the feed column (lg+) — full column height */}
                <div className="md:border-l md:border">
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
