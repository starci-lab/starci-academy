"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
} from "@heroui/react"
import type {
    AiBalancerProviderHealth,
} from "@/modules/api"
import {
    KeyStatusChip,
    KeyStatusChipVariant,
    formatBalancerTimestamp,
} from "@/components/reuseable/AiBalancer"
import {
    PROVIDER_COLOR_MAP,
} from "../../map"

interface ProviderCardProps {
    /** Provider aggregate from GraphQL. */
    providerHealth: AiBalancerProviderHealth
    /** Localized provider display name. */
    providerLabel: string
    /** BCP-47 locale for timestamps. */
    locale: string
    /** Maps status enum value to translated label. */
    statusLabel: (status: string) => string
    /** Localized column labels for the compact key list. */
    labels: {
        activeSummary: string
        lastPing: string
    }
}

/**
 * One provider card on the StarCi AI key-pool status section.
 *
 * @param props.providerHealth - Provider snapshot from GraphQL.
 */
export const ProviderCard = ({
    providerHealth,
    providerLabel,
    locale,
    statusLabel,
    labels,
}: ProviderCardProps) => {
    const sortedKeys = useMemo(
        () => [
            ...providerHealth.keys,
        ].sort((left, right) => left.keySuffix.localeCompare(right.keySuffix)),
        [
            providerHealth.keys,
        ],
    )

    const chipColor = PROVIDER_COLOR_MAP[providerHealth.provider] ?? "default"

    const activeSummary = useMemo(
        () => labels.activeSummary
            .replace("{active}", String(providerHealth.activeKeys))
            .replace("{total}", String(providerHealth.totalKeys)),
        [
            labels.activeSummary,
            providerHealth.activeKeys,
            providerHealth.totalKeys,
        ],
    )

    return (
        <div className="rounded-3xl border bg-background p-5 transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Chip
                        size="sm"
                        color={chipColor}
                        variant="primary"
                    >
                        {providerLabel}
                    </Chip>
                    <span className="text-sm text-muted">
                        {activeSummary}
                    </span>
                </div>
            </div>
            <div className="h-4" />
            <div className="flex flex-col gap-2">
                {sortedKeys.map((keyHealth) => (
                    <div
                        key={`${providerHealth.provider}-${keyHealth.keySuffix}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-default-200/60 bg-default-50/50 px-3 py-2"
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-foreground">
                                …{keyHealth.keySuffix}
                            </span>
                            <KeyStatusChip
                                status={keyHealth.status}
                                label={statusLabel(keyHealth.status)}
                                variant={KeyStatusChipVariant.Light}
                            />
                        </div>
                        <span className="text-xs text-muted">
                            {labels.lastPing}: {formatBalancerTimestamp(keyHealth.lastHealthCheckAt, locale)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
