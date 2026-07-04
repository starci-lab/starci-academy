"use client"

import React, { useMemo } from "react"
import { Label, ListBox, ScrollShadow, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ARCHITECTURE_COMPONENTS } from "../constants"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { getArchitectureStatusVisual, resolveArchitectureStatus } from "../statusVisual"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ArchitectureRail}. */
export interface ArchitectureRailProps extends WithClassNames<undefined> {
    /** Live health keyed by component name, or `null` before the first probe resolves. */
    healthByName: HealthByName | null
    /** Selected node id, mirrored to `?node=`. */
    selectedId: string
    /** Selects a node (rail row, map click, or mobile chip all call this). */
    onSelect: (id: string) => void
}

/** One rail row: icon + name/tagline + a live status dot WITH a text label —
 *  never color-only (a11y: dot + text, ≥3:1 contrast). Shared by both the
 *  "own" and "external" groups below. */
const ComponentRow = ({
    name,
    icon: Icon,
    healthByName,
}: {
    name: string
    icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    healthByName: HealthByName | null
}) => {
    const t = useTranslations("architecture")
    const state = resolveArchitectureStatus(name, healthByName)
    const visual = getArchitectureStatusVisual(state)
    return (
        <span className="flex w-full min-w-0 items-center gap-2">
            <Icon aria-hidden className="size-4 shrink-0 text-muted" />
            <span className="flex min-w-0 flex-1 flex-col">
                <Typography type="body-sm" weight="medium" className="min-w-0 truncate">
                    {name}
                </Typography>
                <Typography type="body-xs" color="muted" className="min-w-0 truncate">
                    {t(`rail.tagline.${name}`)}
                </Typography>
            </span>
            <span className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5", visual.chipClassName)}>
                <span className={cn("size-1.5 shrink-0 rounded-full", visual.dotClassName, visual.pulse && "animate-pulse")} aria-hidden />
                <Typography type="body-xs" className="whitespace-nowrap">
                    {t(`status.${state}`)}
                </Typography>
            </span>
        </span>
    )
}

/**
 * Desktop LEFT RAIL — the "docs-style" sidebar (pinned header + scroll region,
 * full rail height) listing every probed component, GROUPED into StarCi's own
 * system vs the external SaaS it depends on. Selecting a row drives the shared
 * `?node=` state (rail ⇄ map ⇄ dissection panel). Placed in the rail column by
 * the page shell; reads/writes URL state via the `onSelect` callback + the
 * `selectedId` prop (owned by the parent so the mobile chip row stays in sync
 * too).
 *
 * @param props - {@link ArchitectureRailProps}
 */
export const ArchitectureRail = ({ healthByName, selectedId, onSelect, className }: ArchitectureRailProps) => {
    const t = useTranslations("architecture")

    const ownComponents = useMemo(() => ARCHITECTURE_COMPONENTS.filter((c) => c.group === "own"), [])
    const externalComponents = useMemo(() => ARCHITECTURE_COMPONENTS.filter((c) => c.group === "external"), [])

    const onSelectionChange = (keys: Set<React.Key> | "all") => {
        if (keys === "all") return
        const key = [...keys][0]
        if (typeof key === "string") onSelect(key)
    }

    return (
        <div className={cn("relative flex min-h-0 min-w-0 flex-col gap-3 p-6", className)}>
            <ScrollShadow hideScrollBar className="-mx-1 min-h-0 min-w-0 flex-1 overflow-y-auto px-1">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label className="px-1 text-xs text-muted">{t("rail.ownGroup")}</Label>
                        <ListBox
                            aria-label={t("rail.ownGroup")}
                            selectionMode="single"
                            selectedKeys={ownComponents.some((c) => c.name === selectedId) ? [selectedId] : []}
                            onSelectionChange={onSelectionChange}
                            className="gap-1 p-0"
                        >
                            {ownComponents.map((component) => (
                                <ListBox.Item
                                    key={component.name}
                                    id={component.name}
                                    textValue={component.name}
                                    className="cursor-pointer rounded-2xl px-3 py-2 data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent/10"
                                >
                                    <ComponentRow name={component.name} icon={component.icon} healthByName={healthByName} />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="px-1 text-xs text-muted">{t("rail.externalGroup")}</Label>
                        <ListBox
                            aria-label={t("rail.externalGroup")}
                            selectionMode="single"
                            selectedKeys={externalComponents.some((c) => c.name === selectedId) ? [selectedId] : []}
                            onSelectionChange={onSelectionChange}
                            className="gap-1 p-0"
                        >
                            {externalComponents.map((component) => (
                                <ListBox.Item
                                    key={component.name}
                                    id={component.name}
                                    textValue={component.name}
                                    className="cursor-pointer rounded-2xl px-3 py-2 data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent/10"
                                >
                                    <ComponentRow name={component.name} icon={component.icon} healthByName={healthByName} />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </div>
                </div>
            </ScrollShadow>
        </div>
    )
}
