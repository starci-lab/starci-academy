"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    usePathname,
    useRouter,
} from "@/i18n/navigation"
import {
    pathConfig,
} from "@/resources/path"
import {
    useSearchOverlayState,
} from "@/hooks/singleton"
import type {
    NavbarItem,
} from "./types"
import {
    Logo,
} from "./Logo"
import {
    AccountMenuDropdown,
} from "./AccountMenuDropdown"
import {
    NavLinks,
} from "./NavLinks"
import {
    SearchButton,
} from "./SearchButton"

/**
 * Navbar — top application navigation bar.
 *
 * Container: owns the active-route derivation, the Ctrl/Cmd+K search shortcut,
 * and navigation; renders the logo, presentational links, search trigger, and
 * the account dropdown. `"use client"` for hooks + keyboard handling.
 */
export const Navbar = () => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const { open: openSearch } = useSearchOverlayState()

    // register the global Ctrl/Cmd+K shortcut to open the search overlay
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const isK = event.key.toLowerCase() === "k"
            if (!isK) return
            if (!(event.ctrlKey || event.metaKey)) return
            event.preventDefault()
            openSearch()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [openSearch])

    const items = useMemo<Array<NavbarItem>>(
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
                label: t("nav.practice"),
                path: "/practice",
                isActive: pathname.startsWith("/practice"),
            },
            {
                label: t("nav.contact"),
                path: pathConfig().locale().contact().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).contact().build()),
            },
        ],
        [
            locale,
            pathname,
            t,
        ],
    )

    /** Navigate to the chosen nav entry path. */
    const onSelectItem = useCallback(
        (path: string) => router.push(path),
        [
            router,
        ],
    )

    return (
        <nav className="sticky top-0 z-50 h-16 min-h-16 border-b bg-background">
            <div className="mx-auto flex h-full w-full items-center justify-between px-3">
                <div className="flex items-center gap-6">
                    <Logo className="flex-1 justify-start" />
                    <NavLinks
                        items={items}
                        onSelectItem={onSelectItem}
                    />
                </div>

                <div className="flex items-center justify-end gap-3">
                    <SearchButton />
                    <AccountMenuDropdown />
                </div>
            </div>
        </nav>
    )
}
