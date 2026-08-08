"use client"

import React, { useMemo } from "react"
import { Card, CardContent } from "@heroui/react"
import { useTranslations } from "next-intl"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { Box } from "@/components/frames/Box"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { StackH, StackV } from "@/components/frames/Stack"
import { resolveComponentStatusVisual } from "../map"
import type { SystemHealthComponent } from "@/modules/api/graphql/queries/types/system-health-status"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"

/** Props for {@link ComponentCard}. */
export interface ComponentCardProps {
    /** One probed infrastructure component from GraphQL. */
    component: SystemHealthComponent
}

/**
 * A single infrastructure component card on the public status page — status dot
 * + name, a status chip, latency ("12ms"), and a relative last-checked time.
 *
 * List item: keeps its own `component` payload but reads its own status labels
 * + relative-time strings from the i18n hooks (no prop-drilled maps).
 * @param props.component - Probed component snapshot.
 */
export const ComponentCard = ({ component }: ComponentCardProps) => {
    const t = useTranslations()
    const visual = resolveComponentStatusVisual(component.status)

    const statusLabel = t(`status.componentStatus.${component.status}`)

    const checkedAgo = useMemo(
        () => getTimeAgoLabel(getTimeAgoMessage(component.checkedAt), t),
        [component.checkedAt, t],
    )

    return (
        <Card className="border border-default bg-surface">
            {/* Vendor CardContent padding cleared so house card-padding owns the inset. */}
            <CardContent className="p-0">
                <Box principle="card-padding" className="p-4"
                    explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                    <StackV
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={[
                            () => (
                                <StackH
                                    principle="flex-action-between"
                                    explain="Identity and status chip shoved apart on one control row — not plain flex-action, because the status reads as the trailing commit."
                                    items={[
                                        () => (
                                            <FillAvailable
                                                at="base"
                                                explain="Component name takes remaining header width beside the status chip so long service ids truncate."
                                                body={() => (
                                                    <StackH
                                                        principle="identity"
                                                        explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                                        items={[
                                                            () => (
                                                                <span
                                                                    className={`size-2.5 shrink-0 rounded-full ${visual.dotClassName}`}
                                                                    aria-hidden
                                                                />
                                                            ),
                                                            () => (
                                                                <span className="truncate font-mono text-sm font-medium text-foreground">
                                                                    {component.name}
                                                                </span>
                                                            ),
                                                        ]}
                                                    />
                                                )}
                                            />
                                        ),
                                        () => (
                                            <StatusChip tone={visual.tone} icon={visual.icon}>
                                                {statusLabel}
                                            </StatusChip>
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                <StackH
                                    principle="flex-action-between"
                                    explain="Latency and checked-ago meta shoved apart on one control row — not plain flex-action, because the pair reads as escape/commit ends."
                                    items={[
                                        () => (
                                            <span className="tabular-nums text-xs text-muted">
                                                {component.latencyMs === null
                                                    ? "—"
                                                    : t("status.latency", { ms: component.latencyMs })}
                                            </span>
                                        ),
                                        () => (
                                            <span className="truncate text-xs text-muted">
                                                {t("status.checked", { ago: checkedAgo })}
                                            </span>
                                        ),
                                    ]}
                                />
                            ),
                            ...(component.message ? [() => (
                                <p className="truncate text-xs text-danger-soft-foreground" title={component.message ?? undefined}>
                                    {component.message}
                                </p>
                            )] : []),
                        ]}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}
