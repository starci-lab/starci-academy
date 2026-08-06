"use client"

import React, {
    useMemo,
} from "react"
import {
    Card,
    CardContent,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    KeyRow,
} from "./KeyRow"
import type { AiBalancerProviderHealth } from "@/modules/api/graphql/queries/types/ai-balancer-health"
import { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { StackH, StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

interface ProviderSectionProps extends WithClassNames<undefined> {
    /** Provider aggregate from GraphQL. */
    providerHealth: AiBalancerProviderHealth
}

/**
 * Card listing all keys for one AI provider in the balancer pool.
 *
 * List item: keeps its own `providerHealth` payload but reads all display
 * labels itself from the i18n hook (no prop-drilled label maps).
 * @param props.providerHealth - Provider snapshot from GraphQL.
 */
export const ProviderSection = ({
    providerHealth,
}: ProviderSectionProps) => {
    const t = useTranslations("admin.aiBalancer")

    /** Localized provider display name, falling back to the raw provider id. */
    const providerLabel = useMemo(
        (): string => {
            const labelByProvider: Record<string, string> = {
                [ModelProvider.Gemini]: t("providers.gemini"),
                [ModelProvider.OpenAI]: t("providers.openai"),
            }
            return labelByProvider[providerHealth.provider] ?? providerHealth.provider
        },
        [
            t,
            providerHealth.provider,
        ],
    )

    /** Column header labels for the keys table. */
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

    /** Summary pill labels (active / disabled / total). */
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
            {/* ps-admin-1: p-5 has no house token (dropped from padding scale) — teacher-hold */}
            <CardContent data-principle="ps-admin-1" className="p-5">
                <StackV gap={4} principle="card-caption"
                    explain="Holds caption text under card media so the caption stays attached to the image above it."
                    items={[
                        () => (
                            <StackH gap={4} principle="content-row" align="start" justify="between"
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                items={[
                                    () => (
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                {providerLabel}
                                            </h2>
                                            <p className="mt-1 font-mono text-xs text-slate-500">
                                                {providerHealth.keysFilePath}
                                            </p>
                                        </div>
                                    ),
                                    () => (
                                        <Box principle="chip-row" className="flex flex-wrap gap-2 text-xs"
                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column.">
                                            {/* ps-admin-3: span px-3 py-1 — py-1 not control-pad (needs py-2) — teacher-hold */}
                                            <span data-principle="ps-admin-3" className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                                                {summaryLabels.active}: {providerHealth.activeKeys}
                                            </span>
                                            <span data-principle="ps-admin-3" className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-300">
                                                {summaryLabels.disabled}: {providerHealth.disabledKeys}
                                            </span>
                                            <span data-principle="ps-admin-3" className="rounded-full bg-slate-500/10 px-3 py-1 text-slate-300">
                                                {summaryLabels.total}: {providerHealth.totalKeys}
                                            </span>
                                        </Box>
                                    ),
                                ]} />
                        ),
                        () => (
                            <div className="overflow-x-auto rounded-lg border border-white/5">
                                <table className="min-w-full text-left">
                                    <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                                        <tr>
                                            {/* ps-admin-4: th px-4 py-2 — HTML table cell, genuine foreign mount — teacher-hold */}
                                            <th data-principle="ps-admin-4" className="px-4 py-2 font-medium">
                                                {columnLabels.suffix}
                                            </th>
                                            <th data-principle="ps-admin-4" className="px-4 py-2 font-medium">
                                                {columnLabels.status}
                                            </th>
                                            <th data-principle="ps-admin-4" className="px-4 py-2 font-medium text-center">
                                                {columnLabels.failCount}
                                            </th>
                                            <th data-principle="ps-admin-4" className="px-4 py-2 font-medium">
                                                {columnLabels.lastPing}
                                            </th>
                                            <th data-principle="ps-admin-4" className="px-4 py-2 font-medium">
                                                {columnLabels.lastUsed}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedKeys.map((keyHealth) => (
                                            <KeyRow
                                                key={`${providerHealth.provider}-${keyHealth.keySuffix}`}
                                                keyHealth={keyHealth}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ),
                    ]} />
            </CardContent>
        </Card>
    )
}
