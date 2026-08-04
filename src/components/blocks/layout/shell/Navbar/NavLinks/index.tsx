"use client"

import React, {
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
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _NavLinks, type NavLinkItem } from "./component"

/**
 * Props for {@link NavLinks}.
 */
export type NavLinksProps = WithClassNames<undefined>

/**
 * Desktop navbar link group — the CONNECTED half: derives its entries +
 * active-route state from the router/locale itself and self-navigates on
 * press. See `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const NavLinks = ({ className }: NavLinksProps) => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const items = useMemo<Array<NavLinkItem>>(
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
                label: t("nav.community"),
                path: pathConfig().locale().community().build(),
                isActive: pathname.startsWith(pathConfig().locale(locale).community().build()),
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

    return <_NavLinks items={items} onNavigate={(path) => router.push(path)} className={className} />
}
