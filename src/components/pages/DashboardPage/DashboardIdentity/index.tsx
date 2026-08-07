"use client"

import React from "react"
import {
    ProfileMenuCard,
} from "./ProfileMenuCard"
import {
    QuickActions,
} from "../QuickActions"
import {
    IdentityStats,
} from "./IdentityStats"
/** Props for {@link DashboardIdentity}. */
export type DashboardIdentityProps = Record<string, never>
/**
 * DashboardPage LEFT column — the viewer's own identity + standing, bare (no card),
 * stable across every tab (mirrors the profile page's identity sidebar). Stacks:
 * the profile anchor (avatar + name + link), a compact standing chip row (streak ·
 * AI credit · reward), then the quick-action shortcuts. Each child self-fetches.
 * @param props - optional className for the root column.
 */
export const DashboardIdentity = () => {
    return (
        <div className={"flex flex-col gap-4"}>
            {/* profile anchor — avatar + name + rank, links to the public profile */}
            <ProfileMenuCard />
            {/* glanceable standing that persists across tabs */}
            <IdentityStats />
            {/* one-tap shortcuts to the most-reached surfaces */}
            <QuickActions />
        </div>
    )
}
