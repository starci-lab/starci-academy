import type { DashboardTab } from "@/hooks/zustand/dashboardTab/store"

/** Re-export the canonical tab union (owned by the shared DashboardPage tab store). */
export type { DashboardTab }

/**
 * DashboardPage tabs in display order. "overview" = the cockpit (next action + pace);
 * "explore" = feed/discovery; "courses" = my courses + recommended + livestreams;
 * "community" = league + leaderboard + changelog. i18n labels under `DashboardPage.tabs.*`.
 */
export const DASHBOARD_TABS: ReadonlyArray<DashboardTab> = [
    "overview",
    "explore",
    "courses",
    "community",
]
