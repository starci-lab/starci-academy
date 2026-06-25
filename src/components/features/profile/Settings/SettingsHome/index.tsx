"use client"

import React from "react"
import {
    Typography,
    Chip,
    cn,
} from "@heroui/react"
import {
    EnvelopeIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    IconTile,
    PageHeader,
    PressableCard,
} from "@/components/blocks"
import {
    GithubIcon,
    GoogleIcon,
} from "@/components/svg"
import {
    useAppSelector,
} from "@/redux"
import {
    AuthenticationType,
} from "@/modules/types"
import {
    SettingsBreadcrumb,
} from "../SettingsBreadcrumb"
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

    // login method (provider) badge — google / github / credentials
    const authType = useAppSelector((state) => state.user.user?.authenticationType)
    const methodMeta = authType === AuthenticationType.Github
        ? { key: "github", icon: <GithubIcon className="size-3.5" /> }
        : authType === AuthenticationType.Google
            ? { key: "google", icon: <GoogleIcon className="size-3.5" /> }
            : authType === AuthenticationType.Credentials
                ? { key: "credentials", icon: <EnvelopeIcon className="size-3.5" /> }
                : null

    return (
        <div className={cn("flex flex-col gap-10", className)}>
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("profileSettings.title")} />}
                title={t("profileSettings.title")}
                description={t("profileSettings.subtitle")}
            />
            {methodMeta ? (
                <div className="flex items-center gap-2">
                    <Typography type="body-sm" className="text-default-500">
                        {t("profileSettings.loginMethod")}
                    </Typography>
                    <Chip size="sm" variant="soft" color="default" className="gap-1.5">
                        {methodMeta.icon}
                        <Chip.Label>
                            {t(`profileSettings.loginMethodValue.${methodMeta.key}`)}
                        </Chip.Label>
                    </Chip>
                </div>
            ) : null}
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
