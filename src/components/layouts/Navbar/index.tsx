"use client"

import { useAuthenticationDisclosure, useKeycloak } from "@/hooks/singleton"
import {
    Navbar as HeroUINavbar, 
    NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react"
import React from "react"
import { useTranslations } from "next-intl"

export const Navbar = () => {
    const { onOpenChange } = useAuthenticationDisclosure()
    const { data: keycloak, isLoading: keycloakLoading } = useKeycloak()
    const t = useTranslations()
    return (
        <HeroUINavbar shouldHideOnScroll>
            <NavbarBrand>
                <div className="font-bold text-inherit">{t("nav.brand")}</div>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/">
                        {t("nav.home")}
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="/khoa-hoc">
                        {t("nav.courses")}
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        {t("nav.contact")}
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {keycloakLoading ? (
                    <Button isDisabled variant="flat">
                        …
                    </Button>
                ) : keycloak?.authenticated ? (
                    <Button onPress={() => keycloak.logout()}>
                        {t("nav.logout")}
                    </Button>
                ) : (
                    <Button onPress={onOpenChange}>
                        {t("nav.signIn")}
                    </Button>
                )}
            </NavbarContent>
        </HeroUINavbar>
    )
}
