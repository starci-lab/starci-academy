"use client"

import React from "react"
import { ScrollShadow, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ARCHITECTURE_COMPONENTS } from "../../constants"
import type { HealthByName } from "../../hooks/useSystemHealthPoll"
import { getArchitectureStatusVisual, resolveArchitectureStatus } from "../../statusVisual"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ArchitectureMobileNav}. */
export interface ArchitectureMobileNavProps extends WithClassNames<undefined> {
    /** Live health keyed by component name, or `null` before the first probe resolves. */
    healthByName: HealthByName | null
    /** Selected node id, mirrored to `?node=`. */
    selectedId: string
    /** Selects a node — shares state with {@link import("..").ArchitectureRail}. */
    onSelect: (id: string) => void
}

/** One selectable chip: icon + name + status dot. */
const NodeChip = ({
    name,
    icon: Icon,
    healthByName,
    selected,
    onSelect,
}: {
    name: string
    icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    healthByName: HealthByName | null
    selected: boolean
    onSelect: () => void
}) => {
    const state = resolveArchitectureStatus(name, healthByName)
    const visual = getArchitectureStatusVisual(state)
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                selected ? "border-accent bg-accent/10 text-accent" : "border-default text-muted hover:bg-default",
            )}
        >
            <Icon aria-hidden className="size-4 shrink-0" />
            <Typography type="body-sm" className={selected ? "text-accent" : undefined}>{name}</Typography>
            <span className={cn("size-2 shrink-0 rounded-full", visual.dotClassName, visual.pulse && "animate-pulse")} aria-hidden />
        </button>
    )
}

/**
 * Mobile counterpart of {@link import("..").ArchitectureRail}: below `lg` the
 * docs-style rail hides, so the component list folds into two horizontally
 * scrollable chip rows (own system, then external dependencies) above the map
 * — the master-detail mobile pattern (mirrors `PracticeMobileNav`). Reads/
 * writes the same `?node=` state as the rail, so the two stay in lockstep.
 *
 * @param props - {@link ArchitectureMobileNavProps}
 */
export const ArchitectureMobileNav = ({ healthByName, selectedId, onSelect, className }: ArchitectureMobileNavProps) => {
    const t = useTranslations("architecture")
    const ownComponents = ARCHITECTURE_COMPONENTS.filter((c) => c.group === "own")
    const externalComponents = ARCHITECTURE_COMPONENTS.filter((c) => c.group === "external")

    return (
        <div className={cn("flex flex-col gap-3 lg:hidden", className)}>
            <div className="flex flex-col gap-1.5">
                <Typography type="body-xs" color="muted">{t("rail.ownGroup")}</Typography>
                <ScrollShadow orientation="horizontal" hideScrollBar className="flex gap-2 overflow-x-auto pb-1">
                    {ownComponents.map((component) => (
                        <NodeChip
                            key={component.name}
                            name={component.name}
                            icon={component.icon}
                            healthByName={healthByName}
                            selected={selectedId === component.name}
                            onSelect={() => onSelect(component.name)}
                        />
                    ))}
                </ScrollShadow>
            </div>
            <div className="flex flex-col gap-1.5">
                <Typography type="body-xs" color="muted">{t("rail.externalGroup")}</Typography>
                <ScrollShadow orientation="horizontal" hideScrollBar className="flex gap-2 overflow-x-auto pb-1">
                    {externalComponents.map((component) => (
                        <NodeChip
                            key={component.name}
                            name={component.name}
                            icon={component.icon}
                            healthByName={healthByName}
                            selected={selectedId === component.name}
                            onSelect={() => onSelect(component.name)}
                        />
                    ))}
                </ScrollShadow>
            </div>
        </div>
    )
}
