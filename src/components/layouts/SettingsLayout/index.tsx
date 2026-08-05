"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    usePathname,
    useRouter,
} from "next/navigation"
import { getSettingsGroups } from "@/components/features/profile/Settings/nav"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { toBlockSettingsGroups } from "./map"
import { _SettingsLayout } from "./component"

/**
 * `localStorage` key persisting the settings sidebar collapsed flag — the SAME key
 * the retiring `src/components/features/profile/Settings/SettingsLayout` uses, so a
 * learner's collapse choice survives the swap to this storybook-driven shell.
 */
const SIDEBAR_STORAGE_KEY = "starci.settings.sidebar.collapsed"

/** Props for {@link SettingsLayout}. */
export interface SettingsLayoutProps {
    /**
     * The active settings page for the current route. A Next.js route-group
     * `layout.tsx` hands this in as an already-rendered element (framework
     * shape) — wrapped below into the buildable slot `_SettingsLayout` expects.
     */
    children: React.ReactNode
}

/**
 * Settings shell — the CONNECTED half of `SettingsLayout`: resolves the grouped
 * destinations (`getSettingsGroups`, narrowed to the ported block's closed
 * vocabulary via {@link toBlockSettingsGroups}), the active route, navigation, and
 * every label, then hands fully-resolved data to the presentational
 * {@link _SettingsLayout}. Mirrors the wiring of the real
 * `src/components/features/profile/Settings/SettingsLayout`.
 *
 * @param props - {@link SettingsLayoutProps}
 */
export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const groups = toBlockSettingsGroups(getSettingsGroups(locale))

    // Buildable slot — `Container`'s `body` mounts an uncalled component (COMPOSITE-8),
    // never a handed-in element; this wraps the router-supplied `children` once so it
    // fits that shape without pushing a `ReactNode` prop down into the presentational tree.
    const BodySlot: ComponentTypeWithSkeleton = () => <>{children}</>

    return (
        <_SettingsLayout
            groups={groups}
            activeHref={pathname}
            onNavigate={(href) => router.push(href)}
            title={t("profileSettings.title")}
            collapseLabel={t("profileSettings.collapseMenu")}
            expandLabel={t("profileSettings.expandMenu")}
            storageKey={SIDEBAR_STORAGE_KEY}
            body={BodySlot}
        />
    )
}
