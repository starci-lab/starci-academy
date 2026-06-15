"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link DashboardSidebar}. */
export type DashboardSidebarProps = WithClassNames<undefined>

/**
 * GitHub-style dashboard RIGHT rail: an advertisement banner on top (paid slot
 * or the internal "advertise here" house ad) and the system changelog below.
 * Both are global content fetched client-side; each block hides itself when it
 * has nothing to show. `"use client"` for the SWR hooks.
 * @param props - optional className for the root element
 */
export const DashboardSidebar = ({
    className,
}: DashboardSidebarProps = {}) => {
    const { data: ad } = useQueryActiveAdvertisementSwr()
    const { data: changelog } = useQueryChangelogEntriesSwr()

    return (
        <div className={cn("flex flex-col gap-6 p-3", className)}>
            {ad ? (
                <AdBanner ad={ad} />
            ) : null}
            <ChangelogList entries={changelog ?? []} />
        </div>
    )
}
