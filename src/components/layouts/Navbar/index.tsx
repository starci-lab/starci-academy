"use client"
import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import { useMemo } from "react"
import { Logo } from "./Logo"
import { Link } from "@heroui/react"
import { cn } from "@heroui/react"
import { AccountMenuDropdown } from "./AccountMenuDropdown"

/**
 * Navbar item interface
 */
export interface NavbarItem {
    /**
     * Label of the navbar item
     */
    label: string
    /**
     * Path of the navbar item
     */
    path: string
    /**
     * Whether the navbar item is active
     */
    isActive: boolean
}

/**
 * Navbar is the main navigation component for the application.
 */
export const Navbar = () => {
    /**
     * Translations hook
     */
    const t = useTranslations()
    /**
     * Router hook
     */
    const router = useRouter()
    /**
     * Pathname hook
     */
    const pathname = usePathname()
    /**
     * Locale hook
     */
    const locale = useLocale()
    /**
     * Navigation items
     */
    const items: Array<NavbarItem> = useMemo(() => [
        { 
            label: t("nav.home"), 
            path: pathConfig().locale().build(), 
            isActive: pathname === pathConfig().locale(locale).build() || pathname === "/"
        },
        { 
            label: t("nav.courses"), 
            path: pathConfig().locale(locale).course().build(), 
            isActive: pathname.startsWith(pathConfig().locale(locale).course().build()) 
        },
        { 
            label: t("nav.contact"), 
            path: pathConfig().locale(locale).contact().build(), 
            isActive: pathname.startsWith(pathConfig().locale(locale).contact().build())
        },
    ], [pathname, locale])
    
    return (
        <nav className="border-b border-divider px-6 py-3">
            {/**
             * Navbar content
             */}
            <div className="max-w-[1024px] mx-auto flex items-center justify-between">
                {/**
                 * Logo
                 */}
                <Logo className="flex-1 justify-start" />
                {/**
                 * Navbar items
                 */}
                <div className="flex items-center gap-3 flex-1 justify-center">
                    {items.map(
                        (item) => (
                            <Link key={item.path} onPress={() => router.push(item.path)}>
                                <span className={cn("text-sm", item.isActive ? "text-accent" : "")}>{item.label}</span>
                            </Link>
                        )
                    )
                    }
                </div>
                {/**
                 * User actions
                 */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <AccountMenuDropdown />
                </div>
            </div>
        </nav>
    )
}
