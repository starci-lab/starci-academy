"use client"

import {
    useMemo,
} from "react"
import type {
    AiQuotaLaneData,
} from "@/components/starci/blocks/ai/AiQuotaLane"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyCreditUsageSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCreditUsageSwr"
import { useWindowResetLabel } from "@/components/modalsv2/AiQuotaModal/hooks"
import {
    QuotaLaneVariant,
} from "./quota-lane-variant"

/** Return shape of {@link useQuotaLaneData}. */
export interface UseQuotaLaneDataResult {
    /** The lane's two windows, ready for `AiQuotaLane`. Unset while `isLoading` (or before the first fetch lands). */
    data?: AiQuotaLaneData
    /** `true` → this lane's own fetch is in flight. */
    isLoading: boolean
}

/**
 * Derives one {@link AiQuotaLaneData} lane for the canonical `AiQuotaLane` block —
 * ported from the retired `src/components/modals/AiQuotaModal/QuotaLane`'s own
 * variant switch: the Auto lane reads `myCreditUsage`, the Premium lane reads
 * `myAiQuota`, both windows' reset lines go through {@link useWindowResetLabel}.
 *
 * @param variant - Which lane to derive (`myCreditUsage` vs `myAiQuota`).
 * @returns {@link UseQuotaLaneDataResult}
 */
export const useQuotaLaneData = (variant: QuotaLaneVariant): UseQuotaLaneDataResult => {
    const buildResetLabel = useWindowResetLabel()
    const { data: quota, isLoading: isQuotaLoading } = useQueryMyAiQuotaSwr()
    const {
        data: creditUsage,
        isLoading: isCreditUsageLoading,
    } = useQueryMyCreditUsageSwr()

    const data = useMemo<AiQuotaLaneData | undefined>(() => {
        if (variant === QuotaLaneVariant.Auto) {
            if (!creditUsage) {
                return undefined
            }
            return {
                window5h: {
                    used: creditUsage.window5h.usedCredits,
                    limit: creditUsage.window5h.quota,
                    resetLabel: buildResetLabel(creditUsage.window5h.resetAt),
                },
                windowWeek: {
                    used: creditUsage.windowWeek.usedCredits,
                    limit: creditUsage.windowWeek.quota,
                    resetLabel: buildResetLabel(creditUsage.windowWeek.resetAt),
                },
            }
        }
        if (!quota) {
            return undefined
        }
        return {
            window5h: {
                used: quota.credit.used5h,
                limit: quota.credit.limit5h,
                resetLabel: buildResetLabel(quota.window5hResetAt),
            },
            windowWeek: {
                used: quota.credit.usedWeek,
                limit: quota.credit.limitWeek,
                resetLabel: buildResetLabel(quota.windowWeekResetAt),
            },
        }
    }, [
        variant,
        creditUsage,
        quota,
        buildResetLabel,
    ])

    return {
        data,
        isLoading: variant === QuotaLaneVariant.Auto ? isCreditUsageLoading : isQuotaLoading,
    }
}
