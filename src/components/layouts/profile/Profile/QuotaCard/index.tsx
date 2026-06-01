"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Chip,
    Skeleton,
    cn,
} from "@heroui/react"
import {
    GaugeIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAiQuotaOverlayState,
    useQueryMyAiQuotaSwr,
    useQueryMyCreditUsageSwr,
} from "@/hooks/singleton"
import {
    AiMode,
} from "@/modules/api"

/**
 * AI quota summary card on the profile hub.
 *
 * Container: reads the quota SWR, shows the active lane + the remaining
 * allowance in the current 5h window, and opens the full quota modal.
 * `"use client"` for the SWR singleton + overlay state.
 */
export const QuotaCard = () => {
    const t = useTranslations()
    const { open } = useAiQuotaOverlayState()
    const { data: quota, isLoading: isQuotaLoading } = useQueryMyAiQuotaSwr()
    const { data: creditUsage, isLoading: isCreditLoading } = useQueryMyCreditUsageSwr()

    /** Open the detailed AI quota modal. */
    const onView = useCallback(
        () => open(),
        [
            open,
        ],
    )

    const isPremium = quota?.mode === AiMode.Premium
    const remainingCredits = isPremium
        ? quota?.premium.remainingWeek
        : creditUsage?.windowWeek.remainingCredits
    const isLoading = isQuotaLoading || (!isPremium && isCreditLoading)

    return (
        <div className="flex flex-col gap-4 rounded-large bg-default/40 p-5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <GaugeIcon
                        weight="duotone"
                        className="size-5 text-accent"
                    />
                    <span className="font-semibold text-foreground">{t("aiQuota.cardTitle")}</span>
                </div>
                {quota ? (
                    <Chip
                        size="sm"
                        color={quota.tier ? "warning" : "accent"}
                        variant={quota.tier ? "soft" : "primary"}
                    >
                        {quota.tier
                            ? quota.tier.toUpperCase()
                            : t(`aiSettings.lanes.${quota.mode}.title`)}
                    </Chip>
                ) : null}
            </div>

            {isLoading || !quota ? (
                <Skeleton className="h-5 w-40 rounded-medium" />
            ) : (
                <div className="text-sm text-muted">
                    {t("aiQuota.remainingSummary", {
                        remaining: remainingCredits ?? 0,
                    })}
                </div>
            )}

            <Button
                variant="tertiary"
                fullWidth
                onPress={onView}
                className={cn("justify-center")}
            >
                {t("aiQuota.viewDetails")}
            </Button>
        </div>
    )
}
