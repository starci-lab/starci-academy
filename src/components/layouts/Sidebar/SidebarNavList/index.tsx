"use client"

import React from "react"
import {
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

/**
 * Props for {@link SidebarNavList}.
 */
export interface SidebarNavListProps {
    /** Nav entries to render. */
    items: Array<SidebarNavItem>
    /** Currently active sidebar tab. */
    selectedTab: SidebarTab
    /** Fired with the chosen entry when a row is pressed. */
    onSelect: (item: SidebarNavItem) => void
}

/**
 * Scrollable list of course-learn sidebar rows.
 *
 * Presentational: maps entries → {@link SidebarNavItemRow}, no logic.
 * @param props - entries, active tab, and select callback
 */
export const SidebarNavList = ({
    items,
    selectedTab,
    onSelect,
}: SidebarNavListProps) => {
    return (
        <ScrollShadow
            hideScrollBar
            className="min-h-[calc(100vh-4rem)] overflow-y-auto pr-1 p-3"
            size={40}
        >
            {items.map((item) => (
                <SidebarNavItemRow
                    key={item.value}
                    item={item}
                    selected={selectedTab === item.tab}
                    onSelect={onSelect}
                />
            ))}
        </ScrollShadow>
    )
}
