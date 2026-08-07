"use client"

import React from "react"
import {
    FeedTabs,
} from "../FeedTabs"
import {
    WhoToFollow,
} from "../WhoToFollow"
/** Props for {@link ExploreTab}. */
export type ExploreTabProps = Record<string, never>
/**
 * DashboardPage "Explore" tab — discovery + social: the for-you / following activity
 * feed (with trending) on top, then "who to follow" to grow the graph. Each child
 * self-fetches; the feed owns its own pagination + states.
 * @param props - optional root class name (placement only)
 */
export const ExploreTab = () => {
    return (
        <div className={"flex flex-col gap-6"}>
            <FeedTabs />
            <WhoToFollow />
        </div>
    )
}
