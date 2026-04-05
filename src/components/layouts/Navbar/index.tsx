"use client"

import { 
    useAuthenticationDisclosure, 
    useKeycloak 
} from "@/hooks/singleton"
import React from "react"
import { useTranslations } from "next-intl"
import { AuthenticatedDropdown } from "./AuthenticatedDropdown"
import { useAppSelector } from "@/redux"
import { 
    StarCiAvatar, 
    StarCiButton, 
    StarCiLink, 
    StarCiNavbar, 
    StarCiNavbarBrand, 
    StarCiNavbarContent, 
    StarCiNavbarItem 
} from "@/components/atomic"
import { UserIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useLocale } from "next-intl"

export const Navbar = () => {
    const { onOpenChange } = useAuthenticationDisclosure()
    const keycloak = useKeycloak()
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)
    const router = useRouter()
    const locale = useLocale()
    return (
        <StarCiNavbar shouldHideOnScroll>
            <StarCiNavbarBrand>
                <div className="font-bold text-inherit">{t("nav.brand")}</div>
            </StarCiNavbarBrand>
            <StarCiNavbarContent className="hidden sm:flex gap-4" justify="center">
                <StarCiNavbarItem>
                    <StarCiLink color="foreground" onPress={() => router.push(pathConfig().locale(locale).build())}>
                        {t("nav.home")}
                    </StarCiLink>
                </StarCiNavbarItem>
                <StarCiNavbarItem isActive>
                    <StarCiLink aria-current="page" onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                        {t("nav.courses")}
                    </StarCiLink>
                </StarCiNavbarItem>
                <StarCiNavbarItem>
                    <StarCiLink color="foreground" href="#">
                        {t("nav.contact")}
                    </StarCiLink>
                </StarCiNavbarItem>
            </StarCiNavbarContent>
            <StarCiNavbarContent justify="end">
                {keycloak?.isLoading ? (
                    <StarCiButton 
                        isIconOnly
                        isLoading
                        radius="full" 
                        onPress={onOpenChange}
                    />
                ) : keycloak?.data?.authenticated ? (
                    <>
                        <div className="hidden sm:block">
                            <AuthenticatedDropdown />
                        </div>
                        <div className="block sm:hidden">
                            <StarCiAvatar
                                src={user?.avatar}
                                className="cursor-pointer"
                                color="primary"
                                name={user?.username}
                            />
                        </div>
                    </>
                ) : (
                    <StarCiButton 
                        isIconOnly 
                        radius="full" 
                        onPress={onOpenChange}
                    >
                        <UserIcon className="size-5" />
                    </StarCiButton>
                )
                }
            </StarCiNavbarContent>
        </StarCiNavbar>
    )
}
