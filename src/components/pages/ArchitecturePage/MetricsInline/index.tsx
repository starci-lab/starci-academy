import React from "react"
import { cn } from "@heroui/react"
import { ArrowsDownUpIcon, CpuIcon, MemoryIcon } from "@phosphor-icons/react"
import type { ComponentMetrics } from "@/modules/api/graphql/queries/types/system-health-status"
import { formatBytesPerSecond, formatCpuPercent, formatMemory } from "../metricsFormat"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MetricsInline}. */
export interface MetricsInlineProps extends WithClassNames<undefined> {
    /** Live resource metrics for this component, or `null`/`undefined` when
     *  there's no local container to measure (or no sample yet) — renders
     *  nothing rather than a fake placeholder. */
    metrics: ComponentMetrics | null | undefined
}

/**
 * A compact CPU / memory / network readout for one component, shared by
 * {@link import("../ArchitectureRail").ArchitectureRail} (rail row) and
 * {@link import("../NodeDissectionPanel").NodeDissectionPanel} (detail panel) —
 * same "flex-wrap of small icon+text chips" treatment `panel.latency` already
 * uses. Every field is independently gated on being non-null: a component
 * with only, say, `cpuPercent` known shows just that one chip, never a `0`/
 * "N/A" filler for the others. Renders nothing at all when every field is null.
 *
 * @param props - {@link MetricsInlineProps}
 */
export const MetricsInline = ({ metrics, className }: MetricsInlineProps) => {
    const cpu = formatCpuPercent(metrics?.cpuPercent)
    const memory = formatMemory(metrics?.memoryUsedBytes, metrics?.memoryLimitBytes)
    const network = metrics
        ? [formatBytesPerSecond(metrics.networkRxBytesPerSec), formatBytesPerSecond(metrics.networkTxBytesPerSec)]
        : [null, null]
    const [rx, tx] = network

    if (cpu == null && memory == null && rx == null && tx == null) return null

    return (
        <span className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
            {cpu != null ? (
                <span className="inline-flex items-center gap-1 tabular-nums">
                    <CpuIcon aria-hidden focusable="false" className="size-3 shrink-0" />
                    {cpu}
                </span>
            ) : null}
            {memory != null ? (
                <span className="inline-flex items-center gap-1 tabular-nums">
                    <MemoryIcon aria-hidden focusable="false" className="size-3 shrink-0" />
                    {memory}
                </span>
            ) : null}
            {rx != null || tx != null ? (
                <span className="inline-flex items-center gap-1 tabular-nums">
                    <ArrowsDownUpIcon aria-hidden focusable="false" className="size-3 shrink-0" />
                    {rx != null ? `↓ ${rx}` : null}
                    {rx != null && tx != null ? " " : null}
                    {tx != null ? `↑ ${tx}` : null}
                </span>
            ) : null}
        </span>
    )
}
