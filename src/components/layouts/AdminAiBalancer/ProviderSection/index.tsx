"use client"

import React, {
    useMemo,
} from "react"
import {
    Card,
    CardContent,
} from "@heroui/react"
import type {
    AiBalancerProviderHealth,
} from "@/modules/api"
import {
    KeyRow,
} from "./KeyRow"

interface ProviderSectionProps {
    /** Provider aggregate from GraphQL. */
    providerHealth: AiBalancerProviderHealth
    /** BCP-47 locale for timestamps. */
    locale: string
    /** Localized provider display name. */
    providerLabel: string
    /** Maps status enum value to translated label. */
    statusLabel: (status: string) => string
    /** Column header labels for the keys table. */
    columnLabels: {
        suffix: string
        status: string
        failCount: string
        lastPing: string
        lastUsed: string
    }
    /** Summary line template values (active / total). */
    summaryLabels: {
        active: string
        disabled: string
        total: string
    }
}

/**
 * Card listing all keys for one AI provider in the balancer pool.
 *
 * @param props.providerHealth - Provider snapshot from GraphQL.
 */
export const ProviderSection = ({
    providerHealth,
    locale,
    providerLabel,
    statusLabel,
    columnLabels,
    summaryLabels,
}: ProviderSectionProps) => {
    const sortedKeys = useMemo(
        () => [
            ...providerHealth.keys,
        ].sort((left, right) => left.keySuffix.localeCompare(right.keySuffix)),
        [
            providerHealth.keys,
        ],
    )

    return (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {providerLabel}
                        </h2>
                        <p className="mt-1 font-mono text-xs text-slate-500">
                            {providerHealth.keysFilePath}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                            {summaryLabels.active}: {providerHealth.activeKeys}
                        </span>
                        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-300">
                            {summaryLabels.disabled}: {providerHealth.disabledKeys}
                        </span>
                        <span className="rounded-full bg-slate-500/10 px-3 py-1 text-slate-300">
                            {summaryLabels.total}: {providerHealth.totalKeys}
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-white/5">
                    <table className="min-w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-2 font-medium">
                                    {columnLabels.suffix}
                                </th>
                                <th className="px-4 py-2 font-medium">
                                    {columnLabels.status}
                                </th>
                                <th className="px-4 py-2 font-medium text-center">
                                    {columnLabels.failCount}
                                </th>
                                <th className="px-4 py-2 font-medium">
                                    {columnLabels.lastPing}
                                </th>
                                <th className="px-4 py-2 font-medium">
                                    {columnLabels.lastUsed}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedKeys.map((keyHealth) => (
                                <KeyRow
                                    key={`${providerHealth.provider}-${keyHealth.keySuffix}`}
                                    keyHealth={keyHealth}
                                    locale={locale}
                                    statusLabel={statusLabel}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
