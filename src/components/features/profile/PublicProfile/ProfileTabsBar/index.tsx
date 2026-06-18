"use client"

import React from "react"
import { cn, Tabs } from "@heroui/react"
import {
    HouseIcon,
    PuzzlePieceIcon,
    RocketIcon,
    CodeIcon,
    PulseIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { ExtendedTabs } from "@/components/blocks"
import { useProfileTabStore } from "@/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PROFILE_TABS } from "../types"
import type { ProfileTab } from "../types"

/** Leading icon shown on each profile tab, keyed by tab id. */
const TAB_ICONS: Record<ProfileTab, typeof HouseIcon> = {
    overview: HouseIcon,
    challenges: PuzzlePieceIcon,
    projects: RocketIcon,
    skills: CodeIcon,
    activity: PulseIcon,
}

/** Props for {@link ProfileTabsBar}. */
export type ProfileTabsBarProps = WithClassNames<undefined>

/**
 * Full-width tab strip that sits directly under the app navbar, only on the
 * profile page (the page renders it; the global navbar stays untouched). Uses the
 * native HeroUI secondary Tabs (foreground text on the selected tab + an accent
 * underline indicator) so no custom styling leaks in. Sticky under the 64px
 * navbar so the primary nav stays reachable while the content column scrolls; the
 * open tab lives in the shared store, so panels elsewhere stay in sync.
 *
 * @param props - optional root class name (placement only)
 */
export const ProfileTabsBar = ({ className }: ProfileTabsBarProps) => {
    const t = useTranslations()
    const { tab, setTab } = useProfileTabStore()

    return (
        <div className={cn("sticky top-16 z-40 w-full border-b border-separator bg-background", className)}>
            <div className="w-full px-6">
                <ExtendedTabs
                    selectedKey={tab}
                    onSelectionChange={(key) => setTab(key as ProfileTab)}
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("publicProfile.title")}>
                            {PROFILE_TABS.map((tabId) => {
                                const TabIcon = TAB_ICONS[tabId]
                                return (
                                    <Tabs.Tab
                                        key={tabId}
                                        id={tabId}
                                        aria-controls={`profile-panel-${tabId}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <TabIcon
                                                aria-hidden
                                                focusable="false"
                                                className="size-5 shrink-0"
                                            />
                                            {/* mobile = icon only; label shows from md up */}
                                            <span className="hidden md:inline">
                                                {t(`publicProfile.tabs.${tabId}`)}
                                            </span>
                                        </span>
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                )
                            })}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </ExtendedTabs>
            </div>
        </div>
    )
}
