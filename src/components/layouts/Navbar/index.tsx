import { useAuthenticationDisclosure } from "@/hooks/singleton"
import {
    Navbar as HeroUINavbar, 
    NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react"
import React from "react"

export const Navbar = () => {
    const { onOpenChange } = useAuthenticationDisclosure()
    return (
        <HeroUINavbar shouldHideOnScroll>
            <NavbarBrand>
                <div className="font-bold text-inherit">StarCi Academy</div>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/">
            Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="/khoa-hoc">
            Courses
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Contact
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <Button onPress={onOpenChange}>
                    Sign In
                </Button>
            </NavbarContent>
        </HeroUINavbar>
    )
}
