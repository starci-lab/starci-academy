"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
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
    useQueryAiBalancerHealthSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    AiBalancerKeyStatus,
    ModelProvider,
} from "@/modules/api"
import {
    TopBar,
} from "./TopBar"
import {
    ProviderSection,
} from "./ProviderSection"
import {
    AdminAiBalancerSkeleton,
} from "./AdminAiBalancerSkeleton"

/**
 * Admin dashboard for live AI balancer API key health (Redis ping cache + pool).
 *
 * Requires admin API key in Redux (same gate as other admin tools) and an
 * authenticated session for the GraphQL query. Polls every 10s.
 */
export const AdminAiBalancer = () => {
    const apiKey = useAppSelector((state) => state.admin.apiKey)
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations("admin.aiBalancer")
    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useQueryAiBalancerHealthSwr()

    useEffect(() => {
        if (!apiKey) {
            router.replace("../../admin")
        }
    }, [
        apiKey,
        router,
    ])

    const providerLabelMap = useMemo(
        (): Record<string, string> => ({
            [ModelProvider.Gemini]: t("providers.gemini"),
            [ModelProvider.OpenAI]: t("providers.openai"),
            [ModelProvider.Claude]: t("providers.claude"),
            [ModelProvider.OpenRouter]: t("providers.openrouter"),
        }),
        [
            t,
        ],
    )

    const statusLabel = useCallback(
        (status: string) => {
            if (status === AiBalancerKeyStatus.Active) {
                return t("status.active")
            }
            if (status === AiBalancerKeyStatus.Disabled) {
                return t("status.disabled")
            }
            if (status === AiBalancerKeyStatus.Probing) {
                return t("status.probing")
            }
            return status
        },
        [
            t,
        ],
    )

    const columnLabels = useMemo(
        () => ({
            suffix: t("columns.suffix"),
            status: t("columns.status"),
            failCount: t("columns.failCount"),
            lastPing: t("columns.lastPing"),
            lastUsed: t("columns.lastUsed"),
        }),
        [
            t,
        ],
    )

    const summaryLabels = useMemo(
        () => ({
            active: t("summary.active"),
            disabled: t("summary.disabled"),
            total: t("summary.total"),
        }),
        [
            t,
        ],
    )

    const sortedProviders = useMemo(
        () => [
            ...(data?.providers ?? []),
        ].sort((left, right) => left.provider.localeCompare(right.provider)),
        [
            data?.providers,
        ],
    )

    const onRefresh = useCallback(
        () => {
            void mutate()
        },
        [
            mutate,
        ],
    )

    const ready = !isLoading && !!data && !error

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pb-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <TopBar />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-slate-400">
                        {t("subtitle")}
                    </p>
                    {isValidating ? (
                        <p className="text-xs text-indigo-300">
                            {t("refreshing")}
                        </p>
                    ) : null}
                </div>
                {!ready ? (
                    <AdminAiBalancerSkeleton />
                ) : (
                    <div className="flex flex-col gap-6">
                        {sortedProviders.map((providerHealth) => (
                            <ProviderSection
                                key={providerHealth.provider}
                                providerHealth={providerHealth}
                                locale={locale}
                                providerLabel={
                                    providerLabelMap[providerHealth.provider]
                                    ?? providerHealth.provider
                                }
                                statusLabel={statusLabel}
                                columnLabels={columnLabels}
                                summaryLabels={summaryLabels}
                            />
                        ))}
                        {sortedProviders.length === 0 ? (
                            <p className="text-center text-sm text-slate-400">
                                {t("empty")}
                            </p>
                        ) : null}
                    </div>
                )}
                {error ? (
                    <p className="text-center text-sm text-rose-300">
                        {t("error")}
                    </p>
                ) : null}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mx-auto text-indigo-300"
                    onPress={onRefresh}
                >
                    {t("refreshNow")}
                </Button>
            </div>
        </div>
    )
}
