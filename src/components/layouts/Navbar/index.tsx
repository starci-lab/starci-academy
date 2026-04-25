"use client"

import React, { useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import { Logo } from "./Logo"
import { AccountMenuDropdown } from "./AccountMenuDropdown"
import { Button, Kbd, Link, cn } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useSearchOverlayState } from "@/hooks/singleton"

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
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const { onOpen: onOpenSearch } = useSearchOverlayState()

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const isK = event.key.toLowerCase() === "k"
            if (!isK) return
            if (!(event.ctrlKey || event.metaKey)) return
            event.preventDefault()
            onOpenSearch()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onOpenSearch])

    const items: Array<NavbarItem> = useMemo(
        () => [
            {
                label: t("nav.home"),
                path: pathConfig().locale().build(),
                isActive: pathname === pathConfig().locale(locale).build() || pathname === "/",
            },
            {
                label: t("nav.courses"),
                path: pathConfig().locale().course().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).course().build()),
            },
            {
                label: t("nav.contact"),
                path: pathConfig().locale().contact().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).contact().build()),
            },
        ],
        [locale, pathname, t],
    )

    return (
        <nav className="sticky top-0 z-50 h-16 min-h-16 border-b bg-background">
            <div className="mx-auto flex h-full w-full items-center justify-between px-3">
                <div className="flex items-center gap-6">
                    <Logo className="flex-1 justify-start" />
                    <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
                        {items.map((item) => (
                            <Link key={item.path} onPress={() => router.push(item.path)}>
                                <span
                                    className={cn(
                                        "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                                        item.isActive
                                            ? "bg-accent/10 text-accent"
                                            : "text-foreground-500 hover:text-foreground",
                                    )}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button className="w-[300px] justify-between px-3" variant="outline" onPress={onOpenSearch}>
                        <span className="inline-flex items-center gap-2">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                            <span className="text-sm">{t("search.label")}</span>
                        </span>
                        <div className="flex items-center gap-1 hidden md:inline-flex">
                            <Kbd>
                                <Kbd.Content>Ctrl</Kbd.Content>
                            </Kbd>
                            <Kbd>
                                <Kbd.Content>K</Kbd.Content>
                            </Kbd>
                        </div>
                    </Button>
                    <AccountMenuDropdown />
                </div>
            </div>
        </nav>
    )
}