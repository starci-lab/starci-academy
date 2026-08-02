"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { useAiQuotaOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { resetAiQuotaTab, setAiQuotaTab } from "@/redux/slices/tabs"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useQueryMyCreditUsageSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCreditUsageSwr"
import { useAiQuotaHistorySwr, useWindowResetLabel } from "@/components/modals/AiQuotaModal/hooks"
import { pathConfig } from "@/resources/path"
import {
    _AiQuotaModal,
    type AiQuotaModalAutoState,
    type AiQuotaModalHistoryState,
    type AiQuotaModalSubscriptionState,
    type AiQuotaModalTab,
} from "./component"
import {
    buildAiQuotaHistoryChartPoints,
    toAiQuotaHistoryChargeItem,
    toAiQuotaModalTab,
    toAiQuotaTier,
    toRealAiQuotaTab,
} from "./map"

/**
 * AI usage quota dialog — the CONNECTED half of `AiQuotaModal`: reads the overlay open-state
 * (`useAiQuotaOverlayState`, zustand), the active tab (redux `state.tabs.aiQuotaTab`, shared with
 * the un-migrated `src/components/modals/AiQuotaModal`), and each tab's own SWR data
 * (`myAiQuota` / `myCreditUsage` / the credit-usage history query — reusing the real modal's own
 * `useAiQuotaHistorySwr` + `useWindowResetLabel` hooks unchanged), converts every real/blueprint
 * enum boundary (see `./map`), and hands fully-typed data to the presentational {@link _AiQuotaModal}.
 *
 * TODO(i18n): `_AiQuotaModal` owns its own hardcoded English vocabulary (tab labels, tier badge,
 * "View full usage") ported straight from the blueprint — same block-owned-vocabulary call as the
 * `LessonVideoModal` port. `aiQuota.*` keys already exist in en/vi.json and should replace it once
 * the presentational file takes label props instead (out of this pilot's scope).
 */
export const AiQuotaModal = () => {
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isOpen, setOpen } = useAiQuotaOverlayState()
    const reduxTab = useAppSelector((state) => state.tabs.aiQuotaTab)
    const buildResetLabel = useWindowResetLabel()

    const { data: quota, isLoading: isQuotaLoading } = useQueryMyAiQuotaSwr()
    const { data: creditUsage, isLoading: isCreditUsageLoading } = useQueryMyCreditUsageSwr()
    const { data: historyData, isLoading: isHistoryLoading } = useAiQuotaHistorySwr()

    // Mirrors the real modal's own effect: leaving the dialog resets the tab to Auto,
    // so it never reopens on whichever tab the viewer last had selected.
    useEffect(() => {
        if (!isOpen) {
            dispatch(resetAiQuotaTab())
        }
    }, [isOpen, dispatch])

    const activeTab = toAiQuotaModalTab(reduxTab)
    const onTabChange = useCallback(
        (tab: AiQuotaModalTab) => dispatch(setAiQuotaTab(toRealAiQuotaTab(tab))),
        [dispatch],
    )

    // Auto tab — free/auto lane, from `myCreditUsage` (mirrors the real `QuotaLane`'s Auto branch).
    const auto = useMemo<AiQuotaModalAutoState>(() => ({
        data: creditUsage ? {
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
        } : undefined,
        isLoading: isCreditUsageLoading,
    }), [creditUsage, isCreditUsageLoading, buildResetLabel])

    // Subscription tab's Premium lane — from `myAiQuota` (mirrors the real `QuotaLane`'s Premium branch).
    const subscription = useMemo<AiQuotaModalSubscriptionState>(() => ({
        data: quota ? {
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
        } : undefined,
        isLoading: isQuotaLoading,
    }), [quota, isQuotaLoading, buildResetLabel])

    // History tab — chart buckets + charge rows, from the same credit-usage-history query the
    // real `HistoryTab` uses (`useAiQuotaHistorySwr` already gates its fetch on this dialog's own
    // open-state + active tab, so no `enabled` override is needed here).
    const history = useMemo<AiQuotaModalHistoryState>(() => ({
        chartPoints: buildAiQuotaHistoryChartPoints(historyData?.items),
        items: historyData ? historyData.items.map(toAiQuotaHistoryChargeItem) : undefined,
        isLoading: isHistoryLoading,
    }), [historyData, isHistoryLoading])

    const onSubscribe = useCallback(() => {
        setOpen(false)
        router.push(pathConfig().locale(locale).profile().aiSubscription().build())
    }, [setOpen, router, locale])

    const onViewDetails = useCallback(() => {
        setOpen(false)
        router.push(pathConfig().locale(locale).profile().aiUsage().build())
    }, [setOpen, router, locale])

    return (
        <_AiQuotaModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            tier={toAiQuotaTier(quota?.tier ?? null)}
            activeTab={activeTab}
            onTabChange={onTabChange}
            auto={auto}
            subscription={subscription}
            history={history}
            onSubscribe={onSubscribe}
            onViewDetails={onViewDetails}
        />
    )
}
