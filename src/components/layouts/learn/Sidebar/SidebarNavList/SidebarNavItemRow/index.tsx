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
import {
    useAppDispatch,
} from "@/redux"
import {
    setSidebar,
} from "@/redux/slices"
import {
    useRouter,
} from "next/navigation"
import type {
    WithClassNames,
} from "@/modules/types"

/**
 * Props for {@link SidebarNavItemRow}.
 */
export interface SidebarNavItemRowProps extends WithClassNames<undefined> {
    /** Nav entry this row represents. */
    item: SidebarNavItem
    /** Whether this row's tab is the active one. */
    selected: boolean
    /** Icon-only mode: hide the label and center the icon (collapsed rail). */
    collapsed?: boolean
}

/**
 * One selectable sidebar row (icon + label).
 *
 * List item: keeps its own `item` payload and self-dispatches the tab change +
 * navigation when pressed. `"use client"` for the dispatch + router.
 * @param props - the nav entry and selected state
 */
export const SidebarNavItemRow = ({
    item,
    selected,
    collapsed = false,
    className,
}: SidebarNavItemRowProps) => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const onPress = useCallback(
        () => {
            dispatch(setSidebar({ tab: item.tab, extraId: undefined }))
            if (item.url) {
                router.push(item.url)
            }
        },
        [dispatch, router, item],
    )
    return (
        <ListBox
            selectedKeys={selected ? [item.value] : []}
            selectionMode="single"
            className={cn(className)}
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
