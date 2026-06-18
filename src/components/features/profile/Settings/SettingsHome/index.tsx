"use client"

import React from "react"
import {
    Typography,
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
    IconTile,
    PressableCard,
} from "@/components/blocks"
import {
    getSettingsGroups,
} from "../nav"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link SettingsHome}. */
export type SettingsHomeProps = WithClassNames<undefined>

/**
 * Settings hub landing — a responsive grid of every account-management
 * destination (a card per page), so `/profile/settings` answers "where do I
 * manage things?" directly. Shares its destinations with the sidebar via
 * {@link getSettingsGroups}, so the two never drift.
 *
 * @param props - optional root className.
 */
export const SettingsHome = ({
    className,
}: SettingsHomeProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const items = getSettingsGroups(locale).flatMap((group) => group.items)

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col gap-2">
                <Typography type="h4" weight="bold">
                    {t("profileSettings.title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("profileSettings.subtitle")}
                </Typography>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                    <PressableCard
                        key={item.key}
                        onPress={() => router.push(item.href)}
                        className="flex items-center gap-3"
                    >
                        <IconTile icon={item.icon} tone="accent" size="sm" />
                        <Typography type="body-sm" weight="medium" truncate>
                            {t(`profileSettings.items.${item.key}`)}
                        </Typography>
                    </PressableCard>
                ))}
            </div>
        </div>
    )
}
