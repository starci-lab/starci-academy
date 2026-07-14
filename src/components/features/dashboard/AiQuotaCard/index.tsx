"use client"

import React from "react"
import {
    Button,
    Chip,
    ProgressBar,
    Skeleton,
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"

/** Props for {@link AiQuotaCard}. */
export type AiQuotaCardProps = WithClassNames<undefined>

/** HeroUI {@link Chip} colour per paid tier. */
const TIER_CHIP_COLOR: Record<AiSubTier, "default" | "success" | "warning"> = {
    [AiSubTier.Plus]: "default",
    [AiSubTier.Pro]: "success",
    [AiSubTier.Max]: "warning",
}

/**
 * Right-rail AI-credit mini card: the single credit pool (free base + tier)
 * remaining in the current 5-hour and weekly windows, with a bar per window, a
 * tier chip when subscribed, and an upgrade CTA. Surfaces the AI allowance on
 * the home surface so the learner sees it before hitting the limit mid-task.
 * Self-fetches its own leaf query; renders nothing until the quota is known.
 * @param props - optional className for the root element.
 */
export const AiQuotaCard = ({
    className,
}: AiQuotaCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error, isLoading } = useQueryMyAiQuotaSwr()

    // the two rolling windows rendered as remaining/limit + a usage bar
    const windows = data ? [
        {
            key: "window5h",
            used: data.credit.used5h,
            limit: data.credit.limit5h,
            remaining: data.credit.remaining5h,
        },
        {
            key: "windowWeek",
            used: data.credit.usedWeek,
            limit: data.credit.limitWeek,
            remaining: data.credit.remainingWeek,
        },
    ] : []

    return (
        <AsyncContent
            isLoading={isLoading}
            skeleton={(
                <div className={cn("flex w-full flex-col gap-3", className)}>
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton className="h-5 w-32 rounded-lg" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-48 rounded-lg" />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                            <Skeleton className="h-3 w-20 rounded-lg" />
                            <Skeleton className="h-3 w-16 rounded-lg" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                            <Skeleton className="h-3 w-20 rounded-lg" />
                            <Skeleton className="h-3 w-16 rounded-lg" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-xl" />
                </div>
            )}
            // signed out / fetch failed / not yet loaded → self-hide (widget phụ,
            // không có generic error copy dùng chung để tránh thêm i18n key mới
            // cho 1 card phụ)
            isEmpty={!data}
            error={error}
        >
            {data ? (
                <div className={cn("flex w-full flex-col gap-3", className)}>
                    {/* title row — plain heading (no card, no icon) + tier chip */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold text-foreground">
                            {t("dashboard.aiQuota.title")}
                        </span>
                        {data.tier ? (
                            <Chip
                                size="sm"
                                color={TIER_CHIP_COLOR[data.tier]}
                                variant="soft"
                            >
                                {data.tier.toUpperCase()}
                            </Chip>
                        ) : null}
                    </div>
                    {/* clarify the two bars are ONE shared pool seen through two windows */}
                    <Typography type="body-xs" color="muted">
                        {t("dashboard.aiQuota.poolCaption")}
                    </Typography>
                    {windows.map((window) => (
                        <div
                            key={window.key}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="text-muted">
                                    {t(`dashboard.aiQuota.${window.key}`)}
                                </span>
                                <span className="font-medium text-foreground">
                                    {t("dashboard.aiQuota.credits", {
                                        remaining: window.remaining,
                                        limit: window.limit,
                                    })}
                                </span>
                            </div>
                            <ProgressBar
                                aria-label={t(`dashboard.aiQuota.${window.key}`)}
                                value={window.used}
                                maxValue={window.limit || 1}
                                color="accent"
                                size="sm"
                            >
                                <ProgressBar.Track>
                                    <ProgressBar.Fill />
                                </ProgressBar.Track>
                            </ProgressBar>
                        </div>
                    ))}
                    <Button
                        variant="tertiary"
                        size="sm"
                        className="self-start"
                        onPress={() => router.push(`/${locale}/profile/settings/ai-subscription`)}
                    >
                        {t("dashboard.aiQuota.upgrade")}
                    </Button>
                </div>
            ) : null}
        </AsyncContent>
    )
}
