"use client"

import React from "react"
import {
    Typography,
    Chip,
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
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import {
    getSettingsGroups,
} from "@/resources/settings-nav"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { GroupPressableCard } from "@/components/blocks/cards/GroupPressableCard"
import { GithubIcon } from "@/components/svg/GithubIcon"
import { GoogleIcon } from "@/components/svg/GoogleIcon"
import { useAppSelector } from "@/redux/hooks"
import { AuthenticationType } from "@/modules/types/enums/authentication-type"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link SettingsHomePage}. */
export type SettingsHomePageProps = WithClassNames<undefined>

/**
 * Settings hub landing — a responsive grid of every account-management
 * destination (a card per page), so `/profile/settings` answers "where do I
 * manage things?" directly. Shares its destinations with the sidebar via
 * {@link getSettingsGroups}, so the two never drift.
 *
 * @param props - optional root className.
 */
export const SettingsHomePage = ({
    className,
}: SettingsHomePageProps) => {
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
        <div className={className}>
            <StackV gap={7} principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                items={[
                    () => (
                        <PageHeader
                            breadcrumb={<SettingsBreadcrumb current={t("profileSettings.title")} />}
                            title={t("profileSettings.title")}
                            description={t("profileSettings.subtitle")}
                        />
                    ),
                    () => (methodMeta ? (
                        <StackH gap={3} principle="identity"
                            explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                            align="center" items={[
                                () => (
                                    <Typography type="body-sm" className="text-default-500">
                                        {t("profileSettings.loginMethod")}
                                    </Typography>
                                ),
                                () => (
                                    <Chip size="sm" variant="soft" color="default">
                                        {methodMeta.icon}
                                        <Chip.Label>
                                            {t(`profileSettings.loginMethodValue.${methodMeta.key}`)}
                                        </Chip.Label>
                                    </Chip>
                                ),
                            ]} />
                    ) : null),
                    () => (
                        <GroupPressableCard
                            ariaLabel={t("profileSettings.itemsAria")}
                            // container steps, not viewport: two-up only once the settings column
                            // is 512px wide (≈252px per card — enough for the icon tile plus a
                            // label that would otherwise truncate)
                            columns={{ base: 1, lg: 2 }}
                            items={items.map((item) => ({
                                key: item.key,
                                onPress: () => router.push(item.href),
                                content: () => (
                                    <StackH gap={4} principle="content-row"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        align="center" items={[
                                            () => <IconTile icon={item.icon} tone="accent" size="sm" />,
                                            () => (
                                                <Typography type="body-sm" weight="medium" truncate>
                                                    {t(`profileSettings.items.${item.key}`)}
                                                </Typography>
                                            ),
                                        ]} />
                                ),
                            }))}
                        />
                    ),
                ]} />
        </div>
    )
}
