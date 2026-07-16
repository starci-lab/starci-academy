"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    LeagueCard,
} from "../LeagueCard"
import {
    TopLearners,
} from "../TopLearners"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/**
 * Dashboard "Community" tab — competition + standing among people: the weekly
 * league cohort, and the platform's top learners with the viewer's own global
 * standing merged into its header (both read the same global-leaderboard query, so
 * they're one card — `TopLearners`; thầy 2026-07-17). Each child self-fetches +
 * self-hides when empty. The product changelog ("Có gì mới") now lives on the
 * Overview tab, not here — Community is people/competition, not platform news.
 * @param props - optional root class name (placement only)
 */
export type CommunityTabProps = WithClassNames<undefined>

export const CommunityTab = ({
    className,
}: CommunityTabProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <LeagueCard framed />
            <TopLearners />
        </div>
    )
}
