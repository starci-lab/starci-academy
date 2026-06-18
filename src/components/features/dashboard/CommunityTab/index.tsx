"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    LeagueCard,
} from "../LeagueCard"
import {
    ChangelogList,
} from "../ChangelogList"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/**
 * Dashboard "Community" tab — competitive + platform news: the weekly league
 * standing and the system changelog. Each child self-fetches + self-hides when
 * empty. (Global leaderboard is a candidate addition once a FE query exists.)
 * @param props - optional root class name (placement only)
 */
export type CommunityTabProps = WithClassNames<undefined>

export const CommunityTab = ({
    className,
}: CommunityTabProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <LeagueCard />
            <ChangelogList />
        </div>
    )
}
