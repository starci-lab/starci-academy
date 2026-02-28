import {Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react"
import React from "react"

export const Navbar = () => {
    return (
        <HeroUINavbar shouldHideOnScroll>
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
            Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="#">
            Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    )
}
