"use client"

import React, {
    useCallback,
} from "react"
import {
    Link,
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
} from "../Settings/SettingsBreadcrumb"
import { pathConfig } from "@/resources/path"
import { PageHeader } from "@/components/blocks/layout/PageHeader"

/**
 * AI settings page.
 *
 * BYOK (bring-your-own-key) was removed from the main flow — grading + the lesson
 * tutor run ONLY on the StarCi System pool: the system auto-picks a model by task
 * difficulty + the user's plan (no per-user key/lane config). So this page no
 * longer manages a key; it just explains that and cross-links to the AI plans.
 * (BYOK may return later, scoped to the AI Lab playground.)
 */
export const AiSettings = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    /** Navigate to the AI subscription page (where higher model tiers unlock). */
    const onNavigateSubscription = useCallback(
        () => router.push(`${pathConfig().locale(locale).profile().build()}/ai-subscription`),
        [
            router,
            locale,
        ],
    )

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("aiSettings.title")} />}
                title={t("aiSettings.title")}
                description={t("aiSettings.systemDescription")}
            />
            <div className="flex flex-wrap items-center gap-2">
                <Typography type="body-sm" color="muted">
                    {t("aiSettings.upgradePrompt")}
                </Typography>
                <Link onPress={onNavigateSubscription}>
                    {t("aiSettings.byok.upsellCta")}
                </Link>
            </div>
        </div>
    )
}
