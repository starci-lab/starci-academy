"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import {
    SidebarNavList,
} from "./SidebarNavList"
import {
    useSidebarNavItems,
} from "./useSidebarNavItems"

/**
 * Course learn sidebar (desktop only).
 *
 * Container: pulls the shared nav entries from {@link useSidebarNavItems} and
 * renders the presentational {@link SidebarNavList}. Hidden below `lg`; on
 * desktop it collapses to an icon-only rail when `sidebar.leftCollapsed` is set.
 * `"use client"` for the underlying hooks + navigation.
 */
export const Sidebar = () => {
    // shared entries + select handler (also used by the mobile drawer)
    const { items, selectedTab, onSelect } = useSidebarNavItems()
    // when collapsed the rail shrinks (grid column) and shows icons only
    const leftCollapsed = useAppSelector((state) => state.sidebar.leftCollapsed)
    return (
        // sticky rail under the navbar; only visible from the lg breakpoint up. overflow-hidden
        // clips labels while the column animates down to the icon-only width.
        <div className="sticky top-16 hidden self-start overflow-hidden border-r lg:block">
            <SidebarNavList
                items={items}
                selectedTab={selectedTab}
                collapsed={leftCollapsed}
                onSelect={onSelect}
            />
        </div>
    )
}
