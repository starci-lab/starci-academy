"use client"

import { Pulse as PulseIcon } from "@gravity-ui/icons"
import React, {
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryAiBalancerHealthSwr,
} from "@/hooks"
import type { WithClassNames } from "@/modules/types"
import {
    ProviderCard,
} from "./ProviderCard"
import {
    KeyPoolStatusSkeleton,
} from "./KeyPoolStatusSkeleton"

/** Props for {@link KeyPoolStatus}. */
export interface KeyPoolStatusProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props. */
    readonly _reserved?: undefined
}

/**
 * Live API key pool status for StarCi AI (Redis ping cache + balancer pool).
 *
 * Polls via {@link useQueryAiBalancerHealthSwr}; only key suffixes are shown.
 * Each {@link ProviderCard} derives its own labels via i18n hooks.
 */
export const KeyPoolStatus = ({ className }: KeyPoolStatusProps) => {
    const t = useTranslations("starciAi.keyPool")
    const {
        data,
        error,
        isLoading,
        isValidating,
    } = useQueryAiBalancerHealthSwr()

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
        <section className={cn("flex flex-col gap-3", className)}>
            <div className="flex flex-wrap items-center gap-1.5">
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
            <div className="flex flex-col gap-3">
                {sortedProviders.map((providerHealth) => (
                    <ProviderCard
                        key={providerHealth.provider}
                        providerHealth={providerHealth}
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
