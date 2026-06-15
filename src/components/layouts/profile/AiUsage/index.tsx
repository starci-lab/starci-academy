"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Breadcrumbs,
    Button,
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
    SubPageHeader,
} from "@/components/reuseable"
import {
    QuotaLane,
} from "@/components/modals/AiQuotaModal/QuotaLane"
import {
    AiQuotaHistoryTab,
} from "@/components/modals/AiQuotaModal/HistoryTab"
import {
    QuotaLaneVariant,
} from "@/components/modals/AiQuotaModal/types"

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

    const onBack = useCallback(
        () => onNavigateProfile(),
        [
            onNavigateProfile,
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

            <SubPageHeader
                title={t("aiQuota.fullPageTitle")}
                description={t("aiQuota.fullPageDescription")}
                onBack={onBack}
            />

            <section className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-foreground">
                    {t("aiQuota.tabs.auto")}
                </h2>
                <QuotaLane variant={QuotaLaneVariant.Auto} />
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-foreground">
                    {t("aiQuota.tabs.subscription")}
                </h2>
                {quota?.tier ? (
                    <>
                        <QuotaLane variant={QuotaLaneVariant.Premium} />
                        <p className="text-sm text-muted">
                            {t("aiQuota.subscriptionActive", {
                                tier: quota.tier.toUpperCase(),
                            })}
                        </p>
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-muted">
                            {t("aiQuota.subscriptionNone")}
                        </p>
                        <Button
                            variant="primary"
                            className="self-start"
                            onPress={onSubscribe}
                        >
                            {t("aiQuota.subscribeCta")}
                        </Button>
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-foreground">
                    {t("aiQuota.tabs.history")}
                </h2>
                <AiQuotaHistoryTab alwaysLoad />
            </section>
        </div>
    )
}
