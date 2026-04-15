"use client"
import React from "react"
import {
    Dropdown, 
    DropdownTrigger, 
    DropdownPopover,
    DropdownMenu, 
    DropdownItem,
    DropdownSection,
} from "@heroui/react"
import type { DropdownMenuProps } from "@heroui/react"

/**
 * StarCiDropdown is a dropdown component that is used to display a dropdown menu.
 */
export const StarCiDropdown = Dropdown
/**
 * StarCiDropdownTrigger is a trigger component that is used to display a dropdown menu.
 */
export const StarCiDropdownTrigger = DropdownTrigger
/**
 * StarCiDropdownPopover is a popover component that is used to display a dropdown menu.
 */
export const StarCiDropdownPopover = DropdownPopover
/**
 * StarCiDropdownMenu is a menu component that is used to display a dropdown menu.
 */
export const StarCiDropdownMenu = <T extends object = object>({ children, ...props }: DropdownMenuProps<T>) => {
    return <DropdownMenu {...props}>{children}</DropdownMenu>
}
/**
 * StarCiDropdownItem is an item component that is used to display a dropdown menu item.
 */
export const StarCiDropdownItem = DropdownItem
/**
 * StarCiDropdownSection is a section component that is used to display a dropdown menu section.
 */
export const StarCiDropdownSection = DropdownSection
