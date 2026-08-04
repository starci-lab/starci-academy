"use client"

import React, { useMemo, useState } from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _MobileNavbar, type MobileNavItem } from "./component"

/**
 * Props for {@link MobileNavbar}.
 */
export type MobileNavbarProps = WithClassNames<undefined>

/**
 * MobileNavbar — the CONNECTED half: derives nav entries + active-route state
 * from the router/locale itself, manages its own open/close state, and
 * self-navigates on item press. See `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const MobileNavbar = ({ className }: MobileNavbarProps) => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = useMemo<Array<MobileNavItem>>(
        () => [
            {
                label: t("nav.home"),
                path: pathConfig().locale().build(),
                isActive: pathname === pathConfig().locale(locale).build() || pathname === "/",
                icon: () => null,
            },
            {
                label: t("nav.courses"),
                path: pathConfig().locale().course().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).course().build()),
                icon: () => null,
            },
            {
                label: t("nav.contact"),
                path: pathConfig().locale().contact().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).contact().build()),
                icon: () => null,
            },
        ],
        [locale, pathname, t],
    )

    return (
        <_MobileNavbar
            isMenuOpen={isMenuOpen}
            navItems={navItems}
            menuAriaLabel={t("nav.mobileMenu")}
            appearanceLabel={t("nav.appearance")}
            systemThemeCaption="System theme"
            toggleLanguageLabel={t("nav.toggleLanguage")}
            currentLanguageCaption={locale === "en" ? "English" : "Tiếng Việt"}
            onNavigate={(path) => {
                router.push(path)
                setIsMenuOpen(false)
            }}
            className={className}
        />
    )
}
