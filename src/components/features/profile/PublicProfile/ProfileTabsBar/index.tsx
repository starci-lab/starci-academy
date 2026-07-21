"use client"

import React, { useCallback, useMemo } from "react"
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
import type { SectionVisibility } from "@/modules/types/entities/user"
import { PROFILE_TABS } from "../types"
import type { ProfileTab } from "../types"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { pathConfig } from "@/resources/path"

/**
 * The section tabs gated by `sectionVisibility` (Overview + CV are never gated —
 * Overview always shows, CV keeps its own `hasPublicCv` gate).
 */
const SECTION_TABS: ReadonlyArray<keyof SectionVisibility> = [
    "projects",
    "challenges",
    "skills",
    "activity",
]

/** Whether a tab is one of the visibility-gated section tabs. */
const isSectionTab = (tabId: ProfileTab): tabId is keyof SectionVisibility =>
    (SECTION_TABS as ReadonlyArray<ProfileTab>).includes(tabId)

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
    /** Whether the viewer is the profile owner — shows the "CV" tab even without a public CV. */
    isSelf: boolean
    /** Whether the viewed user has a PUBLIC CV — shows the "CV" tab to visitors too. */
    hasPublicCv: boolean
    /**
     * The viewed user's per-section visibility (all default true). A section tab is
     * withheld from VISITORS when its flag is false; the owner ({@link isSelf}) always
     * sees every tab (with a "· ẩn" marker on hidden ones). Absent = all visible.
     */
    sectionVisibility?: SectionVisibility
}

/**
 * Build the href for a profile tab. Every tab nests under `/profile/<username>`,
 * INCLUDING "cv" — the public, read-only CV view (`/profile/<username>/cv`). The
 * owner's private editor stays reachable from the "Chỉnh sửa CV" button inside
 * that view (the always-own `/profile/cv` gallery).
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
        return profile.cv().build()
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
export const ProfileTabsBar = ({ username, isSelf, hasPublicCv, sectionVisibility, className }: ProfileTabsBarProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    // Whether a SECTION tab is hidden for the current viewer: false flag + visitor.
    // The owner (isSelf) always sees it (just marked "· ẩn"); an absent flag = visible.
    const isSectionHidden = useCallback(
        (tabId: ProfileTab): boolean =>
            !isSelf && isSectionTab(tabId) && sectionVisibility?.[tabId] === false,
        [isSelf, sectionVisibility],
    )
    // Tab gating, combined:
    //  • "cv" shows for the owner (always) or when the viewed user has a PUBLIC CV.
    //  • a section tab (projects/challenges/skills/activity) is withheld from VISITORS
    //    when its sectionVisibility flag is false. Overview is never gated.
    const visibleTabs = useMemo(
        () => PROFILE_TABS.filter((tabId) => {
            if (tabId === "cv") {
                return isSelf || hasPublicCv
            }
            return !isSectionHidden(tabId)
        }),
        [isSelf, hasPublicCv, isSectionHidden],
    )

    // active tab = the tab whose path is a PREFIX of the current pathname (so a
    // nested sub-route like `/challenges/<courseId>/<id>` still lights up its tab).
    // "overview" is the bare `/profile/<username>` path — a prefix of everything —
    // so it's only the FALLBACK when no deeper tab matches.
    const activeTab = useMemo<ProfileTab>(() => {
        const match = visibleTabs
            .filter((tabId) => tabId !== "overview")
            .find((tabId) => {
                const href = tabHref(locale, username, tabId)
                return pathname === href || pathname.startsWith(`${href}/`)
            })
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
                                            <span className="hidden @app-md:inline">
                                                {t(`publicProfile.tabs.${tabId}`)}
                                                {/* owner-only marker on a section hidden from
                                                    visitors (visitors never see the tab at all) */}
                                                {isSelf && isSectionTab(tabId) && sectionVisibility?.[tabId] === false ? (
                                                    <span className="ml-1 text-foreground-500">
                                                        {t("publicProfile.tabHidden")}
                                                    </span>
                                                ) : null}
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
