import {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    usePathname,
} from "@/i18n/navigation"
import {
    pathConfig,
} from "@/resources/path"
import type {
    NavbarItem,
} from "./types"

/**
 * Shared source of truth for the navbar's top-level nav entries.
 *
 * Desktop `NavLinks` and the mobile drawer both render off this same list so
 * adding/renaming a route only has one place to update. Pass
 * `includeCart: true` for the mobile drawer, which also surfaces the cart
 * entry that the desktop bar renders separately via `CartButton`.
 * @param options.includeCart - append a "cart" entry (mobile drawer only)
 */
export const useNavbarItems = ({ includeCart = false }: { includeCart?: boolean } = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const pathname = usePathname()

    return useMemo<Array<NavbarItem>>(() => {
        const items: Array<NavbarItem> = [
            {
                label: t("nav.home"),
                path: pathConfig().locale().home().build(),
                isActive: pathname === "/" || pathname === pathConfig().locale().home().build(),
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
        ]
        if (includeCart) {
            items.push({
                label: t("cart.title"),
                path: pathConfig().locale().cart().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).cart().build()),
            })
        }
        return items
    }, [includeCart, locale, pathname, t])
}
