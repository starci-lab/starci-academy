"use client"

import React, { useMemo } from "react"
import { cn, Tabs } from "@heroui/react"
import {
    HouseIcon,
    PuzzlePieceIcon,
    RocketIcon,
    CodeIcon,
    FileTextIcon,
    PulseIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PROFILE_TABS } from "../types"
import type { ProfileTab } from "../types"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { useProfileTabStore } from "@/hooks/zustand/profileTab/store"

/** Leading icon shown on each profile tab, keyed by tab id. */
const TAB_ICONS: Record<ProfileTab, typeof HouseIcon> = {
    overview: HouseIcon,
    challenges: PuzzlePieceIcon,
    projects: RocketIcon,
    skills: CodeIcon,
    cv: FileTextIcon,
    activity: PulseIcon,
}

/** Props for {@link ProfileTabsBar}. */
export interface ProfileTabsBarProps extends WithClassNames<undefined> {
    /** Whether the viewer is the profile owner — withholds the owner-only "CV" tab otherwise. */
    isSelf: boolean
}

/**
 * Full-width tab strip for the profile page. The page registers it as the global
 * Navbar's bottom layer ({@link useRegisterNavbarBottomLayer}); the Navbar renders
 * it flush under its primary row and owns the single bottom border + sticky, so
 * this strip carries no border / sticky / bg of its own. Uses the native HeroUI
 * secondary Tabs (foreground text on the selected tab + an accent underline
 * indicator). The open tab lives in the shared store, so panels elsewhere stay in
 * sync.
 *
 * @param props - {@link ProfileTabsBarProps}
 */
export const ProfileTabsBar = ({ isSelf, className }: ProfileTabsBarProps) => {
    const t = useTranslations()
    const { tab, setTab } = useProfileTabStore()
    // "cv" is the owner's résumé tool — withheld from visitors viewing someone else's profile.
    const visibleTabs = useMemo(
        () => PROFILE_TABS.filter((tabId) => tabId !== "cv" || isSelf),
        [isSelf],
    )

    return (
        // Rendered as the Navbar's bottom layer — no border / sticky / bg of its
        // own; the Navbar root owns the single bottom border and the sticky.
        <div className={cn("w-full", className)}>
            <div className="w-full px-6">
                <ExtendedTabs
                    selectedKey={tab}
                    onSelectionChange={(key) => setTab(key as ProfileTab)}
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("publicProfile.title")}>
                            {visibleTabs.map((tabId) => {
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
