import type { IconComponent } from "@/types"
import { GlobeIcon as TranslateIcon, PaintBrushIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import {
    DarkLightModeSwitch,
} from "../AccountMenuDropdown/DarkLightMode"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * One entry rendered in the mobile navigation menu, already localized + resolved.
 */
export interface MobileNavItem {
    /** Visible label, already localized. */
    label: string
    /** Navigation target path. */
    path: string
    /** Whether this entry matches the active route. */
    isActive: boolean
    /** Icon component rendered next to the label. */
    icon: IconComponent
}

/** Props for {@link _MobileNavbar} — presentational; nav items + labels already resolved. */
export interface MobileNavbarProps extends WithClassNames<undefined> {
    /** `false` → renders nothing (menu closed). */
    isMenuOpen: boolean
    /** Nav entries to render, already resolved (label + active state). */
    navItems: Array<MobileNavItem>
    /** Already-localized aria-label for the `<nav>` landmark. */
    menuAriaLabel: string
    /** Already-localized "Appearance" row label. */
    appearanceLabel: string
    /** Already-localized "System theme" caption under the appearance row. */
    systemThemeCaption: string
    /** Already-localized "Toggle language" row label. */
    toggleLanguageLabel: string
    /** Already-localized current-language caption ("English" / "Tiếng Việt"). */
    currentLanguageCaption: string
    /** Fired with the target path when a nav item is pressed (the connected half also closes the menu). */
    onNavigate: (path: string) => void
}

/**
 * MobileNavbar — full-screen navigation menu shown on small screens.
 *
 * @param props - {@link MobileNavbarProps}
 */
export const _MobileNavbar = ({
    isMenuOpen,
    navItems,
    menuAriaLabel,
    appearanceLabel,
    systemThemeCaption,
    toggleLanguageLabel,
    currentLanguageCaption,
    onNavigate,
    className,
}: MobileNavbarProps) => {
    if (!isMenuOpen) return null

    return (
        <nav
            className={cn("backdrop-blur-xl bg-background/80 flex flex-col h-[calc(100vh-64px)] pb-10", className)}
            aria-label={menuAriaLabel}
        >
            <div className="flex flex-col gap-2 mt-4 flex-grow">
                {navItems.map((item, index) => (
                    <div key={`${item.path}-${index}`} className="w-full">
                        <Link
                            className={cn(
                                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                                item.isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "hover:bg-default-100",
                            )}
                            onPress={() => onNavigate(item.path)}
                        >
                            <item.icon className="size-6" />
                            <span className="font-bold tracking-tight">{item.label}</span>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-6 pt-6 border-t">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                            <PaintBrushIcon className="size-5" />
                        </div>
                        <div className="flex flex-col gap-0">
                            <span className="text-sm font-bold">{appearanceLabel}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                {systemThemeCaption}
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
                        <div className="flex flex-col gap-0">
                            <span className="text-sm font-bold">
                                {toggleLanguageLabel}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                {currentLanguageCaption}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
