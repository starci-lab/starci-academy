"use client"

import React, { useMemo } from "react"
import { Card, CardContent, Link, Typography, cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowUpRightIcon, BookOpenTextIcon } from "@phosphor-icons/react"
import { Callout } from "@/components/blocks/feedback/Callout"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { pathConfig } from "@/resources/path"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { ARCHITECTURE_MODULE_MAP } from "../modules"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { MetricsInline } from "../MetricsInline"
import { getArchitectureStatusVisual, resolveArchitectureStatus } from "../statusVisual"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link NodeDissectionPanel}. */
export interface NodeDissectionPanelProps extends WithClassNames<undefined> {
    /** Selected component name (must exist in the catalog). */
    nodeId: string
    /** Live health keyed by component name, or `null` before the first probe resolves. */
    healthByName: HealthByName | null
}

/**
 * The "dissection" panel for the currently selected node: identity (icon +
 * name + role), live status (dot + text + latency + relative freshness), a
 * short "why this matters" note, and — when the component has one — a link to
 * its StarCi engineering-blog deep-dive. Public-safe only: no secrets, no
 * connection strings, just role + live traffic-light + a public failure
 * message when down.
 *
 * @param props - {@link NodeDissectionPanelProps}
 */
export const NodeDissectionPanel = ({ nodeId, healthByName, className }: NodeDissectionPanelProps) => {
    const t = useTranslations("architecture")
    const tRoot = useTranslations()
    const locale = useLocale()
    const component = ARCHITECTURE_COMPONENT_MAP[nodeId]

    const state = resolveArchitectureStatus(nodeId, healthByName)
    const visual = getArchitectureStatusVisual(state)
    const health = healthByName?.[nodeId] ?? null

    const checkedAgo = useMemo(
        () => (health ? getTimeAgoLabel(getTimeAgoMessage(health.checkedAt), tRoot) : null),
        [health, tRoot],
    )

    // feature module (Core API split) — no health probe exists, so no status /
    // metrics / blog: identity + role + the real infra it runs on (grounded in
    // `usesInfra`), which is exactly what makes the "Core → modules" reading legible.
    const module = ARCHITECTURE_MODULE_MAP[nodeId]
    if (module) {
        const ModuleIcon = module.icon
        const infraNames = module.usesInfra.map((id) => ARCHITECTURE_COMPONENT_MAP[id]?.name ?? id)
        return (
            <Card className={cn(className)}>
                <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <IconTile icon={<ModuleIcon aria-hidden />} tone="neutral" size="sm" />
                        <div className="flex min-w-0 flex-col">
                            <Typography type="h4" weight="semibold" className="min-w-0 truncate">
                                {t(`module.${module.id}.name`)}
                            </Typography>
                            <Typography type="body-sm" color="muted">
                                {t(`module.${module.id}.sub`)}
                            </Typography>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-default pt-3">
                        <Typography type="body-sm" weight="medium">{t("panel.whyHeading")}</Typography>
                        <Typography type="body-sm" color="muted">{t(`module.${module.id}.role`)}</Typography>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-default pt-3">
                        <Typography type="body-sm" weight="medium">{t("panel.runsOn")}</Typography>
                        <div className="flex flex-wrap gap-2">
                            {infraNames.map((name) => (
                                <span key={name} className="rounded-full bg-default px-2 py-1 font-mono text-xs text-muted">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!component) return null

    const Icon = component.icon
    const blogHref = component.blogSlug
        ? `${pathConfig().locale(locale).blog().build()}/${component.blogSlug}`
        : null

    return (
        <Card className={cn(className)}>
            <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <IconTile icon={<Icon aria-hidden />} tone="neutral" size="sm" />
                        <div className="flex min-w-0 flex-col">
                            <Typography type="h4" weight="semibold" className="min-w-0 truncate font-mono">
                                {component.name}
                            </Typography>
                            <Typography type="body-sm" color="muted">
                                {t(`role.${component.name}`)}
                            </Typography>
                        </div>
                    </div>
                    <span className={cn("flex shrink-0 items-center gap-2 rounded-full px-2 py-1", visual.chipClassName)}>
                        <span className={cn("size-2 shrink-0 rounded-full", visual.dotClassName, visual.pulse && "animate-pulse")} aria-hidden />
                        <Typography type="body-xs" weight="medium" className="whitespace-nowrap">
                            {t(`status.${state}`)}
                        </Typography>
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="tabular-nums">
                        {health?.latencyMs == null ? "—" : t("panel.latency", { ms: health.latencyMs })}
                    </span>
                    {checkedAgo ? <span>{t("panel.checked", { ago: checkedAgo })}</span> : null}
                    <MetricsInline metrics={health?.metrics} />
                </div>

                {health?.message ? (
                    <Callout status="danger" title={health.message} />
                ) : null}

                <div className="flex flex-col gap-2 border-t border-default pt-3">
                    <Typography type="body-sm" weight="medium">{t("panel.whyHeading")}</Typography>
                    <Typography type="body-sm" color="muted">{t(`why.${component.name}`)}</Typography>
                </div>

                {blogHref ? (
                    <Link href={blogHref} className="group inline-flex items-center gap-2 text-accent">
                        <BookOpenTextIcon aria-hidden focusable="false" className="size-4" />
                        {t("panel.deepDive")}
                        <ArrowUpRightIcon
                            aria-hidden
                            focusable="false"
                            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                ) : null}
            </CardContent>
        </Card>
    )
}
