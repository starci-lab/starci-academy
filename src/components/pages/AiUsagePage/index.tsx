"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Chip,
    Typography,
} from "@heroui/react"
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
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { StackH, StackV } from "@/components/frames/Stack"
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
            <LabeledCard
                label={t("aiQuota.creditPool")}
                action={() => (
                    <Chip
                        size="sm"
                        variant="soft"
                        color={quota?.tier === "max" ? "warning" : "default"}
                    >
                        <Chip.Label>
                            {quota?.tier
                                ? quota.tier.toUpperCase()
                                : t("aiQuota.freeTier")}
                        </Chip.Label>
                    </Chip>
                )}
            >
                <AiQuotaLane data={premiumLane} isLoading={isPremiumLaneLoading} />
            </LabeledCard>
        ),
        ...(showUpsell
            ? [() => (
                <StackH
                    gap={4}
                    justify="between"
                    align="center"
                    at="sm"
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    items={[
                        () => (
                            <Typography type="body-sm" className="text-warning-soft-foreground">
                                {upsellText}
                            </Typography>
                        ),
                        () => (
                            <Button
                                variant="primary"
                                onPress={onSubscribe}
                                className="@app-sm:shrink-0"
                            >
                                {upsellCta}
                            </Button>
                        ),
                    ]}
                />
            )]
            : []),
        () => <AiUsageHistory />,
    ]

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("aiQuota.fullPageTitle")} />}
                title={t("aiQuota.fullPageTitle")}
                description={t("aiQuota.fullPageDescription")}
            />
            <StackV gap={6} items={bodyItems} />
        </div>
    )
}
