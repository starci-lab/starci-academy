"use client"

import React from "react"
import {
    useQueryActiveAdvertisementSwr,
    useQueryChangelogEntriesSwr,
} from "@/hooks"
import {
    AdBanner,
} from "../AdBanner"
import {
    ChangelogList,
} from "../ChangelogList"

/**
 * GitHub-style dashboard RIGHT rail: an advertisement banner on top (paid slot
 * or the internal "advertise here" house ad) and the system changelog below.
 * Both are global content fetched client-side; each block hides itself when it
 * has nothing to show. `"use client"` for the SWR hooks.
 */
export const DashboardSidebar = () => {
    const { data: ad } = useQueryActiveAdvertisementSwr()
    const { data: changelog } = useQueryChangelogEntriesSwr()

    return (
        <div className="flex flex-col gap-6 p-3">
            {ad ? (
                <AdBanner ad={ad} />
            ) : null}
            <ChangelogList entries={changelog ?? []} />
        </div>
    )
}
