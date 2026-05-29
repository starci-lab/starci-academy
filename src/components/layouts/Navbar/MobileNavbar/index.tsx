"use client"

import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import {
    PaintBrushIcon,
    TranslateIcon,
} from "@phosphor-icons/react"
import type {
    Icon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    DarkLightModeSwitch,
} from "../AccountMenuDropdown/DarkLightMode"

/**
 * One entry rendered in the mobile navigation menu.
 */
export interface MobileNavItem {
    /** Visible label. */
    label: string
    /** Navigation target path. */
    path: string
    /** Whether this entry matches the active route. */
    isActive: boolean
    /** Phosphor icon component rendered next to the label. */
    icon: Icon
}

/**
 * Props for {@link MobileNavbar}.
 */
export interface MobileNavbarProps {
    /** Navigation entries to render in the menu. */
    navItems: Array<MobileNavItem>
    /** Whether the mobile menu is currently open. */
    isMenuOpen: boolean
    /** Fired with the next open state when toggling the menu. */
    setIsMenuOpen: (value: boolean) => void
    /** Active locale code (drives the language label). */
    locale: string
    /** Fired with the chosen path when a nav entry is pressed. */
    onSelectItem: (path: string) => void
}

/**
 * MobileNavbar — full-screen navigation menu shown on small screens.
 *
 * Presentational: renders the passed nav entries plus appearance/language
 * rows; navigation and menu-state changes are delegated via `onXXX` props.
 * `"use client"` for the interactive theme switch + press handlers.
 * @param props - nav entries, open state, locale, and select callback
 */
export const MobileNavbar = ({
    navItems,
    setIsMenuOpen,
    locale,
    onSelectItem,
}: MobileNavbarProps) => {
    const t = useTranslations()
    return (
        <nav
            className="backdrop-blur-xl bg-background/80 flex flex-col h-[calc(100vh-64px)] pb-10"
            aria-label={t("nav.mobileMenu")}
        >
            <div className="flex flex-col gap-2 mt-4 flex-grow">
                {navItems.map((item, index) => (
                    <div key={`${item.path}-${index}`} className="w-full">
                        <Link
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                                item.isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "hover:bg-default-100",
                            )}
                            onPress={() => {
                                onSelectItem(item.path)
                                setIsMenuOpen(false)
                            }}
                        >
                            <item.icon
                                weight={item.isActive ? "fill" : "regular"}
                                className="size-6"
                            />
                            <span className="font-bold tracking-tight">{item.label}</span>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-5 pt-6 border-t ">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                            <PaintBrushIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{t("nav.appearance")}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                System theme
                            </span>
                        </div>
                    </div>
                    <DarkLightModeSwitch />
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                            <TranslateIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">
                                {t("nav.toggleLanguage")}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                {locale === "en" ? "English" : "Tiếng Việt"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
