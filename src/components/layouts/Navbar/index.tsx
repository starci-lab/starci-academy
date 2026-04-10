"use client"
import React from "react"
import { 
    StarCiLink, 
    StarCiNavbar, 
    StarCiNavbarBrand, 
    StarCiNavbarContent, 
    StarCiNavbarItem,
    StarCiNavbarMenuToggle } from "@/components/atomic"
import { 
    BookOpenIcon, 
    ChatCenteredTextIcon, 
    HouseIcon, 
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import { MobileNavbar } from "./MobileNavbar"
import { AccountMenuDropdown } from "./AccountMenuDropdown"

export const Navbar = () => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const navItems = [
        { 
            label: t("nav.home"), 
            path: pathConfig().locale().build(), 
            icon: HouseIcon,
            isActive: pathname === "/" || pathname === ""
        },
        { 
            label: t("nav.courses"), 
            path: pathConfig().locale().course().build(), 
            icon: BookOpenIcon,
            isActive: pathname.startsWith("/courses") 
        },
        { 
            label: t("nav.contact"), 
            path: pathConfig().locale().contact().build(), 
            icon: ChatCenteredTextIcon,
            isActive: pathname.startsWith("/contact")
        },
    ]
    return (
        <StarCiNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            <StarCiNavbarContent justify="start">
                <StarCiNavbarBrand>
                    <div className="font-bold text-inherit">{t("nav.brand")}</div>
                </StarCiNavbarBrand>
            </StarCiNavbarContent>

            {/* Center part: Desktop Navigation Links */}
            <StarCiNavbarContent className="hidden sm:flex gap-4" justify="center">
                {navItems.map((item) => (
                    <StarCiNavbarItem key={item.path} isActive={item.isActive}>
                        <StarCiLink color="foreground" onPress={() => router.push(item.path)}>
                            {item.label}
                        </StarCiLink>
                    </StarCiNavbarItem>
                ))}
            </StarCiNavbarContent>

            {/* Right part: Icons and Profile */}
            <StarCiNavbarContent justify="end">
                <StarCiNavbarItem className="max-sm:!hidden">
                    <AccountMenuDropdown />
                </StarCiNavbarItem>
                <StarCiNavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden rounded-none border-1 border-foreground-200 h-10 w-10 min-w-10 p-0 flex items-center justify-center transition-all bg-transparent"
                />
            </StarCiNavbarContent>
            {/* Mobile Navigation Menu */}
            <MobileNavbar 
                navItems={navItems} 
                isMenuOpen={isMenuOpen} 
                setIsMenuOpen={setIsMenuOpen} 
                locale={locale} 
            />

        </StarCiNavbar>

    )
}
