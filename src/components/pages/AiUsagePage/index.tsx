"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
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
    AiQuotaLane,
} from "@/components/blocks/ai/AiQuotaLane"
import {
    AiUsageHistory,
} from "./AiUsageHistory"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { pathConfig } from "@/resources/path"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { StackH, StackV } from "@/components/frames/Stack"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { QuotaLaneVariant } from "@/hooks/quota-lane-variant"
import { useQuotaLaneData } from "@/hooks/useQuotaLaneData"

/**
 * Full AI quota / usage page — Auto + Premium lanes and usage history.
 * Mounted by `/[locale]/profile/ai-usage`.
 */
export const AiUsagePage = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const { data: quota } = useQueryMyAiQuotaSwr()
    const { data: premiumLane, isLoading: isPremiumLaneLoading } = useQuotaLaneData(QuotaLaneVariant.Premium)


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

    // upsell prompt under the credit card: free → "buy a plan"; paid-but-not-max →
    // "upgrade"; on the MAX plan there is nothing left to sell, so it hides.
    const tier = quota?.tier ?? null
    const showUpsell = tier !== AiSubTier.Max
    const upsellText = tier
        ? t("aiQuota.upgradeWarning", { tier: tier.toUpperCase() })
        : t("aiQuota.subscriptionNone")
    const upsellCta = tier ? t("aiQuota.upgradeCta") : t("aiQuota.subscribeCta")

    const bodyItems = [
        () => (
            <SurfaceCard
                label={t("aiQuota.creditPool")}
                action={() => (
                    <Chip
                        tone={quota?.tier === "max" ? "warning" : "default"}
                        text={quota?.tier
                            ? quota.tier.toUpperCase()
                            : t("aiQuota.freeTier")}
                    />
                )}
                body={() => (
                    <AiQuotaLane data={premiumLane} isLoading={isPremiumLaneLoading} />
                )}
            />
        ),
        ...(showUpsell
            ? [() => (
                <StackH
                    at="sm"
                    justify="between"
                    align="center"
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    items={[
                        () => (
                            <Typography
                                size="sm"
                                color="warning"
                                text={upsellText}
                            />
                        ),
                        () => (
                            <Button
                                variant="primary"
                                label={upsellCta}
                                onPress={onSubscribe}
                            />
                        ),
                    ]}
                />
            )]
            : []),
        () => <AiUsageHistory />,
    ]

    return (
        <StackV
            identity={{ tier: "page", component: "AiUsagePage" }}
            principle="layout-split"
            explain="Layout seam between header and body — not block-boundary, because this is the page chrome split rather than stacked content blocks."
            items={[
                () => (
                    <PageHeader
                        breadcrumb={<SettingsBreadcrumb current={t("aiQuota.fullPageTitle")} />}
                        title={t("aiQuota.fullPageTitle")}
                        description={t("aiQuota.fullPageDescription")}
                    />
                ),
                () => (
                    <StackV
                        principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={bodyItems}
                    />
                ),
            ]}
        />
    )
}
