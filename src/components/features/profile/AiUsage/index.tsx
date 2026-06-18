"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Breadcrumbs,
    Button,
    Chip,
    Label,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryMyAiQuotaSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources"
import {
    PageHeader,
} from "@/components/blocks"
import {
    QuotaLane,
} from "@/components/modals/AiQuotaModal/QuotaLane"
import {
    QuotaLaneVariant,
} from "@/components/modals/AiQuotaModal/types"
import {
    AiUsageHistory,
} from "./AiUsageHistory"

/**
 * Full AI quota / usage page — Auto + Premium lanes and usage history.
 * Mounted by `/[locale]/profile/ai-usage`.
 */
export const AiUsage = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const { data: quota } = useQueryMyAiQuotaSwr()

    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )

    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    const subscriptionHref = useMemo(
        () => `${pathConfig().locale(locale).profile().build()}/ai-subscription`,
        [
            locale,
        ],
    )

    const onSubscribe = useCallback(() => {
        router.push(subscriptionHref)
    }, [
        router,
        subscriptionHref,
    ])

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("aiQuota.fullPageTitle")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>

            <PageHeader
                title={t("aiQuota.fullPageTitle")}
                description={t("aiQuota.fullPageDescription")}
            />

            {/* one unified credit pool (5h + week windows); the lane it is billed
                under is a backend concern, not a display axis */}
            <section className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label>{t("aiQuota.creditPool")}</Label>
                    <div className="flex items-center gap-2">
                        <Chip
                            size="sm"
                            variant="soft"
                            color={quota?.tier ? "warning" : "default"}
                        >
                            <Chip.Label>
                                {quota?.tier
                                    ? quota.tier.toUpperCase()
                                    : t("aiQuota.freeTier")}
                            </Chip.Label>
                        </Chip>
                        {!quota?.tier ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onPress={onSubscribe}
                            >
                                {t("aiQuota.subscribeCta")}
                            </Button>
                        ) : null}
                    </div>
                </div>
                <QuotaLane variant={QuotaLaneVariant.Premium} />
            </section>

            <AiUsageHistory />
        </div>
    )
}
