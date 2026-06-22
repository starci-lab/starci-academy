"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Breadcrumbs,
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
    useQueryMyAiQuotaSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources"
import {
    AiSubTier,
} from "@/modules/api"
import {
    LabeledCard,
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
    /** Navigate to the settings root (breadcrumb parent of every settings page). */
    const onNavigateSettings = useCallback(
        () => router.push(pathConfig().locale(locale).profile().settings().build()),
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

    // upsell prompt under the credit card: free → "buy a plan"; paid-but-not-max →
    // "upgrade"; on the MAX plan there is nothing left to sell, so it hides.
    const tier = quota?.tier ?? null
    const showUpsell = tier !== AiSubTier.Max
    const upsellText = tier
        ? t("aiQuota.upgradeWarning", { tier: tier.toUpperCase() })
        : t("aiQuota.subscriptionNone")
    const upsellCta = tier ? t("aiQuota.upgradeCta") : t("aiQuota.subscribeCta")

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateSettings}>
                    {t("nav.settings")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("aiQuota.fullPageTitle")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>

            <PageHeader
                title={t("aiQuota.fullPageTitle")}
                description={t("aiQuota.fullPageDescription")}
            />

            {/* one unified credit pool (5h + week windows) — the lane it is billed under is a
                backend concern, not a display axis. Only the tier chip sits in the label action;
                the subscribe/upgrade CTA moved below the card into the upsell prompt. */}
            <LabeledCard
                label={t("aiQuota.creditPool")}
                action={(
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
                <QuotaLane variant={QuotaLaneVariant.Premium} />
            </LabeledCard>

            {/* upsell prompt — urges free users to buy / paid users to upgrade; hidden on MAX */}
            {showUpsell ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Typography type="body-sm" className="text-warning">
                        {upsellText}
                    </Typography>
                    <Button
                        variant="primary"
                        onPress={onSubscribe}
                        className="sm:shrink-0"
                    >
                        {upsellCta}
                    </Button>
                </div>
            ) : null}

            {/* usage insight — chart / by-provider / history, each its own card */}
            <AiUsageHistory />
        </div>
    )
}
