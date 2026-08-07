"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import type { AiBalancerKeyHealth } from "@/modules/api/graphql/queries/types/ai-balancer-health"
import { AiBalancerKeyStatus } from "@/modules/api/graphql/queries/enums/ai-balancer-key-status"
import { KeyStatusChip } from "@/components/blocks/learn/AiBalancer/KeyStatusChip"
import { formatBalancerTimestamp } from "@/modules/utils/format-balancer-timestamp"

interface KeyRowProps {
    /** Key health row from GraphQL. */
    keyHealth: AiBalancerKeyHealth
}

/**
 * Table row for one API key suffix in the admin balancer dashboard.
 *
 * List item: keeps its own `keyHealth` payload but reads locale + status labels
 * itself from the i18n hooks (no prop-drilled label resolvers).
 * @param props.keyHealth - Per-key health payload.
 */
export const KeyRow = ({
    keyHealth,
}: KeyRowProps) => {
    const locale = useLocale()
    const t = useTranslations("admin.aiBalancer")

    /** Maps a status enum value to its translated label. */
    const statusLabel = (status: string) => {
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
    }

    return (
        <tr className="border-t border-separator text-sm text-foreground">
            <td data-principle="ps-admin-4" className="px-4 py-2 font-mono text-foreground">
                …{keyHealth.keySuffix}
            </td>
            <td data-principle="ps-admin-4" className="px-4 py-2">
                <KeyStatusChip
                    status={keyHealth.status}
                    label={statusLabel(keyHealth.status)}
                />
            </td>
            <td data-principle="ps-admin-4" className="px-4 py-2 text-center tabular-nums">
                {keyHealth.failCount}
            </td>
            <td data-principle="ps-admin-4" className="px-4 py-2 text-muted">
                {formatBalancerTimestamp(keyHealth.lastHealthCheckAt, locale)}
            </td>
            <td data-principle="ps-admin-4" className="px-4 py-2 text-muted">
                {formatBalancerTimestamp(keyHealth.lastUsedAt, locale)}
            </td>
        </tr>
    )
}
