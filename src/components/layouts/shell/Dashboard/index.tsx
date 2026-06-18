"use client"

import React from "react"
import {
    Separator,
    cn,
} from "@heroui/react"
import {
    HistoryRail,
} from "./HistoryRail"
import {
    ContinueLearning,
} from "./ContinueLearning"
import {
    NearCompletion,
} from "./NearCompletion"
import {
    StreakStrip,
} from "./StreakStrip"
import {
    DailyGoal,
} from "./DailyGoal"
import {
    KpiCard,
} from "./KpiCard"
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
 * panes: the left rail (identity + courses, via its own leaf query), the centre
 * column (a "continue learning" hero, the streak strip + today's goal, then the
 * cursor-paginated feed) and the right rail (the viewer's profile card, weekly
 * league, ad banner + changelog). Each pane owns its own loading + error state, so
 * the page never hangs on one shared query.
 *
 * Responsive order: on mobile the centre column leads (the next action first),
 * then the history rail, then the right-rail content — instead of burying the feed
 * under a full-height identity rail. The left rail returns at `lg`, the right rail
 * at `xl`.
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
                {/* left rail — below the centre on mobile, first column at lg+.
                    min-w-0 lets the grid track shrink instead of forcing overflow */}
                <div className="order-2 min-w-0 lg:order-1">
                    <HistoryRail />
                </div>
                {/* centre column — leads on mobile (the next action first). min-w-0
                    so long feed titles can't widen the 1fr track past the viewport */}
                <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:border-l lg:border">
                    {/* "pick up where you left off" hero — the prime next-action slot */}
                    <ContinueLearning />
                    {/* "almost there" nudge for the course closest to finishing */}
                    <NearCompletion />
                    {/* streak strip (last 7 days + current/longest streak) */}
                    <StreakStrip />
                    {/* today's goal — turns the streak into an active prompt */}
                    <DailyGoal />
                    <Separator/>
                    {/* weekly KPI — composite + per-metric breakdown + link to the /kpi editor */}
                    <KpiCard  />
                    {/* divider closing the KPI block off from the feed below */}
                    <Separator />
                    <FeedTabs />
                </div>
                {/* right rail — profile + league + ad + changelog. Last on mobile
                    (stacked), a full-width band under the two columns at lg (no
                    dedicated column there), and its own right column at xl */}
                <div className="order-3 min-w-0 lg:col-span-2 lg:border-t xl:col-span-1 xl:border-l xl:border">
                    <DashboardSidebar />
                </div>
            </div>
        </div>
    )
}
