"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import type {
    AiBalancerProviderHealth,
} from "@/modules/api"
import {
    AiBalancerKeyStatus,
    ModelProvider,
} from "@/modules/api"
import {
    KeyStatusChip,
    KeyStatusChipVariant,
    formatBalancerTimestamp,
} from "@/components/reuseable/AiBalancer"
import {
    PROVIDER_COLOR_MAP,
} from "../../map"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link ProviderCard}. */
export interface ProviderCardProps extends WithClassNames<undefined> {
    /** Provider aggregate from GraphQL. */
    providerHealth: AiBalancerProviderHealth
}

/**
 * One provider card on the StarCi AI key-pool status section.
 *
 * List item: keeps its own data prop ({@link providerHealth}) and derives all
 * labels internally via i18n hooks. No callbacks accepted.
 *
 * @param props.providerHealth - Provider snapshot from GraphQL.
 */
export const ProviderCard = ({
    providerHealth,
    className,
}: ProviderCardProps) => {
    const locale = useLocale()
    const t = useTranslations("starciAi.keyPool")

    const providerLabelMap = useMemo(
        (): Record<string, string> => ({
            [ModelProvider.Gemini]: t("providers.gemini"),
            [ModelProvider.OpenAI]: t("providers.openai"),
            [ModelProvider.Claude]: t("providers.claude"),
            [ModelProvider.OpenRouter]: t("providers.openrouter"),
        }),
        [t],
    )

    const resolveStatusLabel = useCallback(
        (status: string) => {
            if (status === AiBalancerKeyStatus.Active) return t("status.active")
            if (status === AiBalancerKeyStatus.Disabled) return t("status.disabled")
            if (status === AiBalancerKeyStatus.Probing) return t("status.probing")
            return status
        },
        [t],
    )

    const providerLabel = providerLabelMap[providerHealth.provider] ?? providerHealth.provider
    const chipColor = PROVIDER_COLOR_MAP[providerHealth.provider] ?? "default"

    const activeSummary = useMemo(
        () => t("activeSummary")
            .replace("{active}", String(providerHealth.activeKeys))
            .replace("{total}", String(providerHealth.totalKeys)),
        [t, providerHealth.activeKeys, providerHealth.totalKeys],
    )

    const sortedKeys = useMemo(
        () => [...providerHealth.keys].sort((left, right) => left.keySuffix.localeCompare(right.keySuffix)),
        [providerHealth.keys],
    )

    return (
        <div className={cn("rounded-3xl border bg-background p-4 transition-shadow hover:shadow-md", className)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Chip
                        size="sm"
                        color={chipColor}
                        variant="primary"
                    >
                        {providerLabel}
                    </Chip>
                    <Typography type="body-sm" color="muted">
                        {activeSummary}
                    </Typography>
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
                            <Typography type="body-xs" weight="semibold" className="font-mono">
                                …{keyHealth.keySuffix}
                            </Typography>
                            <KeyStatusChip
                                status={keyHealth.status}
                                label={resolveStatusLabel(keyHealth.status)}
                                variant={KeyStatusChipVariant.Light}
                            />
                        </div>
                        <Typography type="body-xs" color="muted">
                            {t("lastPing")}: {formatBalancerTimestamp(keyHealth.lastHealthCheckAt, locale)}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    )
}
