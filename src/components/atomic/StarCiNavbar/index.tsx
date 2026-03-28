import React from "react"
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    NavbarProps,
    NavbarBrandProps,
    NavbarContentProps,
    NavbarItemProps,
    NavbarMenuProps,
    NavbarMenuItemProps,
    NavbarMenuToggleProps,
} from "@heroui/react"

export const StarCiNavbar = (props: NavbarProps) => {
    return <Navbar {...props} />
}

export const StarCiNavbarBrand = (props: NavbarBrandProps) => {
    return <NavbarBrand {...props} />
}

export const StarCiNavbarContent = (props: NavbarContentProps) => {
    return <NavbarContent {...props} />
}

export const StarCiNavbarItem = (props: NavbarItemProps) => {
    return <NavbarItem {...props} />
}

export const StarCiNavbarMenu = (props: NavbarMenuProps) => {
    return <NavbarMenu {...props} />
}

export const StarCiNavbarMenuItem = (props: NavbarMenuItemProps) => {
    return <NavbarMenuItem {...props} />
}

export const StarCiNavbarMenuToggle = (props: NavbarMenuToggleProps) => {
    return <NavbarMenuToggle {...props} />
}
