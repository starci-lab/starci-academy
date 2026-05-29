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
                className={cn(selected ? "text-accent bg-accent/10" : "")}
                onPress={onPress}
            >
                <div className="flex items-center gap-2">
                    <item.icon className="size-5 shrink-0" />
                    <span className="hidden sm:inline">{item.label}</span>
                </div>
            </ListBox.Item>
        </ListBox>
    )
}
