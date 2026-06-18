"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    CollapsibleSidebar,
    SidebarNavGroup,
    SidebarNavItem,
} from "@/components/blocks"
import {
    useSidebarNavItems,
} from "../hooks/useSidebarNavItems"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** localStorage key persisting the learn course-nav collapsed flag. */
const SIDEBAR_STORAGE_KEY = "starci.learn.sidebar.collapsed"

/** Props for {@link LearnSidebar}. */
export type LearnSidebarProps = WithClassNames<undefined>

/**
 * Course-learn left navigation rail (desktop).
 *
 * Container: pulls the shared nav entries from {@link useSidebarNavItems} and
 * composes the {@link CollapsibleSidebar} block — which owns the collapse-in-place
 * animation, the toggle, the divider, and persisting the collapsed flag. Each row
 * is a {@link SidebarNavItem} that self-dispatches its tab + navigation through the
 * shared select handler. Hidden below `lg` (mobile uses the drawer in
 * {@link import("../LearnMobileBar").LearnMobileBar}). `"use client"` for the hooks.
 *
 * @param props - {@link LearnSidebarProps}
 */
export const LearnSidebar = ({ className }: LearnSidebarProps) => {
    const t = useTranslations()
    // shared entries + active tab (also used by the mobile drawer)
    const { items, selectedTab, onSelect } = useSidebarNavItems()
    return (
        <CollapsibleSidebar
            title={t("nav.courseMenu")}
            collapseLabel={t("nav.collapseLeftRail")}
            expandLabel={t("nav.expandLeftRail")}
            storageKey={SIDEBAR_STORAGE_KEY}
            className={className}
        >
            <SidebarNavGroup>
                {items.map((item) => (
                    <SidebarNavItem
                        key={item.value}
                        icon={<item.icon className="size-5 shrink-0" />}
                        label={item.label}
                        isActive={selectedTab === item.tab}
                        onPress={() => onSelect(item)}
                    />
                ))}
            </SidebarNavGroup>
        </CollapsibleSidebar>
    )
}
