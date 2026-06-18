"use client"

import { PulseIcon } from "@phosphor-icons/react"
import React, {
    useMemo,
} from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryAiBalancerHealthSwr,
} from "@/hooks"
import {
    AsyncContent,
} from "@/components/blocks"
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
 * Each {@link ProviderCard} derives its own labels via i18n hooks. The fetch is
 * wrapped in {@link AsyncContent} for the loading / error / empty branches.
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

    return (
        <section className={cn("flex flex-col gap-3", className)}>
            <div className="flex flex-wrap items-center gap-2">
                <PulseIcon
                    aria-hidden
                    focusable="false"
                    className="size-5 text-accent"
                />
                <div className="flex flex-col">
                    <Typography type="body" weight="semibold">
                        {t("title")}
                    </Typography>
                    <Typography type="body-xs" color="muted">
                        {isValidating ? t("refreshing") : t("subtitle")}
                    </Typography>
                </div>
            </div>
            <AsyncContent
                isLoading={isLoading || !data}
                error={error}
                errorContent={{ title: t("error") }}
                isEmpty={!!data && sortedProviders.length === 0}
                emptyContent={{ title: t("empty") }}
                skeleton={<KeyPoolStatusSkeleton />}
            >
                <div className="flex flex-col gap-3">
                    {sortedProviders.map((providerHealth) => (
                        <ProviderCard
                            key={providerHealth.provider}
                            providerHealth={providerHealth}
                        />
                    ))}
                </div>
            </AsyncContent>
        </section>
    )
}
