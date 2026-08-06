"use client"

import React from "react"
import { cn, Tabs } from "@heroui/react"
import {
    HouseIcon,
    CompassIcon,
    GraduationCapIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { DASHBOARD_TABS } from "../types"
import type { DashboardTab } from "../types"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { useDashboardTabStore } from "@/hooks/zustand/dashboardTab/store"
import { Box } from "@/components/frames/Box"
import { StackH } from "@/components/frames/Stack"

/** Leading icon shown on each DashboardPage tab, keyed by tab id. */
const TAB_ICONS: Record<DashboardTab, typeof HouseIcon> = {
    overview: HouseIcon,
    explore: CompassIcon,
    courses: GraduationCapIcon,
    community: TrophyIcon,
}

/** Props for {@link DashboardTabsBar}. */
export type DashboardTabsBarProps = WithClassNames<undefined>

/**
 * Full-width DashboardPage tab strip (mirror of the profile page's `ProfileTabsBar`).
 * Registered as the global Navbar's bottom layer ({@link useRegisterNavbarBottomLayer}),
 * so the Navbar renders it flush under its primary row and owns the single bottom
 * border + sticky — this strip carries none of its own. Native HeroUI secondary
 * Tabs (foreground text + accent underline); the open tab lives in the shared
 * store so panels stay in sync. Mobile = icon only; label shows from `md` up.
 * @param props - optional root class name (placement only)
 */
export const DashboardTabsBar = ({ className }: DashboardTabsBarProps) => {
    const t = useTranslations()
    const { tab, setTab } = useDashboardTabStore()

    return (
        <div className={cn("w-full", className)}>
            {/* page-pad owns the horizontal inset; py stays 0 so the strip hugs the navbar */}
            <Box principle="page-pad" className="w-full px-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <ExtendedTabs
                    selectedKey={tab}
                    onSelectionChange={(key) => setTab(key as DashboardTab)}
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("DashboardPage.title")}>
                            {DASHBOARD_TABS.map((tabId) => {
                                const TabIcon = TAB_ICONS[tabId]
                                return (
                                    <Tabs.Tab
                                        key={tabId}
                                        id={tabId}
                                        aria-controls={`DashboardPage-panel-${tabId}`}
                                    >
                                        <StackH
                                            gap={2}
                                            principle="icon-text"
                                            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                            align="center"
                                            items={[
                                                () => (
                                                    <TabIcon
                                                        aria-hidden
                                                        focusable="false"
                                                        className="size-5 shrink-0"
                                                    />
                                                ),
                                                () => (
                                                    <span className="hidden @app-md:inline">
                                                        {t(`DashboardPage.tabs.${tabId}`)}
                                                    </span>
                                                ),
                                            ]}
                                        />
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                )
                            })}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </ExtendedTabs>
            </Box>
        </div>
    )
}
