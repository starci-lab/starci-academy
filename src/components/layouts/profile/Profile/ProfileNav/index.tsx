"use client"

import { Bookmark as BookmarkSimpleIcon, ChevronRight as CaretRightIcon, CrownDiamond as CrownIcon, Sliders as SlidersHorizontalIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Card,
    Separator,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources"

/** A single navigable row in the profile hub. */
interface ProfileNavItem {
    /** Stable key. */
    key: string
    /** Row icon. */
    icon: React.ReactNode
    /** i18n label. */
    label: string
    /** i18n description. */
    description: string
    /** Destination path. */
    href: string
}

/**
 * Profile hub navigation list — links to AI settings, AI subscription, and
 * bookmarks.
 *
 * Container: owns navigation; renders a joined list of rows (outer rounded
 * border + inner separators), matching the StarCi list pattern.
 */
export const ProfileNav = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    /** Profile base path for the current locale. */
    const profileBase = useMemo(
        () => pathConfig().locale(locale).profile().build(),
        [
            locale,
        ],
    )

    const items = useMemo<Array<ProfileNavItem>>(
        () => [
            {
                key: "ai-settings",
                icon: <SlidersHorizontalIcon className="size-5 text-accent" />,
                label: t("aiSettings.title"),
                description: t("profile.nav.aiSettingsDesc"),
                href: `${profileBase}/ai-settings`,
            },
            {
                key: "ai-subscription",
                icon: <CrownIcon className="size-5 text-warning" />,
                label: t("aiSubscription.title"),
                description: t("profile.nav.aiSubscriptionDesc"),
                href: `${profileBase}/ai-subscription`,
            },
            {
                key: "bookmarks",
                icon: <BookmarkSimpleIcon className="size-5 text-accent" />,
                label: t("profile.nav.bookmarks"),
                description: t("profile.nav.bookmarksDesc"),
                href: pathConfig().locale(locale).profile().bookmarks().build(),
            },
        ],
        [
            t,
            locale,
            profileBase,
        ],
    )

    const onNavigate = useCallback(
        (href: string) => router.push(href),
        [
            router,
        ],
    )

    return (
        <div className="flex flex-col overflow-hidden rounded-large">
            {items.map((item, index) => (
                <React.Fragment key={item.key}>
                    <Card
                        onClick={() => onNavigate(item.href)}
                        className={cn(
                            "rounded-none bg-default/40 shadow-none cursor-pointer hover:bg-default/60 transition-colors",
                            "flex flex-row items-center gap-3 p-4",
                        )}
                    >
                        {item.icon}
                        <div className="flex flex-1 flex-col">
                            <span className="font-medium text-foreground">{item.label}</span>
                            <span className="text-xs text-muted">{item.description}</span>
                        </div>
                        <CaretRightIcon className="size-4 text-muted" />
                    </Card>
                    {index !== items.length - 1 ? <Separator /> : null}
                </React.Fragment>
            ))}
        </div>
    )
}
