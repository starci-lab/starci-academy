"use client"

import { Pulse as PulseIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useQueryAiBalancerHealthSwr,
} from "@/hooks"
import {
    AiBalancerKeyStatus,
    ModelProvider,
} from "@/modules/api"
import {
    ProviderCard,
} from "./ProviderCard"
import {
    KeyPoolStatusSkeleton,
} from "./KeyPoolStatusSkeleton"

/**
 * Live API key pool status for StarCi AI (Redis ping cache + balancer pool).
 *
 * Polls via {@link useQueryAiBalancerHealthSwr}; only key suffixes are shown.
 */
export const KeyPoolStatus = () => {
    const locale = useLocale()
    const t = useTranslations("starciAi.keyPool")
    const {
        data,
        error,
        isLoading,
        isValidating,
    } = useQueryAiBalancerHealthSwr()

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

    const cardLabels = useMemo(
        () => ({
            activeSummary: t("activeSummary"),
            lastPing: t("lastPing"),
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

    // error takes priority so a failed load never sticks on the skeleton
    if (error) {
        return (
            <div className="rounded-3xl border border-danger/30 bg-danger/5 p-5 text-sm text-danger">
                {t("error")}
            </div>
        )
    }

    // loading gate: skeleton while loading or before the data has settled
    if (isLoading || !data) {
        return <KeyPoolStatusSkeleton />
    }

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <PulseIcon
                    className="size-5 text-accent"
                />
                <div>
                    <h2 className="text-base font-semibold">
                        {t("title")}
                    </h2>
                    <p className="text-xs text-muted">
                        {isValidating ? t("refreshing") : t("subtitle")}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {sortedProviders.map((providerHealth) => (
                    <ProviderCard
                        key={providerHealth.provider}
                        providerHealth={providerHealth}
                        providerLabel={
                            providerLabelMap[providerHealth.provider]
                            ?? providerHealth.provider
                        }
                        locale={locale}
                        statusLabel={statusLabel}
                        labels={cardLabels}
                    />
                ))}
                {sortedProviders.length === 0 ? (
                    <p className="text-center text-sm text-muted">
                        {t("empty")}
                    </p>
                ) : null}
            </div>
        </section>
    )
}
