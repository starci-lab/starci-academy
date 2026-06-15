"use client"

import React, {
    useCallback,
} from "react"
import {
    cn,
    ListBox,
} from "@heroui/react"
import type {
    SidebarNavItem,
} from "../../types"

/**
 * Props for {@link SidebarNavItemRow}.
 */
export interface SidebarNavItemRowProps {
    /** Nav entry this row represents. */
    item: SidebarNavItem
    /** Whether this row's tab is the active one. */
    selected: boolean
    /** Icon-only mode: hide the label and center the icon (collapsed rail). */
    collapsed?: boolean
    /** Fired with the row's entry when pressed. */
    onSelect: (item: SidebarNavItem) => void
}

/**
 * One selectable sidebar row (icon + label).
 *
 * Presentational: renders a single {@link ListBox} entry and forwards a thin
 * select callback. `"use client"` for the press handler.
 * @param props - the nav entry, selected state, and select callback
 */
export const SidebarNavItemRow = ({
    item,
    selected,
    collapsed = false,
    onSelect,
}: SidebarNavItemRowProps) => {
    const onPress = useCallback(
        () => onSelect(item),
        [
            item,
            onSelect,
        ],
    )
    return (
        <ListBox
            selectedKeys={selected ? [item.value] : []}
            selectionMode="single"
        >
            <ListBox.Item
                // in collapsed mode keep the label as the accessible name even though it is hidden
                aria-label={collapsed ? item.label : undefined}
                // center the lone icon when collapsed; otherwise the row keeps icon + label
                className={cn(selected ? "text-accent bg-accent/10" : "", collapsed ? "justify-center" : "")}
                onPress={onPress}
            >
                <div className={cn("flex items-center gap-1.5", collapsed ? "justify-center" : "")}>
                    <item.icon className="size-5 shrink-0" />
                    {/* hide the label entirely when collapsed; else show from the sm breakpoint up */}
                    <span className={cn(collapsed ? "hidden" : "hidden sm:inline")}>{item.label}</span>
                </div>
            </ListBox.Item>
        </ListBox>
    )
}
