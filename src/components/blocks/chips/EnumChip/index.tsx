"use client"

import React from "react"
import { Chip, Tooltip, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** HeroUI soft-chip colors usable by an {@link EnumChip}. */
export type EnumChipColor = "default" | "success" | "warning" | "danger" | "accent"

/** One enum value's chip presentation. */
export interface EnumChipEntry {
    /** Soft chip color. Omit to use the Chip default. */
    color?: EnumChipColor
    /** Visible label (already localized by the caller). */
    label: ReactNode
    /** Optional leading icon — the CALLER sizes it (this primitive never forces a size). */
    icon?: ReactNode
    /** Optional tooltip (already localized); wraps the chip in a Tooltip when set. */
    tooltip?: ReactNode
}

/** Props for {@link EnumChip}. */
export interface EnumChipProps<E extends string> extends WithClassNames<undefined> {
    /** The current enum value; looked up in {@link map}. */
    value: E
    /**
     * Map from enum value to presentation. Usually declare it `Record<E, EnumChipEntry>`
     * at the call site to get TS completeness; the prop accepts `Partial` so a domain
     * may intentionally leave some values unhandled (they throw at render, matching the
     * old switch-`default`-throw behavior).
     */
    map: Partial<Record<E, EnumChipEntry>>
}

/**
 * The canonical "enum → soft chip" primitive: a `Chip variant="soft" size="sm"` whose
 * color / label / optional leading icon / optional tooltip come from a per-value map.
 * Domain badges (AI-model category, difficulty, video host, video kind …) shrink to
 * just their map table + this delegate instead of each re-implementing the same
 * Chip / Tooltip / Label JSX. It deliberately does NOT force width or icon size — the
 * caller controls those via `className` and the icon node, so every domain keeps its
 * exact rendering.
 *
 * @param props - {@link EnumChipProps}
 */
export const EnumChip = <E extends string>({ value, map, className }: EnumChipProps<E>) => {
    const entry = map[value]
    if (!entry) {
        // exhaustive Record makes this unreachable in typed code; guards a bad runtime value
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <Chip color={entry.color} size="sm" variant="soft" className={cn(className)}>
            {entry.icon}
            <Chip.Label>{entry.label}</Chip.Label>
        </Chip>
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip>
            <Tooltip.Trigger>{chip}</Tooltip.Trigger>
            <Tooltip.Content>{entry.tooltip}</Tooltip.Content>
        </Tooltip>
    )
}
