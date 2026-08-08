"use client"

import React, {
    useMemo,
} from "react"
import {
    useDashboardTabUrlSync,
} from "@/hooks/useDashboardTabUrlSync"
import {
    DashboardTabsBar,
} from "./DashboardTabsBar"
import {
    DashboardIdentity,
} from "./DashboardIdentity"
import {
    OverviewTab,
} from "./OverviewTab"
import {
    ExploreTab,
} from "./ExploreTab"
import {
    CoursesTab,
} from "./CoursesTab"
import {
    CommunityTab,
} from "./CommunityTab"
import { useDashboardTabStore } from "@/hooks/zustand/dashboardTab/store"
import { useRegisterNavbarBottomLayer } from "@/hooks/zustand/navbarBottomLayer/store"
import { Container } from "@/components/frames/Container"
import { RailShell } from "@/components/frames/RailShell"

/** Props for {@link DashboardPage}. */
export type DashboardPageProps = Record<string, never>
/**
 * Logged-in home — rebuilt on the proven PROFILE page layout: a tab strip rendered
 * as the navbar's bottom layer, then a centered 2-column body — left = the viewer's identity +
 * standing (bare, stable across tabs), right = the selected tab's content. Tabs:
 * Overview (cockpit) · Explore (feed) · Courses · Community. The open tab lives in
 * the shared store and mirrors `?tab=` (shareable); only the active panel mounts,
 * so each tab's leaf queries fetch lazily. Mobile stacks the identity then the
 * content (no rail, no drawer). `"use client"` for the tab store + URL sync.
 * @param props - optional className for the root element
 */
export const DashboardPage = () => {
    useDashboardTabUrlSync()
    const tab = useDashboardTabStore((state) => state.tab)
    // the DashboardPage tab strip renders as the global Navbar's bottom layer
    const tabsNode = useMemo(() => <DashboardTabsBar />, [])
    useRegisterNavbarBottomLayer(tabsNode)

    // RailShell owns the identity<->content layout seam (stack -> row at md, gap-8).
    const rail = () => <DashboardIdentity />
    const body = () => {
        if (tab === "overview") {
            return (
                <div
                    id="DashboardPage-panel-overview"
                    role="tabpanel"
                    aria-labelledby="overview"
                >
                    <OverviewTab />
                </div>
            )
        }
        if (tab === "explore") {
            return (
                <div
                    id="DashboardPage-panel-explore"
                    role="tabpanel"
                    aria-labelledby="explore"
                >
                    <ExploreTab />
                </div>
            )
        }
        if (tab === "courses") {
            return (
                <div
                    id="DashboardPage-panel-courses"
                    role="tabpanel"
                    aria-labelledby="courses"
                >
                    <CoursesTab />
                </div>
            )
        }
        if (tab === "community") {
            return (
                <div
                    id="DashboardPage-panel-community"
                    role="tabpanel"
                    aria-labelledby="community"
                >
                    <CommunityTab />
                </div>
            )
        }
        return null
    }

    return (
        <div className={"flex w-full flex-col"}>
            {/* tab strip is registered as the Navbar bottom layer above (not here) */}
            <Container
                size="xl"
                padding={6}
                identity={{ tier: "block", component: "DashboardPage" }}
                body={() => (
                    <RailShell
                        at="md"
                        principle="layout-split"
                        explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                        rail={rail}
                        body={body}
                    />
                )}
            />
        </div>
    )
}
