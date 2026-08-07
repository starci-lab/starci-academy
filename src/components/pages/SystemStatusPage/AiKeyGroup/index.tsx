"use client"

import React, { useMemo } from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { CpuIcon } from "@phosphor-icons/react"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AiKeyHealthGroup } from "@/modules/api/graphql/queries/types/ai-key-health"

/** Props for {@link AiKeyGroup}. */
export interface AiKeyGroupProps {
    /** One per-model AI key health group from GraphQL. */
    group: AiKeyHealthGroup
}

/**
 * One model group of AI keys on the public status page. Header reads
 * "<models> · <provider> · healthy/total keys"; below it a row of masked key
 * chips, each tinted success (healthy) or danger (unhealthy). Token-only colors
 * → works light + dark. The masked label (`sk-...x9f`) is all that is shown.
 *
 * List item: keeps its own `group` payload but reads its own labels from i18n.
 * @param props.group - Masked AI key health for one model.
 */
export const AiKeyGroup = ({ group }: AiKeyGroupProps) => {
    const t = useTranslations("status")

    const header = useMemo(() => {
        const models = group.models.join(", ") || group.provider
        return t("aiKeyGroupHeader", {
            models,
            provider: group.provider,
            healthy: group.healthyKeys,
            total: group.totalKeys,
        })
    }, [group, t])

    const chipItems = group.keys.map((key, index) => () => (
        <span
            key={`${key.keyMask}-${index}`}
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0 font-mono text-xs font-medium",
                key.healthy
                    ? "bg-success-soft text-success-soft-foreground"
                    : "bg-danger-soft text-danger-soft-foreground",
            )}
        >
            {key.keyMask}
        </span>
    ))

    return (
        <Card className="border border-default bg-surface">
            {/* Vendor CardContent padding cleared so house card-padding owns the inset. */}
            <CardContent className="p-0">
                <Box principle="card-padding" className="p-4"
                    explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                    <StackV
                        gap={4}
                        principle="label-field"
                        explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principle="identity"
                                    explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                    align="center"
                                    items={[
                                        () => (
                                            <CpuIcon
                                                aria-hidden
                                                focusable="false"
                                                className="size-4 shrink-0 text-muted"
                                            />
                                        ),
                                        () => (
                                            <span className="text-sm font-medium text-foreground">
                                                {header}
                                            </span>
                                        ),
                                    ]}
                                />
                            ),
                            () => (group.keys.length > 0 ? (
                                <Cluster gap={3} principle="chip-row" items={chipItems}
                                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                />
                            ) : (
                                <span className="text-xs text-muted">{t("noKeys")}</span>
                            )),
                        ]}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}
