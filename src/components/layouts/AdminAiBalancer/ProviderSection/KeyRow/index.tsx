"use client"

import React from "react"
import type {
    AiBalancerKeyHealth,
} from "@/modules/api"
import {
    KeyStatusChip,
    KeyStatusChipVariant,
    formatBalancerTimestamp,
} from "@/components/reuseable/AiBalancer"

interface KeyRowProps {
    /** Key health row from GraphQL. */
    keyHealth: AiBalancerKeyHealth
    /** BCP-47 locale for timestamps. */
    locale: string
    /** Maps status enum value to translated label. */
    statusLabel: (status: string) => string
}

/**
 * Table row for one API key suffix in the admin balancer dashboard.
 *
 * @param props.keyHealth - Per-key health payload.
 * @param props.locale - Active UI locale.
 * @param props.statusLabel - Status label resolver.
 */
export const KeyRow = ({
    keyHealth,
    locale,
    statusLabel,
}: KeyRowProps) => {
    return (
        <tr className="border-t border-white/5 text-sm text-slate-300">
            <td className="px-4 py-2 font-mono text-slate-200">
                …{keyHealth.keySuffix}
            </td>
            <td className="px-4 py-2">
                <KeyStatusChip
                    status={keyHealth.status}
                    label={statusLabel(keyHealth.status)}
                />
            </td>
            <td className="px-4 py-2 text-center tabular-nums">
                {keyHealth.failCount}
            </td>
            <td className="px-4 py-2 text-slate-400">
                {formatBalancerTimestamp(keyHealth.lastHealthCheckAt, locale)}
            </td>
            <td className="px-4 py-2 text-slate-400">
                {formatBalancerTimestamp(keyHealth.lastUsedAt, locale)}
            </td>
        </tr>
    )
}
