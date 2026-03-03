import {Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@heroui/react"
import React from "react"

export const Navbar = () => {
    return (
        <HeroUINavbar shouldHideOnScroll>
            <NavbarBrand>
                <div className="font-bold text-inherit">StarCi Academy</div>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/">
            Trang chủ
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="/khoa-hoc">
            Khóa học
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Liên hệ
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    )
}
