"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    useTranslations,
} from "next-intl"
import {
    QuotaBar,
} from "../QuotaBar"
import {
    useWindowResetLabel,
} from "../hooks"
import type {
    QuotaLaneWindow,
} from "../types"
import {
    QuotaLaneVariant,
} from "../types"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyCreditUsageSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCreditUsageSwr"

/** Props for {@link QuotaLane}. */
export interface QuotaLaneProps extends WithClassNames<undefined> {
    /** Which lane to load from SWR (`myCreditUsage` vs `myAiQuota`). */
    variant: QuotaLaneVariant
}

/**
 * One AI lane — title, status chips, and 5h / 7-day bars.
 * Fetches quota data internally; only {@link QuotaLaneProps.variant} is passed in.
 * @param props - {@link QuotaLaneProps}
 */
export const QuotaLane = ({
    variant,
    className,
}: QuotaLaneProps) => {
    const t = useTranslations()
    const buildResetLabel = useWindowResetLabel()
    const { data: quota } = useQueryMyAiQuotaSwr()
    const {
        data: creditUsage,
        isLoading: isCreditUsageLoading,
    } = useQueryMyCreditUsageSwr()

    const window5h = useMemo((): QuotaLaneWindow | null => {
        if (variant === QuotaLaneVariant.Auto) {
            if (!creditUsage) {
                return null
            }
            return {
                used: creditUsage.window5h.usedCredits,
                limit: creditUsage.window5h.quota,
                resetLabel: buildResetLabel(creditUsage.window5h.resetAt),
            }
        }
        if (!quota) {
            return null
        }
        return {
            used: quota.credit.used5h,
            limit: quota.credit.limit5h,
            resetLabel: buildResetLabel(quota.window5hResetAt),
        }
    }, [
        variant,
        creditUsage,
        quota,
        buildResetLabel,
    ])

    const windowWeek = useMemo((): QuotaLaneWindow | null => {
        if (variant === QuotaLaneVariant.Auto) {
            if (!creditUsage) {
                return null
            }
            return {
                used: creditUsage.windowWeek.usedCredits,
                limit: creditUsage.windowWeek.quota,
                resetLabel: buildResetLabel(creditUsage.windowWeek.resetAt),
            }
        }
        if (!quota) {
            return null
        }
        return {
            used: quota.credit.usedWeek,
            limit: quota.credit.limitWeek,
            resetLabel: buildResetLabel(quota.windowWeekResetAt),
        }
    }, [
        variant,
        creditUsage,
        quota,
        buildResetLabel,
    ])

    const laneSkeleton = (
        <div className={cn("flex flex-col gap-3", className)}>
            {[0, 1].map((row) => (
                <div key={row} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton.Typography type="body-sm" className="w-24" />
                        <Skeleton.Typography type="body-sm" className="w-16" />
                    </div>
                    <Skeleton.ProgressBar />
                    {/* reset-label line under the bar */}
                    <Skeleton.Typography type="body-xs" width="1/2" />
                </div>
            ))}
        </div>
    )

    if (variant === QuotaLaneVariant.Auto && (isCreditUsageLoading || !window5h || !windowWeek)) {
        return laneSkeleton
    }

    if (variant === QuotaLaneVariant.Premium && (!window5h || !windowWeek)) {
        return laneSkeleton
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <QuotaBar
                label={t("aiQuota.window5h")}
                used={window5h!.used}
                limit={window5h!.limit}
                resetLabel={window5h!.resetLabel}
            />
            <QuotaBar
                label={t("aiQuota.windowWeek")}
                used={windowWeek!.used}
                limit={windowWeek!.limit}
                resetLabel={windowWeek!.resetLabel}
            />
        </div>
    )
}
