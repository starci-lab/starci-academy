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
import { useTranslations, useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PROFILE_TABS } from "../types"
import type { ProfileTab } from "../types"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { pathConfig } from "@/resources/path"

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
    /** The viewed user's canonical username (drives every tab's href). */
    username: string
    /** Whether the viewer is the profile owner — withholds the owner-only "CV" tab otherwise. */
    isSelf: boolean
}

/**
 * Build the href for a profile tab. Every tab nests under `/profile/<username>`
 * EXCEPT "cv" — that stays on the pre-existing, always-own `/profile/cv` CV
 * gallery route (never `/profile/<username>/cv`), so it takes no username.
 */
const tabHref = (locale: string, username: string, tabId: ProfileTab): string => {
    const profile = pathConfig().locale(locale).profile(username)
    switch (tabId) {
    case "overview":
        return profile.overview().build()
    case "projects":
        return profile.projects().build()
    case "challenges":
        return profile.challenges().build()
    case "skills":
        return profile.skills().build()
    case "activity":
        return profile.activity().build()
    case "cv":
        return pathConfig().locale(locale).profile().cv().build()
    }
}

/**
 * Full-width tab strip for the profile page. The page registers it as the global
 * Navbar's bottom layer ({@link useRegisterNavbarBottomLayer}); the Navbar renders
 * it flush under its primary row and owns the single bottom border + sticky, so
 * this strip carries no border / sticky / bg of its own. Uses the native HeroUI
 * secondary Tabs (foreground text on the selected tab + an accent underline
 * indicator).
 *
 * Each tab is a real nested route (`/profile/<username>/<tab>`, bare = overview) —
 * the active tab is derived from the URL pathname and switching a tab
 * `router.push`es its href, mirroring the `pathname === href` + `router.push`
 * pattern `SettingsLayout` already uses for its own route-derived nav. No store,
 * no `?tab=` query param: the URL alone is the source of truth, so the open tab
 * is shareable / bookmarkable / back-forward friendly for free.
 *
 * @param props - {@link ProfileTabsBarProps}
 */
export const ProfileTabsBar = ({ username, isSelf, className }: ProfileTabsBarProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    // "cv" is the owner's résumé tool — withheld from visitors viewing someone else's profile.
    const visibleTabs = useMemo(
        () => PROFILE_TABS.filter((tabId) => tabId !== "cv" || isSelf),
        [isSelf],
    )

    // active tab = the one whose href matches the current pathname; falls back to
    // "overview" (bare `/profile/<username>`, no extra segment).
    const activeTab = useMemo<ProfileTab>(() => {
        const match = visibleTabs.find((tabId) => pathname === tabHref(locale, username, tabId))
        return match ?? "overview"
    }, [visibleTabs, pathname, locale, username])

    return (
        // Rendered as the Navbar's bottom layer — no border / sticky / bg of its
        // own; the Navbar root owns the single bottom border and the sticky.
        <div className={cn("w-full", className)}>
            <div className="w-full px-6">
                <ExtendedTabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => router.push(tabHref(locale, username, key as ProfileTab))}
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
