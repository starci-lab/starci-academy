"use client"

import React from "react"
import {
    cn,
    ScrollShadow,
} from "@heroui/react"
import type {
    SidebarNavItem,
} from "../types"
import {
    SidebarTab,
} from "@/redux/slices"
import {
    SidebarNavItemRow,
} from "./SidebarNavItemRow"
import type {
    WithClassNames,
} from "@/modules/types"

/**
 * Props for {@link SidebarNavList}.
 */
export interface SidebarNavListProps extends WithClassNames<undefined> {
    /** Nav entries to render. */
    items: Array<SidebarNavItem>
    /** Currently active sidebar tab. */
    selectedTab: SidebarTab
    /** Icon-only mode forwarded to every row (collapsed rail). */
    collapsed?: boolean
}

/**
 * Scrollable list of course-learn sidebar rows.
 *
 * Presentational: maps entries → {@link SidebarNavItemRow}. Each row
 * self-dispatches its tab + navigation; no callback needed here.
 * @param props - entries, active tab, and collapsed state
 */
export const SidebarNavList = ({
    items,
    selectedTab,
    collapsed = false,
    className,
}: SidebarNavListProps) => {
    return (
        <ScrollShadow
            hideScrollBar
            className={cn("min-h-[calc(100vh-4rem)] overflow-y-auto pr-1 p-3", className)}
            size={40}
        >
            {items.map((item) => (
                <SidebarNavItemRow
                    key={item.value}
                    item={item}
                    selected={selectedTab === item.tab}
                    collapsed={collapsed}
                />
            ))}
        </ScrollShadow>
    )
}
