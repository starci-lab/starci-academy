"use client"
import {
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem,
    DropdownSection,
    DropdownMenuProps,
} from "@heroui/react"

export const StarCiDropdown = Dropdown
export const StarCiDropdownTrigger = DropdownTrigger
export const StarCiDropdownMenu = ({ children, ...props }: DropdownMenuProps) => {
    return <DropdownMenu {...props}>{children}</DropdownMenu>
}
export const StarCiDropdownItem = DropdownItem
export const StarCiDropdownSection = DropdownSection